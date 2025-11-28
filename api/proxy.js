// api/proxy.js
export default async function handler(req, res) {
  // allow CORS (untuk Wokwi / browser)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // target URL dari query param `url`
  const target = req.query.url;
  if (!target) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    // forward request method, body dan headers minimal Content-Type
    const fetchOptions = {
      method: req.method,
      headers: {
        // biarkan content-type dari client kalau ada
        "Content-Type": req.headers["content-type"] || "application/json"
      },
      // body hanya untuk method yang mengizinkan
      body: (req.method === "GET" || req.method === "HEAD") ? undefined : JSON.stringify(req.body)
    };

    const forwardRes = await fetch(target, fetchOptions);
    const text = await forwardRes.text();

    // forward status & body kembali ke client (ESP32/Wokwi)
    res.status(forwardRes.status).send(text);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: err.toString() });
  }
}
