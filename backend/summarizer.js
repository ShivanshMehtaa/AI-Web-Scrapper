import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b";
export async function summarizeText(text) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing. Add it to your .env file.");
  }

  const response = await axios.post(
    GROQ_URL,
    {
      model: MODEL,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content:
            "You summarize webpages. Write a clear summary in 4-6 sentences, then list 3 key points as bullet points. Use only the text provided.",
        },
        {
          role: "user",
          content: `Summarize this webpage content:\n\n${text}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    },
  );

  return response.data.choices[0].message.content;
}
