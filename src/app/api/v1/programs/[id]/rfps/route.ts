import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { rfpListSelect } from "@/lib/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const program = await prisma.program.findUnique({ where: { id } });
  if (!program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 });
  }

  const rfps = await prisma.rfp.findMany({
    where: { programId: id },
    select: rfpListSelect,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: rfps, program });
}
