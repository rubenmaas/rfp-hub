import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const [totalRfps, openRfps, programCount, rfps] = await Promise.all([
    prisma.rfp.count(),
    prisma.rfp.count({ where: { status: "OPEN" } }),
    prisma.program.count(),
    prisma.rfp.findMany({
      select: { ecosystems: true, budgetMax: true, status: true },
    }),
  ]);

  const ecosystems = new Set<string>();
  let totalBudget = 0;

  for (const rfp of rfps) {
    for (const eco of rfp.ecosystems) ecosystems.add(eco);
    if (rfp.budgetMax && rfp.status === "OPEN") {
      totalBudget += Number(rfp.budgetMax);
    }
  }

  return NextResponse.json({
    data: {
      totalRfps,
      openRfps,
      ecosystems: ecosystems.size,
      programs: programCount,
      totalOpenBudget: totalBudget,
    },
  });
}
