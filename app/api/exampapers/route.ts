// api/exampaper/route.ts
import dbConnect from "@/lib/dbConnect";
import ExamPaper from "@/models/ExamPaper";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const examPapers = await ExamPaper.find().sort({ createdAt: -1 });
    return new NextResponse(JSON.stringify(examPapers), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const {
      creator,
      name,
      description,
      year,
      subject,
      banner_url,
      is_published,
    } = await request.json();

    const examPaper = await ExamPaper.create({
      creator,
      name,
      description,
      year,
      subject,
      banner_url,
      is_published,
    });

    return new NextResponse(JSON.stringify(examPaper), { status: 201 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
