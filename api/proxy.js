export default async function handler(req, res) {
  const target = req.query.url;
  
  if (!target) {
    return res.status(400).json({ error: "Missing 'url' query parameter" });
  }

  try {
    const forwardRes = await fetch(target, {
      method: req.method,
      headers: {
        "Content-Type": "application/json"
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined
    });

    const text = await forwardRes.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    return res.status(200).send(text);

  } catch (e) {
    return res.status(500).json({ error: e.toString() });
  }
}
