# Traitements photo des 4 univers. Usage : python3 scripts/traitements.py entree.jpg dossier_sortie prefixe
import sys
import numpy as np
from PIL import Image, ImageOps
src, out, pre = sys.argv[1], sys.argv[2], sys.argv[3]
im = Image.open(src).convert("RGB"); W, H = im.size
rng = np.random.default_rng(7)
def grain(a, s): return np.clip(a + rng.normal(0, s, a.shape[:2])[..., None], 0, 255)
def duo(g, dark, light):
    dark, light = np.array(dark, float), np.array(light, float)
    return dark + (light - dark) * g[..., None]
gray = np.asarray(ImageOps.autocontrast(im.convert("L"), cutoff=1)).astype(float) / 255
# 1. Éditorial : noir et blanc chaud, grain argentique
a = grain(duo(np.clip((gray - .04) / .9, 0, 1) ** 1.05, (22, 19, 15), (241, 236, 226)), 9)
Image.fromarray(a.astype(np.uint8)).save(f"{out}/{pre}-editorial.jpg", quality=92)
# 2. Cinéma : contraste, ombres froides, hautes lumières chaudes, vignette
c = np.asarray(im).astype(float) / 255
c = np.clip((c - .5) * 1.25 + .5, 0, 1)
lum = c.mean(2, keepdims=True)
c = c + (1 - lum) * np.array([-.06, .02, .07]) + lum * np.array([.07, .02, -.06])
yy, xx = np.mgrid[0:H, 0:W]; v = 1 - .55 * (((xx - W / 2) / (W / 1.3)) ** 2 + ((yy - H / 2.3) / (H / 1.2)) ** 2)
c = np.clip(c * np.clip(v, .25, 1)[..., None] * .92, 0, 1) * 255
Image.fromarray(grain(c, 6).astype(np.uint8)).save(f"{out}/{pre}-cinema.jpg", quality=92)
# 3. Suisse : noir et blanc dur
s = np.clip((gray - .18) / .62, 0, 1) ** 1.3 * 255
Image.fromarray(np.repeat(s[..., None], 3, 2).astype(np.uint8)).save(f"{out}/{pre}-suisse.jpg", quality=92)
# 4. Encre bleue : bichromie bleu FinanceData sur papier crème
e = grain(duo(np.clip((gray - .06) / .86, 0, 1) ** 1.1, (0, 25, 75), (239, 234, 224)), 5)
Image.fromarray(e.astype(np.uint8)).save(f"{out}/{pre}-encre.jpg", quality=92)
