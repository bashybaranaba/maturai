// api/examquestion/route.ts
import dbConnect from "@/lib/dbConnect";
import ExamQuestion from "@/models/ExamQuestion";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const questionId = searchParams.get("questionId");
  try {
    await dbConnect();
    const examQuestion = await ExamQuestion.findById(questionId).populate(
      "examPaper"
    );
    return new NextResponse(JSON.stringify(examQuestion), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
