# Reel — Le marché obligataire (nouvelle DA FinanceData)

50,9 s, 1080×1920. Déroulé et types d'animation de la v1 (`reel-obligations`, commit 8fadb49) refaits dans la DA FinanceData
(`styles/financedata/STYLE.md`) : fonds blanc / bleu vignettés en alternance, Inter 800, titres en typographie seule avec filet d'accent (aucun encadré), cartes sans bordure (ombre douce / verre dépoli), chiffres géants,
vert = gain, rouge = alerte, police secondaire Schibsted Grotesk pour graphiques et chiffres (traits fins, sans grille), sous-titres Inter 600 sur fond gris (3 mots max).

Écrans : barres obligations vs actions · cartes action (propriétaire) / obligation (prêteur) · « C'est vous la banque » · fiche d'une obligation
qui se remplit · coupon 5 % × 1 000 € = 50 €/an · flux sur 10 ans (+500 €) · nuage risque/rendement (Allemagne, entreprise fragile) ·
« jamais remboursés ? » · revente avant l'échéance · courbes taux ↑ / prix ↓ · 4 % contre 6 % · prix de revente 1 000 € → 853 € (−15 %).

Vraies photos (Pinterest, plein écran, voile marine, push lent ≤ 3,5 %) pour casser le rythme des graphiques :
foule (« presque personne ne sait ») · titres anciens à coupons (« le coupon ») · Reichstag (« un État solide comme l'Allemagne ») · terminal Bloomberg (revente sur le marché secondaire).

## Fichiers
- `index.html` : composition (sous-titres générés depuis `assets/vo-words.js`, timing ElevenLabs Scribe de la voix montée)
- `audio/voix-off-obligataire.wav` : voix montée (mémo iPhone xHE-AAC décodé avec un FFmpeg récent, pauses ≤ 0,15 s, −16 LUFS, sans autre traitement)
- `audio/voix-off-brute.wav` : prise d'origine ; `audio/stt-montee.json` : transcription mot par mot

## Rendu
```
npx -y hyperframes@0.8.137 render -o renders/raw.mp4 .
ffmpeg -i renders/raw.mp4 -i audio/voix-off-obligataire.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af apad -t 50.9 renders/marche-obligataire.mp4
```

## Sources et calculs
- Encours mondial fin 2024 : obligations 145 100 Md$, actions 126 700 Md$ (SIFMA, Capital Markets Fact Book 2025)
- Revente : coupon 4 %, 10 ans restants, actualisée à 6 % → 40 × 7,360 + 1 000 / 1,06¹⁰ ≈ 853 € (−15 %)
- Nuage risque/rendement et courbes taux/prix : schémas illustratifs
