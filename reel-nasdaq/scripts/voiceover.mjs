// Génère la voix off ElevenLabs (eleven_v3, voix « Waul Storyteller », FR) avec timestamps,
// puis écrit assets/voiceover.mp3, assets/voiceover-alignment.json et assets/vo-words.js
// (timing mot par mot lu par reel-data.js) et cale la durée de la composition sur la voix.
// Usage : ELEVENLABS_API_KEY=sk_... node scripts/voiceover.mjs   (VOICE_ID=... pour forcer la voix)
// Sans clé : node scripts/voiceover.mjs --from-alignment  (rejoue à partir du JSON existant)
// Voix déjà enregistrée : node scripts/voiceover.mjs --audio prise.wav  (convertit en MP3 et aligne le
// fichier sur voix-off-elevenlabs-v3.txt via /v1/forced-alignment ; le texte doit être celui réellement lu)
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const A = (f) => path.join(DIR, "assets", f);
const KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_NAME = "Waul Storyteller";
const API = "https://api.elevenlabs.io";

async function api(p, opts = {}) {
  const r = await fetch(API + p, { ...opts, headers: { "xi-api-key": KEY, "content-type": "application/json", ...(opts.headers || {}) } });
  if (!r.ok) throw new Error(`${p} → ${r.status} ${await r.text()}`);
  return r.json();
}

async function findVoice() {
  if (process.env.VOICE_ID) return process.env.VOICE_ID;
  const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
  const mine = await api("/v2/voices?page_size=100&search=" + encodeURIComponent("Waul"));
  let v = (mine.voices || []).find((x) => norm(x.name).includes(norm(VOICE_NAME)));
  if (v) return v.voice_id;
  const shared = await api("/v1/shared-voices?page_size=30&search=" + encodeURIComponent("Waul"));
  v = (shared.voices || []).find((x) => norm(x.name).includes(norm(VOICE_NAME))) || (shared.voices || [])[0];
  if (!v) throw new Error(`Voix « ${VOICE_NAME} » introuvable : passe VOICE_ID=...`);
  console.log(`Voix partagée trouvée : ${v.name} (${v.voice_id}), ajout à la bibliothèque…`);
  try { await api(`/v1/voices/add/${v.public_owner_id}/${v.voice_id}`, { method: "POST", body: JSON.stringify({ new_name: VOICE_NAME }) }); } catch (e) { console.warn("(ajout ignoré)", e.message); }
  return v.voice_id;
}

// Alignement caractère par caractère → mots (les balises v3 type [pause] sont ignorées).
function words(al) {
  const ch = al.characters, st = al.character_start_times_seconds, en = al.character_end_times_seconds;
  const out = []; let cur = null, tag = false;
  for (let i = 0; i < ch.length; i++) {
    const c = ch[i];
    if (c === "[") { tag = true; continue; }
    if (tag) { if (c === "]") tag = false; continue; }
    if (/\s/.test(c)) { if (cur) { out.push(cur); cur = null; } continue; }
    if (!cur) cur = { w: "", start: st[i], end: en[i] };
    cur.w += c; cur.end = en[i];
  }
  if (cur) out.push(cur);
  return out.filter((x) => /[\p{L}\p{N}%]/u.test(x.w));
}

let alignment, audioEnd;
const audioArg = process.argv.includes("--audio") ? process.argv[process.argv.indexOf("--audio") + 1] : null;
if (process.argv.includes("--from-alignment")) {
  alignment = JSON.parse(fs.readFileSync(A("voiceover-alignment.json"), "utf8"));
} else if (audioArg) {
  if (!KEY) throw new Error("ELEVENLABS_API_KEY manquante");
  const text = fs.readFileSync(path.join(DIR, "voix-off-elevenlabs-v3.txt"), "utf8").trim();
  execFileSync("ffmpeg", ["-v", "error", "-y", "-i", audioArg, "-codec:a", "libmp3lame", "-b:a", "192k", A("voiceover.mp3")]);
  const fd = new FormData();
  fd.append("file", new Blob([fs.readFileSync(audioArg)]), path.basename(audioArg));
  fd.append("text", text);
  console.log("Alignement forcé…");
  const r = await fetch(API + "/v1/forced-alignment", { method: "POST", headers: { "xi-api-key": KEY }, body: fd });
  if (!r.ok) throw new Error(`/v1/forced-alignment → ${r.status} ${await r.text()}`);
  const fa = await r.json();
  alignment = {
    characters: fa.characters.map((c) => c.text),
    character_start_times_seconds: fa.characters.map((c) => c.start),
    character_end_times_seconds: fa.characters.map((c) => c.end),
  };
  fs.writeFileSync(A("voiceover-alignment.json"), JSON.stringify(alignment));
} else {
  if (!KEY) throw new Error("ELEVENLABS_API_KEY manquante");
  const text = fs.readFileSync(path.join(DIR, "voix-off-elevenlabs-v3.txt"), "utf8").trim();
  const voice = await findVoice();
  console.log("Génération eleven_v3…");
  const res = await api(`/v1/text-to-speech/${voice}/with-timestamps?output_format=mp3_44100_128`, {
    method: "POST",
    body: JSON.stringify({ text, model_id: "eleven_v3", language_code: "fr" }),
  });
  fs.writeFileSync(A("voiceover.mp3"), Buffer.from(res.audio_base64, "base64"));
  alignment = res.normalized_alignment && process.env.USE_NORMALIZED ? res.normalized_alignment : res.alignment;
  fs.writeFileSync(A("voiceover-alignment.json"), JSON.stringify(alignment));
}
const W = words(alignment);
audioEnd = alignment.character_end_times_seconds.at(-1);
fs.writeFileSync(A("vo-words.js"), "// Généré par scripts/voiceover.mjs : timing réel de la voix off (mot par mot).\nwindow.VO = " +
  JSON.stringify({ end: +audioEnd.toFixed(3), words: W.map((x) => ({ w: x.w, s: +x.start.toFixed(3), e: +x.end.toFixed(3) })) }) + ";\n");
console.log(`${W.length} mots, voix ${audioEnd.toFixed(2)} s`);

// Durée de la composition = calculée par reel-data.js (fin de voix + générique).
globalThis.window = globalThis;
globalThis.VO = { end: audioEnd, words: W.map((x) => ({ w: x.w, s: x.start, e: x.end })) };
await import(path.join(DIR, "assets", "reel-data.js") + "?t=" + Date.now());
const total = globalThis.REEL.total;
let html = fs.readFileSync(path.join(DIR, "index.html"), "utf8");
html = html.replace(/(id="(?:root|stage)"[^>]*data-duration=")[\d.]+"/g, `$1${total}"`);
const tag = `<audio id="vo" src="assets/voiceover.mp3" data-start="0" data-duration="${total}" data-track-index="1"></audio>`;
html = /<audio id="vo"/.test(html) ? html.replace(/<audio id="vo"[^>]*><\/audio>/, tag) : html.replace(/(\s*)<div id="stage"/, `$1${tag}$1<div id="stage"`);
fs.writeFileSync(path.join(DIR, "index.html"), html);
console.log(`Composition : ${total} s`);
