import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { rfpListQuerySchema } from "@/lib/validators";
import { buildRfpWhere, buildRfpOrderBy, rfpListSelect } from "@/lib/queries";

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams);
  const parsed = rfpListQuerySchema.safeParse(params);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { page, limit, sortBy, sortDir, ...filters } = parsed.data;
  const skip = (page - 1) * limit;

  const where = buildRfpWhere(filters);
  const orderBy = buildRfpOrderBy(sortBy, sortDir);

  const [data, total] = await Promise.all([
    prisma.rfp.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: rfpListSelect,
    }),
    prisma.rfp.count({ where }),
  ]);

  return NextResponse.json({
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
