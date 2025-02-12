//api/subject/route.ts
import dbConnect from "@/lib/dbConnect";
import Subject from "@/models/Subject";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const subjects = await Subject.find().sort({ createdAt: -1 });
    return new NextResponse(JSON.stringify(subjects), { status: 200 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { creator, name, description, is_published } = await request.json();

    // You can add additional logic here if you want to check for duplicate subjects
    const subject = await Subject.create({
      creator,
      name,
      description,
      is_published,
    });

    return new NextResponse(JSON.stringify(subject), { status: 201 });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
