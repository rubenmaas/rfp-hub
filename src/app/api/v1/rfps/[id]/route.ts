import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { rfpInclude } from "@/lib/queries";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const rfp = await prisma.rfp.findUnique({
    where: { id },
    include: rfpInclude,
  });

  if (!rfp) {
    return NextResponse.json({ error: "RFP not found" }, { status: 404 });
  }

  return NextResponse.json({ data: rfp });
}
