const DEMO_USERS = [
  { id: "u-001", name: "Maya Chen", role: "Sales Rep", workspace: "Oracle North America" },
  { id: "u-002", name: "Jordan Ellis", role: "Sales Manager", workspace: "Oracle North America" },
  { id: "u-003", name: "Priya Raman", role: "Admin", workspace: "Oracle North America" }
];

const docs = {
  generativeAi: "https://docs.oracle.com/en-us/iaas/Content/generative-ai/home.htm",
  autonomousDatabase: "https://docs.oracle.com/en-us/iaas/autonomous-database/index.html",
  cloudGuard: "https://docs.oracle.com/en-us/iaas/Content/cloud-guard/home.htm",
  iam: "https://docs.oracle.com/en-us/iaas/Content/Identity/home.htm",
  apiGateway: "https://docs.oracle.com/en-us/iaas/Content/APIGateway/home.htm",
  functions: "https://docs.oracle.com/en-us/iaas/Content/Functions/home.htm",
  oke: "https://docs.oracle.com/en-us/iaas/Content/ContEng/home.htm",
  objectStorage: "https://docs.oracle.com/en-us/iaas/Content/Object/home.htm",
  vault: "https://docs.oracle.com/en-us/iaas/Content/KeyManagement/home.htm",
  fastConnect: "https://docs.oracle.com/en-us/iaas/Content/Network/Concepts/fastconnect.htm",
  costManagement: "https://docs.oracle.com/en-us/iaas/Content/Billing/Concepts/billingoverview.htm"
};

const services = [
  service("OCI Generative AI", "AI and automation", ["ai", "automation", "content", "assistant", "language", "customer experience", "personalization"], "Build, deploy, and govern enterprise AI applications with managed models, agents, guardrails, observability, and auditability.", "position governed AI experiences without forcing the customer to assemble every model, guardrail, and runtime concern themselves", docs.generativeAi),
  service("Autonomous AI Database", "Data platform", ["database", "data", "analytics", "transaction", "sql", "erp", "crm", "ai vector", "reporting"], "A self-governing database service that handles provisioning, backup, patching, upgrades, and elastic scaling.", "modernize core data workloads while reducing operational database administration effort", docs.autonomousDatabase),
  service("AI Vector Search on Oracle Database", "Data and AI", ["ai", "search", "recommendation", "knowledge", "database", "personalization", "semantic"], "Bring LLMs to enterprise data using built-in vector search without copying proprietary data into a separate specialty vector database.", "ground AI answers in trusted enterprise data while keeping the data estate simpler", docs.autonomousDatabase),
  service("Oracle Analytics Cloud", "Analytics", ["analytics", "reporting", "dashboard", "forecast", "insight", "business intelligence", "kpi"], "Enterprise analytics for dashboards, self-service exploration, and governed insight delivery across business teams.", "move leaders from periodic reporting to governed, shared decision intelligence", "https://docs.oracle.com/en/cloud/paas/analytics-cloud/"),
  service("OCI Kubernetes Engine", "Application modernization", ["kubernetes", "container", "microservice", "scale", "devops", "platform", "cloud native"], "Define and create Kubernetes clusters for deployment, scaling, and management of containerized applications.", "standardize container operations while giving engineering teams a managed Kubernetes foundation", docs.oke),
  service("OCI Functions", "Serverless", ["serverless", "event", "automation", "api", "integration", "workflow", "backend"], "Run and scale business logic without managing infrastructure.", "automate event-driven workflows and integrations without adding infrastructure overhead", docs.functions),
  service("OCI API Gateway", "Integration and APIs", ["api", "integration", "partner", "mobile", "developer", "rate limiting", "authentication"], "Create governed HTTP/S interfaces with policy enforcement such as authentication and rate limiting.", "turn integration surfaces into governed, observable, secured APIs", docs.apiGateway),
  service("OCI Cloud Guard", "Security posture", ["security", "risk", "compliance", "posture", "misconfiguration", "monitoring", "threat"], "Monitor, identify, achieve, and maintain a strong security posture across OCI resources and users.", "make security posture management continuous instead of reactive", docs.cloudGuard),
  service("OCI IAM with Identity Domains", "Identity and access", ["identity", "access", "sso", "authentication", "lifecycle", "governance", "user"], "Provide authentication, SSO, identity lifecycle management, and access governance for Oracle and non-Oracle applications.", "centralize access control as the customer's cloud and SaaS footprint grows", docs.iam),
  service("OCI Vault", "Encryption and secrets", ["encryption", "key", "secret", "compliance", "privacy", "regulated", "secure"], "Store and manage encryption keys used to securely access resources.", "give security teams stronger control of keys and secrets for regulated workloads", docs.vault),
  service("OCI Object Storage", "Storage and data lake", ["storage", "data lake", "backup", "archive", "media", "document", "durable", "scale"], "A programmable, scalable, durable storage service for storing and accessing large amounts of data.", "create a durable landing zone for documents, telemetry, media, backups, and analytics data", docs.objectStorage),
  service("OCI Observability and Management", "Operations", ["monitoring", "logging", "observability", "uptime", "incident", "sla", "reliability"], "Centralize logs, metrics, alarms, and operational insight for cloud resources and applications.", "help operations teams detect, explain, and resolve issues faster across the cloud estate", "https://docs.oracle.com/en-us/iaas/Content/observability/home.htm"),
  service("OCI Cost Management and FinOps Hub", "FinOps", ["cost", "budget", "spend", "forecast", "efficiency", "optimization", "finance"], "Estimate costs, set budgets, view cost reports, visualize spending, and optimize consumption.", "give finance and platform leaders stronger visibility and controls over cloud spend", docs.costManagement),
  service("OCI FastConnect", "Hybrid cloud networking", ["hybrid", "network", "data center", "private", "latency", "connectivity", "on premises"], "Create a dedicated private connection between a data center and OCI.", "support hybrid migration paths where private connectivity, latency, or data movement predictability matters", docs.fastConnect)
];

const industries = [
  ["Healthcare and Life Sciences", ["patient", "clinical", "health", "healthcare", "hospital", "pharma", "medical", "care"]],
  ["Financial Services", ["bank", "financial", "insurance", "payment", "wealth", "loan", "credit", "risk", "trading"]],
  ["Retail and Consumer Goods", ["retail", "shop", "store", "commerce", "consumer", "brand", "loyalty", "customer"]],
  ["Manufacturing", ["manufacturing", "factory", "supply chain", "industrial", "equipment", "production", "quality"]],
  ["Technology and SaaS", ["software", "platform", "developer", "api", "saas", "cloud", "data", "application"]],
  ["Public Sector", ["government", "public sector", "agency", "citizen", "municipal", "state", "federal"]],
  ["Education", ["student", "education", "university", "college", "school", "learning", "campus"]],
  ["Media and Communications", ["media", "streaming", "content", "telecom", "network", "subscriber", "broadcast"]],
  ["Energy and Utilities", ["energy", "utility", "grid", "oil", "gas", "renewable", "power"]],
  ["Logistics and Transportation", ["logistics", "shipping", "fleet", "transportation", "delivery", "warehouse", "supply"]]
];

const signalCatalog = [
  signal("ai", "AI and automation opportunity", ["ai", "artificial intelligence", "machine learning", "automation", "predictive", "recommendation", "personalization", "agent"], "The company appears to have use cases where AI, automation, or intelligent assistants could improve productivity or digital experiences."),
  signal("data", "Data platform and analytics need", ["data", "analytics", "insight", "dashboard", "reporting", "intelligence", "database", "real-time", "forecast"], "The website suggests reliance on data, reporting, decision intelligence, or analytical products."),
  signal("security", "Security and compliance pressure", ["security", "secure", "privacy", "compliance", "risk", "regulated", "trust", "encryption", "governance"], "Trust, compliance, privacy, or risk language indicates security posture may matter to buyers."),
  signal("modernization", "Application modernization", ["cloud", "platform", "api", "mobile", "digital", "developer", "kubernetes", "container", "microservice", "modern"], "Digital platform language suggests modernization, managed runtime, or integration opportunities."),
  signal("scale", "Scale and reliability", ["global", "scale", "millions", "availability", "uptime", "mission critical", "performance", "low latency", "resilient"], "Scale, performance, or uptime language points to resilient cloud architecture needs."),
  signal("cost", "Cost and efficiency", ["cost", "efficient", "efficiency", "productivity", "optimize", "margin", "automation", "streamline", "reduce"], "Efficiency language gives reps a CFO and operations angle around cloud cost controls and automation."),
  signal("hybrid", "Hybrid or multicloud path", ["hybrid", "on-premises", "data center", "azure", "aws", "google cloud", "private cloud", "migration"], "Hybrid or multicloud language suggests a gradual migration and connectivity conversation."),
  signal("customer", "Customer experience transformation", ["customer", "member", "patient", "consumer", "experience", "support", "engagement", "loyalty", "journey"], "Customer-facing language can anchor a revenue, retention, or service experience talk track.")
];

let analyses = [];
let audit = [];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) return handleApi(request, url);
      if (env.ASSETS) return env.ASSETS.fetch(request);
      return json({ error: "Static assets binding is not configured." }, 500);
    } catch (error) {
      const status = error.status || 500;
      return json({ error: status >= 500 ? "Unexpected server error" : "Website analysis failed", detail: error.message }, status);
    }
  }
};

async function handleApi(request, url) {
  if (request.method === "GET" && url.pathname === "/api/health") return json({ ok: true, users: DEMO_USERS, runtime: "cloudflare-worker" });

  if (request.method === "POST" && url.pathname === "/api/analyze") {
    const body = await request.json();
    const user = DEMO_USERS.find((candidate) => candidate.id === body.userId) || DEMO_USERS[0];
    const normalizedUrl = normalizeInputUrl(body.url || "");
    const startedAt = Date.now();
    const crawl = await crawlWebsite(normalizedUrl);
    const analysis = buildAnalysis(crawl, normalizedUrl, user);
    analysis.durationMs = Date.now() - startedAt;
    analyses = [...analyses, analysis].slice(-60);
    writeAudit("analysis.created", user, { analysisId: analysis.id, company: analysis.company.name, url: normalizedUrl, pagesAnalyzed: analysis.company.pagesAnalyzed.length });
    return json(analysis);
  }

  if (request.method === "GET" && url.pathname === "/api/analyses") {
    const q = (url.searchParams.get("q") || "").toLowerCase();
    const results = q ? analyses.filter((item) => [item.company.name, item.company.domain, item.company.industry, item.status].join(" ").toLowerCase().includes(q)) : analyses;
    return json(results.map(toSummary).reverse());
  }

  if (url.pathname.startsWith("/api/analyses/")) {
    const id = url.pathname.split("/").pop();
    const index = analyses.findIndex((item) => item.id === id);
    if (index === -1) return json({ error: "Analysis not found" }, 404);
    if (request.method === "GET") return json(analyses[index]);
    if (request.method === "PATCH") {
      const body = await request.json();
      const user = DEMO_USERS.find((candidate) => candidate.id === body.userId) || DEMO_USERS[0];
      analyses[index] = {
        ...analyses[index],
        status: body.status || analyses[index].status,
        talkTrack: body.talkTrack ? { ...analyses[index].talkTrack, ...body.talkTrack } : analyses[index].talkTrack,
        notes: typeof body.notes === "string" ? body.notes : analyses[index].notes,
        updatedAt: new Date().toISOString()
      };
      writeAudit("analysis.updated", user, { analysisId: id, status: analyses[index].status });
      return json(analyses[index]);
    }
  }

  if (request.method === "GET" && url.pathname === "/api/admin/metrics") return json(buildAdminMetrics());
  if (request.method === "GET" && url.pathname === "/api/audit") return json([...audit].slice(-80).reverse());

  if (request.method === "GET" && url.pathname.startsWith("/api/export/")) {
    const id = url.pathname.replace("/api/export/", "").replace(/\.md$/, "");
    const analysis = analyses.find((item) => item.id === id);
    if (!analysis) return text("Analysis not found", 404);
    return new Response(toMarkdown(analysis), {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${slugify(analysis.company.name)}-oci-talk-track.md"`
      }
    });
  }

  return json({ error: "API route not found" }, 404);
}

async function crawlWebsite(startUrl) {
  const homepage = await fetchPage(startUrl);
  const base = new URL(homepage.finalUrl || startUrl);
  const links = pickInternalLinks(homepage.html, base).slice(0, 4);
  const pages = [homepage];

  for (const link of links) {
    try {
      pages.push(await fetchPage(link));
    } catch (error) {
      pages.push({ url: link, finalUrl: link, title: "Unavailable page", description: "", text: "", html: "", error: error.message });
    }
  }

  const successful = pages.filter((page) => page.text && page.text.length > 80);
  if (!successful.length) {
    const error = new Error("The website could not be analyzed. It may block automated requests or require JavaScript rendering.");
    error.status = 422;
    throw error;
  }

  return {
    requestedUrl: startUrl,
    finalUrl: homepage.finalUrl || startUrl,
    domain: base.hostname.replace(/^www\./, ""),
    pages,
    text: successful.map((page) => page.text).join("\n\n").slice(0, 60000)
  };
}

async function fetchPage(targetUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (compatible; OCI-Talk-Track-Studio/1.0)", "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5" }
    });
    const contentType = response.headers.get("content-type") || "";
    if (!response.ok) {
      const error = new Error(`Received HTTP ${response.status}. The website may block automated requests.`);
      error.status = 422;
      throw error;
    }
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      const error = new Error(`Unsupported content type: ${contentType || "unknown"}`);
      error.status = 422;
      throw error;
    }
    const html = await response.text();
    return { url: targetUrl, finalUrl: response.url || targetUrl, title: extractTitle(html), description: extractMetaDescription(html), html, text: htmlToText(html) };
  } finally {
    clearTimeout(timer);
  }
}

function buildAnalysis(crawl, normalizedUrl, user) {
  const now = new Date().toISOString();
  const textValue = normalizeWhitespace(crawl.text);
  const lower = textValue.toLowerCase();
  const companyName = inferCompanyName(crawl.pages[0], crawl.domain);
  const industry = detectIndustry(lower);
  const businessModel = detectBusinessModel(lower, industry.name);
  const detectedSignals = detectSignals(textValue);
  const recommendations = scoreServices(detectedSignals, lower, industry.name).slice(0, 7);

  const analysis = {
    id: `ana-${randomId()}`,
    createdAt: now,
    updatedAt: now,
    status: "Needs review",
    owner: user,
    workspace: user.workspace,
    source: {
      requestedUrl: normalizedUrl,
      finalUrl: crawl.finalUrl,
      analysisMethod: "Live website crawl plus deterministic OCI fit scoring",
      pages: crawl.pages.map((page) => ({ url: page.finalUrl || page.url, title: page.title, status: page.error ? "Skipped" : "Analyzed", error: page.error || null }))
    },
    company: {
      name: companyName,
      domain: crawl.domain,
      website: crawl.finalUrl,
      industry: industry.name,
      industryConfidence: industry.confidence,
      businessModel,
      description: crawl.pages[0].description || firstSentence(textValue),
      profileSummary: "",
      pagesAnalyzed: crawl.pages.filter((page) => !page.error).map((page) => page.finalUrl || page.url)
    },
    signals: detectedSignals,
    recommendations,
    notes: "",
    demoReadiness: {
      beforeWorkflow: "Sales rep manually researches the website, searches product docs, edits a generic deck, and risks unsupported claims.",
      afterWorkflow: "Sales rep enters a URL, reviews cited evidence, selects OCI positioning, edits the talk track, and exports meeting-ready content.",
      verificationSteps: ["Enter a public company URL.", "Confirm pages analyzed and website evidence.", "Review OCI recommendations and confidence levels.", "Edit the talk track and save review status.", "Open Admin to inspect usage and audit history."]
    }
  };

  analysis.company.profileSummary = `${companyName} appears to be a ${industry.name.toLowerCase()} organization focused on ${businessModel.toLowerCase()}. Public content indicates possible priorities around ${joinHuman(detectedSignals.slice(0, 3).map((item) => item.label.toLowerCase())) || "general enterprise cloud priorities"}.`;
  analysis.talkTrack = buildTalkTrack(companyName, industry.name, businessModel, detectedSignals, recommendations);
  analysis.governance = buildGovernance(crawl, detectedSignals, recommendations);
  return analysis;
}

function detectSignals(textValue) {
  const lower = textValue.toLowerCase();
  return signalCatalog.map((item) => {
    const matchedTerms = item.terms.filter((term) => lower.includes(term));
    const score = item.terms.reduce((total, term) => total + countOccurrences(lower, term), 0);
    const evidence = pickEvidence(collectEvidence(textValue, item.terms), item.terms, 3);
    return { id: item.id, label: item.label, strength: score >= 12 ? "High" : score >= 4 ? "Medium" : "Low", score, description: item.description, matchedTerms, evidence };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
}

function scoreServices(detectedSignals, lower, industry) {
  const activeTerms = new Set(detectedSignals.flatMap((item) => item.matchedTerms));
  return services.map((item) => {
    let score = 0;
    const matched = [];
    for (const tag of item.tags) {
      const occurrences = countOccurrences(lower, tag);
      if (occurrences > 0) {
        score += Math.min(occurrences, 8) * 2;
        matched.push(tag);
      }
      if (activeTerms.has(tag)) score += 4;
    }
    for (const detected of detectedSignals) {
      if (item.tags.some((tag) => detected.matchedTerms.includes(tag))) score += 5;
      if (detected.id === "security" && item.area.toLowerCase().includes("security")) score += 8;
      if (detected.id === "ai" && item.area.toLowerCase().includes("ai")) score += 8;
      if (detected.id === "modernization" && ["Application modernization", "Serverless", "Integration and APIs"].includes(item.area)) score += 7;
      if (detected.id === "hybrid" && item.area.toLowerCase().includes("hybrid")) score += 8;
      if (detected.id === "cost" && item.area === "FinOps") score += 8;
    }
    const confidence = Math.max(18, Math.min(96, Math.round(score + 30)));
    return {
      name: item.name,
      area: item.area,
      confidence,
      level: confidence >= 78 ? "High" : confidence >= 55 ? "Medium" : "Exploratory",
      whyFit: `The strongest website signals point to ${joinHuman(detectedSignals.slice(0, 2).map((signalItem) => signalItem.label.toLowerCase())) || "enterprise cloud priorities"}. For a ${industry.toLowerCase()} account, ${item.name} can help the rep discuss how Oracle can ${item.talkTrackValue}.`,
      ociStrength: item.strength,
      talkTrackValue: item.talkTrackValue,
      docs: item.docs,
      tags: Array.from(new Set([...matched, ...item.tags.slice(0, 4)])),
      evidence: pickEvidence(collectEvidence(lower, item.tags), item.tags, 3)
    };
  }).sort((a, b) => b.confidence - a.confidence).filter((item, index) => item.confidence >= 45 || index < 5);
}

function buildTalkTrack(companyName, industry, businessModel, detectedSignals, recommendations) {
  const topSignals = detectedSignals.slice(0, 3);
  const topServices = recommendations.slice(0, 4);
  const signalPhrase = joinHuman(topSignals.map((item) => item.label.toLowerCase())) || "digital operations, security, and data priorities";
  const servicePhrase = joinHuman(topServices.map((item) => item.name));
  return {
    executiveSummary: `${companyName} appears to operate in ${industry} with a business model centered on ${businessModel.toLowerCase()}. The recommended sales motion should lead with business outcomes, prove the recommendations with public website evidence, and avoid making claims beyond what the site supports.`,
    opener: `Based on ${companyName}'s public website, the strongest conversation appears to be around ${signalPhrase}. I would position Oracle Cloud as a way to connect ${businessModel.toLowerCase()} priorities with a secure, data-driven cloud foundation, starting with ${servicePhrase}.`,
    valuePillars: topServices.map((item) => ({ title: item.area, service: item.name, message: `Use ${item.name} to ${item.talkTrackValue}. Confidence: ${item.level} (${item.confidence}%).`, proofPoint: item.ociStrength })),
    personas: {
      CIO: persona("Platform strategy, modernization, governance, and business alignment", `For the CIO, anchor on how OCI can support ${companyName}'s digital agenda with governed cloud services, integration discipline, and a roadmap that reduces operational fragmentation.`, "Which systems or processes are slowing your ability to turn business priorities into reliable digital services?"),
      CTO: persona("Architecture, APIs, data, reliability, and engineering velocity", `For the CTO, focus on the technical path: ${servicePhrase} can support scalable architectures while preserving security and observability requirements.`, "Where are your teams seeing the most friction today: data access, deployment speed, integration, security reviews, or runtime scale?"),
      CFO: persona("Cost control, productivity, and measurable return", "For the CFO, connect the cloud discussion to productivity, spend governance, and a phased adoption model that makes value measurable before broad rollout.", "How do you currently measure the cost and value of cloud, data, and automation investments across teams?"),
      CISO: persona("Security posture, access governance, encryption, and auditability", "For the CISO, lead with evidence-backed security and governance needs, then position Cloud Guard, IAM, and Vault where trust, privacy, or compliance language appears in the account profile.", "Which cloud risks are most important for your team to reduce: misconfiguration, identity sprawl, data protection, audit readiness, or incident response?"),
      "VP Sales": persona("Customer insight, faster response, and better front-line execution", "For the VP Sales or revenue leader, emphasize faster insight, better customer segmentation, and AI-assisted workflows that help teams act on data with less manual effort.", "Where would better account intelligence or automated follow-up create the most visible lift for your team?")
    },
    discoveryQuestions: [`Which current initiative at ${companyName} is most dependent on better data, automation, or digital scale?`, "What parts of the current technology stack create the most manual work for teams?", "Where do security, privacy, or compliance reviews slow down delivery?", "Are there workloads that need a hybrid, multicloud, or phased migration path?", "What would a successful first 90-day cloud initiative need to prove?"],
    objectionHandling: [
      { objection: "We already have a cloud provider.", response: "Acknowledge the existing investment and position OCI where it is complementary: Oracle data workloads, governed AI, hybrid connectivity, database modernization, or cost visibility." },
      { objection: "We are worried about AI accuracy.", response: "Lead with governance. The app's own workflow separates website facts, assumptions, and recommendations. OCI Generative AI provides enterprise controls such as guardrails, observability, and auditability." },
      { objection: "Migration sounds risky.", response: "Suggest a phased path. Start with a contained workload, a data or analytics pilot, API modernization, or private connectivity pattern before broad migration." }
    ],
    followUpEmail: `Subject: OCI ideas for ${companyName}\n\nHi [Name],\n\nI reviewed ${companyName}'s public website and noticed signals around ${signalPhrase}. Based on that, I thought it may be useful to compare a few Oracle Cloud options that could support your priorities: ${servicePhrase}.\n\nWould it be helpful to spend 30 minutes validating which of these areas maps to your current roadmap?\n\nBest,\n[Sales Rep]`,
    meetingPrep: ["Open with the website evidence, not a generic cloud pitch.", "Ask which signal is real and which is only inferred from public messaging.", "Use the top two OCI recommendations first; keep the rest as supporting options.", "Capture objections and update the reviewed talk track before exporting CRM notes."],
    facts: topSignals.flatMap((item) => item.evidence).slice(0, 6),
    assumptions: ["Public website language is a directional signal, not confirmed internal priority.", "Technology fit should be validated with discovery before proposing architecture or pricing.", "Recommendations intentionally avoid claims that are not supported by website evidence or Oracle documentation."]
  };
}

function buildGovernance(crawl, detectedSignals, recommendations) {
  return {
    reviewState: "Human review required before customer use",
    confidenceMethod: "Confidence combines website keyword evidence, industry fit, signal strength, and OCI service tag alignment.",
    promptVersion: "oci-talk-track-v1.0-worker",
    factPolicy: "Only website snippets and official Oracle documentation are treated as facts. Account priorities are labeled as assumptions until validated.",
    sourceCitations: [
      ...crawl.pages.filter((page) => !page.error).map((page) => ({ label: page.title || page.finalUrl || page.url, url: page.finalUrl || page.url, type: "Company website" })),
      ...recommendations.map((item) => ({ label: `${item.name} documentation`, url: item.docs, type: "Official Oracle documentation" }))
    ],
    signalCoverage: detectedSignals.map((item) => ({ signal: item.label, evidenceCount: item.evidence.length, confidence: item.strength }))
  };
}

function buildAdminMetrics() {
  const reviewed = analyses.filter((item) => item.status === "Reviewed").length;
  const totalRecommendations = analyses.reduce((total, item) => total + item.recommendations.length, 0);
  const topServices = {};
  analyses.forEach((analysis) => analysis.recommendations.slice(0, 3).forEach((item) => { topServices[item.name] = (topServices[item.name] || 0) + 1; }));
  return {
    users: DEMO_USERS,
    totals: { analyses: analyses.length, reviewed, reviewRate: analyses.length ? Math.round((reviewed / analyses.length) * 100) : 0, averageRecommendations: analyses.length ? Math.round((totalRecommendations / analyses.length) * 10) / 10 : 0, auditEvents: audit.length },
    topServices: Object.entries(topServices).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 6),
    recentAnalyses: analyses.slice(-6).reverse().map(toSummary),
    governanceControls: ["Human review required before customer use", "Facts, assumptions, and recommendations are separated", "Official Oracle docs are linked for OCI capabilities", "All create/update actions are recorded in audit history", "Exports include source and confidence context"],
    integrations: [
      { name: "Salesforce", status: "Ready for API connector", scope: "CRM notes and account activity" },
      { name: "Oracle CX Sales", status: "Ready for API connector", scope: "Account plan and opportunity notes" },
      { name: "Slack or Teams", status: "Deferred", scope: "Share reviewed talk tracks" },
      { name: "Identity Provider", status: "Simulated", scope: "SSO and role mapping" }
    ]
  };
}

function toSummary(analysis) {
  return { id: analysis.id, company: analysis.company, createdAt: analysis.createdAt, updatedAt: analysis.updatedAt, status: analysis.status, owner: analysis.owner, recommendations: analysis.recommendations.slice(0, 3), signals: analysis.signals.slice(0, 3), durationMs: analysis.durationMs };
}

function toMarkdown(analysis) {
  return `# OCI Talk Track: ${analysis.company.name}

Generated: ${analysis.createdAt}
Website: ${analysis.company.website}
Industry: ${analysis.company.industry}
Business model: ${analysis.company.businessModel}
Status: ${analysis.status}

## Executive Summary
${analysis.talkTrack.executiveSummary}

## Recommended OCI Positioning
${analysis.recommendations.map((item) => `- **${item.name}** (${item.level}, ${item.confidence}%): ${item.whyFit}\n  - Docs: ${item.docs}`).join("\n")}

## Opener
${analysis.talkTrack.opener}

## Discovery Questions
${analysis.talkTrack.discoveryQuestions.map((item) => `- ${item}`).join("\n")}
`;
}

function writeAudit(action, actor, details) {
  audit = [...audit, { id: `evt-${randomId()}`, timestamp: new Date().toISOString(), action, actor, details }].slice(-300);
}

function pickInternalLinks(html, base) {
  const priorities = ["about", "solution", "product", "platform", "service", "customer", "industry", "security", "technology", "data", "blog"];
  const links = [];
  const anchorRegex = /<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
  let match;
  while ((match = anchorRegex.exec(html)) !== null) {
    const href = decodeHtml(match[1] || "").trim();
    if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
    try {
      const url = new URL(href, base);
      if (url.hostname.replace(/^www\./, "") !== base.hostname.replace(/^www\./, "")) continue;
      url.hash = "";
      const lower = `${url.pathname} ${stripTags(match[2] || "")}`.toLowerCase();
      const priority = priorities.findIndex((term) => lower.includes(term));
      if (priority !== -1) links.push({ url: url.toString(), priority });
    } catch {
      // Ignore invalid links.
    }
  }
  const seen = new Set();
  return links.sort((a, b) => a.priority - b.priority || a.url.length - b.url.length).map((item) => item.url).filter((item) => !seen.has(item) && seen.add(item));
}

function detectIndustry(lower) {
  const scored = industries.map(([name, terms]) => ({ name, matches: terms.reduce((total, term) => total + countOccurrences(lower, term), 0) })).sort((a, b) => b.matches - a.matches);
  const top = scored[0];
  return top.matches > 0 ? { name: top.name, confidence: top.matches >= 8 ? "High" : top.matches >= 3 ? "Medium" : "Low" } : { name: "General Enterprise", confidence: "Low" };
}

function detectBusinessModel(lower, industry) {
  if (hasAny(lower, ["subscription", "saas", "platform", "software", "developer"])) return "Digital platform or subscription services";
  if (hasAny(lower, ["shop", "store", "retail", "commerce", "consumer"])) return "Consumer commerce and customer engagement";
  if (hasAny(lower, ["manufacturer", "factory", "industrial", "supply chain"])) return "Production, operations, and supply chain";
  if (hasAny(lower, ["bank", "insurance", "wealth", "payment"])) return "Regulated financial products and services";
  if (hasAny(lower, ["patient", "clinical", "healthcare", "care"])) return "Regulated care delivery and health operations";
  return industry !== "General Enterprise" ? `${industry} operations and digital services` : "Enterprise services and digital operations";
}

function collectEvidence(textValue, terms) {
  return textValue.replace(/\s+/g, " ").split(/(?<=[.!?])\s+/).map((item) => item.trim()).filter((item) => item.length >= 50 && item.length <= 260 && terms.some((term) => item.toLowerCase().includes(term.toLowerCase())));
}

function pickEvidence(evidence, terms, limit) {
  const seen = new Set();
  return evidence.sort((a, b) => scoreSentence(b, terms) - scoreSentence(a, terms)).filter((item) => scoreSentence(item, terms) > 0).filter((item) => !seen.has(item.toLowerCase()) && seen.add(item.toLowerCase())).slice(0, limit);
}

function scoreSentence(sentence, terms) {
  const lower = sentence.toLowerCase();
  return terms.reduce((total, term) => total + (lower.includes(term.toLowerCase()) ? 1 : 0), 0);
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(normalizeWhitespace(match[1])).slice(0, 120) : "";
}

function extractMetaDescription(html) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i) || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);
  return match ? decodeHtml(normalizeWhitespace(match[1])).slice(0, 260) : "";
}

function htmlToText(html) {
  return decodeHtml(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function inferCompanyName(homepage, domain) {
  const title = homepage.title || "";
  const parts = title.split(/\s+[|-]\s+|:\s+/).map((part) => part.trim()).filter(Boolean);
  const cleaned = parts.find((part) => part.length >= 2 && part.length <= 42);
  if (cleaned) return cleaned;
  return (domain.split(".")[0] || domain).split(/[-_]/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

function normalizeInputUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) {
    const error = new Error("Please enter a company website URL.");
    error.status = 400;
    throw error;
  }
  const url = new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
  if (!["http:", "https:"].includes(url.protocol)) {
    const error = new Error("Only http and https URLs are supported.");
    error.status = 400;
    throw error;
  }
  url.hash = "";
  return url.toString();
}

function json(value, status = 200) {
  return new Response(JSON.stringify(value, null, 2), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

function text(value, status = 200) {
  return new Response(value, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

function service(name, area, tags, strength, talkTrackValue, docsUrl) {
  return { name, area, tags, strength, talkTrackValue, docs: docsUrl };
}

function signal(id, label, terms, description) {
  return { id, label, terms, description };
}

function persona(focus, talkTrack, discovery) {
  return { focus, talkTrack, discovery };
}

function decodeHtml(value) {
  const entities = { amp: "&", lt: "<", gt: ">", quot: "\"", apos: "'", nbsp: " " };
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity) => {
    if (entity[0] === "#") {
      const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isFinite(code) ? String.fromCharCode(code) : " ";
    }
    return entities[entity.toLowerCase()] || " ";
  });
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function normalizeWhitespace(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function firstSentence(value) {
  return (normalizeWhitespace(value).split(/(?<=[.!?])\s+/)[0] || "").slice(0, 260);
}

function countOccurrences(haystack, needle) {
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (haystack.match(new RegExp(`\\b${escaped}\\b`, "gi")) || []).length;
}

function hasAny(haystack, terms) {
  return terms.some((term) => haystack.includes(term));
}

function joinHuman(items) {
  const values = items.filter(Boolean);
  if (values.length <= 1) return values[0] || "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "analysis";
}

function randomId() {
  const bytes = new Uint8Array(5);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}
