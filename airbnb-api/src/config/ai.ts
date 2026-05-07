import { ChatGroq } from "@langchain/groq";

// Deterministic model for structured tasks (filter extraction, recommendations)
// temperature: 0 ensures consistent output
export const deterministicModel = new ChatGroq({
  model: "llama3-8b-8192",
  temperature: 0,
  apiKey: process.env["GROQ_API_KEY"],
  maxTokens: 1024,
});

// Creative model for descriptions, chat, and summaries
// temperature: 0.7 provides varied, natural responses
export const creativeModel = new ChatGroq({
  model: "llama3-8b-8192",
  temperature: 0.7,
  apiKey: process.env["GROQ_API_KEY"],
  maxTokens: 2048,
});

export default creativeModel;
