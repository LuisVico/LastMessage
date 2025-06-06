
# Secure AI Gateway Specification

**Purpose**: sandbox & rate‑limit all generative‑AI calls to ensure:
1. No prompt‑injection leaks
2. Content safety (PG‑13 language)
3. Latency < 2000 ms (95th)

## Pipeline
1. **Auth check** (JWT from device)
2. **Input sanitizer** – strips system keywords, regex profanity filter.
3. **Intent tags** inserted (`{ "intent":"advise_escape" }`)
4. **OpenAI GPT‑4o** call (max 50 tokens) with system prompt lock.
5. **Output classifier** (Perspective API) → if flag, replace with safe fallback.

See `example_request.json`.
