import { NextResponse } from "next/server";

const SCHEMA_DEFINITION = {
  schemaVersion: "1.0.0",
  daoipVersion: "DAOIP-5",
  description: "RFP Hub Standard Object Format — extends DAOIP-5 grantPool with RFP-specific fields",
  fields: {
    id: { type: "string", format: "cuid", description: "Globally unique identifier" },
    schemaVersion: { type: "string", format: "semver", description: "Schema version" },
    type: { type: "enum", values: ["RFP", "GRANT", "BOUNTY", "RETROACTIVE"] },
    name: { type: "string", description: "RFP title" },
    description: { type: "string", description: "Full description (markdown supported)" },
    status: { type: "enum", values: ["DRAFT", "OPEN", "CLOSED", "AWARDED", "CANCELLED"] },
    deadline: { type: "datetime", nullable: true, description: "Application deadline (ISO 8601)" },
    budgetMin: { type: "decimal", nullable: true },
    budgetMax: { type: "decimal", nullable: true },
    budgetCurrency: { type: "string", default: "USD" },
    durationMinDays: { type: "integer", nullable: true },
    durationMaxDays: { type: "integer", nullable: true },
    applicationUrl: { type: "url", description: "Where to apply" },
    sourceUrl: { type: "url", description: "Canonical link to original posting" },
    tags: { type: "string[]" },
    ecosystems: { type: "string[]", description: "e.g. ['Ethereum', 'Arbitrum']" },
    submittedBy: { type: "string" },
    verificationStatus: { type: "enum", values: ["UNVERIFIED", "VERIFIED", "DISPUTED"] },
    programId: { type: "string", description: "Parent funding program" },
  },
  relations: {
    program: "Program",
    requirements: "Requirement[]",
    evaluationCriteria: "EvaluationCriterion[]",
    deliverables: "Deliverable[]",
    changeHistory: "ChangeRecord[]",
  },
  daoip5Mapping: {
    "grantPool.name": "rfp.name",
    "grantPool.description": "rfp.description",
    "grantPool.id": "rfp.programId",
    "grantRound.startDate": "rfp.createdAt",
    "grantRound.endDate": "rfp.deadline",
    "grantPool.fundingAmount": "rfp.budgetMin/budgetMax",
  },
};

export async function GET() {
  return NextResponse.json(SCHEMA_DEFINITION);
}
