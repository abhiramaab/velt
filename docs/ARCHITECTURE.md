# Velt System Architecture & Technical Specification

Velt is an AI-native design generation platform and interactive studio. It synthesizes structured, high-fidelity digital design documents, responsive web prototypes, marketing collateral, and brand design systems directly from natural language prompts.

---

## 1. Dual-Tier Architecture Overview

```text
 Client Studio Application (Next.js 15 App Router & React 19)
                           │
                           ▼
          ┌───────────────────────────────────┐
          │     Prompt Normalizer & Format    │
          │     Target Spec (14 Layouts)      │
          └───────────────────────────────────┘
                           │
                           ▼
          ┌───────────────────────────────────┐
          │         OpenAI GPT-4o API         │ ──► Structured Output (json_schema)
          └───────────────────────────────────┘
                           │
                           ▼ Strict Design Document JSON
 ┌────────────────────────────────────────────────────────┐
 │                   STUDIO CANVAS ENGINE                 │
 │                                                        │
 │  1. Schema Validator (Zod Schema Guarantee)            │
 │  2. Token Extractor (Hex Palettes, Typography, Scales) │
 │  3. Multi-Format Dynamic Canvas Renderers              │
 │     - Website & Landing Page Canvas                    │
 │     - Dashboard & Telemetry Analytics View             │
 │     - Mobile Onboarding Flow Pipeline                  │
 │     - Brand Identity & Poster Grid                     │
 │  4. Conversational Refinement Engine (AST Diffs)       │
 └────────────────────────────────────────────────────────┘
                           │
                           ▼ Workspace State & Relational Sync
 ┌────────────────────────────────────────────────────────┐
 │           SPRING BOOT 3.5 & POSTGRESQL LAYER           │
 │                                                        │
 │  - JWT Stateless Session Authentication                │
 │  - Spring Data JPA Relational Persistence (Supabase)   │
 │  - Multi-tenant Workspace Isolation                    │
 └────────────────────────────────────────────────────────┘
```

---

## 2. Structured JSON Schema Synthesis

### Deterministic Generation
Unstructured LLM generation (Markdown or free-form HTML) causes frontend parser breakage, missing required CSS properties, and unclosed tags. Velt passes a strict JSON schema directly to OpenAI GPT-4o's Structured Outputs engine (`response_format: { type: "json_schema" }`):

* Guarantees all returned payloads conform exactly to expected component models without runtime serialization exceptions.
* Validates every generated document client-side using Zod before passing it to canvas renderers.

---

## 3. Conversational Direction Engine

* **AST Mutation**: When a user provides feedback (e.g., "darken the palette", "add a three-tier pricing grid", "make typography editorial"), Velt's prompt engine passes the existing document AST alongside the critique.
* **Non-Destructive Patching**: Updates targeted JSON nodes while preserving stable brand tokens, copywriting, and visual hierarchy.

---

## 4. Design System Token Compiler

* **Color Extraction**: Computes primary, secondary, background, muted, and accent colors with automatic contrast verification.
* **Typography Hierarchy**: Maps heading and body typography pairings to Google Font configurations (Instrument Sans, Fraunces Serif).
* **Export Pipeline**: Generates ready-to-use Tailwind CSS configuration tokens and modular React TSX component code.

---

## 5. Enterprise Backend & Security

* **Java 21 & Spring Boot 3.5**: Handles account provisioning, workspace quotas, and project state persistence.
* **Stateless JWT**: Verifies cryptographically signed tokens across all studio API mutations.
* **PostgreSQL Storage**: Maintains historical revisions and design variants in normalized relational tables.
