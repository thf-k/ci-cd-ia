const express = require("express");
const path = require("path");
const auth = require("./modules/authentication");
const { createClient: realCreateClient } = require("./modules/genai");

function makeApp({ createClient = realCreateClient } = {}) {
  const app = express();
  app.use(express.json());

  const distPath = path.join(__dirname, "..", "frontend", "dist");
  app.use(express.static(distPath));

  app.get("/auth/:secret", (req, res) => {
    const { secret } = req.params;
    const response = auth(secret);
    res.status(response.status).send(response.message);
  });

  app.post("/ai", async (req, res) => {
    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      if (!apiKey) return res.status(500).json({ error: "Missing GOOGLE_API_KEY" });

      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Missing prompt" });

      const ai = createClient(apiKey);

      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });

      res.json({ text: result.text });
    } catch (e) {
      res.status(500).json({ error: String(e?.message || e) });
    }
  });


  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });

  return app;
}

// app “par défaut” pour l’exécution normale
const app = makeApp();

// export pour les tests
module.exports = { app, makeApp };

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Example app listening on http://localhost:${port}`);
  });
}
