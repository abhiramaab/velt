<p align="center">
  <a href="https://github.com/abhiramaab/velt">
    <img src="./assets/velt-logo.svg" alt="Velt Logo" width="100" />
  </a>
</p>

<h1 align="center">Velt</h1>

<p align="center">
  AI-Native Design Generation Platform & Structured Document Engine<br/>
  Synthesizes production-ready digital design documents, responsive prototypes, design systems, and marketing collateral directly from natural language prompts.
</p>

<p align="center">
  <a href="https://github.com/abhiramaab/velt">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15_(App_Router)-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 15" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java 21" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot 3.5" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o_JSON_Schema-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
</p>

---

<details>
<summary><strong>Table of Contents</strong></summary>

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [System Design & Core Modules](#system-design--core-modules)
  - [1. Inference Engine: Strict JSON Schema Enforcement](#1-inference-engine-strict-json-schema-enforcement)
  - [2. Multi-Format Design Canvas Engine](#2-multi-format-design-canvas-engine)
  - [3. Conversational Direction & Real-Time Refinement](#3-conversational-direction--real-time-refinement)
  - [4. Automated Design Token Extraction](#4-automated-design-token-extraction)
  - [5. Dual-Tier Service Layer: Auth & Workspace State](#5-dual-tier-service-layer-auth--workspace-state)
- [Design Document Schema Specification](#design-document-schema-specification)
- [Technology Stack](#technology-stack)
- [Quickstart Guide](#quickstart-guide)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Running the Frontend Studio](#running-the-frontend-studio)
  - [Running the Enterprise Backend](#running-the-enterprise-backend)
- [Repository Structure](#repository-structure)

</details>

---

## Overview

Velt is an interactive design synthesis platform built to eliminate the manual gap between natural language concept ideation and structured UI/UX assets. Rather than producing static images, Velt generates fully serializable, structured digital design trees that render into live, interactive web components, mobile screens, data dashboards, editorial monographs, and brand identity systems.

Key capabilities include:

* **Strict JSON Synthesis**: Uses OpenAI GPT-4o with structured schema enforcement to ensure zero parsing failures or hallucinated keys.
* **14 Distinct Canvas Layouts**: From SaaS landing pages and multi-step onboarding flows to print posters and social display collateral.
* **Conversational Direction Engine**: Translates iterative natural language critique into targeted AST/JSON node updates without corrupting existing design tokens.
* **Design System Token Compiler**: Automatically computes WCAG-compliant color palettes, font pairings, spacing scales, and brand identity kits.
* **Enterprise Spring Boot Layer**: Secure workspace persistence, account provisioning, and JWT authentication backed by PostgreSQL.

---

## System Architecture

```text
 User Natural Language Prompt
              │
              ▼
 ┌──────────────────────────┐
 │   Prompt Normalizer &    │ ──► Extracts Target Format, Industry Tone & Constraints
 │   Schema Constraint Spec │
 └──────────────────────────┘
              │
              ▼
 ┌──────────────────────────┐
 │    OpenAI GPT-4o API     │ ──► Structured Output Mode (response_format: json_schema)
 └──────────────────────────┘
              │
              ▼ Strict Design Document JSON
 ┌────────────────────────────────────────────────────────┐
 │                   VELT CLIENT STUDIO                   │
 │                                                        │
 │  1. Schema Validator (Zod Schema Guarantee)            │
 │  2. Token Extractor (Hex Palettes, Typography, Scales) │
 │  3. Multi-Format Dynamic Canvas Engine                 │
 │     ├── Website & Landing Page Renderer                │
 │     ├── Dashboard & Analytics Layout Engine            │
 │     └── Mobile Flow & Poster Grid Pipeline             │
 │  4. Conversational Refinement Loop (Live Node Patches) │
 └────────────────────────────────────────────────────────┘
              │
              ▼ Workspace Persistence
 ┌────────────────────────────────────────────────────────┐
 │           SPRING BOOT 3.5 & POSTGRESQL LAYER           │
 │                                                        │
 │  ► JWT Authentication & Workspace Session State        │
 │  ► Supabase Relational Persistence (Designs, History)  │
 │  ► Production Account Provisioning                     │
 └────────────────────────────────────────────────────────┘
```

---

## System Design & Core Modules

### 1. Inference Engine: Strict JSON Schema Enforcement
* **Deterministic Synthesis**: Prompts are passed to OpenAI GPT-4o with strict schema parameters, ensuring the model returns valid, typed AST nodes rather than unstructured Markdown.
* **Zero Parsing Failures**: Guarantees that every generated document adheres to required properties (format, theme, hero, layout sections, features, and typography scales).

### 2. Multi-Format Design Canvas Engine
* **Universal Document Renderer**: A unified rendering pipeline that accepts the validated JSON tree and projects it into one of 14 target design layouts.
* **Component Abstractions**: Automatically maps JSON elements into responsive Tailwind CSS containers, typography hierarchies (Instrument Sans, Fraunces Serif), and Motion animations.

### 3. Conversational Direction & Real-Time Refinement
* **Context-Preserving Feedback**: Allows designers to critique existing screens (e.g., "make the hero more aggressive", "switch to a dark high-contrast palette") without losing existing content structure.
* **Surgical Node Replacement**: Computes localized tree diffs and applies non-destructive state mutations.

### 4. Automated Design Token Extraction
* **Brand Token Compilation**: Parses generated documents to generate exportable design tokens, including primary, secondary, background, muted, and accent hex codes.
* **Design Export**: Produces copy-pasteable CSS variables and React component trees ready for production workflows.

### 5. Dual-Tier Service Layer: Auth & Workspace State
* **Next.js 15 Client Layer**: Serverless execution optimized for high interactivity, instant preview rendering, and edge delivery.
* **Spring Boot 3.5 Enterprise Layer**: Java 21 backend providing stateless JWT authorization, relational persistence via Spring Data JPA, and user workspace isolation.

---

## Design Document Schema Specification

Designs are represented as strict, serializable JSON documents following this schema:

```json
{
  "format": "website",
  "name": "Acme Analytics",
  "tagline": "Next-generation distributed stream processing",
  "theme": {
    "bg": "#0B0F17",
    "fg": "#F8FAFC",
    "muted": "#94A3B8",
    "line": "#1E293B",
    "accent": "#6366F1",
    "accentFg": "#FFFFFF"
  },
  "typography": {
    "heading": "Fraunces, serif",
    "body": "Instrument Sans, sans-serif"
  },
  "hero": {
    "headline": "Real-time telemetry for modern infrastructure",
    "subline": "Zero-overhead distributed tracing and payment stream observability.",
    "cta": "Start Free Trial",
    "secondaryCta": "Read the Documentation"
  },
  "sections": [
    {
      "id": "features",
      "title": "Built for scale",
      "items": [
        {
          "title": "Sub-millisecond Routing",
          "description": "Deterministic ring routing across globally distributed clusters."
        }
      ]
    }
  ]
}
```

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| Frontend Studio | Next.js 15 (App Router), React 19, TypeScript |
| Styling & Motion | Tailwind CSS 4, Motion, Instrument Sans, Fraunces Serif |
| AI Inference Engine | OpenAI GPT-4o (Strict JSON Schema Mode) |
| Enterprise Backend | Java 21, Spring Boot 3.5, Spring Security, Maven |
| Database & Persistence | Supabase PostgreSQL, Spring Data JPA |
| Security | Stateless JWT Authentication, CORS enforcement |
| Cloud Infrastructure | Vercel Edge Network, AWS EC2 |

---

## Quickstart Guide

### Prerequisites
* **Node.js 20+** and **npm**
* **Java Development Kit (JDK) 21**
* **Apache Maven 3.9+**
* **OpenAI API Key**

### Environment Setup
Create a `.env.local` file inside the `frontend/` directory:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Running the Frontend Studio

```bash
cd frontend
npm install
npm run dev
```

The studio will be available at `http://localhost:3000`.

### Running the Enterprise Backend

```bash
cd backend
mvn clean spring-boot:run
```

The service will listen on `http://localhost:8080`.

---

## Repository Structure

```text
velt/
├── assets/                  # Brand vectors and visual documentation
│   └── velt-logo.svg
├── backend/                 # Enterprise Spring Boot 3.5 service
│   ├── pom.xml
│   └── src/main/java/       # Controllers, security, entities, services
├── frontend/                # Next.js 15 studio interface
│   ├── app/                 # App Router pages and API routes
│   ├── components/          # Multi-format canvas engines & UI elements
│   ├── lib/                 # Schema definitions, prompt templates, Supabase client
│   └── package.json
└── marketing/               # Video and display collateral pipelines
```


