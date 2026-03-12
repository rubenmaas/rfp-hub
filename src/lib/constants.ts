export const ECOSYSTEMS = [
  { name: "Ethereum", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  { name: "Arbitrum", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { name: "Optimism", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { name: "Base", color: "bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200" },
  { name: "Gitcoin", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { name: "Starknet", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { name: "Filecoin", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" },
  { name: "Uniswap", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  OPEN: "bg-green-100 text-green-800",
  CLOSED: "bg-red-100 text-red-700",
  AWARDED: "bg-yellow-100 text-yellow-800",
  CANCELLED: "bg-gray-200 text-gray-500",
};

export const TYPE_COLORS: Record<string, string> = {
  RFP: "bg-violet-100 text-violet-800",
  GRANT: "bg-emerald-100 text-emerald-800",
  BOUNTY: "bg-amber-100 text-amber-800",
  RETROACTIVE: "bg-teal-100 text-teal-800",
};

export function getEcosystemColor(name: string): string {
  const eco = ECOSYSTEMS.find(
    (e) => e.name.toLowerCase() === name.toLowerCase()
  );
  return eco?.color ?? "bg-gray-100 text-gray-700";
}
