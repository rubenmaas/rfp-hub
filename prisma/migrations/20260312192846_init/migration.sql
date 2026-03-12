-- CreateEnum
CREATE TYPE "RfpType" AS ENUM ('RFP', 'GRANT', 'BOUNTY', 'RETROACTIVE');

-- CreateEnum
CREATE TYPE "RfpStatus" AS ENUM ('DRAFT', 'OPEN', 'CLOSED', 'AWARDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('UNVERIFIED', 'VERIFIED', 'DISPUTED');

-- CreateTable
CREATE TABLE "Rfp" (
    "id" TEXT NOT NULL,
    "schemaVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "type" "RfpType" NOT NULL DEFAULT 'RFP',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "RfpStatus" NOT NULL DEFAULT 'OPEN',
    "deadline" TIMESTAMP(3),
    "budgetMin" DECIMAL(65,30),
    "budgetMax" DECIMAL(65,30),
    "budgetCurrency" TEXT NOT NULL DEFAULT 'USD',
    "durationMinDays" INTEGER,
    "durationMaxDays" INTEGER,
    "applicationUrl" TEXT NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "tags" TEXT[],
    "ecosystems" TEXT[],
    "submittedBy" TEXT NOT NULL DEFAULT 'system',
    "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'UNVERIFIED',
    "lastCheckedAt" TIMESTAMP(3),
    "programId" TEXT NOT NULL,
    "duplicateOfId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rfp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "organization" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "ecosystems" TEXT[],
    "publisherId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publisher" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verificationMethod" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Requirement" (
    "id" TEXT NOT NULL,
    "rfpId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'required',

    CONSTRAINT "Requirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvaluationCriterion" (
    "id" TEXT NOT NULL,
    "rfpId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "weight" INTEGER,

    CONSTRAINT "EvaluationCriterion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deliverable" (
    "id" TEXT NOT NULL,
    "rfpId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "milestone" TEXT,

    CONSTRAINT "Deliverable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChangeRecord" (
    "id" TEXT NOT NULL,
    "rfpId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "changedBy" TEXT NOT NULL DEFAULT 'system',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChangeRecord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rfp_sourceUrl_key" ON "Rfp"("sourceUrl");

-- CreateIndex
CREATE INDEX "Rfp_status_idx" ON "Rfp"("status");

-- CreateIndex
CREATE INDEX "Rfp_deadline_idx" ON "Rfp"("deadline");

-- CreateIndex
CREATE INDEX "Rfp_programId_idx" ON "Rfp"("programId");

-- CreateIndex
CREATE INDEX "Rfp_verificationStatus_idx" ON "Rfp"("verificationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Publisher_domain_key" ON "Publisher"("domain");

-- CreateIndex
CREATE INDEX "Requirement_rfpId_idx" ON "Requirement"("rfpId");

-- CreateIndex
CREATE INDEX "EvaluationCriterion_rfpId_idx" ON "EvaluationCriterion"("rfpId");

-- CreateIndex
CREATE INDEX "Deliverable_rfpId_idx" ON "Deliverable"("rfpId");

-- CreateIndex
CREATE INDEX "ChangeRecord_rfpId_idx" ON "ChangeRecord"("rfpId");

-- AddForeignKey
ALTER TABLE "Rfp" ADD CONSTRAINT "Rfp_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rfp" ADD CONSTRAINT "Rfp_duplicateOfId_fkey" FOREIGN KEY ("duplicateOfId") REFERENCES "Rfp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "Publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Requirement" ADD CONSTRAINT "Requirement_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "Rfp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvaluationCriterion" ADD CONSTRAINT "EvaluationCriterion_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "Rfp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deliverable" ADD CONSTRAINT "Deliverable_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "Rfp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChangeRecord" ADD CONSTRAINT "ChangeRecord_rfpId_fkey" FOREIGN KEY ("rfpId") REFERENCES "Rfp"("id") ON DELETE CASCADE ON UPDATE CASCADE;
