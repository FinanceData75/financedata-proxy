// Reel obligations : script, découpage des sous-titres (3 mots max) et timing.
// Timing estimé (~2,8 mots/s) par défaut ; remplacé par le timing réel de la voix off
// si assets/vo-words.js (window.VO) est chargé avant ce fichier.
(function (root) {
  var NB = " "; // espace fine insécable : "+18 %" ou "Résultat :" restent un seul bloc
  // " / " = coupure de sous-titre (3 mots max par groupe)
  var SCENES = [
    { id: "hook", text: "Le marché / obligataire / pèse plus lourd / que le marché / actions mondial, / mais pourtant / presque personne / ne sait / comment il / fonctionne." },
    { id: "versus", text: "Quand vous achetez / une action, / vous devenez / propriétaire / d'un morceau / de l'entreprise, / mais quand vous / achetez une / obligation, / vous prêtez / de l'argent. / Autrement dit, / c'est vous / la banque." },
    { id: "term", text: "Prenez un exemple. / Vous prêtez / 1" + NB + "000 euros / à un État / ou à une / entreprise / pendant 10 ans / et en échange, / vous recevez / des intérêts / chaque année. / C'est ce / qu'on appelle / le coupon." },
    { id: "flows", text: "Avec un coupon / de 5" + NB + "% / vous touchez donc / 50 euros / par an. / Puis au bout / de 10 ans, / on vous rend / vos 1" + NB + "000 euros / et au total, / vous aurez gagné / 500 euros." },
    { id: "risk", text: "Mais attention, / tous les / emprunteurs ne / se valent pas, / car un État / solide comme / l'Allemagne / rembourse presque / à coup sûr, / donc il / paye peu. / À l'inverse, / une entreprise / fragile / doit payer / beaucoup plus / pour convaincre / les prêteurs, / car elle risque / de ne jamais / rembourser. / En clair, / plus le risque / est élevé, / plus vous / êtes payé." },
    { id: "rates", text: "Enfin, une / obligation peut / se revendre / avant la fin. / Et c'est là / que ça / se complique. / Quand les taux / montent, / son prix / baisse. / Pourquoi ?" },
    { id: "why", text: "Imaginez votre / obligation rapporte / 4" + NB + "%. / Puis les nouvelles / obligations se / mettent à / rapporter 6" + NB + "%. / Du coup, / personne ne voudra / acheter la vôtre / au même prix. / Et pour / la vendre, / vous devez donc / baisser son prix." }
  ];

  var SPOKEN = { "1 000": 0.5, "5 %": 0.6, "4 %": 0.6, "6 %": 0.6, "500": 0.6 };

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
