export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { actorId, input, token } = req.body;
  if (!actorId || !token) return res.status(400).json({ error: "actorId et token requis" });

  try {
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/runs?token=${token}&memory=256&timeout=90`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }
    );
    if (!runRes.ok) {
      const errText = await runRes.text();
      return res.status(runRes.status).json({ error: `Apify start failed: ${errText.slice(0, 200)}` });
    }
    const runData = await runRes.json();
    const runId = runData?.data?.id;
    const datasetId = runData?.data?.defaultDatasetId;
    if (!runId) return res.status(500).json({ error: "Pas de runId" });

    const MAX_WAIT = 90000;
    const POLL_INTERVAL = 3000;
    const started = Date.now();
    while (Date.now() - started < MAX_WAIT) {
      await new Promise(r => setTimeout(r, POLL_INTERVAL));
      const statusRes = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${token}`);
      if (!statusRes.ok) continue;
      const s = (await statusRes.json())?.data?.status;
      if (s === "SUCCEEDED") break;
      if (["FAILED", "ABORTED", "TIMED-OUT"].includes(s)) return res.status(500).json({ error: `Run ${s}` });
    }

    const itemsRes = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=50&clean=true`);
    if (!itemsRes.ok) return res.status(itemsRes.status).json({ error: "Dataset inaccessible" });
    return res.status(200).json(await itemsRes.json());
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
