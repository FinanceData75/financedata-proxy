# Passe une photo en bichromie FinanceData (bleu #00194B -> blanc #EEF3FC).
# Usage : python3 scripts/bichromie.py entree.jpg sortie.jpg
import sys
import numpy as np
from PIL import Image, ImageOps
src = ImageOps.autocontrast(Image.open(sys.argv[1]).convert("L"), cutoff=1)
g = np.clip((np.asarray(src).astype(float) / 255 - 0.08) / 0.84, 0, 1) ** 1.1
dark, light = np.array([0, 25, 75]), np.array([238, 243, 252])
Image.fromarray((dark + (light - dark) * g[..., None]).astype(np.uint8)).save(sys.argv[2], quality=92)
