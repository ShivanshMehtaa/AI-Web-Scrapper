import { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      setError("Please paste a URL first.");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch(`${API_URL}/api/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSummary(data.summary);
    } catch (err) {
      if (err instanceof TypeError) {
        setError("Could not reach the server. Is the backend running?");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>AI Web Page Summarizer</h1>
      <p className="subtitle">Paste a link and get a short AI summary.</p>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "Summarize"}
        </button>
      </form>

      {loading && (
        <p className="loading">
          Loading... reading the page and writing your summary.
        </p>
      )}
      {error && <div className="error">{error}</div>}

      {summary && (
        <div className="result">
          <h2>Summary</h2>
          <ReactMarkdown>{summary}</ReactMarkdown>
        </div>
      )}
    </div>
  );
}

export default App;
