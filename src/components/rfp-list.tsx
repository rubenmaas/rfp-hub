import Link from "next/link";
import { cn, formatCurrency, formatDeadline } from "@/lib/utils";
import { getEcosystemColor, STATUS_COLORS, TYPE_COLORS } from "@/lib/constants";
import type { Decimal } from "@prisma/client/runtime/library";

interface RfpItem {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  deadline: Date | null;
  budgetMin: Decimal | null;
  budgetMax: Decimal | null;
  budgetCurrency: string;
  tags: string[];
  ecosystems: string[];
  verificationStatus: string;
  program: { id: string; name: string; organization: string };
  createdAt: Date;
}

export function RfpList({ rfps }: { rfps: RfpItem[] }) {
  if (rfps.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-muted-foreground">No RFPs match your filters</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {rfps.map((rfp) => (
        <RfpCard key={rfp.id} rfp={rfp} />
      ))}
    </div>
  );
}

function RfpCard({ rfp }: { rfp: RfpItem }) {
  const deadlineText = formatDeadline(rfp.deadline);
  const isUrgent =
    rfp.deadline &&
    rfp.status === "OPEN" &&
    new Date(rfp.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  return (
    <Link
      href={`/rfps/${rfp.id}`}
      className="group rounded-lg border border-border p-5 transition-all hover:border-primary/50 hover:shadow-sm"
    >
      {/* Top badges */}
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            STATUS_COLORS[rfp.status] ?? "bg-gray-100 text-gray-700"
          )}
        >
          {rfp.status}
        </span>
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
            TYPE_COLORS[rfp.type] ?? "bg-gray-100 text-gray-700"
          )}
        >
          {rfp.type}
        </span>
        {rfp.verificationStatus === "VERIFIED" && (
          <span className="ml-auto text-[10px] text-green-600" title="Verified source">
            Verified
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
        {rfp.name}
      </h3>

      {/* Organization */}
      <p className="mt-1 text-xs text-muted-foreground">{rfp.program.organization}</p>

      {/* Budget + Deadline */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {formatCurrency(rfp.budgetMin, rfp.budgetMax, rfp.budgetCurrency)}
        </span>
        <span className={cn("font-medium", isUrgent ? "text-red-600" : "text-muted-foreground")}>
          {deadlineText}
        </span>
      </div>

      {/* Ecosystem tags */}
      <div className="mt-3 flex flex-wrap gap-1">
        {rfp.ecosystems.map((eco) => (
          <span
            key={eco}
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-medium",
              getEcosystemColor(eco)
            )}
          >
            {eco}
          </span>
        ))}
      </div>

      {/* Tags */}
      {rfp.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {rfp.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {rfp.tags.length > 3 && (
            <span className="text-[10px] text-muted-foreground">
              +{rfp.tags.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
