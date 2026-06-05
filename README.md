# Student Signal — Challenge 02

**The City Hacks the State Hackathon**  
**Team:** Nghia Trang  
**Building:** 345 East 15th Street  
**API:** CriticalAsset GraphQL (Live Data)

---

## 🎯 What It Does

Student Signal transforms raw field observations ("the exit sign is dark") into structured, compliance-aware operational intelligence — closing the gap between what occupants see and what maintenance teams need.

## 🔄 The Full Pipeline

```
Student Observation → AI Structuring → Public Data Enrichment → Workflow → Closure Verification
```

| Stage | What Happens |
|-------|-------------|
| **1. Work Order Selection** | Shows 3 live work orders from CriticalAsset API with identified information gaps |
| **2. Field Observation** | Dead-simple intake — one sentence, one location, one tap for severity |
| **3. AI Structuring** | Transforms messy human input into 11 structured operational fields |
| **4. Public Data Enrichment** | NYC DOB, FDNY, 311 complaints, building code compliance — with explained operational implications |
| **5. Workflow Recommendation** | Step-by-step actions, escalation triggers, compliance flags |
| **6. Closure Verification** | Student confirms fix (Fixed / Partial / Still Broken / Worse) — prevents false closures |

## 🏗️ Architecture

- **Frontend:** Single-page HTML/CSS/JS (no dependencies, no build step)
- **Data Source:** CriticalAsset GraphQL API (live work orders, assets, locations)
- **Enrichment:** NYC Open Data (DOB BIS, FDNY inspections, 311 complaints)
- **AI Engine:** Simulated NLP structuring (production version uses LLM)

## 📊 Live Data From CriticalAsset API

All 3 work orders are real, pulled from the staging environment:

1. **Annual Steam System Inspection** (High / HVAC)
2. **Electrical Distribution Panel PM** (Medium / Electrical)  
3. **Emergency Exit Sign & Lighting Test** (Critical / Fire & Life Safety)

Building has **100 registered assets** across mechanical, electrical, plumbing, and fire safety systems.

## 🏆 Scoring Criteria Addressed

| Criterion | How We Address It |
|-----------|-------------------|
| AI adding value to field data | Raw observation → 11 structured fields + enhanced description |
| Connection to real work orders | All 3 work orders from live CriticalAsset API |
| Enrichment from public records | NYC DOB, FDNY, 311, building code citations |
| Workflow recommendation | Prioritized steps + escalation logic + compliance flags |
| Closure verification | 4-option student feedback loop with system responses |
| Student-facing UX | One sentence input, severity pills, photo upload |

## 🚀 How to Run

Just open `index.html` in any browser. No server needed.

```bash
# Or serve locally:
python3 -m http.server 8000
# Then visit http://localhost:8000
```

## 📁 File Structure

```
├── index.html          # Complete application (self-contained)
└── README.md           # This file
```

## 🔑 Key Design Decisions

1. **Field truth > form fill** — Students describe what they see in plain language; AI handles categorization
2. **Compliance-first enrichment** — Every public data point explains *why it matters operationally*
3. **Escalation logic** — Automatic severity upgrades based on scope, duration, and compliance risk
4. **Student closure loop** — Work orders can't be closed without occupant confirmation
5. **Single file deployment** — No build step, no dependencies, instant demo

---

*Built for The City Hacks the State Hackathon — Challenge 02: AI Workflow Tool*
