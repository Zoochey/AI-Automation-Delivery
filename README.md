# AI Automation Delivery

Organizational **AI & Automation Delivery Framework** (v1.0 draft) plus a small **local web viewer** to browse the standards, operating model, and diagrams.

---

## About

The framework defines baseline standards for identifying, assessing, designing, delivering, and governing AI and automation: data handling, use-case intake, integration, solution design, and risk controls. The canonical source is the markdown document in this repository.

**Primary document:** [`AI_Delivery_Framework.md`](./AI_Delivery_Framework.md)

---

## Repository contents

| Item | Description |
|------|-------------|
| `AI_Delivery_Framework.md` | Full framework: executive summary, operating model, six core standards, definitions, document control, and appendix diagrams |
| `web/` | React + Vite app that presents the framework as navigable pages (including Mermaid flows) |

---

## Framework outline (for navigation)

1. Executive summary — objectives and principles  
2. Operating model — end-to-end flow and delivery lanes  
3. Core standards index  
4. **AI Data Standard** — classification, AI usage boundaries, pipeline pattern  
5. **AI Use Case Standard** — intake fields, types, scoring  
6. **Automation & Integration Standard** — APIs, naming, logging, version control  
7. **AI Solution Design Standard** — patterns, prompts, human-in-the-loop, fallbacks  
8. **AI Governance & Risk Standard** — risk levels, restricted areas, auditability  
9. **Definitions & Document Control** — glossary and version history  
10. Appendix — visual delivery flow (Mermaid)

---

## Run the web viewer locally

Requirements: [Node.js](https://nodejs.org/) (LTS recommended).

```bash
cd web
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

Build for static hosting:

```bash
cd web
npm run build
npm run preview   # optional: test production build
```

---

## Project structure

```
├── AI_Delivery_Framework.md   # Canonical framework text
├── README.md                  # This file
└── web/                       # Vite + React viewer
    ├── src/
    │   ├── pages/             # One page per major framework section
    │   └── components/
    └── package.json
```

---

## Status

Content in `AI_Delivery_Framework.md` is marked **Draft** in-document; version and change history are maintained in **Section 9 — Definitions & Document Control** of that file.

---

## License

Add a `LICENSE` file when you publish (for example MIT, or your org’s standard license).
