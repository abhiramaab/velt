# Velt

Prompt-to-prototype design studio. Describe a product, a room, a feeling — Velt composes a live layout you can refine through chat.

## Stack

- Frontend: Next.js 16, Tailwind CSS 4, Motion
- Backend: Spring Boot 3.5, Java 21, H2, JWT
- Optional AI: SpaceXAI (`XAI_API_KEY`) for Grok-composed copy and structure. Without a key, the layout engine still produces original drafts.

## Run locally

```bash
# backend — http://localhost:8080
cd backend
JAVA_HOME=/usr/lib/jvm/java-21-openjdk mvn spring-boot:run

# frontend — http://localhost:3000
cd frontend
npm run dev
```

Demo studio: `studio@velt.app` / `veltstudio`

A new composition costs 2 credits. A chat refine costs 1.
