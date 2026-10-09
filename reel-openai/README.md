# Reel FinanceData – OpenAI déçoit (HyperFrames)

Reel vertical 1080×1920, 30,7 s, même DA que la v6 LVMH : bleu #00194B quadrillé alterné avec un blanc cassé quadrillé,
photos plein cadre (Sam Altman, OpenAI, Dario Amodei), Inter, rouge vif pour les alertes, sous-titres blancs sur fond gris translucide.
14 scènes, aucune au-delà de 3 s (sauf la fin animée : profil Instagram FinanceData (anneau de story, nom en blanc) + bouton « S'abonner » → « Abonné »).

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
