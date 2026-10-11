import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { scrapeUrl } from "./scraper.js";
import { summarizeText } from "./summarizer.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Checks that the input is a valid, public http/https URL
function isValidUrl(value) {
  try {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol)) return false;
    const host = url.hostname;
    const isPrivate =
      host === "localhost" ||
      host.startsWith("127.") ||
      host.startsWith("10.") ||
      host.startsWith("192.168.") ||
      host.startsWith("169.254.");
    return !isPrivate;
  } catch {
    return false;
  }
}

// Main endpoint
app.post("/api/summarize", async (req, res) => {
  const { url } = req.body;

  if (!url || !isValidUrl(url)) {
    return res.status(400).json({
      error:
        "Please enter a valid public URL (starting with http:// or https://).",
    });
  }

  let text;
  try {
    text = await scrapeUrl(url);
  } catch (err) {
    console.error("Scraping error:", err.message);
    return res.status(422).json({
      error:
        "Could not read that page. It may be blocked, empty, or not available.",
    });
  }

  try {
    const summary = await summarizeText(text);
    res.json({ summary });
  } catch (err) {
    console.error("AI error:", err.response?.data || err.message);
    res
      .status(502)
      .json({ error: "The AI service failed. Please try again in a moment." });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
  console.error("SERVER ERROR:", err.code, err.message);
  process.exit(1);
});
