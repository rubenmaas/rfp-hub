import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { rfpInclude } from "@/lib/queries";

export async function GET() {
  const rfps = await prisma.rfp.findMany({
    include: rfpInclude,
    orderBy: { createdAt: "desc" },
  });

  const exportData = {
    schemaVersion: "1.0.0",
    generatedAt: new Date().toISOString(),
    count: rfps.length,
    data: rfps,
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="rfp-hub-export-${new Date().toISOString().split("T")[0]}.json"`,
    },
  });
}
