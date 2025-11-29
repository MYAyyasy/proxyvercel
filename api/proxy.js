// api/proxy.js
// Simple CORS proxy that forwards JSON POST to the target Google Apps Script URL.
// Deploy this to Vercel (Node runtime).

export default async function handler(req, res) {
  // Allow CORS for Wokwi/browser during development
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Get target URL from query param `url`
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const fetchOptions = {
      method: req.method,
      headers: {
        "Content-Type": req.headers["content-type"] || "application/json"
      },
      // forward the body as JSON string (works even if req.body is parsed)
      body: (req.method === "GET" || req.method === "HEAD") ? undefined : JSON.stringify(req.body)
    };

    const forwardRes = await fetch(target, fetchOptions);
    const text = await forwardRes.text();

    // Forward response status & body to client
    res.status(forwardRes.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: String(err) });
  }
}
