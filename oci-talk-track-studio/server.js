const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { URL } = require("url");

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, "public");
const DATA_DIR = path.join(ROOT, "data");
const ANALYSES_FILE = path.join(DATA_DIR, "analyses.json");
const AUDIT_FILE = path.join(DATA_DIR, "audit.json");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

const DEMO_USERS = [
  { id: "u-001", name: "Maya Chen", role: "Sales Rep", workspace: "Oracle North America" },
  { id: "u-002", name: "Jordan Ellis", role: "Sales Manager", workspace: "Oracle North America" },
  { id: "u-003", name: "Priya Raman", role: "Admin", workspace: "Oracle North America" }
];

const OFFICIAL_ORACLE_SOURCES = {
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

const OCI_SERVICES = [
  {
    name: "OCI Generative AI",
    area: "AI and automation",
    tags: ["ai", "automation", "content", "assistant", "language", "customer experience", "personalization"],
    strength: "Build, deploy, and govern enterprise AI applications with managed models, agents, guardrails, observability, and auditability.",
    talkTrackValue: "position governed AI experiences without forcing the customer to assemble every model, guardrail, and runtime concern themselves",
    docs: OFFICIAL_ORACLE_SOURCES.generativeAi
  },
  {
    name: "Autonomous AI Database",
    area: "Data platform",
    tags: ["database", "data", "analytics", "transaction", "sql", "erp", "crm", "ai vector", "reporting"],
    strength: "A self-governing database service that handles provisioning, backup, patching, upgrades, and elastic scaling.",
    talkTrackValue: "modernize core data workloads while reducing operational database administration effort",
    docs: OFFICIAL_ORACLE_SOURCES.autonomousDatabase
  },
  {
    name: "AI Vector Search on Oracle Database",
    area: "Data and AI",
    tags: ["ai", "search", "recommendation", "knowledge", "database", "personalization", "semantic"],
    strength: "Bring LLMs to enterprise data using built-in vector search without copying proprietary data into a separate specialty vector database.",
    talkTrackValue: "ground AI answers in trusted enterprise data while keeping the data estate simpler",
    docs: OFFICIAL_ORACLE_SOURCES.autonomousDatabase
  },
  {
    name: "Oracle Analytics Cloud",
    area: "Analytics",
    tags: ["analytics", "reporting", "dashboard", "forecast", "insight", "business intelligence", "kpi"],
    strength: "Enterprise analytics for dashboards, self-service exploration, and governed insight delivery across business teams.",
    talkTrackValue: "move leaders from periodic reporting to governed, shared decision intelligence",
    docs: "https://docs.oracle.com/en/cloud/paas/analytics-cloud/"
  },
  {
    name: "OCI Kubernetes Engine",
    area: "Application modernization",
    tags: ["kubernetes", "container", "microservice", "scale", "devops", "platform", "cloud native"],
    strength: "Define and create Kubernetes clusters for deployment, scaling, and management of containerized applications.",
    talkTrackValue: "standardize container operations while giving engineering teams a managed Kubernetes foundation",
    docs: OFFICIAL_ORACLE_SOURCES.oke
  },
  {
    name: "OCI Functions",
    area: "Serverless",
    tags: ["serverless", "event", "automation", "api", "integration", "workflow", "backend"],
    strength: "Run and scale business logic without managing infrastructure.",
    talkTrackValue: "automate event-driven workflows and integrations without adding infrastructure overhead",
    docs: OFFICIAL_ORACLE_SOURCES.functions
  },
  {
    name: "OCI API Gateway",
    area: "Integration and APIs",
    tags: ["api", "integration", "partner", "mobile", "developer", "rate limiting", "authentication"],
    strength: "Create governed HTTP/S interfaces with policy enforcement such as authentication and rate limiting.",
    talkTrackValue: "turn integration surfaces into governed, observable, secured APIs",
    docs: OFFICIAL_ORACLE_SOURCES.apiGateway
  },
  {
    name: "OCI Cloud Guard",
    area: "Security posture",
    tags: ["security", "risk", "compliance", "posture", "misconfiguration", "monitoring", "threat"],
    strength: "Monitor, identify, achieve, and maintain a strong security posture across OCI resources and users.",
    talkTrackValue: "make security posture management continuous instead of reactive",
    docs: OFFICIAL_ORACLE_SOURCES.cloudGuard
  },
  {
    name: "OCI IAM with Identity Domains",
    area: "Identity and access",
    tags: ["identity", "access", "sso", "authentication", "lifecycle", "governance", "user"],
    strength: "Provide authentication, SSO, identity lifecycle management, and access governance for Oracle and non-Oracle applications.",
    talkTrackValue: "centralize access control as the customer's cloud and SaaS footprint grows",
    docs: OFFICIAL_ORACLE_SOURCES.iam
  },
  {
    name: "OCI Vault",
    area: "Encryption and secrets",
    tags: ["encryption", "key", "secret", "compliance", "privacy", "regulated", "secure"],
    strength: "Store and manage encryption keys used to securely access resources.",
    talkTrackValue: "give security teams stronger control of keys and secrets for regulated workloads",
    docs: OFFICIAL_ORACLE_SOURCES.vault
  },
  {
    name: "OCI Object Storage",
    area: "Storage and data lake",
    tags: ["storage", "data lake", "backup", "archive", "media", "document", "durable", "scale"],
    strength: "A programmable, scalable, durable storage service for storing and accessing large amounts of data.",
    talkTrackValue: "create a durable landing zone for documents, telemetry, media, backups, and analytics data",
    docs: OFFICIAL_ORACLE_SOURCES.objectStorage
  },
  {
    name: "OCI Observability and Management",
    area: "Operations",
    tags: ["monitoring", "logging", "observability", "uptime", "incident", "sla", "reliability"],
    strength: "Centralize logs, metrics, alarms, and operational insight for cloud resources and applications.",
    talkTrackValue: "help operations teams detect, explain, and resolve issues faster across the cloud estate",
    docs: "https://docs.oracle.com/en-us/iaas/Content/observability/home.htm"
  },
  {
    name: "OCI Cost Management and FinOps Hub",
    area: "FinOps",
    tags: ["cost", "budget", "spend", "forecast", "efficiency", "optimization", "finance"],
    strength: "Estimate costs, set budgets, view cost reports, visualize spending, and optimize consumption.",
    talkTrackValue: "give finance and platform leaders stronger visibility and controls over cloud spend",
    docs: OFFICIAL_ORACLE_SOURCES.costManagement
  },
  {
    name: "OCI FastConnect",
    area: "Hybrid cloud networking",
    tags: ["hybrid", "network", "data center", "private", "latency", "connectivity", "on premises"],
    strength: "Create a dedicated private connection between a data center and OCI.",
    talkTrackValue: "support hybrid migration paths where private connectivity, latency, or data movement predictability matters",
    docs: OFFICIAL_ORACLE_SOURCES.fastConnect
  }
];

const INDUSTRIES = [
  { name: "Healthcare and Life Sciences", terms: ["patient", "clinical", "health", "healthcare", "hospital", "pharma", "medical", "care"] },
  { name: "Financial Services", terms: ["bank", "financial", "insurance", "payment", "wealth", "loan", "credit", "risk", "trading"] },
  { name: "Retail and Consumer Goods", terms: ["retail", "shop", "store", "commerce", "consumer", "brand", "loyalty", "customer"] },
  { name: "Manufacturing", terms: ["manufacturing", "factory", "supply chain", "industrial", "equipment", "production", "quality"] },
  { name: "Technology and SaaS", terms: ["software", "platform", "developer", "api", "saas", "cloud", "data", "application"] },
  { name: "Public Sector", terms: ["government", "public sector", "agency", "citizen", "municipal", "state", "federal"] },
  { name: "Education", terms: ["student", "education", "university", "college", "school", "learning", "campus"] },
  { name: "Media and Communications", terms: ["media", "streaming", "content", "telecom", "network", "subscriber", "broadcast"] },
  { name: "Energy and Utilities", terms: ["energy", "utility", "grid", "oil", "gas", "renewable", "power"] },
  { name: "Logistics and Transportation", terms: ["logistics", "shipping", "fleet", "transportation", "delivery", "warehouse", "supply"] }
];

const SIGNALS = [
  {
    id: "ai",
    label: "AI and automation opportunity",
    terms: ["ai", "artificial intelligence", "machine learning", "automation", "predictive", "recommendation", "personalization", "agent"],
    description: "The company appears to have use cases where AI, automation, or intelligent assistants could improve productivity or digital experiences."
  },
  {
    id: "data",
    label: "Data platform and analytics need",
    terms: ["data", "analytics", "insight", "dashboard", "reporting", "intelligence", "database", "real-time", "forecast"],
    description: "The website suggests reliance on data, reporting, decision intelligence, or analytical products."
  },
  {
    id: "security",
    label: "Security and compliance pressure",
    terms: ["security", "secure", "privacy", "compliance", "risk", "regulated", "trust", "encryption", "governance"],
    description: "Trust, compliance, privacy, or risk language indicates security posture may matter to buyers."
  },
  {
    id: "modernization",
    label: "Application modernization",
    terms: ["cloud", "platform", "api", "mobile", "digital", "developer", "kubernetes", "container", "microservice", "modern"],
    description: "Digital platform language suggests modernization, managed runtime, or integration opportunities."
  },
  {
    id: "scale",
    label: "Scale and reliability",
    terms: ["global", "scale", "millions", "availability", "uptime", "mission critical", "performance", "low latency", "resilient"],
    description: "Scale, performance, or uptime language points to resilient cloud architecture needs."
  },
  {
    id: "cost",
    label: "Cost and efficiency",
    terms: ["cost", "efficient", "efficiency", "productivity", "optimize", "margin", "automation", "streamline", "reduce"],
    description: "Efficiency language gives reps a CFO and operations angle around cloud cost controls and automation."
  },
  {
    id: "hybrid",
    label: "Hybrid or multicloud path",
    terms: ["hybrid", "on-premises", "data center", "azure", "aws", "google cloud", "private cloud", "migration"],
    description: "Hybrid or multicloud language suggests a gradual migration and connectivity conversation."
  },
  {
    id: "customer",
    label: "Customer experience transformation",
    terms: ["customer", "member", "patient", "consumer", "experience", "support", "engagement", "loyalty", "journey"],
    description: "Customer-facing language can anchor a revenue, retention, or service experience talk track."
  }
];

ensureDataFiles();

const server = http.createServer(async (req, res) => {
  try {
    const parsed = new URL(req.url, `http://${req.headers.host}`);
    if (parsed.pathname.startsWith("/api/")) {
      await handleApi(req, res, parsed);
      return;
    }
    serveStatic(req, res, parsed);
  } catch (error) {
    console.error(error);
    const status = error.status || 500;
    const label = status >= 500 ? "Unexpected server error" : "Website analysis failed";
    sendJson(res, status, { error: label, detail: error.message });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`OCI Talk Track Studio running at http://${HOST}:${PORT}`);
});

async function handleApi(req, res, parsed) {
  if (req.method === "GET" && parsed.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, users: DEMO_USERS });
    return;
  }

  if (req.method === "POST" && parsed.pathname === "/api/analyze") {
    const body = await readJson(req);
    const normalizedUrl = normalizeInputUrl(body.url || "");
    const user = DEMO_USERS.find((candidate) => candidate.id === body.userId) || DEMO_USERS[0];
    const startedAt = Date.now();
    const crawl = await crawlWebsite(normalizedUrl);
    const analysis = buildAnalysis(crawl, normalizedUrl, user);
    analysis.durationMs = Date.now() - startedAt;
    saveAnalysis(analysis);
    writeAudit("analysis.created", user, {
      analysisId: analysis.id,
      company: analysis.company.name,
      url: normalizedUrl,
      pagesAnalyzed: analysis.company.pagesAnalyzed.length
    });
    sendJson(res, 200, analysis);
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/analyses") {
    const q = (parsed.searchParams.get("q") || "").trim().toLowerCase();
    let analyses = readJsonFile(ANALYSES_FILE, []);
    if (q) {
      analyses = analyses.filter((item) => {
        const haystack = [item.company.name, item.company.domain, item.company.industry, item.status]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });
    }
    sendJson(res, 200, analyses.map(toSummary));
    return;
  }

  if (req.method === "GET" && parsed.pathname.startsWith("/api/analyses/")) {
    const id = parsed.pathname.split("/").pop();
    const analysis = readJsonFile(ANALYSES_FILE, []).find((item) => item.id === id);
    if (!analysis) {
      sendJson(res, 404, { error: "Analysis not found" });
      return;
    }
    sendJson(res, 200, analysis);
    return;
  }

  if (req.method === "PATCH" && parsed.pathname.startsWith("/api/analyses/")) {
    const id = parsed.pathname.split("/").pop();
    const body = await readJson(req);
    const analyses = readJsonFile(ANALYSES_FILE, []);
    const index = analyses.findIndex((item) => item.id === id);
    if (index === -1) {
      sendJson(res, 404, { error: "Analysis not found" });
      return;
    }
    const user = DEMO_USERS.find((candidate) => candidate.id === body.userId) || DEMO_USERS[0];
    analyses[index] = {
      ...analyses[index],
      status: body.status || analyses[index].status,
      talkTrack: body.talkTrack ? { ...analyses[index].talkTrack, ...body.talkTrack } : analyses[index].talkTrack,
      notes: typeof body.notes === "string" ? body.notes : analyses[index].notes,
      updatedAt: new Date().toISOString()
    };
    writeJsonFile(ANALYSES_FILE, analyses);
    writeAudit("analysis.updated", user, { analysisId: id, status: analyses[index].status });
    sendJson(res, 200, analyses[index]);
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/admin/metrics") {
    const analyses = readJsonFile(ANALYSES_FILE, []);
    const audit = readJsonFile(AUDIT_FILE, []);
    sendJson(res, 200, buildAdminMetrics(analyses, audit));
    return;
  }

  if (req.method === "GET" && parsed.pathname === "/api/audit") {
    sendJson(res, 200, readJsonFile(AUDIT_FILE, []).slice(-80).reverse());
    return;
  }

  if (req.method === "GET" && parsed.pathname.startsWith("/api/export/")) {
    const id = parsed.pathname.replace("/api/export/", "").replace(/\.md$/, "");
    const analysis = readJsonFile(ANALYSES_FILE, []).find((item) => item.id === id);
    if (!analysis) {
      sendText(res, 404, "Analysis not found");
      return;
    }
    const markdown = toMarkdown(analysis);
    res.writeHead(200, {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slugify(analysis.company.name)}-oci-talk-track.md"`
    });
    res.end(markdown);
    return;
  }

  sendJson(res, 404, { error: "API route not found" });
}

function serveStatic(req, res, parsed) {
  const requested = parsed.pathname === "/" ? "/index.html" : parsed.pathname;
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendText(res, 403, "Forbidden");
    return;
  }
  fs.readFile(filePath, (error, data) => {
    if (error) {
      fs.readFile(path.join(PUBLIC_DIR, "index.html"), (indexError, indexData) => {
        if (indexError) {
          sendText(res, 404, "Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": MIME_TYPES[".html"] });
        res.end(indexData);
      });
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

async function crawlWebsite(startUrl) {
  const homepage = await fetchPage(startUrl);
  const homepageUrl = homepage.finalUrl || startUrl;
  const base = new URL(homepageUrl);
  const candidateLinks = pickInternalLinks(homepage.html, base).slice(0, 4);
  const pages = [homepage];

  for (const link of candidateLinks) {
    try {
      const page = await fetchPage(link);
      pages.push(page);
    } catch (error) {
      pages.push({
        url: link,
        finalUrl: link,
        title: "Unavailable page",
        description: "",
        text: "",
        html: "",
        error: error.message
      });
    }
  }

  const successfulPages = pages.filter((page) => page.text && page.text.length > 80);
  if (successfulPages.length === 0) {
    throw new Error("The website could not be analyzed. It may block automated requests or require JavaScript rendering.");
  }

  return {
    requestedUrl: startUrl,
    finalUrl: homepageUrl,
    domain: base.hostname.replace(/^www\./, ""),
    pages,
    text: successfulPages.map((page) => page.text).join("\n\n").slice(0, 60000)
  };
}

async function fetchPage(targetUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(targetUrl, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; OCI-Talk-Track-Studio/1.0; +https://oracle.com)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5"
      }
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
    const title = extractTitle(html);
    const description = extractMetaDescription(html);
    return {
      url: targetUrl,
      finalUrl: response.url || targetUrl,
      title,
      description,
      html,
      text: htmlToText(html)
    };
  } finally {
    clearTimeout(timer);
  }
}

function pickInternalLinks(html, base) {
  const links = [];
  const priorities = [
    "about",
    "solution",
    "product",
    "platform",
    "service",
    "customer",
    "industry",
    "security",
    "technology",
    "data",
    "blog"
  ];
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
      if (priority === -1) continue;
      links.push({ url: url.toString(), priority });
    } catch {
      // Ignore invalid links.
    }
  }
  const seen = new Set();
  return links
    .sort((a, b) => a.priority - b.priority || a.url.length - b.url.length)
    .map((item) => item.url)
    .filter((url) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });
}

function buildAnalysis(crawl, normalizedUrl, user) {
  const now = new Date().toISOString();
  const text = normalizeWhitespace(crawl.text);
  const lower = text.toLowerCase();
  const companyName = inferCompanyName(crawl.pages[0], crawl.domain);
  const industry = detectIndustry(lower);
  const businessModel = detectBusinessModel(lower, industry.name);
  const signals = detectSignals(text);
  const recommendations = scoreServices(signals, lower, industry.name);
  const evidenceBank = collectEvidence(text, [
    ...signals.flatMap((signal) => signal.matchedTerms),
    ...recommendations.flatMap((rec) => rec.tags)
  ]);
  const rankedRecommendations = recommendations.slice(0, 7).map((rec) => ({
    ...rec,
    evidence: pickEvidence(evidenceBank, rec.tags, 3)
  }));

  const analysis = {
    id: `ana-${crypto.randomBytes(5).toString("hex")}`,
    createdAt: now,
    updatedAt: now,
    status: "Needs review",
    owner: user,
    workspace: user.workspace,
    source: {
      requestedUrl: normalizedUrl,
      finalUrl: crawl.finalUrl,
      analysisMethod: "Live website crawl plus deterministic OCI fit scoring",
      pages: crawl.pages.map((page) => ({
        url: page.finalUrl || page.url,
        title: page.title,
        status: page.error ? "Skipped" : "Analyzed",
        error: page.error || null
      }))
    },
    company: {
      name: companyName,
      domain: crawl.domain,
      website: crawl.finalUrl,
      industry: industry.name,
      industryConfidence: industry.confidence,
      businessModel,
      description: crawl.pages[0].description || firstSentence(text),
      profileSummary: buildProfileSummary(companyName, industry.name, businessModel, signals),
      pagesAnalyzed: crawl.pages.filter((page) => !page.error).map((page) => page.finalUrl || page.url)
    },
    signals,
    recommendations: rankedRecommendations,
    talkTrack: buildTalkTrack(companyName, industry.name, businessModel, signals, rankedRecommendations),
    governance: buildGovernance(crawl, signals, rankedRecommendations),
    notes: "",
    demoReadiness: {
      beforeWorkflow: "Sales rep manually researches the website, searches product docs, edits a generic deck, and risks unsupported claims.",
      afterWorkflow: "Sales rep enters a URL, reviews cited evidence, selects OCI positioning, edits the talk track, and exports meeting-ready content.",
      verificationSteps: [
        "Enter a public company URL.",
        "Confirm pages analyzed and website evidence.",
        "Review OCI recommendations and confidence levels.",
        "Edit the talk track and save review status.",
        "Open Admin to inspect usage and audit history."
      ]
    }
  };

  return analysis;
}

function detectIndustry(lower) {
  const scored = INDUSTRIES.map((industry) => {
    const matches = industry.terms.reduce((total, term) => total + countOccurrences(lower, term), 0);
    return { name: industry.name, matches };
  }).sort((a, b) => b.matches - a.matches);
  const top = scored[0];
  const confidence = top.matches >= 8 ? "High" : top.matches >= 3 ? "Medium" : "Low";
  return top.matches > 0 ? { name: top.name, confidence } : { name: "General Enterprise", confidence: "Low" };
}

function detectBusinessModel(lower, industry) {
  if (hasAny(lower, ["subscription", "saas", "platform", "software", "developer"])) return "Digital platform or subscription services";
  if (hasAny(lower, ["shop", "store", "retail", "commerce", "consumer"])) return "Consumer commerce and customer engagement";
  if (hasAny(lower, ["manufacturer", "factory", "industrial", "supply chain"])) return "Production, operations, and supply chain";
  if (hasAny(lower, ["bank", "insurance", "wealth", "payment"])) return "Regulated financial products and services";
  if (hasAny(lower, ["patient", "clinical", "healthcare", "care"])) return "Regulated care delivery and health operations";
  if (industry !== "General Enterprise") return `${industry} operations and digital services`;
  return "Enterprise services and digital operations";
}

function detectSignals(text) {
  const lower = text.toLowerCase();
  return SIGNALS.map((signal) => {
    const matchedTerms = signal.terms.filter((term) => lower.includes(term));
    const count = signal.terms.reduce((total, term) => total + countOccurrences(lower, term), 0);
    const evidence = pickEvidence(collectEvidence(text, signal.terms), signal.terms, 3);
    const strength = count >= 12 ? "High" : count >= 4 ? "Medium" : count >= 1 ? "Low" : "Watch";
    return {
      id: signal.id,
      label: signal.label,
      strength,
      score: count,
      description: signal.description,
      matchedTerms,
      evidence
    };
  })
    .filter((signal) => signal.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

function scoreServices(signals, lower, industry) {
  const activeTerms = new Set(signals.flatMap((signal) => signal.matchedTerms));
  const industryBoosts = {
    "Healthcare and Life Sciences": ["security", "privacy", "database", "analytics", "ai"],
    "Financial Services": ["security", "risk", "database", "compliance", "cost"],
    "Retail and Consumer Goods": ["customer experience", "personalization", "analytics", "ai", "scale"],
    "Manufacturing": ["supply chain", "analytics", "hybrid", "integration", "automation"],
    "Technology and SaaS": ["kubernetes", "api", "serverless", "observability", "security"],
    "Public Sector": ["security", "identity", "compliance", "hybrid", "cost"],
    "Education": ["data", "security", "analytics", "cost", "identity"],
    "Media and Communications": ["scale", "storage", "network", "customer experience", "analytics"],
    "Energy and Utilities": ["hybrid", "security", "data", "observability", "reliability"],
    "Logistics and Transportation": ["analytics", "integration", "automation", "scale", "cost"]
  };
  const boosts = industryBoosts[industry] || [];
  return OCI_SERVICES.map((service) => {
    let score = 0;
    const matched = [];
    for (const tag of service.tags) {
      const occurrences = countOccurrences(lower, tag);
      if (occurrences > 0) {
        score += Math.min(occurrences, 8) * 2;
        matched.push(tag);
      }
      if (activeTerms.has(tag)) score += 4;
      if (boosts.includes(tag)) score += 5;
    }
    for (const signal of signals) {
      if (service.tags.some((tag) => signal.matchedTerms.includes(tag))) score += 5;
      if (signal.id === "security" && service.area.toLowerCase().includes("security")) score += 8;
      if (signal.id === "ai" && service.area.toLowerCase().includes("ai")) score += 8;
      if (signal.id === "modernization" && ["Application modernization", "Serverless", "Integration and APIs"].includes(service.area)) score += 7;
      if (signal.id === "hybrid" && service.area.toLowerCase().includes("hybrid")) score += 8;
      if (signal.id === "cost" && service.area === "FinOps") score += 8;
    }
    const confidenceScore = Math.max(18, Math.min(96, Math.round(score + 30)));
    return {
      name: service.name,
      area: service.area,
      confidence: confidenceScore,
      level: confidenceScore >= 78 ? "High" : confidenceScore >= 55 ? "Medium" : "Exploratory",
      whyFit: buildWhyFit(service, industry, signals),
      ociStrength: service.strength,
      talkTrackValue: service.talkTrackValue,
      docs: service.docs,
      tags: Array.from(new Set([...matched, ...service.tags.slice(0, 4)]))
    };
  })
    .sort((a, b) => b.confidence - a.confidence)
    .filter((service, index) => service.confidence >= 45 || index < 5);
}

function buildWhyFit(service, industry, signals) {
  const signalNames = signals.slice(0, 2).map((signal) => signal.label.toLowerCase());
  const signalPhrase = signalNames.length ? `The strongest website signals point to ${joinHuman(signalNames)}.` : "The website provides enough enterprise context for an exploratory positioning angle.";
  return `${signalPhrase} For a ${industry.toLowerCase()} account, ${service.name} can help the rep discuss how Oracle can ${service.talkTrackValue}.`;
}

function buildTalkTrack(companyName, industry, businessModel, signals, recommendations) {
  const topSignals = signals.slice(0, 3);
  const topServices = recommendations.slice(0, 4);
  const signalPhrase = topSignals.length ? joinHuman(topSignals.map((signal) => signal.label.toLowerCase())) : "digital operations, security, and data priorities";
  const servicePhrase = joinHuman(topServices.map((service) => service.name));
  const firstService = topServices[0] || recommendations[0];

  const opener = `Based on ${companyName}'s public website, the strongest conversation appears to be around ${signalPhrase}. I would position Oracle Cloud as a way to connect ${businessModel.toLowerCase()} priorities with a secure, data-driven cloud foundation, starting with ${servicePhrase}.`;

  return {
    executiveSummary: `${companyName} appears to operate in ${industry} with a business model centered on ${businessModel.toLowerCase()}. The recommended sales motion should lead with business outcomes, prove the recommendations with public website evidence, and avoid making claims beyond what the site supports.`,
    opener,
    valuePillars: topServices.map((service) => ({
      title: service.area,
      service: service.name,
      message: `Use ${service.name} to ${service.talkTrackValue}. Confidence: ${service.level} (${service.confidence}%).`,
      proofPoint: service.ociStrength
    })),
    personas: {
      CIO: {
        focus: "Platform strategy, modernization, governance, and business alignment",
        talkTrack: `For the CIO, anchor on how OCI can support ${companyName}'s digital agenda with governed cloud services, integration discipline, and a roadmap that reduces operational fragmentation.`,
        discovery: "Which systems or processes are slowing your ability to turn business priorities into reliable digital services?"
      },
      CTO: {
        focus: "Architecture, APIs, data, reliability, and engineering velocity",
        talkTrack: `For the CTO, focus on the technical path: ${servicePhrase} can support scalable architectures while preserving security and observability requirements.`,
        discovery: "Where are your teams seeing the most friction today: data access, deployment speed, integration, security reviews, or runtime scale?"
      },
      CFO: {
        focus: "Cost control, productivity, and measurable return",
        talkTrack: `For the CFO, connect the cloud discussion to productivity, spend governance, and a phased adoption model that makes value measurable before broad rollout.`,
        discovery: "How do you currently measure the cost and value of cloud, data, and automation investments across teams?"
      },
      CISO: {
        focus: "Security posture, access governance, encryption, and auditability",
        talkTrack: `For the CISO, lead with evidence-backed security and governance needs, then position Cloud Guard, IAM, and Vault where trust, privacy, or compliance language appears in the account profile.`,
        discovery: "Which cloud risks are most important for your team to reduce: misconfiguration, identity sprawl, data protection, audit readiness, or incident response?"
      },
      "VP Sales": {
        focus: "Customer insight, faster response, and better front-line execution",
        talkTrack: `For the VP Sales or revenue leader, emphasize faster insight, better customer segmentation, and AI-assisted workflows that help teams act on data with less manual effort.`,
        discovery: "Where would better account intelligence or automated follow-up create the most visible lift for your team?"
      }
    },
    discoveryQuestions: [
      `Which current initiative at ${companyName} is most dependent on better data, automation, or digital scale?`,
      "What parts of the current technology stack create the most manual work for teams?",
      "Where do security, privacy, or compliance reviews slow down delivery?",
      "Are there workloads that need a hybrid, multicloud, or phased migration path?",
      "What would a successful first 90-day cloud initiative need to prove?"
    ],
    objectionHandling: [
      {
        objection: "We already have a cloud provider.",
        response: "Acknowledge the existing investment and position OCI where it is complementary: Oracle data workloads, governed AI, hybrid connectivity, database modernization, or cost visibility."
      },
      {
        objection: "We are worried about AI accuracy.",
        response: "Lead with governance. The app's own workflow separates website facts, assumptions, and recommendations. OCI Generative AI provides enterprise controls such as guardrails, observability, and auditability."
      },
      {
        objection: "Migration sounds risky.",
        response: "Suggest a phased path. Start with a contained workload, a data or analytics pilot, API modernization, or private connectivity pattern before broad migration."
      }
    ],
    followUpEmail: `Subject: OCI ideas for ${companyName}\n\nHi [Name],\n\nI reviewed ${companyName}'s public website and noticed signals around ${signalPhrase}. Based on that, I thought it may be useful to compare a few Oracle Cloud options that could support your priorities: ${servicePhrase}.\n\nWould it be helpful to spend 30 minutes validating which of these areas maps to your current roadmap?\n\nBest,\n[Sales Rep]`,
    meetingPrep: [
      "Open with the website evidence, not a generic cloud pitch.",
      "Ask which signal is real and which is only inferred from public messaging.",
      "Use the top two OCI recommendations first; keep the rest as supporting options.",
      "Capture objections and update the reviewed talk track before exporting CRM notes."
    ],
    facts: topSignals.flatMap((signal) => signal.evidence).slice(0, 6),
    assumptions: [
      "Public website language is a directional signal, not confirmed internal priority.",
      "Technology fit should be validated with discovery before proposing architecture or pricing.",
      "Recommendations intentionally avoid claims that are not supported by website evidence or Oracle documentation."
    ]
  };
}

function buildGovernance(crawl, signals, recommendations) {
  return {
    reviewState: "Human review required before customer use",
    confidenceMethod: "Confidence combines website keyword evidence, industry fit, signal strength, and OCI service tag alignment.",
    promptVersion: "oci-talk-track-v1.0-deterministic",
    factPolicy: "Only website snippets and official Oracle documentation are treated as facts. Account priorities are labeled as assumptions until validated.",
    sourceCitations: [
      ...crawl.pages.filter((page) => !page.error).map((page) => ({
        label: page.title || page.finalUrl || page.url,
        url: page.finalUrl || page.url,
        type: "Company website"
      })),
      ...recommendations.map((rec) => ({
        label: `${rec.name} documentation`,
        url: rec.docs,
        type: "Official Oracle documentation"
      }))
    ],
    signalCoverage: signals.map((signal) => ({
      signal: signal.label,
      evidenceCount: signal.evidence.length,
      confidence: signal.strength
    }))
  };
}

function buildProfileSummary(companyName, industry, businessModel, signals) {
  const signalText = signals.length ? joinHuman(signals.slice(0, 3).map((signal) => signal.label.toLowerCase())) : "general enterprise cloud priorities";
  return `${companyName} appears to be a ${industry.toLowerCase()} organization focused on ${businessModel.toLowerCase()}. Public content indicates possible priorities around ${signalText}.`;
}

function collectEvidence(text, terms) {
  const sentences = text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length >= 50 && sentence.length <= 260);
  return sentences.filter((sentence) => {
    const lower = sentence.toLowerCase();
    return terms.some((term) => lower.includes(term.toLowerCase()));
  });
}

function pickEvidence(evidence, terms, limit) {
  const seen = new Set();
  return evidence
    .sort((a, b) => scoreSentence(b, terms) - scoreSentence(a, terms))
    .filter((sentence) => scoreSentence(sentence, terms) > 0)
    .filter((sentence) => {
      const key = sentence.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, limit);
}

function scoreSentence(sentence, terms) {
  const lower = sentence.toLowerCase();
  return terms.reduce((total, term) => total + (lower.includes(term.toLowerCase()) ? 1 : 0), 0);
}

function toSummary(analysis) {
  return {
    id: analysis.id,
    company: analysis.company,
    createdAt: analysis.createdAt,
    updatedAt: analysis.updatedAt,
    status: analysis.status,
    owner: analysis.owner,
    recommendations: analysis.recommendations.slice(0, 3),
    signals: analysis.signals.slice(0, 3),
    durationMs: analysis.durationMs
  };
}

function buildAdminMetrics(analyses, audit) {
  const reviewed = analyses.filter((item) => item.status === "Reviewed").length;
  const totalRecommendations = analyses.reduce((total, item) => total + item.recommendations.length, 0);
  const topServices = {};
  analyses.forEach((analysis) => {
    analysis.recommendations.slice(0, 3).forEach((rec) => {
      topServices[rec.name] = (topServices[rec.name] || 0) + 1;
    });
  });
  return {
    users: DEMO_USERS,
    totals: {
      analyses: analyses.length,
      reviewed,
      reviewRate: analyses.length ? Math.round((reviewed / analyses.length) * 100) : 0,
      averageRecommendations: analyses.length ? Math.round((totalRecommendations / analyses.length) * 10) / 10 : 0,
      auditEvents: audit.length
    },
    topServices: Object.entries(topServices)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6),
    recentAnalyses: analyses.slice(-6).reverse().map(toSummary),
    governanceControls: [
      "Human review required before customer use",
      "Facts, assumptions, and recommendations are separated",
      "Official Oracle docs are linked for OCI capabilities",
      "All create/update actions are recorded in audit history",
      "Exports include source and confidence context"
    ],
    integrations: [
      { name: "Salesforce", status: "Ready for API connector", scope: "CRM notes and account activity" },
      { name: "Oracle CX Sales", status: "Ready for API connector", scope: "Account plan and opportunity notes" },
      { name: "Slack or Teams", status: "Deferred", scope: "Share reviewed talk tracks" },
      { name: "Identity Provider", status: "Simulated", scope: "SSO and role mapping" }
    ]
  };
}

function toMarkdown(analysis) {
  const recs = analysis.recommendations
    .map((rec) => `- **${rec.name}** (${rec.level}, ${rec.confidence}%): ${rec.whyFit}\n  - OCI strength: ${rec.ociStrength}\n  - Docs: ${rec.docs}`)
    .join("\n");
  const signals = analysis.signals
    .map((signal) => `- **${signal.label}** (${signal.strength}): ${signal.description}`)
    .join("\n");
  const questions = analysis.talkTrack.discoveryQuestions.map((item) => `- ${item}`).join("\n");
  const objections = analysis.talkTrack.objectionHandling.map((item) => `- **${item.objection}** ${item.response}`).join("\n");
  return `# OCI Talk Track: ${analysis.company.name}

Generated: ${analysis.createdAt}
Website: ${analysis.company.website}
Industry: ${analysis.company.industry}
Business model: ${analysis.company.businessModel}
Status: ${analysis.status}

## Executive Summary
${analysis.talkTrack.executiveSummary}

## Website Signals
${signals}

## Recommended OCI Positioning
${recs}

## Opener
${analysis.talkTrack.opener}

## Discovery Questions
${questions}

## Objection Handling
${objections}

## Follow-up Email
${analysis.talkTrack.followUpEmail}

## Governance
- ${analysis.governance.reviewState}
- ${analysis.governance.factPolicy}
- Analysis method: ${analysis.source.analysisMethod}
`;
}

function saveAnalysis(analysis) {
  const analyses = readJsonFile(ANALYSES_FILE, []);
  analyses.push(analysis);
  writeJsonFile(ANALYSES_FILE, analyses.slice(-100));
}

function writeAudit(action, user, details) {
  const audit = readJsonFile(AUDIT_FILE, []);
  audit.push({
    id: `evt-${crypto.randomBytes(4).toString("hex")}`,
    timestamp: new Date().toISOString(),
    action,
    actor: user,
    details
  });
  writeJsonFile(AUDIT_FILE, audit.slice(-300));
}

function ensureDataFiles() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(ANALYSES_FILE)) writeJsonFile(ANALYSES_FILE, []);
  if (!fs.existsSync(AUDIT_FILE)) writeJsonFile(AUDIT_FILE, []);
}

function readJsonFile(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error("Invalid JSON body"));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res, status, value) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(value, null, 2));
}

function sendText(res, status, value) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(value);
}

function normalizeInputUrl(input) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("Please enter a company website URL.");
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  const url = new URL(withProtocol);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Only http and https URLs are supported.");
  url.hash = "";
  return url.toString();
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtml(normalizeWhitespace(match[1])).slice(0, 120) : "";
}

function extractMetaDescription(html) {
  const match = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["'][^>]*>/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["'][^>]*>/i);
  return match ? decodeHtml(normalizeWhitespace(match[1])).slice(0, 260) : "";
}

function htmlToText(html) {
  return decodeHtml(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ");
}

function decodeHtml(value) {
  const entities = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: "\"",
    apos: "'",
    nbsp: " "
  };
  return value
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (_, entity) => {
      if (entity[0] === "#") {
        const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCharCode(code) : " ";
      }
      return entities[entity.toLowerCase()] || " ";
    });
}

function normalizeWhitespace(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function inferCompanyName(homepage, domain) {
  const title = homepage.title || "";
  const parts = title
    .split(/\s+[|-]\s+|:\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
  const cleaned = parts.find((part) => part.length >= 2 && part.length <= 42)
    || title
      .replace(/\s*[|-]\s*(Home|Official Site|Homepage).*$/i, "")
      .replace(/\s*[|-]\s*.*$/, "")
      .trim();
  if (cleaned && cleaned.length >= 2 && cleaned.length <= 80) return cleaned;
  const domainName = domain.split(".")[0] || domain;
  return domainName
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function firstSentence(text) {
  const sentence = normalizeWhitespace(text).split(/(?<=[.!?])\s+/)[0] || "";
  return sentence.slice(0, 260);
}

function countOccurrences(haystack, needle) {
  if (!needle) return 0;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  return (haystack.match(regex) || []).length;
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
