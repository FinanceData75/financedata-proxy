// usage : node audio/tts.mjs <sortie-sans-extension> : voix « Waul Story Telling », Eleven v4, stabilité et similarité basses
import fs from "fs";
const K = process.env.ELEVENLABS_API_KEY, VOICE = "I0ZNjxaJrLklKmZK1mlA", out = process.argv[2];
const text = fs.readFileSync(new URL("./texte-tts.txt", import.meta.url), "utf8").trim();
const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE}/with-timestamps?output_format=mp3_44100_128`, {
  method: "POST", headers: { "xi-api-key": K, "content-type": "application/json" },
  body: JSON.stringify({ text, model_id: "eleven_v4", language_code: "fr", voice_settings: { stability: 0.25, similarity_boost: 0.25 } })
});
if (!r.ok) { console.error(r.status, await r.text()); process.exit(1); }
const j = await r.json();
fs.writeFileSync(out + ".mp3", Buffer.from(j.audio_base64, "base64"));
fs.writeFileSync(out + ".json", JSON.stringify(j.alignment));
console.log("ok", out);
