const state = {
  currentUserId: "u-001",
  currentAnalysis: null,
  currentTalkTab: "overview",
  accounts: []
};

const views = document.querySelectorAll(".view");
const navItems = document.querySelectorAll(".nav-item");
const analyzeForm = document.getElementById("analyzeForm");
const urlInput = document.getElementById("companyUrl");
const loadingState = document.getElementById("loadingState");
const errorState = document.getElementById("errorState");
const results = document.getElementById("analysisResults");
const toast = document.getElementById("toast");

document.addEventListener("DOMContentLoaded", () => {
  bindNavigation();
  bindAnalyze();
  bindResults();
  bindSearch();
  refreshAccounts();
  refreshAdmin();
});

function bindNavigation() {
  navItems.forEach((button) => {
    button.addEventListener("click", () => showView(button.dataset.view));
  });
  document.getElementById("roleSelect").addEventListener("change", (event) => {
    state.currentUserId = event.target.value;
    showToast("Demo user switched. New edits will be audited under this user.");
  });
}

function bindAnalyze() {
  analyzeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await analyzeUrl(urlInput.value);
  });
  document.querySelectorAll(".quick-links button").forEach((button) => {
    button.addEventListener("click", () => {
      urlInput.value = button.dataset.url;
      analyzeUrl(button.dataset.url);
    });
  });
}

function bindResults() {
  document.querySelectorAll("[data-talk-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.currentTalkTab = button.dataset.talkTab;
      document.querySelectorAll("[data-talk-tab]").forEach((candidate) => candidate.classList.remove("is-selected"));
      button.classList.add("is-selected");
      renderTalkTrack();
    });
  });

  document.getElementById("copyTalkTrackBtn").addEventListener("click", async () => {
    if (!state.currentAnalysis) return;
    await navigator.clipboard.writeText(buildPlainTalkTrack(state.currentAnalysis));
    showToast("Talk track copied to clipboard.");
  });

  document.getElementById("exportMarkdownBtn").addEventListener("click", () => {
    if (!state.currentAnalysis) return;
    window.location.href = `/api/export/${state.currentAnalysis.id}.md`;
  });

  document.getElementById("printBtn").addEventListener("click", () => window.print());

  document.getElementById("saveReviewBtn").addEventListener("click", async () => {
    if (!state.currentAnalysis) return;
    const updatedOpener = document.getElementById("editableOpener")?.value;
    const updatedEmail = document.getElementById("editableEmail")?.value;
    const payload = {
      userId: state.currentUserId,
      status: document.getElementById("reviewStatus").value,
      talkTrack: {}
    };
    if (updatedOpener) payload.talkTrack.opener = updatedOpener;
    if (updatedEmail) payload.talkTrack.followUpEmail = updatedEmail;
    const response = await fetch(`/api/analyses/${state.currentAnalysis.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) {
      showToast("Unable to save review.");
      return;
    }
    state.currentAnalysis = await response.json();
    renderAnalysis(state.currentAnalysis);
    refreshAccounts();
    refreshAdmin();
    showToast("Review saved and audit history updated.");
  });
}

function bindSearch() {
  document.getElementById("accountSearch").addEventListener("input", debounce((event) => {
    refreshAccounts(event.target.value);
  }, 250));
}

function showView(viewId) {
  views.forEach((view) => view.classList.toggle("is-visible", view.id === viewId));
  navItems.forEach((item) => item.classList.toggle("is-active", item.dataset.view === viewId));
  if (viewId === "accounts") refreshAccounts();
  if (viewId === "admin") refreshAdmin();
}

async function analyzeUrl(url) {
  setLoading(true);
  setError("");
  results.hidden = true;
  try {
    const response = await fetchJson("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, userId: state.currentUserId })
    });
    const payload = response.payload;
    if (!response.ok) {
      const message = payload.detail || payload.error || "Analysis failed.";
      throw new Error(response.status === 422 ? `${message} Try another public marketing site.` : message);
    }
    state.currentAnalysis = payload;
    renderAnalysis(payload);
    refreshAccounts();
    refreshAdmin();
    showToast(`Analysis completed for ${payload.company.name}.`);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
}

async function fetchJson(url, options) {
  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error("The application API is not reachable. Start the local server, or verify the deployed Cloudflare Worker is routing /api/* requests.");
  }

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    payload = { error: "The application API returned a non-JSON response." };
  }

  return { ok: response.ok, status: response.status, payload };
}

function renderAnalysis(analysis) {
  results.hidden = false;
  document.getElementById("companyName").textContent = analysis.company.name;
  document.getElementById("companySummary").textContent = analysis.company.profileSummary;
  document.getElementById("industryMetric").textContent = `${analysis.company.industry} (${analysis.company.industryConfidence})`;
  document.getElementById("signalsMetric").textContent = analysis.signals.length;
  document.getElementById("topServiceMetric").textContent = analysis.recommendations[0]?.name || "-";
  document.getElementById("reviewMetric").textContent = analysis.status;
  document.getElementById("reviewStatus").value = analysis.status;

  renderSignals(analysis);
  renderRecommendations(analysis);
  renderTalkTrack();
  renderGovernance(analysis);
}

function renderSignals(analysis) {
  const list = document.getElementById("signalsList");
  list.innerHTML = analysis.signals.map((signal) => `
    <article class="signal-card">
      <div class="card-top">
        <div>
          <h3>${escapeHtml(signal.label)}</h3>
          <p class="muted">${escapeHtml(signal.description)}</p>
        </div>
        <span class="status-pill ${signal.strength === "High" ? "approved" : "review"}">${signal.strength}</span>
      </div>
      ${renderEvidence(signal.evidence)}
    </article>
  `).join("") || `<p class="muted">No strong website signals were detected. Use discovery questions to validate account priorities.</p>`;
}

function renderRecommendations(analysis) {
  const list = document.getElementById("recommendationsList");
  list.innerHTML = analysis.recommendations.map((rec) => `
    <article class="rec-card">
      <div class="card-top">
        <div>
          <h3>${escapeHtml(rec.name)}</h3>
          <p class="muted">${escapeHtml(rec.area)}</p>
        </div>
        <div class="confidence">${rec.confidence}%<br><small>${rec.level}</small></div>
      </div>
      <p>${escapeHtml(rec.whyFit)}</p>
      <p class="muted"><strong>OCI strength:</strong> ${escapeHtml(rec.ociStrength)}</p>
      ${renderEvidence(rec.evidence)}
      <p><a href="${rec.docs}" target="_blank" rel="noreferrer">Official Oracle documentation</a></p>
    </article>
  `).join("");
}

function renderTalkTrack() {
  const analysis = state.currentAnalysis;
  if (!analysis) return;
  const container = document.getElementById("talkTrackContent");
  const talk = analysis.talkTrack;

  if (state.currentTalkTab === "personas") {
    container.innerHTML = `
      <div class="persona-grid">
        ${Object.entries(talk.personas).map(([persona, data]) => `
          <article class="persona-card">
            <h3>${escapeHtml(persona)}</h3>
            <p class="muted">${escapeHtml(data.focus)}</p>
            <p>${escapeHtml(data.talkTrack)}</p>
            <p><strong>Discovery:</strong> ${escapeHtml(data.discovery)}</p>
          </article>
        `).join("")}
      </div>
    `;
    return;
  }

  if (state.currentTalkTab === "objections") {
    container.innerHTML = `
      <div class="stack no-pad">
        ${talk.objectionHandling.map((item) => `
          <article class="persona-card">
            <h3>${escapeHtml(item.objection)}</h3>
            <p>${escapeHtml(item.response)}</p>
          </article>
        `).join("")}
      </div>
    `;
    return;
  }

  if (state.currentTalkTab === "email") {
    container.innerHTML = `
      <label class="field-label" for="editableEmail">Follow-up email draft</label>
      <textarea id="editableEmail">${escapeHtml(talk.followUpEmail)}</textarea>
    `;
    return;
  }

  container.innerHTML = `
    <div class="stack no-pad">
      <div>
        <h3>Executive summary</h3>
        <p>${escapeHtml(talk.executiveSummary)}</p>
      </div>
      <div>
        <label class="field-label" for="editableOpener">Opening talk track</label>
        <textarea id="editableOpener">${escapeHtml(talk.opener)}</textarea>
      </div>
      <div>
        <h3>Value pillars</h3>
        ${talk.valuePillars.map((pillar) => `
          <article class="persona-card">
            <strong>${escapeHtml(pillar.title)} - ${escapeHtml(pillar.service)}</strong>
            <p>${escapeHtml(pillar.message)}</p>
            <p class="muted">${escapeHtml(pillar.proofPoint)}</p>
          </article>
        `).join("")}
      </div>
      <div>
        <h3>Discovery questions</h3>
        <ul>${talk.discoveryQuestions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </div>
    </div>
  `;
}

function renderGovernance(analysis) {
  const container = document.getElementById("governanceContent");
  container.innerHTML = `
    <article class="signal-card">
      <h3>${escapeHtml(analysis.governance.reviewState)}</h3>
      <p>${escapeHtml(analysis.governance.factPolicy)}</p>
      <p class="muted">Prompt/version: ${escapeHtml(analysis.governance.promptVersion)}</p>
    </article>
    <article class="signal-card">
      <h3>Sources</h3>
      <ul>
        ${analysis.governance.sourceCitations.slice(0, 14).map((source) => `
          <li><a href="${source.url}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a> <span class="muted">${escapeHtml(source.type)}</span></li>
        `).join("")}
      </ul>
    </article>
    <article class="signal-card">
      <h3>Facts</h3>
      ${renderEvidence(analysis.talkTrack.facts)}
    </article>
    <article class="signal-card">
      <h3>Assumptions</h3>
      <ul>${analysis.talkTrack.assumptions.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </article>
  `;
}

async function refreshAccounts(q = "") {
  const response = await fetch(`/api/analyses${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  state.accounts = response.ok ? await response.json() : [];
  const list = document.getElementById("accountsList");
  list.innerHTML = state.accounts.map((analysis) => `
    <article class="account-card">
      <div>
        <h3>${escapeHtml(analysis.company.name)}</h3>
        <p class="muted">${escapeHtml(analysis.company.industry)} - ${escapeHtml(analysis.company.domain)}</p>
        <p>${analysis.signals.map((signal) => escapeHtml(signal.label)).join(", ")}</p>
        <span class="status-pill ${analysis.status.includes("Approved") || analysis.status === "Reviewed" ? "approved" : "review"}">${escapeHtml(analysis.status)}</span>
      </div>
      <button class="secondary-btn" data-open-analysis="${analysis.id}">Open</button>
    </article>
  `).join("") || `<p class="muted">No saved analyses yet. Run a website analysis to create the first account brief.</p>`;

  list.querySelectorAll("[data-open-analysis]").forEach((button) => {
    button.addEventListener("click", async () => {
      const response = await fetch(`/api/analyses/${button.dataset.openAnalysis}`);
      if (!response.ok) return;
      state.currentAnalysis = await response.json();
      renderAnalysis(state.currentAnalysis);
      showView("analyze");
    });
  });
}

async function refreshAdmin() {
  const [metricsResponse, auditResponse] = await Promise.all([
    fetch("/api/admin/metrics"),
    fetch("/api/audit")
  ]);
  const metrics = metricsResponse.ok ? await metricsResponse.json() : null;
  const audit = auditResponse.ok ? await auditResponse.json() : [];
  if (!metrics) return;

  document.getElementById("adminTotal").textContent = metrics.totals.analyses;
  document.getElementById("adminReviewRate").textContent = `${metrics.totals.reviewRate}%`;
  document.getElementById("adminAvgRecs").textContent = metrics.totals.averageRecommendations;
  document.getElementById("adminAuditEvents").textContent = metrics.totals.auditEvents;

  document.getElementById("topServices").innerHTML = metrics.topServices.map((item) => `
    <article class="signal-card">
      <div class="card-top">
        <strong>${escapeHtml(item.name)}</strong>
        <span class="confidence">${item.count}</span>
      </div>
    </article>
  `).join("") || `<p class="muted">No recommendation usage yet.</p>`;

  document.getElementById("integrationsList").innerHTML = [
    ...metrics.governanceControls.map((item) => ({ name: item, status: "Enabled", scope: "Governance" })),
    ...metrics.integrations
  ].map((item) => `
    <div>
      <strong>${escapeHtml(item.name)}</strong>
      <span>${escapeHtml(item.status)} - ${escapeHtml(item.scope)}</span>
    </div>
  `).join("");

  document.getElementById("auditList").innerHTML = audit.map((event) => `
    <article class="audit-card">
      <div class="card-top">
        <strong>${escapeHtml(event.action)}</strong>
        <span class="muted">${new Date(event.timestamp).toLocaleString()}</span>
      </div>
      <p class="muted">${escapeHtml(event.actor.name)} (${escapeHtml(event.actor.role)}) - ${escapeHtml(JSON.stringify(event.details))}</p>
    </article>
  `).join("") || `<p class="muted">No audit events yet.</p>`;
}

function renderEvidence(items) {
  if (!items || !items.length) return "";
  return `<ul class="evidence">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function buildPlainTalkTrack(analysis) {
  return [
    `OCI Talk Track: ${analysis.company.name}`,
    "",
    analysis.talkTrack.executiveSummary,
    "",
    "Opener:",
    analysis.talkTrack.opener,
    "",
    "Top OCI recommendations:",
    ...analysis.recommendations.slice(0, 5).map((rec) => `- ${rec.name}: ${rec.whyFit}`),
    "",
    "Discovery questions:",
    ...analysis.talkTrack.discoveryQuestions.map((item) => `- ${item}`)
  ].join("\n");
}

function setLoading(isLoading) {
  loadingState.hidden = !isLoading;
  analyzeForm.querySelector("button[type='submit']").disabled = isLoading;
}

function setError(message) {
  errorState.hidden = !message;
  errorState.textContent = message;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
