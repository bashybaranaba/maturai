// api/examquestion/route.ts
import dbConnect from "@/lib/dbConnect";
import ExamQuestion from "@/models/ExamQuestion";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const examQuestions = await ExamQuestion.find().sort({ createdAt: -1 });
    return new NextResponse(JSON.stringify(examQuestions), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { creator, content, examPaper, is_published } = await request.json();

    const examQuestion = await ExamQuestion.create({
      creator,
      content,
      examPaper,
      is_published,
    });

    return new NextResponse(JSON.stringify(examQuestion), { status: 201 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
