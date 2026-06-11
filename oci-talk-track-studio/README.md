# OCI Talk Track Studio

Oracle-branded SaaS hackathon demo for enterprise sales reps. A rep enters a public company website URL, the app performs live website analysis, extracts business and technology signals, maps them to relevant Oracle Cloud Infrastructure areas, and generates a cited, editable sales talk track.

## Why This Matches The Rubric

- **Who has the problem:** Enterprise cloud sales reps and account teams who need credible account-specific talk tracks before customer meetings.
- **What they do today:** Manually read public websites, search product material, reuse generic decks, and guess which cloud messages fit the account.
- **Why it is painful:** The workflow is slow, inconsistent, hard to govern, and can produce unsupported claims.
- **How the app improves the workflow:** One URL produces a company brief, evidence-backed business signals, OCI service fit, confidence levels, persona talk tracks, objections, discovery questions, follow-up email, export, and audit history.
- **Why it scales beyond one team:** Any account-based sales organization selling complex cloud services needs faster account research and governed messaging.
- **Differentiation:** The app combines real website analysis, Oracle Cloud positioning, official Oracle documentation links, editable sales output, and enterprise governance controls.

## Features Built

- Live website URL analysis through the backend
- Company profile, industry detection, business model detection
- Business signal extraction with website evidence snippets
- OCI recommendations across AI, database, security, app modernization, APIs, serverless, storage, observability, FinOps, identity, encryption, and hybrid networking
- Confidence scoring and official Oracle documentation citations
- Persona-specific messaging for CIO, CTO, CFO, CISO, and VP Sales
- Discovery questions, objection handling, executive summary, follow-up email
- Editable talk track and review status
- Saved account history and search
- Markdown export and print-to-PDF flow
- Simulated roles for Sales Rep, Sales Manager, and Admin
- Admin dashboard, usage metrics, integrations, controls, and audit trail
- Enterprise settings and API-readiness view

## Run Locally

```bash
cd oci-talk-track-studio
npm start
```

If `node` or `npm` is not on your PATH in Codex, use the bundled runtime:

```bash
/Users/llbennet/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node server.js
```

Open:

```text
http://127.0.0.1:4173
```

If port `4173` is already in use:

```bash
PORT=4180 npm start
```

## Judge Demo Walkthrough

1. Open the app and stay on the `Analyze` view.
2. Enter a public company website, for example `https://www.dropbox.com`, `https://www.shopify.com`, or another accessible corporate site.
3. Click `Analyze`.
4. Review the account brief, detected signals, OCI recommendations, evidence snippets, and documentation links.
5. Open the talk track tabs: `Overview`, `Personas`, `Objections`, and `Email`.
6. Edit the opener or email, set review status to `Reviewed`, and save.
7. Use `Export Markdown` or `Print PDF`.
8. Open `Accounts` to verify saved history.
9. Open `Admin` to verify usage metrics, integrations, controls, and audit trail.
10. Open `Governance` to verify facts, assumptions, citations, and review controls.

## Implementation Notes

- The app uses only built-in Node.js modules and static frontend assets.
- `POST /api/analyze` fetches the public website server-side to avoid browser CORS limitations.
- The analysis engine is deterministic: it crawls the homepage plus priority internal links, extracts text, detects signals, scores OCI services, and generates structured talk tracks.
- Saved analyses and audit events are stored locally in `data/analyses.json` and `data/audit.json`, created automatically at runtime.
- Some websites block automated requests or require JavaScript rendering. In that case, the app returns a clear error instead of fabricating results.

## API Verification

```bash
curl http://127.0.0.1:4173/api/health
curl -X POST http://127.0.0.1:4173/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.dropbox.com","userId":"u-001"}'
curl http://127.0.0.1:4173/api/analyses
curl http://127.0.0.1:4173/api/admin/metrics
curl http://127.0.0.1:4173/api/audit
```

## OCI Source Grounding

The app links recommendations to official Oracle documentation, including OCI Generative AI, Autonomous AI Database, Cloud Guard, IAM with Identity Domains, API Gateway, Functions, Kubernetes Engine, Object Storage, Vault, FastConnect, and Cost Management.
