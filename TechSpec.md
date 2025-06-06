
# LAST MESSAGE – Technical Specification (P0/P1 scope)

## Engine
* **Unity 2023.3 LTS** (URP) – chosen for cross‑platform & Addressables.
* Target devices: iPhone 8+ (iOS 16+), Android 10+ (4 GB RAM).

## Core Subsystems
| Subsystem | Description | Owner |
|-----------|-------------|-------|
| **Chat UI** | Vertical layout; bubble prefab; typing anim. | UI Dev |
| **Danger‑Time** | C# `DangerTimeSystem` – computes remaining time based on formula `T = B + len(msg)*k - panic*δ`. | Gameplay |
| **Intent Classifier** | On‑device *MiniLM* embeddings + cosine to choices. | AI/Backend |
| **Leo AI Gateway** | Azure Function; filters + calls GPT‑4o with story context. | Backend |
| **Analytics** | Unity Analytics + custom events to BigQuery. | Data Eng |

## Build / CI
* **GitHub Actions** → Fastlane for iOS and Gradle for Android.  
* Branch naming: `feat/`, `fix/`, `content/`.  
* Automatic addressable asset check + unit tests.

(See `pipeline/.github/workflows/ci.yml`)
