import { type Decimal } from "@prisma/client/runtime/library";

export function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(
  min?: Decimal | null,
  max?: Decimal | null,
  currency = "USD"
): string {
  const fmt = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  if (min && max) {
    return `${fmt.format(Number(min))} – ${fmt.format(Number(max))}`;
  }
  if (max) return `Up to ${fmt.format(Number(max))}`;
  if (min) return `From ${fmt.format(Number(min))}`;
  return "Not specified";
}

export function formatDeadline(deadline: Date | null): string {
  if (!deadline) return "Rolling";
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Closed";
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days <= 7) return `${days} days left`;
  if (days <= 30) return `${Math.ceil(days / 7)} weeks left`;
  return deadline.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
