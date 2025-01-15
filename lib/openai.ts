import "dotenv/config";
import { OpenAI } from "openai"; // Import the OpenAI class
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
