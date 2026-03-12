import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const rfps = await prisma.rfp.findMany({
    select: { ecosystems: true, status: true },
  });

  const counts: Record<string, { total: number; open: number }> = {};

  for (const rfp of rfps) {
    for (const eco of rfp.ecosystems) {
      if (!counts[eco]) counts[eco] = { total: 0, open: 0 };
      counts[eco].total++;
      if (rfp.status === "OPEN") counts[eco].open++;
    }
  }

  const data = Object.entries(counts)
    .map(([name, c]) => ({ name, ...c }))
    .sort((a, b) => b.total - a.total);

  return NextResponse.json({ data });
}
