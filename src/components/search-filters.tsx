"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { getEcosystemColor, STATUS_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SearchFilters({
  ecosystems,
  currentEcosystem,
  currentStatus,
  currentSearch,
}: {
  ecosystems: string[];
  currentEcosystem?: string;
  currentStatus?: string;
  currentSearch?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch ?? "");

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      updateParam("search", search || undefined);
    },
    [search, updateParam]
  );

  const statuses = ["OPEN", "CLOSED", "AWARDED", "DRAFT", "CANCELLED"];

  return (
    <div className="mb-8 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search RFPs by name or description..."
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          type="submit"
          className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
        >
          Search
        </button>
        {(currentSearch || currentEcosystem || currentStatus) && (
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-lg border border-border px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Ecosystem chips */}
      <div className="flex flex-wrap gap-2">
        {ecosystems.map((eco) => (
          <button
            key={eco}
            onClick={() =>
              updateParam("ecosystem", currentEcosystem === eco ? undefined : eco)
            }
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              currentEcosystem === eco
                ? getEcosystemColor(eco) + " ring-2 ring-primary/50"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {eco}
          </button>
        ))}
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() =>
              updateParam("status", currentStatus === s ? undefined : s)
            }
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-all",
              currentStatus === s
                ? (STATUS_COLORS[s] ?? "bg-gray-100 text-gray-700") +
                    " ring-2 ring-primary/50"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
