// usage : node audio/tts.mjs <voice_id> <texte.txt> <sortie-sans-extension> : Eleven v4, français
import fs from "fs";
const K = process.env.ELEVENLABS_API_KEY, [VOICE, txt, out] = process.argv.slice(2);
const text = fs.readFileSync(txt, "utf8").trim();
const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
  method: "POST", headers: { "xi-api-key": K, "content-type": "application/json" },
  body: JSON.stringify({ text, model_id: "eleven_v4", language_code: "fr", voice_settings: { stability: 0.3, similarity_boost: 0.3 } })
});
if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); }
const j = await r.json();
fs.writeFileSync(out + ".mp3", Buffer.from(j.audio_base64, "base64"));
fs.writeFileSync(out + ".json", JSON.stringify(j.alignment));
console.log("ok", out);
