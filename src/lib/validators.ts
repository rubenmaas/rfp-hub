import { z } from "zod";

export const rfpListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  ecosystem: z.string().optional(),
  status: z.enum(["DRAFT", "OPEN", "CLOSED", "AWARDED", "CANCELLED"]).optional(),
  type: z.enum(["RFP", "GRANT", "BOUNTY", "RETROACTIVE"]).optional(),
  budgetMin: z.coerce.number().optional(),
  budgetMax: z.coerce.number().optional(),
  deadlineFrom: z.coerce.date().optional(),
  deadlineTo: z.coerce.date().optional(),
  tags: z.string().optional(), // comma-separated
  search: z.string().optional(),
  sortBy: z.enum(["deadline", "createdAt", "budgetMax", "name"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type RfpListQuery = z.infer<typeof rfpListQuerySchema>;
