import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";
import { NextResponse } from "next/server";

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: API_KEY });

const FeedbackSchema = z.object({
  technical_feedback: z.string(),
  suggestions: z.string(),
});

export async function POST(request: Request) {
  try {
    const { input, interactionData, contextData } = await request.json();

    const response = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          name: "system",
          content:
            "You are an AI tutor giving structured feedback on students' answers.",
        },
        {
          role: "user",
          name: "user",
          content: `The student's response: "${input}". Notes: ${JSON.stringify(
            interactionData
          )}. Question context: ${JSON.stringify(contextData)}`,
        },
      ],
      response_format: zodResponseFormat(FeedbackSchema, "exam_feedback"),
      temperature: 0.7,
      max_tokens: 2000,
    });

    return new NextResponse(
      JSON.stringify(response.choices[0].message.parsed),
      { status: 200 }
    );
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
