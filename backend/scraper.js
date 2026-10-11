import axios from "axios";
import * as cheerio from "cheerio";

const MAX_CHARS = 12000;

export async function scrapeUrl(url) {
  // download pages html
  const response = await axios.get(url, {
    timeout: 10000,
    headers: { "User-Agent": "Mozilla/5.0 (compatible; AISummarizer/1.0)" },
  });

  // html to cheerio
  const $ = cheerio.load(response.data);

  // remove unwanted parts
  $("script, style, noscript, nav, footer, header, aside, iframe").remove();

  // 4. Prefer <article> or <main>, fall back to <body>
  let root = $("article").first();
  if (!root.length) root = $("main").first();
  if (!root.length) root = $("body");

  // 5. Get the text and clean up extra whitespace
  const text = root.text().replace(/\s+/g, " ").trim();

  if (!text) {
    throw new Error("Could not find any readable text on this page.");
  }

  // 6. Limit the length so we don't send too much to the AI
  return text.slice(0, MAX_CHARS);
}
