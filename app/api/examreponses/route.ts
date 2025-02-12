// api/examresponse/route.ts
import dbConnect from "@/lib/dbConnect";
import ExamResponse from "@/models/ExamResponse";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const examResponses = await ExamResponse.find().sort({ createdAt: -1 });
    return new NextResponse(JSON.stringify(examResponses), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const {
      responder,
      answer,
      answerWorking,
      cornerstoneNotes,
      supplementalNotes,
      examQuestion,
      is_published,
    } = await request.json();

    const examResponse = await ExamResponse.create({
      responder,
      answer,
      answerWorking,
      cornerstoneNotes,
      supplementalNotes,
      examQuestion,
      is_published,
    });

    return new NextResponse(JSON.stringify(examResponse), { status: 201 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
