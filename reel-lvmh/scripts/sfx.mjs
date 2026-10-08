// Mixe les effets sonores (assets/sfx) sous la voix off d'origine, sans toucher à la voix.
// Les instants sont lus dans la composition (window.__SFX, calé sur les mots de la voix).
// Usage : PUPPETEER_CORE=/chemin/vers/puppeteer-core node scripts/sfx.mjs renders/video.mp4 audio/voix.wav sortie.mp4
import path from "node:path";
import { createRequire } from "node:module";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
const DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [video, voice, out] = process.argv.slice(2);
const puppeteer = createRequire(import.meta.url)(process.env.PUPPETEER_CORE);
const browser = await puppeteer.launch({ executablePath: process.env.CHROME || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox", "--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.goto(pathToFileURL(path.join(DIR, "index.html")).href);
await page.waitForFunction(() => window.__SFX);
const cues = await page.evaluate(() => window.__SFX);
const total = await page.evaluate(() => window.REEL.total);
await browser.close();
const inputs = ["-i", video, "-i", voice], parts = [], labels = [];
cues.forEach((c, i) => {
  inputs.push("-i", path.join(DIR, "assets/sfx", c.name + ".mp3"));
  const ms = Math.max(0, Math.round(c.t * 1000));
  parts.push(`[${i + 2}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${c.gain},adelay=${ms}|${ms}[s${i}]`);
  labels.push(`[s${i}]`);
});
// SFX sommés à -18 dB environ sous la voix, puis ajoutés à la voix telle quelle (normalize=0 : aucun gain appliqué à la voix)
parts.push(`${labels.join("")}amix=inputs=${cues.length}:normalize=0,volume=0.32[fx]`);
parts.push(`[1:a]aresample=48000,aformat=channel_layouts=stereo[v]`);
parts.push(`[v][fx]amix=inputs=2:normalize=0:duration=first,apad[a]`);
execFileSync("ffmpeg", ["-v", "error", "-y", ...inputs, "-filter_complex", parts.join(";"), "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-t", String(total), "-movflags", "+faststart", out], { stdio: "inherit" });
console.log(cues.length + " effets sonores mixés → " + out);
cues.forEach((c) => console.log("  " + c.t.toFixed(2) + " s  " + c.name));
