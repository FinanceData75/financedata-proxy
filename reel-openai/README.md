# Reel FinanceData – OpenAI déçoit (HyperFrames)

Reel vertical 1080×1920, 30,7 s, même DA que la v6 LVMH : bleu #00194B quadrillé alterné avec un blanc cassé quadrillé,
photos plein cadre (Sam Altman, OpenAI, Dario Amodei), Inter, rouge vif pour les alertes, sous-titres blancs sur fond gris translucide.
v3 : 10 scènes plus posées et minimalistes (un seul élément par scène), photos plein écran avec sous-titres seuls, formes à angles droits.

## Rendu
```
node scripts/voiceover.mjs --audio audio/voix-off-openai.wav
npx hyperframes@0.8.137 render -o renders/raw.mp4
PUPPETEER_CORE=/chemin/puppeteer-core node scripts/sfx.mjs renders/raw.mp4 audio/voix-off-openai.wav renders/reel-openai.mp4
```

## Chiffres
Repris de la voix off (non vérifiés indépendamment) : ≈ 500 Md$ perdus, revenu annualisé OpenAI 50 Md$ vs 70 Md$ attendus,
IPO visée en 2027 à 1 400 Md$, Anthropic > 65 Md$ de revenu annualisé depuis juillet.
Variations Arm, Micron, Broadcom, AMD, Nvidia : capture de marché fournie.
