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

---

## 6. SOLID Principles & Low-Level Design (LLD)

Velt is architected using SOLID object-oriented principles across both its Spring Boot enterprise layer and Next.js design studio:

### 1. Single Responsibility Principle (SRP)
Each subsystem and service maintains an explicit, decoupled concern:
* `LayoutService`: Solely responsible for prompt normalization, schema constraint specification, and target format layout generation.
* `XaiClient` / LLM Client: Solely responsible for remote model inference, structured JSON output requests, and HTTP transport error handling.
* `ProjectService`: Exclusively manages project workspace state, revision branches, and entity persistence.
* `JwtService` & `JwtAuthFilter`: Strictly responsible for cryptographic JWT validation and setting security contexts.
* `RateLimitInterceptor`: Exclusively manages API throttling based on client IP and workspace tier ceilings.
* Studio Canvas Engines: Individual canvas view components (Landing Page, Mobile Flow, Dashboard, Brand Kit) only render their respective layout ASTs.

### 2. Open/Closed Principle (OCP)
The architecture is open to extension while remaining closed to modification:
* **Pluggable Canvas Format Renderers**: The rendering engine supports 14 layout formats (and can expand to new formats like Email Newsletters or Slide Decks) by adding layout strategy renderers without modifying prompt parsers or workspace database schemas.
* **Extensible Token Compiler**: The design token pipeline compiles typography, spacing scales, and color schemes via modular token extractors, allowing additional token categories (e.g., elevation, animation timing) to be added without touching the conversational AST patcher.

### 3. Liskov Substitution Principle (LSP)
Renderers and client abstractions adhere to unified contracts:
* All format-specific canvas renderers implement the common canvas viewer contract (`CanvasRendererProps`), ensuring that the studio viewport can dynamically mount and hot-swap any layout format without breaking zoom, pan, export, or AST diffing features.
* LLM client interfaces allow swapping model providers (OpenAI GPT-4o, xAI Grok) while maintaining deterministic JSON Schema guarantees.

### 4. Interface Segregation Principle (ISP)
Clients only depend on granular, role-specific contracts:
* **Segregated DTO Layers**: Read-only endpoints consume lean query DTOs (`ProjectSummary`, `ProjectDetail`, `DesignResponse`), while write operations use strict input DTOs (`CreateProjectRequest`, `RefineRequest`).
* **Focused Repositories**: Spring Data interfaces (`ProjectRepository`, `DesignRepository`, `ChatTurnRepository`, `UserRepository`) define only their respective aggregate root operations, avoiding bloated data access layers.

### 5. Dependency Inversion Principle (DIP)
High-level workflows depend on abstractions rather than low-level concrete implementations:
* Controllers (`ProjectController`, `AuthController`) depend on service interfaces and Spring Data repositories, injected via Spring Boot's IoC container via constructor injection.
* The design generation pipeline relies on abstract inference client contracts, decoupling business prompt logic from external AI provider HTTP libraries.

