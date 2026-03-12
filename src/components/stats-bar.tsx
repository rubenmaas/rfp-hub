export function StatsBar({
  totalOpen,
  totalEcosystems,
  totalRfps,
}: {
  totalOpen: number;
  totalEcosystems: number;
  totalRfps: number;
}) {
  return (
    <div className="mb-8 grid grid-cols-3 gap-4">
      <div className="rounded-lg border border-border p-4">
        <div className="text-2xl font-bold">{totalOpen}</div>
        <div className="text-sm text-muted-foreground">Open opportunities</div>
      </div>
      <div className="rounded-lg border border-border p-4">
        <div className="text-2xl font-bold">{totalEcosystems}</div>
        <div className="text-sm text-muted-foreground">Ecosystems tracked</div>
      </div>
      <div className="rounded-lg border border-border p-4">
        <div className="text-2xl font-bold">{totalRfps}</div>
        <div className="text-sm text-muted-foreground">Total results</div>
      </div>
    </div>
  );
}
