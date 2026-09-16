# Velt

Velt is an AI-native design generation platform and interactive studio. It synthesizes structured, high-fidelity digital design documents, responsive web prototypes, marketing collateral, and brand design systems directly from natural language prompts, supporting iterative directional refinement through conversational feedback.

---

## Architecture Overview

The system operates across a dual-tier architecture:

1. **Frontend Studio Application (Next.js 15 App Router & React 19)**:
   - Serverless design inference pipeline executing through OpenAI GPT-4o.
   - Dynamic document renderer engine supporting multi-format layouts (Websites, Mobile Applications, Dashboards, Brand Identity Kits, Posters, Social Creatives, and Display Ads).
   - Real-time conversational refinement engine translating design critiques into structured modifications.
   - Cloud persistence layer integrated with Supabase PostgreSQL.

2. **Enterprise Backend Services (Java 21 & Spring Boot 3.5)**:
   - Dedicated RESTful API services running on Linux infrastructure.
   - Production account provisioning, JWT authentication, and user workspace states.
   - Persistence abstractions using Spring Data JPA and relational storage.

---

## Core Capabilities

- **Multi-Format Canvas Engine**: Transforms single prompts into tailored specifications across 14 formats, including web applications, conversion landing pages, mobile flows, data dashboards, editorial monographs, and print posters.
- **Conversational Art Direction**: Modifies layouts, color palettes, visual hierarchies, and copy tone in real-time through iterative prompt feedback.
- **Design System Extraction**: Automatic extraction and compilation of brand tokens, type scales, and hex palettes.
- **Production Code & Asset Export**: Direct inspection of structured React component trees and design document specifications.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| Frontend Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling & Typography | Tailwind CSS 4, Motion, Fraunces Serif, Instrument Sans |
| AI Inference Engine | OpenAI GPT-4o API (Structured JSON Schema Enforcement) |
| Persistence & Auth | Supabase PostgreSQL, JWT |
| Backend Services | Spring Boot 3.5, Java 21, Maven |
| Production Hosting | Vercel (Edge & Serverless), AWS EC2 (Dedicated Linux Host) |

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm
- Java Development Kit (JDK) 21
- Apache Maven 3.9+
- OpenAI API Key

### Environment Configuration

Create a `.env.local` file inside the `frontend/` directory:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Running the Frontend

```bash
cd frontend
npm install
npm run dev
```

The studio will be accessible at `http://localhost:3000`.

### Running the Backend Service

```bash
cd backend
mvn clean spring-boot:run
```

The service will listen on `http://localhost:8080`.

---

## Design Document Specification

Designs are represented as strict, serializable JSON documents following the schema below:

```json
{
  "format": "website",
  "name": "Project Name",
  "tagline": "Concise summary",
  "theme": {
    "bg": "#F9F8F6",
    "fg": "#121212",
    "muted": "#6B6761",
    "line": "#E2DDD6",
    "accent": "#B83B26",
    "accentFg": "#FFFFFF",
    "surface": "#FFFFFF",
    "fontDisplay": "serif",
    "radius": "4px",
    "mood": "swiss",
    "heroVisual": "architecture"
  },
  "nav": {
    "logo": "Brand Name",
    "links": ["Overview", "Work", "Archive", "Contact"],
    "cta": "Inquire"
  },
  "sections": [
    {
      "kind": "hero",
      "layout": "editorial-cover",
      "kicker": "Kicker Note",
      "headline": "Primary Display Headline",
      "sub": "Supporting description body.",
      "cta": "Explore",
      "visual": "architecture"
    }
  ]
}
```

---

## Deployment

The application is configured for production deployments:

- **Frontend**: Automated continuous deployment via Vercel, bound to `main`.
- **Backend**: Managed systemd service on AWS Linux EC2 instance.
- **Custom Domains**: Configured with DNS routing pointing to production edge endpoints.

---

## License

Copyright 2026 Velt Technologies. All rights reserved.
