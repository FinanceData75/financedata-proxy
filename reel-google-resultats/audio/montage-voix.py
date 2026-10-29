# Montage voix : prises (fichier, début du 1er mot, début du dernier mot), pauses internes ≤ MAXP, jamais de coupe avant « % »
import json, sys, wave, numpy as np
MAXP = 0.15; D = sys.argv[1]
TAKES = [("raw49", 0.32, 4.36), ("raw46", 14.52, 15.76), ("raw46", 19.02, 21.30), ("raw46", 22.40, 31.82),
         ("raw46", 34.58, 38.24), ("raw46", 45.72, 53.24), ("raw46", 54.08, 56.52), ("raw46", 63.18, 66.38),
         ("raw46", 70.84, 74.46), ("raw46", 75.14, 77.62), ("raw46", 81.98, 83.14), ("raw46", 94.40, 97.38),
         ("raw46", 103.92, 108.22), ("raw46", 109.20, 113.14), ("raw46", 119.58, 121.34)]
JOIN = 0.14
aud = {}; words = {}
for f in ("raw46", "raw49"):
    w_ = wave.open(f"{D}/{f}.wav"); sr = w_.getframerate(); aud[f] = np.frombuffer(w_.readframes(w_.getnframes()), np.int16) / 32768
    words[f] = [w for w in json.load(open(f"{D}/{f}.json"))["words"] if w["type"] == "word" and w["text"].strip() not in ("?", ":", ".")]
fr = int(sr * 0.01)
def rms(x):
    n = len(x) // fr; return 20 * np.log10(np.sqrt((x[:n * fr].reshape(n, fr) ** 2).mean(1)) + 1e-9)
R = {f: rms(aud[f]) for f in aud}
def onset(f, t):   # remonte jusqu'au début réel du son
    i = int(t * 100)
    while i > 0 and R[f][i - 1] > -45 and i > int(t * 100) - 12: i -= 1
    return max(0, i / 100 - 0.03)
def offset(f, t, limit):  # avance jusqu'à la fin réelle du son, sans dépasser le mot suivant
    i = int(t * 100); lim = int(limit * 100)
    while i < lim and i < len(R[f]) and R[f][i] > -45: i += 1
    return min(i / 100 + 0.04, limit)
out = []; log = []
for f, a, b in TAKES:
    W = [w for w in words[f] if a - 0.01 <= w["start"] <= b + 0.01]
    nxt = [w for w in words[f] if w["start"] > b + 0.01]
    lim_end = nxt[0]["start"] - 0.02 if nxt else len(aud[f]) / sr
    s = onset(f, W[0]["start"]); segs = []; cur = s
    for k in range(len(W) - 1):
        e = offset(f, W[k]["end"], W[k + 1]["start"]); n0 = onset(f, W[k + 1]["start"])
        if W[k + 1]["text"].startswith("%"): continue
        if n0 - e > MAXP:
            segs.append((cur, e + MAXP / 2)); cur = n0 - MAXP / 2
    segs.append((cur, offset(f, W[-1]["end"], lim_end)))
    for p, q in segs:
        seg = aud[f][int(p * sr):int(q * sr)].copy(); fd = int(0.008 * sr)
        seg[:fd] *= np.linspace(0, 1, fd); seg[-fd:] *= np.linspace(1, 0, fd); out.append(seg)
    out.append(np.zeros(int(JOIN * sr)))
    log.append((f, round(s, 2), " ".join(w["text"] for w in W)))
y = np.concatenate(out[:-1]); o = wave.open(f"{D}/cut.wav", "wb"); o.setnchannels(1); o.setsampwidth(2); o.setframerate(sr); o.writeframes((np.clip(y, -1, 1) * 32767).astype(np.int16).tobytes()); o.close()
print(round(len(y) / sr, 2)); [print(l) for l in log]
