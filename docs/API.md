# Velt API & Schema Reference

Specifications for Velt's REST endpoints and design document contracts.

## Base URL
* Local Backend: `http://localhost:8080`
* Studio Frontend: `http://localhost:3000`

---

## 1. Design Document JSON Contract

Every synthesized digital asset conforms to this structure:

```json
{
  "format": "website",
  "name": "Distributed Analytics Platform",
  "tagline": "Real-time stream telemetry and edge routing",
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
    "headline": "Sub-millisecond Observability",
    "subline": "Zero-overhead distributed tracing and payment stream analytics.",
    "cta": "Start Deployment",
    "secondaryCta": "View Technical Specs"
  },
  "sections": [
    {
      "id": "features",
      "title": "Built for Concurrency",
      "items": [
        {
          "title": "Idempotent Routing",
          "description": "Consistent ring hashing with virtual worker replicas."
        },
        {
          "title": "Double-Entry Integrity",
          "description": "Deterministic debit/credit accounting down to the paisa."
        }
      ]
    }
  ]
}
```

---

## 2. Backend REST Endpoints

### User Authentication & Workspaces
* `POST /api/v1/auth/register` - Create user profile and workspace credentials
* `POST /api/v1/auth/login` - Authenticate credentials and return signed JWT bearer token
* `GET /api/v1/workspaces/me` - Fetch active workspace state, saved designs, and quota status

### Design Persistence
* `POST /api/v1/designs` - Persist validated design document JSON to PostgreSQL
* `GET /api/v1/designs` - List all workspace design documents with pagination
* `GET /api/v1/designs/{id}` - Fetch single design specification by unique ID
* `PUT /api/v1/designs/{id}` - Update existing design AST and revision history
