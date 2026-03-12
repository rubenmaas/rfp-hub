import { prisma } from "@/server/db";
import { RfpList } from "@/components/rfp-list";
import { StatsBar } from "@/components/stats-bar";
import { SearchFilters } from "@/components/search-filters";
import { rfpListSelect } from "@/lib/queries";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const ecosystem = params.ecosystem;
  const status = params.status;
  const search = params.search;

  // Build where clause
  const where: Record<string, unknown> = {};
  if (ecosystem) where.ecosystems = { has: ecosystem };
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [rfps, stats, ecosystems] = await Promise.all([
    prisma.rfp.findMany({
      where,
      select: rfpListSelect,
      orderBy: { deadline: "asc" },
      take: 50,
    }),
    prisma.rfp.aggregate({
      _count: true,
      where: { status: "OPEN" },
    }),
    prisma.rfp.findMany({ select: { ecosystems: true } }),
  ]);

  const allEcosystems = [...new Set(ecosystems.flatMap((r) => r.ecosystems))].sort();
  const totalOpen = stats._count;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">RFP Hub</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Web3 funding opportunities — aggregated, standardized, searchable
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link
                href="/api/v1/rfps"
                className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                API
              </Link>
              <Link
                href="/api/v1/schema"
                className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                Schema
              </Link>
              <Link
                href="/api/v1/export/json"
                className="rounded-md border border-border px-3 py-1.5 text-muted-foreground hover:text-foreground transition-colors"
              >
                Export
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <StatsBar totalOpen={totalOpen} totalEcosystems={allEcosystems.length} totalRfps={rfps.length} />
        <SearchFilters ecosystems={allEcosystems} currentEcosystem={ecosystem} currentStatus={status} currentSearch={search} />
        <RfpList rfps={rfps} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 text-center text-sm text-muted-foreground">
          <p>RFP Hub — Open source grant aggregation infrastructure</p>
          <p className="mt-1">
            Schema v1.0.0 — Extends{" "}
            <a href="https://daostar.org/daoip-5" className="underline hover:text-foreground" target="_blank" rel="noopener">
              DAOIP-5
            </a>
            {" "}— MIT License
          </p>
        </div>
      </footer>
    </div>
  );
}
