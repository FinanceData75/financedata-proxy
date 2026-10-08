// Script (corrigé après fact-check), découpage des sous-titres (3 mots max) et timing.
// Timing estimé (~2,8 mots/s) par défaut ; remplacé par le timing réel de la voix off
// si assets/vo-words.js (window.VO) est chargé avant ce fichier.
(function (root) {
  var NB = " "; // espace fine insécable : "+18 %" ou "Résultat :" restent un seul bloc
  // " / " = coupure de sous-titre (3 mots max par groupe)
  var SCENES = [
    { id: "nasdaq", text: "Le Nasdaq / vient de battre / un nouveau record / et gagne +24" + NB + "% / depuis janvier, / alors que tout / devrait le faire / chuter." },
    { id: "breakout", text: "Depuis juin, / il butait / sur un niveau / qu'il n'arrivait pas / à dépasser, / mais cette fois-ci, / il est passé / au-dessus." },
    { id: "yield", text: "Et pourtant, / le contexte / fait peur. / Le taux / à 10" + NB + "ans américain / dépasse les 5,2" + NB + "%. / Du jamais vu / depuis 2002." },
    { id: "fed", text: "La Fed / a relevé / ses taux / en septembre." },
    { id: "oil", text: "Et le baril / de pétrole / reste au-dessus / des 100" + NB + "dollars." },
    { id: "ai", text: "Mais si / les marchés montent, / c'est encore grâce / à l'intelligence / artificielle. / La demande / explose, / et elle fait / gonfler les revenus / des entreprises / américaines." },
    { id: "earnings", text: "Résultat" + NB + ": / leurs bénéfices / progressent. / Et pour / le moment, / c'est tout / ce qui compte / pour les investisseurs." }
  ];

  var SPOKEN = { "+24 %": 0.95, "5,2 %": 0.95, "10 ans": 0.5, "2002": 0.75, "100 dollars": 0.75, "Résultat :": 0.5 };

  function bare(w) { return w.replace(/[.,]$/, "").replace(/ /g, " "); }
  function wordDur(w) {
    var b = bare(w);
    if (SPOKEN[b] != null) return SPOKEN[b];
    var letters = b.replace(/[^A-Za-zÀ-ÿ']/g, "").length;
    return Math.min(0.62, 0.13 + 0.042 * letters);
  }
  function groups(text) {
    return text.split(" / ").map(function (g) {
      var ws = g.split(" ");
      if (ws.length > 3) throw new Error("sous-titre > 3 mots : " + g);
      return ws;
    });
  }

  var t = 0.5, chunks = [], scenes = [];
  SCENES.forEach(function (s, si) {
    var scene = { id: s.id, start: t, chunks: [] };
    groups(s.text).forEach(function (g) {
      var words = g.map(function (w) {
        var d = wordDur(w), o = { text: w, key: bare(w), start: t, end: t + d };
        t += d;
        return o;
      });
      var last = g[g.length - 1].slice(-1);
      var pause = last === "." ? 0.45 : last === "," || last === ":" ? 0.22 : 0.04;
      var c = { text: g.join(" "), scene: si, start: words[0].start, end: t + pause * 0.6, words: words };
      t += pause;
      chunks.push(c);
      scene.chunks.push(c);
    });
    if (si === 2 || si === 5) t += 0.35;
    scenes.push(scene);
  });
  var end = t;
  if (root.VO && root.VO.words && root.VO.words.length) end = applyVoice(root.VO, chunks, scenes);
  scenes.forEach(function (s, i) { s.end = i < scenes.length - 1 ? scenes[i + 1].start : end + 2.2; });

  root.REEL = { scenes: scenes, chunks: chunks, total: Math.ceil((end + 2.2) * 10) / 10, synced: end !== t };

  // ---- Recalage sur la vraie voix off (assets/vo-words.js, généré par scripts/voiceover.mjs) ----
  function toks(s) {
    return s.toLowerCase().replace(/\+/g, "plus ").replace(/[\u202f\u00a0]/g, " ")
      .replace(/[«»"“”…!?;:.]/g, " ").replace(/,(?!\d)/g, " ").split(/\s+/).filter(Boolean);
  }
  function applyVoice(vo, chunks, scenes) {
    var V = [], S = [];
    vo.words.forEach(function (x) { toks(x.w).forEach(function (k) { V.push({ k: k, s: x.s, e: x.e }); }); });
    chunks.forEach(function (c) { c.words.forEach(function (w) { toks(w.text).forEach(function (k) { S.push({ k: k, w: w }); }); }); });
    // LCS mot à mot entre le script des sous-titres et ce qui est réellement dit
    var n = S.length, m = V.length, L = [], i, j;
    for (i = 0; i <= n; i++) { L.push(new Array(m + 1).fill(0)); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--)
      L[i][j] = S[i].k === V[j].k ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var all = [];
    chunks.forEach(function (c) { c.words.forEach(function (w) { w.start = w.end = null; all.push(w); }); });
    for (i = 0, j = 0; i < n && j < m;) {
      if (S[i].k === V[j].k) {
        var w = S[i].w;
        if (w.start == null || V[j].s < w.start) w.start = V[j].s;
        if (w.end == null || V[j].e > w.end) w.end = V[j].e;
        i++; j++;
      } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++;
    }
    // mots non retrouvés : interpolés entre leurs voisins
    all.forEach(function (w, k) {
      if (w.start != null) return;
      var a = k - 1, b = k + 1;
      while (a >= 0 && all[a].end == null) a--;
      while (b < all.length && all[b].start == null) b++;
      var t0 = a >= 0 ? all[a].end : 0, t1 = b < all.length ? all[b].start : vo.end;
      var lo = k - a, span = b - a;
      w.start = t0 + (t1 - t0) * (lo - 1) / span + 0.01;
      w.end = t0 + (t1 - t0) * lo / span;
    });
    chunks.forEach(function (c, k) {
      c.start = c.words[0].start;
      var last = c.words[c.words.length - 1].end, next = chunks[k + 1];
      c.end = next && next.words[0].start - last < 0.7 ? next.words[0].start - 0.02 : last + 0.3;
    });
    scenes.forEach(function (s) { s.start = Math.max(0, s.chunks[0].start - 0.1); });
    return Math.max(vo.end, all[all.length - 1].end);
  }
})(typeof window !== "undefined" ? window : globalThis);
