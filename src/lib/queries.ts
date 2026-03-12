import { Prisma } from "@prisma/client";
import type { RfpListQuery } from "./validators";

export function buildRfpWhere(params: Partial<RfpListQuery>): Prisma.RfpWhereInput {
  const where: Prisma.RfpWhereInput = {};

  if (params.status) where.status = params.status;
  if (params.type) where.type = params.type;

  if (params.ecosystem) {
    where.ecosystems = { has: params.ecosystem };
  }

  if (params.budgetMin !== undefined || params.budgetMax !== undefined) {
    where.budgetMax = {};
    if (params.budgetMin !== undefined) {
      where.budgetMax.gte = params.budgetMin;
    }
    if (params.budgetMax !== undefined) {
      where.budgetMax.lte = params.budgetMax;
    }
  }

  if (params.deadlineFrom || params.deadlineTo) {
    where.deadline = {};
    if (params.deadlineFrom) where.deadline.gte = params.deadlineFrom;
    if (params.deadlineTo) where.deadline.lte = params.deadlineTo;
  }

  if (params.tags) {
    const tagList = params.tags.split(",").map((t) => t.trim());
    where.tags = { hasSome: tagList };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { description: { contains: params.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export function buildRfpOrderBy(
  sortBy: string = "createdAt",
  sortDir: string = "desc"
): Prisma.RfpOrderByWithRelationInput {
  return { [sortBy]: sortDir } as Prisma.RfpOrderByWithRelationInput;
}

export const rfpInclude = {
  program: true,
  requirements: true,
  evaluationCriteria: true,
  deliverables: true,
  changeHistory: { orderBy: { createdAt: "desc" as const } },
} satisfies Prisma.RfpInclude;

export const rfpListSelect = {
  id: true,
  schemaVersion: true,
  type: true,
  name: true,
  description: true,
  status: true,
  deadline: true,
  budgetMin: true,
  budgetMax: true,
  budgetCurrency: true,
  applicationUrl: true,
  sourceUrl: true,
  tags: true,
  ecosystems: true,
  verificationStatus: true,
  programId: true,
  program: { select: { id: true, name: true, organization: true } },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RfpSelect;
