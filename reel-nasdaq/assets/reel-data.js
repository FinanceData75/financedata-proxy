// Script (corrigé après fact-check), découpage des sous-titres (3 mots max) et timing.
// Narration estimée ~2,8 mots/s ; à recaler sur la vraie voix off.
(function (root) {
  var NB = " "; // espace fine insécable : "+18 %" ou "Résultat :" restent un seul bloc
  // " / " = coupure de sous-titre (3 mots max par groupe)
  var SCENES = [
    { id: "nasdaq", text: "Le Nasdaq / vient de battre / un nouveau record / et gagne +18" + NB + "% / depuis janvier, / alors que tout / devrait le faire / chuter." },
    { id: "breakout", text: "Depuis juin, / il butait / sur un niveau / qu'il n'arrivait pas / à dépasser. / Cette fois, / il est passé / au-dessus." },
    { id: "yield", text: "Et pourtant, / le contexte / fait peur. / Le taux / à 10" + NB + "ans américain / dépasse 5,3" + NB + "%, / du jamais vu / depuis 2002." },
    { id: "fed", text: "La Fed / a relevé / ses taux / en septembre." },
    { id: "oil", text: "Et le baril / de Brent / est repassé / au-dessus / de 100" + NB + "dollars." },
    { id: "ai", text: "Mais si / les marchés américains / montent, / c'est encore grâce / à l'intelligence / artificielle. / La demande / explose, / et elle fait / gonfler les revenus / des entreprises / américaines." },
    { id: "earnings", text: "Résultat" + NB + ": / leurs bénéfices / progressent. / Et pour / le moment, / c'est tout / ce qui compte / pour les investisseurs." }
  ];

  var SPOKEN = { "+18 %": 0.95, "5,3 %": 0.95, "10 ans": 0.5, "2002": 0.75, "100 dollars": 0.75, "Résultat :": 0.5 };

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
  scenes.forEach(function (s, i) { s.end = i < scenes.length - 1 ? scenes[i + 1].start : t + 2.2; });

  root.REEL = { scenes: scenes, chunks: chunks, total: Math.ceil((t + 2.2) * 10) / 10 };
})(typeof window !== "undefined" ? window : globalThis);
