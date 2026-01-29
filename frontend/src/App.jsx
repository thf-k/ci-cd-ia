import { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Salut ! Pose-moi une question 👋" },
  ]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // l'URL de l'API : en dev on utilise un proxy Vite (étape 2)
  const apiBase = useMemo(() => "", []);

  async function send() {
    const text = prompt.trim();
    if (!text || loading) return;

    setMessages((m) => [...m, { role: "user", content: text }]);
    setPrompt("");
    setLoading(true);

    try {
      const res = await fetch(`${apiBase}/ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Erreur API");
      }

      setMessages((m) => [...m, { role: "assistant", content: data.text }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `❌ ${String(e.message || e)}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 12 }}>Chat IA</h1>

      <div
        style={{
          border: "1px solid #333",
          borderRadius: 12,
          padding: 12,
          minHeight: 400,
          marginBottom: 12,
          background: "#111",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                maxWidth: "80%",
                padding: "10px 12px",
                borderRadius: 12,
                background: msg.role === "user" ? "#2563eb" : "#222",
                color: "white",
                whiteSpace: "pre-wrap",
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Écris ton prompt…"
          style={{
            flex: 1,
            padding: 12,
            borderRadius: 10,
            border: "1px solid #333",
            background: "#0b0b0b",
            color: "white",
          }}
        />
        <button
          onClick={send}
          disabled={loading}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            border: "1px solid #333",
            background: loading ? "#444" : "#16a34a",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "..." : "Envoyer"}
        </button>
      </div>
    </div>
  );
}
