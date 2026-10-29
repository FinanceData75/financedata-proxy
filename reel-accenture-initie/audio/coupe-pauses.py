# usage : python3 audio/coupe-pauses.py <prise.mp3> <prise.json> <sortie.wav> <mots.js>
# Raccourcit chaque pause de plus de 0,15 s à 0,15 s (silence = sous -42 dBFS par fenêtres de 10 ms), début et fin à 0,05 s.
# Rien d'autre n'est touché (pas de compression, pas d'égalisation). Recale aussi l'horodatage mot à mot d'ElevenLabs.
import json, subprocess, sys, wave, numpy as np
src, ali, dst, wjs = sys.argv[1:5]; SR = 44100; MAXP = 0.15; TH = -42
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", str(SR), "-f", "s16le", "-"], capture_output=True).stdout
x = np.frombuffer(raw, np.int16) / 32768; fr = SR // 100; n = len(x) // fr
db = 20 * np.log10(np.sqrt((x[:n * fr].reshape(n, fr) ** 2).mean(1)) + 1e-9); sil = db < TH
runs = []; i = 0
while i < n:
    if sil[i]:
        j = i
        while j < n and sil[j]: j += 1
        runs.append((i, j)); i = j
    else: i += 1
keep = []; cur = 0
for a, b in runs:
    if a == 0: cur = max(0, b - 5); continue                       # silence de tête → 0,05 s
    if b == n: keep.append((cur, min(n, a + 5))); cur = None; break  # silence de queue → 0,05 s
    if (b - a) / 100 > MAXP:
        keep.append((cur, a + 7)); cur = b - 8                       # 0,07 + 0,08 = 0,15 s gardés
if cur is not None: keep.append((cur, n))
out = []; fd = int(.006 * SR); t = 0; segs = []
for a, b in keep:
    s = x[a * fr:b * fr].copy(); s[:fd] *= np.linspace(0, 1, fd); s[-fd:] *= np.linspace(1, 0, fd); out.append(s)
    segs.append((a / 100, b / 100, t)); t += (b - a) / 100
y = np.concatenate(out); o = wave.open(dst, "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(SR)
o.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()); o.close()
def remap(tt):
    for a, b, t0 in segs:
        if tt < a: return t0
        if tt <= b: return t0 + tt - a
    return t
A = json.load(open(ali)); ch, st, en = A["characters"], A["character_start_times_seconds"], A["character_end_times_seconds"]
words = []; w = ""; ws = we = None
for c, s, e in zip(ch, st, en):
    if c.isspace():
        if w: words.append((w, ws, we)); w = ""
        continue
    if not w: ws = s
    w += c; we = e
if w: words.append((w, ws, we))
W = [{"w": a, "s": round(remap(s), 2), "e": round(remap(e), 2)} for a, s, e in words if any(k.isalnum() for k in a)]
open(wjs, "w").write("window.VO={words:" + json.dumps(W, ensure_ascii=False) + "};\n")
print("avant %.2f s, après %.2f s, %d pauses raccourcies" % (n / 100, len(y) / SR, len(keep) - 1))
