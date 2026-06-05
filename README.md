````markdown
# The City Hacks the State — Team 6: 345 East 15th Street

**NYC Tech Week 2026 Hackathon**  
**Team Members:** Nghia Trang, Aaradhya  
**Building:** 345 East 15th Street  
**API:** CriticalAsset GraphQL (Live Staging Data)

---

## 🏗️ Our Submission — Two Connected Challenges

We built a **unified facilities management platform** that connects a **real-time operations dashboard** (Challenge 1) with an **AI-powered student signal workflow** (Challenge 2). Together, they close the loop between what the building *records* and what occupants *actually see*.

```
┌─────────────────────────────────────────────────────────────────┐
│                  Challenge 1: Dashboard                          │
│    Pull work orders → Counter cards → Filterable table          │
│    → Detail panel → Asset joins → Student signal intake         │
└──────────────────────────────────┬──────────────────────────────┘
                                   │ Student submits a signal
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│               Challenge 2: AI Workflow Tool                      │
│   Observation → AI Structuring → Public Data → Workflow         │
│   → Record to CriticalAsset → Closure Verification             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Challenge 1: CriticalAsset Work Order Dashboard

**📁 Folder:** [`/challenge1`](./challenge1)

A real-time operations dashboard that pulls live work orders from the CriticalAsset API and turns raw data into actionable views.

### Features
- ✅ Counter row: Open / In Progress / Overdue / Total  
- ✅ Work order table with title, status, priority, asset, location, due date  
- ✅ Filter by status and priority + full-text search  
- ✅ Detail panel on row click with full work order + linked asset  
- ✅ Work orders joined to assets (category, status)  
- ✅ Top 5 buildings by open work orders  
- ✅ Student signal submission form (feeds into Challenge 2)

### Tech Stack
- **Backend:** Node.js + Express (OAuth2 → CriticalAsset GraphQL)
- **Frontend:** Vanilla HTML/CSS/JS (dark theme, responsive)
- **Auth:** M2M client credentials with auto-refresh

### How to Run
```bash
cd challenge1
npm install
cp .env.example .env   # Add credentials
npm start              # → http://localhost:3000
```

### Scoring (100 pts)
| Criterion | Points |
|-----------|--------|
| Clarity of signal → action | 30 |
| Working data pull from CriticalAsset | 25 |
| Dashboard usability | 20 |
| Bonus: joins, map, student signal | 15 |
| Demo and storytelling | 10 |

---

## Challenge 2: AI Workflow Tool — Student Signal

**📁 File:** [`/index.html`](./index.html)

Student Signal transforms raw field observations ("the exit sign is dark") into structured, compliance-aware operational intelligence — closing the gap between what occupants see and what maintenance teams need.

### The Full Pipeline

```
Select Work Order → Field Observation → AI Structuring → Public Data → Workflow → Record → Verify
```

| Stage | What Happens |
|-------|-------------|
| **1. Work Order Selection** | 3 live work orders from CriticalAsset API with identified information gaps |
| **2. Field Observation** | Dead-simple intake — one sentence, one location, one tap for severity |
| **3. AI Structuring** | Transforms messy input into 11 structured fields + confidence labels |
| **4. Public Data Enrichment** | NYC DOB, FDNY, 311, building code — with explained implications |
| **5. Workflow** | Step-by-step actions, escalation triggers, compliance flags |
| **6. Record to CriticalAsset** | Push structured intelligence back into the building record |
| **7. Closure Verification** | Student confirms fix (Fixed / Partial / Still Broken / Worse) |

### Key Innovation: Confidence Labels
Every AI-structured field is tagged: **Verified** / **Likely** / **Inferred** / **Missing** / **Needs Inspection** — so technicians know what's fact vs. what needs confirmation.

### How to Run
```bash
# Just open in any browser — no server needed:
open index.html

# Or serve:
python3 -m http.server 8000
```

### Scoring (100 pts)
| Criterion | Points |
|-----------|--------|
| Product clarity (user → problem → action) | 20 |
| Quick starter (connect, pull building, pull ticket, dashboard) | 15 |
| CriticalAsset integration (make the record better) | 15 |
| Student signal + AI structuring | 15 |
| Public evidence (permits, inspections, complaints) | 10 |
| Confidence model (facts vs. guesses) | 10 |
| Usability | 10 |
| Demo (3 minutes) | 5 |

---

## 🔗 How They Connect

1. **Dashboard → Signal:** The Challenge 1 dashboard has a "Student Signal" submission form on each work order's detail panel. When a student observes something, they can attach it directly.

2. **Signal → AI → Record:** Challenge 2 takes that raw observation through AI structuring, public data enrichment, and workflow generation — then **records it back to CriticalAsset**.

3. **Unified Data:** Both tools pull from the same CriticalAsset GraphQL API (345 E 15th St building), so work orders, assets, and locations are consistent across both experiences.

4. **Closure Loop:** After a fix is made, Challenge 2's verification step ensures the student confirms the issue is truly resolved — preventing false closures.

---

## 📁 Repository Structure

```
├── index.html              # Challenge 2: Student Signal AI Workflow (standalone)
├── README.md               # This file
└── challenge1/             # Challenge 1: Work Order Dashboard
    ├── server.js           # Express backend (OAuth2, GraphQL proxy)
    ├── public/
    │   └── index.html      # Dashboard frontend
    ├── package.json        # Dependencies
    ├── .env.example        # Credential template
    └── README.md           # Challenge 1 specific docs
```

---

## 🔑 CriticalAsset API Details

- **Endpoint:** `https://345e15.stg.criticalasset.com/api` (staging)
- **Auth:** OAuth2 Client Credentials (M2M)
- **Building:** 345 East 15th Street (ID: `6bbaf32c-707e-5bae-a59e-447e8aff1efc`)
- **Assets:** 100 registered across HVAC, Electrical, Plumbing, Fire & Life Safety

---

*Built for The City Hacks the State Hackathon — NYC Tech Week 2026*
````
