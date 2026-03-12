import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Publishers
  const efPublisher = await prisma.publisher.upsert({
    where: { domain: "esp.ethereum.foundation" },
    update: {},
    create: {
      name: "Ethereum Foundation",
      domain: "esp.ethereum.foundation",
      verified: true,
      verifiedAt: new Date(),
      verificationMethod: "domain_verification",
    },
  });

  const arbPublisher = await prisma.publisher.upsert({
    where: { domain: "arbitrum.foundation" },
    update: {},
    create: {
      name: "Arbitrum Foundation",
      domain: "arbitrum.foundation",
      verified: true,
      verifiedAt: new Date(),
      verificationMethod: "domain_verification",
    },
  });

  const gitcoinPublisher = await prisma.publisher.upsert({
    where: { domain: "gitcoin.co" },
    update: {},
    create: {
      name: "Gitcoin",
      domain: "gitcoin.co",
      verified: true,
      verifiedAt: new Date(),
      verificationMethod: "domain_verification",
    },
  });

  const opPublisher = await prisma.publisher.upsert({
    where: { domain: "optimism.io" },
    update: {},
    create: {
      name: "Optimism Foundation",
      domain: "optimism.io",
      verified: true,
      verifiedAt: new Date(),
      verificationMethod: "domain_verification",
    },
  });

  const starkPublisher = await prisma.publisher.upsert({
    where: { domain: "starknet.io" },
    update: {},
    create: {
      name: "Starknet Foundation",
      domain: "starknet.io",
      verified: true,
      verifiedAt: new Date(),
      verificationMethod: "domain_verification",
    },
  });

  // Programs
  const espProgram = await prisma.program.upsert({
    where: { id: "ef-esp" },
    update: {},
    create: {
      id: "ef-esp",
      name: "Ecosystem Support Program",
      organization: "Ethereum Foundation",
      website: "https://esp.ethereum.foundation",
      ecosystems: ["Ethereum"],
      publisherId: efPublisher.id,
    },
  });

  const arbGrowth = await prisma.program.upsert({
    where: { id: "arb-growth" },
    update: {},
    create: {
      id: "arb-growth",
      name: "Arbitrum Growth Track",
      organization: "Arbitrum Foundation",
      website: "https://arbitrum.foundation/grants",
      ecosystems: ["Arbitrum", "Ethereum"],
      publisherId: arbPublisher.id,
    },
  });

  const gitcoinGrants = await prisma.program.upsert({
    where: { id: "gitcoin-grants" },
    update: {},
    create: {
      id: "gitcoin-grants",
      name: "Gitcoin Grants",
      organization: "Gitcoin",
      website: "https://grants.gitcoin.co",
      ecosystems: ["Ethereum", "Gitcoin"],
      publisherId: gitcoinPublisher.id,
    },
  });

  const opRetro = await prisma.program.upsert({
    where: { id: "op-retro" },
    update: {},
    create: {
      id: "op-retro",
      name: "Retro Funding",
      organization: "Optimism Foundation",
      website: "https://app.optimism.io/retropgf",
      ecosystems: ["Optimism", "Ethereum"],
      publisherId: opPublisher.id,
    },
  });

  const starkGrants = await prisma.program.upsert({
    where: { id: "stark-grants" },
    update: {},
    create: {
      id: "stark-grants",
      name: "Starknet Grants",
      organization: "Starknet Foundation",
      website: "https://www.starknet.io/grants",
      ecosystems: ["Starknet"],
      publisherId: starkPublisher.id,
    },
  });

  // Clear existing RFPs for clean seed
  await prisma.changeRecord.deleteMany();
  await prisma.deliverable.deleteMany();
  await prisma.evaluationCriterion.deleteMany();
  await prisma.requirement.deleteMany();
  await prisma.rfp.deleteMany();

  // --- EF ESP RFPs ---
  const rfpHub = await prisma.rfp.create({
    data: {
      name: "RFP Hub: Standard RFP Object and Public Aggregation API",
      description:
        "Build an open-source platform that defines a standard RFP object format, exposes it through a public unauthenticated API, and aggregates funding opportunities from across the web3 ecosystem into a single, searchable, exportable dataset. Must extend DAOIP-5 metadata standard.",
      type: "RFP",
      status: "OPEN",
      deadline: new Date("2026-04-23"),
      budgetMin: 50000,
      budgetMax: 100000,
      budgetCurrency: "USD",
      durationMinDays: 90,
      durationMaxDays: 180,
      applicationUrl: "https://esp.ethereum.foundation/applicants",
      sourceUrl: "https://esp.ethereum.foundation/applicants/rfp",
      tags: ["public-goods", "infrastructure", "grants", "daoip-5", "api"],
      ecosystems: ["Ethereum"],
      programId: espProgram.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
      requirements: {
        create: [
          { title: "Standard RFP object format", description: "Versioned, validated schema extending DAOIP-5", priority: "required" },
          { title: "Public unauthenticated API", description: "REST API with filtering, search, pagination", priority: "required" },
          { title: "Export mechanism", description: "JSON, CSV, and DAOIP-5 native export formats", priority: "required" },
          { title: "Update tracking", description: "Webhooks, polling, or feeds for RFP changes", priority: "required" },
          { title: "Duplicate detection", description: "Handle same RFP from different sources", priority: "required" },
          { title: "Governance framework", description: "Transparent rules for content inclusion and community contributions", priority: "required" },
        ],
      },
      evaluationCriteria: {
        create: [
          { name: "Technical feasibility", description: "Is the proposed architecture sound?", weight: 25 },
          { name: "Schema design quality", description: "Does the schema extend DAOIP-5 appropriately?", weight: 25 },
          { name: "Adoption strategy", description: "Realistic plan for publisher onboarding", weight: 20 },
          { name: "Open source commitment", description: "MIT license, public development", weight: 15 },
          { name: "Sustainability", description: "Long-term maintenance plan", weight: 15 },
        ],
      },
      deliverables: {
        create: [
          { title: "Versioned RFP schema", description: "JSON Schema + Zod definitions", milestone: "M1" },
          { title: "REST API", description: "Full CRUD with filtering and search", milestone: "M1" },
          { title: "Ingestion pipelines", description: "Scrapers + verified publisher API", milestone: "M2" },
          { title: "Export system", description: "JSON, CSV, DAOIP-5 exports", milestone: "M3" },
          { title: "Reference frontend", description: "Search, filter, detail views", milestone: "M4" },
        ],
      },
    },
  });

  await prisma.rfp.create({
    data: {
      name: "Wallet UX Improvements for Account Abstraction",
      description:
        "Research and prototype wallet interfaces that make ERC-4337 account abstraction transparent to end users. Focus on gas sponsorship UX, social recovery flows, and session key management. Deliverables include user research findings, interactive prototypes, and a reference implementation.",
      type: "RFP",
      status: "OPEN",
      deadline: new Date("2026-05-15"),
      budgetMin: 30000,
      budgetMax: 75000,
      budgetCurrency: "USD",
      durationMinDays: 90,
      durationMaxDays: 150,
      applicationUrl: "https://esp.ethereum.foundation/applicants",
      sourceUrl: "https://esp.ethereum.foundation/applicants/rfp/wallet-ux-aa",
      tags: ["wallets", "account-abstraction", "erc-4337", "ux-research"],
      ecosystems: ["Ethereum"],
      programId: espProgram.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  await prisma.rfp.create({
    data: {
      name: "Ethereum Protocol Education Platform",
      description:
        "Build an interactive, open-source education platform covering Ethereum protocol internals — consensus, execution layer, EVM, state management, and networking. Target audience: developers transitioning from application to protocol level. Should include hands-on exercises, simulations, and assessment modules.",
      type: "GRANT",
      status: "OPEN",
      deadline: new Date("2026-06-01"),
      budgetMin: 40000,
      budgetMax: 80000,
      budgetCurrency: "USD",
      durationMinDays: 120,
      durationMaxDays: 240,
      applicationUrl: "https://esp.ethereum.foundation/applicants",
      sourceUrl: "https://esp.ethereum.foundation/applicants/wishlist/protocol-education",
      tags: ["education", "protocol", "developer-tooling"],
      ecosystems: ["Ethereum"],
      programId: espProgram.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  await prisma.rfp.create({
    data: {
      name: "ZK Proving Cost Benchmarking Suite",
      description:
        "Create a standardized benchmarking framework for comparing ZK proving systems (Groth16, PLONK, STARKs, Halo2) across metrics: proof generation time, verification gas cost, memory usage, and prover hardware requirements. Results should be published as a living dataset with automated CI-driven updates.",
      type: "RFP",
      status: "OPEN",
      deadline: new Date("2026-04-30"),
      budgetMin: 50000,
      budgetMax: 120000,
      budgetCurrency: "USD",
      durationMinDays: 90,
      durationMaxDays: 180,
      applicationUrl: "https://esp.ethereum.foundation/applicants",
      sourceUrl: "https://esp.ethereum.foundation/applicants/rfp/zk-benchmarks",
      tags: ["zero-knowledge", "benchmarking", "infrastructure", "research"],
      ecosystems: ["Ethereum"],
      programId: espProgram.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  await prisma.rfp.create({
    data: {
      name: "MEV Supply Chain Transparency Dashboard",
      description:
        "Develop a public dashboard that visualizes the MEV supply chain: block builders, relays, searchers, and validators. Track market share, censorship metrics, and relay reliability over time. Data should be available via API for researchers.",
      type: "RFP",
      status: "OPEN",
      deadline: new Date("2026-05-30"),
      budgetMin: 30000,
      budgetMax: 60000,
      budgetCurrency: "USD",
      durationMinDays: 60,
      durationMaxDays: 120,
      applicationUrl: "https://esp.ethereum.foundation/applicants",
      sourceUrl: "https://esp.ethereum.foundation/applicants/rfp/mev-dashboard",
      tags: ["mev", "transparency", "dashboard", "public-goods"],
      ecosystems: ["Ethereum"],
      programId: espProgram.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  // --- Arbitrum ---
  await prisma.rfp.create({
    data: {
      name: "Arbitrum DeFi Analytics & Risk Platform",
      description:
        "Build a comprehensive analytics platform for Arbitrum DeFi protocols. Track TVL, yield opportunities, protocol health metrics, and risk scores. Must support Arbitrum One and Arbitrum Nova. Open API for third-party integrations required.",
      type: "GRANT",
      status: "OPEN",
      deadline: new Date("2026-04-15"),
      budgetMin: 50000,
      budgetMax: 150000,
      budgetCurrency: "USD",
      durationMinDays: 90,
      durationMaxDays: 180,
      applicationUrl: "https://arbitrum.foundation/grants",
      sourceUrl: "https://arbitrum.foundation/grants/defi-analytics",
      tags: ["defi", "analytics", "risk", "dashboard"],
      ecosystems: ["Arbitrum", "Ethereum"],
      programId: arbGrowth.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  await prisma.rfp.create({
    data: {
      name: "AI Agent Infrastructure on Arbitrum",
      description:
        "Develop infrastructure for deploying autonomous AI agents that can interact with Arbitrum smart contracts. Focus areas: agent wallets, transaction signing, gas management, and safety guardrails. Must include a reference implementation with at least 2 agent use cases.",
      type: "GRANT",
      status: "OPEN",
      deadline: new Date("2026-05-01"),
      budgetMin: 75000,
      budgetMax: 250000,
      budgetCurrency: "USD",
      durationMinDays: 120,
      durationMaxDays: 240,
      applicationUrl: "https://arbitrum.foundation/grants",
      sourceUrl: "https://arbitrum.foundation/grants/ai-agent-infra",
      tags: ["ai", "agents", "infrastructure", "smart-contracts"],
      ecosystems: ["Arbitrum", "Ethereum"],
      programId: arbGrowth.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  // --- Gitcoin ---
  await prisma.rfp.create({
    data: {
      name: "Gitcoin Grants Stack Open Source Contributions",
      description:
        "Contribute to the open-source Grants Stack — Gitcoin's modular grants platform. Priority areas: Allo Protocol improvements, round manager UX, explorer performance, and passport integration. Bounties range from $500 for small PRs to $10,000 for major features.",
      type: "BOUNTY",
      status: "OPEN",
      deadline: null,
      budgetMin: 500,
      budgetMax: 10000,
      budgetCurrency: "USD",
      applicationUrl: "https://github.com/gitcoinco/grants-stack/issues",
      sourceUrl: "https://grants.gitcoin.co/open-source-contributions",
      tags: ["open-source", "grants-stack", "bounty", "public-goods"],
      ecosystems: ["Ethereum", "Gitcoin"],
      programId: gitcoinGrants.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  await prisma.rfp.create({
    data: {
      name: "GG22 Climate Solutions Round",
      description:
        "Gitcoin Grants Round 22 — Climate Solutions track. Quadratic funding round for projects working on ReFi, carbon markets, environmental monitoring, and sustainability tools. Matching pool: $200,000.",
      type: "GRANT",
      status: "OPEN",
      deadline: new Date("2026-04-20"),
      budgetMin: 1000,
      budgetMax: 50000,
      budgetCurrency: "USD",
      durationMinDays: 30,
      durationMaxDays: 365,
      applicationUrl: "https://grants.gitcoin.co/rounds/gg22-climate",
      sourceUrl: "https://grants.gitcoin.co/rounds/gg22-climate",
      tags: ["climate", "refi", "quadratic-funding", "public-goods"],
      ecosystems: ["Ethereum", "Gitcoin"],
      programId: gitcoinGrants.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  // --- Optimism ---
  await prisma.rfp.create({
    data: {
      name: "Retro Funding Round 7: Developer Tooling",
      description:
        "Optimism Retro Funding Round 7 focused on developer tooling that has demonstrated impact on the OP Stack ecosystem. Retroactive grants for tools, libraries, documentation, and infrastructure that have shipped and shown measurable adoption.",
      type: "RETROACTIVE",
      status: "OPEN",
      deadline: new Date("2026-05-10"),
      budgetMin: 5000,
      budgetMax: 500000,
      budgetCurrency: "USD",
      applicationUrl: "https://app.optimism.io/retropgf",
      sourceUrl: "https://gov.optimism.io/retro-funding-round-7-dev-tooling",
      tags: ["retroactive", "developer-tooling", "op-stack", "public-goods"],
      ecosystems: ["Optimism", "Ethereum"],
      programId: opRetro.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  // --- Starknet ---
  await prisma.rfp.create({
    data: {
      name: "Starknet Seed Grant: Cairo Developer Tools",
      description:
        "Seed grants for building developer tools for the Cairo programming language and Starknet ecosystem. Priority areas: IDE plugins, testing frameworks, debugging tools, and documentation generators. Fast-track review for tools that improve Cairo developer experience.",
      type: "GRANT",
      status: "OPEN",
      deadline: new Date("2026-06-30"),
      budgetMin: 10000,
      budgetMax: 50000,
      budgetCurrency: "USD",
      durationMinDays: 60,
      durationMaxDays: 180,
      applicationUrl: "https://www.starknet.io/grants",
      sourceUrl: "https://www.starknet.io/grants/seed-cairo-dev-tools",
      tags: ["cairo", "developer-tooling", "seed-grant"],
      ecosystems: ["Starknet"],
      programId: starkGrants.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  await prisma.rfp.create({
    data: {
      name: "Starknet DeFi Composability Framework",
      description:
        "Build a composability framework enabling Starknet DeFi protocols to integrate seamlessly. Includes standard interfaces for token swaps, lending positions, and yield strategies. Must demonstrate with at least 3 protocol integrations on testnet.",
      type: "GRANT",
      status: "OPEN",
      deadline: new Date("2026-05-15"),
      budgetMin: 25000,
      budgetMax: 100000,
      budgetCurrency: "USD",
      durationMinDays: 90,
      durationMaxDays: 180,
      applicationUrl: "https://www.starknet.io/grants",
      sourceUrl: "https://www.starknet.io/grants/defi-composability",
      tags: ["defi", "composability", "framework", "growth-grant"],
      ecosystems: ["Starknet"],
      programId: starkGrants.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date(),
    },
  });

  // One closed RFP for demo purposes
  await prisma.rfp.create({
    data: {
      name: "EF PhD Fellowship 2025",
      description:
        "The Ethereum Foundation PhD Fellowship supports doctoral students working on Ethereum-related research. Areas of interest: consensus mechanisms, cryptography, formal verification, mechanism design, and network security.",
      type: "GRANT",
      status: "CLOSED",
      deadline: new Date("2025-12-01"),
      budgetMin: 40000,
      budgetMax: 60000,
      budgetCurrency: "USD",
      durationMinDays: 365,
      durationMaxDays: 1095,
      applicationUrl: "https://esp.ethereum.foundation/applicants",
      sourceUrl: "https://esp.ethereum.foundation/phd-fellowship-2025",
      tags: ["research", "fellowship", "phd", "academic"],
      ecosystems: ["Ethereum"],
      programId: espProgram.id,
      submittedBy: "system",
      verificationStatus: "VERIFIED",
      lastCheckedAt: new Date("2025-12-02"),
    },
  });

  console.log(`Seeded: ${await prisma.rfp.count()} RFPs, ${await prisma.program.count()} programs, ${await prisma.publisher.count()} publishers`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
