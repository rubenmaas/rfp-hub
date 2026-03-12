import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const programs = await prisma.program.findMany({
    include: {
      _count: { select: { rfps: true } },
      publisher: { select: { name: true, verified: true } },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: programs });
}
