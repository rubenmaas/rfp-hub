import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/server/db";
import { rfpInclude } from "@/lib/queries";
import { cn, formatCurrency, formatDate, formatDeadline } from "@/lib/utils";
import { getEcosystemColor, STATUS_COLORS, TYPE_COLORS } from "@/lib/constants";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function RfpDetailPage({ params }: PageProps) {
  const { id } = await params;

  const rfp = await prisma.rfp.findUnique({
    where: { id },
    include: rfpInclude,
  });

  if (!rfp) notFound();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            &larr; Back to all RFPs
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        {/* Header section */}
        <div className="mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className={cn("rounded-md px-2.5 py-1 text-xs font-semibold uppercase", STATUS_COLORS[rfp.status])}>
              {rfp.status}
            </span>
            <span className={cn("rounded-md px-2.5 py-1 text-xs font-semibold uppercase", TYPE_COLORS[rfp.type])}>
              {rfp.type}
            </span>
            {rfp.verificationStatus === "VERIFIED" && (
              <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
                Verified Source
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold tracking-tight">{rfp.name}</h1>

          <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{rfp.program.organization} — {rfp.program.name}</span>
            <span>{formatCurrency(rfp.budgetMin, rfp.budgetMax, rfp.budgetCurrency)}</span>
            <span className={rfp.status === "OPEN" && rfp.deadline && new Date(rfp.deadline).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 ? "text-red-600 font-medium" : ""}>
              Deadline: {formatDeadline(rfp.deadline)}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {rfp.ecosystems.map((eco) => (
              <span key={eco} className={cn("rounded-full px-3 py-1 text-xs font-medium", getEcosystemColor(eco))}>
                {eco}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {rfp.description}
              </p>
            </section>

            {/* Requirements */}
            {rfp.requirements.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">Requirements</h2>
                <ul className="space-y-3">
                  {rfp.requirements.map((req) => (
                    <li key={req.id} className="rounded-lg border border-border p-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{req.title}</span>
                        <span className={cn(
                          "rounded px-1.5 py-0.5 text-[10px] font-medium uppercase",
                          req.priority === "required" ? "bg-red-50 text-red-700" :
                          req.priority === "preferred" ? "bg-yellow-50 text-yellow-700" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          {req.priority}
                        </span>
                      </div>
                      {req.description && (
                        <p className="mt-1 text-xs text-muted-foreground">{req.description}</p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Evaluation Criteria */}
            {rfp.evaluationCriteria.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">Evaluation Criteria</h2>
                <div className="space-y-2">
                  {rfp.evaluationCriteria.map((crit) => (
                    <div key={crit.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
                      <div className="flex-1">
                        <span className="text-sm font-medium">{crit.name}</span>
                        {crit.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{crit.description}</p>
                        )}
                      </div>
                      {crit.weight && (
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-16 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-primary" style={{ width: `${crit.weight}%` }} />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">{crit.weight}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Deliverables */}
            {rfp.deliverables.length > 0 && (
              <section>
                <h2 className="mb-3 text-lg font-semibold">Deliverables</h2>
                <div className="space-y-2">
                  {rfp.deliverables.map((del) => (
                    <div key={del.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                      {del.milestone && (
                        <span className="shrink-0 rounded bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                          {del.milestone}
                        </span>
                      )}
                      <div>
                        <span className="text-sm font-medium">{del.title}</span>
                        {del.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground">{del.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="rounded-lg border border-border p-4 space-y-3">
              <a
                href={rfp.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg bg-primary py-2.5 text-center text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Apply Now
              </a>
              <a
                href={rfp.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-lg border border-border py-2.5 text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                View Original Source
              </a>
            </div>

            {/* Details */}
            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-3 text-sm font-semibold">Details</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-muted-foreground">Budget</dt>
                  <dd className="font-medium">{formatCurrency(rfp.budgetMin, rfp.budgetMax, rfp.budgetCurrency)}</dd>
                </div>
                {rfp.deadline && (
                  <div>
                    <dt className="text-muted-foreground">Deadline</dt>
                    <dd className="font-medium">{formatDate(new Date(rfp.deadline))}</dd>
                  </div>
                )}
                {rfp.durationMinDays && (
                  <div>
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-medium">
                      {rfp.durationMinDays}–{rfp.durationMaxDays} days
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">Schema Version</dt>
                  <dd className="font-mono text-xs">{rfp.schemaVersion}</dd>
                </div>
              </dl>
            </div>

            {/* Tags */}
            {rfp.tags.length > 0 && (
              <div className="rounded-lg border border-border p-4">
                <h3 className="mb-3 text-sm font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-1.5">
                  {rfp.tags.map((tag) => (
                    <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Provenance */}
            <div className="rounded-lg border border-border p-4">
              <h3 className="mb-3 text-sm font-semibold">Provenance</h3>
              <dl className="space-y-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Submitted by</dt>
                  <dd>{rfp.submittedBy}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Verification</dt>
                  <dd className={rfp.verificationStatus === "VERIFIED" ? "text-green-600" : "text-yellow-600"}>
                    {rfp.verificationStatus}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Added</dt>
                  <dd>{formatDate(new Date(rfp.createdAt))}</dd>
                </div>
                {rfp.lastCheckedAt && (
                  <div>
                    <dt className="text-muted-foreground">Last checked</dt>
                    <dd>{formatDate(new Date(rfp.lastCheckedAt))}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-muted-foreground">RFP ID</dt>
                  <dd className="font-mono break-all">{rfp.id}</dd>
                </div>
              </dl>
            </div>

            {/* API link */}
            <div className="rounded-lg border border-dashed border-border p-4 text-center">
              <p className="text-xs text-muted-foreground mb-2">Access via API</p>
              <code className="text-[10px] text-muted-foreground break-all">
                GET /api/v1/rfps/{rfp.id}
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
