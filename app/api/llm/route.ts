import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getPrompt } from "@/lib/prompts";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: API_KEY,
});

export async function POST(request: Request) {
  try {
    const requestbody = await request.json();
    const { option, input, interactionData, userData, contextData } =
      requestbody;
    const prompt = getPrompt(option);
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `user_prompt = "${prompt}", user_background=${userData}, contextData=${contextData}, previous_interatioction_data="${interactionData}, `,
        },
        { role: "user", content: input },
      ],
      temperature: 0.8,
      max_tokens: 3800,
      top_p: 0.6,
      frequency_penalty: 0.8,
      presence_penalty: 0.6,
    });

    return new NextResponse(response.choices[0].message.content, {
      status: 200,
    });
  } catch (error: any) {
    return new NextResponse(error.message, {
      status: 500,
    });
  }
}
