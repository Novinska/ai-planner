import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

console.log(process.env.GEMINI_API_KEY);

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

async function main() {
  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent("Hello");

    console.log(result.response.text());
  } catch (e) {
    console.error(e);
  }
}

main();
