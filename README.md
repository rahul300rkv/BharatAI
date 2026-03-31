<p align="center">
  <img src="public/logo-horizontal.svg" alt="BharatAI" width="360"/>
</p>

<h3 align="center">Bharat ka Apna AI Classroom 🇮🇳</h3>

<p align="center">
  Multi-agent interactive learning — CBSE, JEE, NEET, UPSC & more — in Hinglish
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-AGPL--3.0-blue.svg?style=flat-square" alt="License"/></a>
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js" alt="Next.js"/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Groq-LPU_Inference-F55036?style=flat-square" alt="Groq"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
</p>

---

## 🇮🇳 What is BharatAI?

BharatAI is a fork of [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) — completely reimagined for Indian students. It turns any topic into a rich interactive classroom experience with AI teachers, quizzes, simulations and project-based learning — all delivered in **Hinglish** with an Indian cultural aesthetic.

### ✨ BharatAI-specific features

| Feature | Details |
|---|---|
| 🎨 **Indian Design System** | Saffron palette, warm parchment tones, Yatra One + Mukta fonts |
| 🗣️ **Hinglish Mode** | AI teachers naturally blend Hindi + English |
| ⚡ **Groq Integration** | Ultra-fast Llama 4, Llama 3.3, DeepSeek R1 on Groq LPUs |
| 🎤 **Groq Whisper ASR** | Hindi voice input with 12 Indian language support |
| 📚 **Indian Curriculum** | CBSE, ICSE, JEE, NEET, UPSC prompt suggestions |
| 🏛️ **BharatAI Branding** | Namaste greeting, Indian cultural context, desi examples |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/rahul300rkv/BharatAI.git
cd BharatAI

# Install
pnpm install

# Configure (see .env.example)
cp .env.example .env.local
# Add at least one API key — Groq is free!

# Run
pnpm dev
```

Open **http://localhost:3000** — BharatAI is ready!

---

## 🔑 Getting API Keys

### Groq (Free — Recommended!)
1. Go to **https://console.groq.com** → Sign up free
2. Create API Key → copy it
3. In `.env.local`:
```env
GROQ_API_KEY=gsk_...
ASR_GROQ_API_KEY=gsk_...
DEFAULT_MODEL=groq:llama-3.3-70b-versatile
```

### Other providers
```env
ANTHROPIC_API_KEY=sk-ant-...   # Claude
GOOGLE_API_KEY=AIza...         # Gemini
OPENAI_API_KEY=sk-...          # GPT
```

---

## 🤖 Supported Groq Models

| Model | Context | Best For |
|---|---|---|
| `groq:llama-3.3-70b-versatile` | 128K | General classroom ⭐ |
| `groq:meta-llama/llama-4-maverick-17b-128e-instruct` | 131K | Vision + tools |
| `groq:meta-llama/llama-4-scout-17b-16e-instruct` | 131K | Fast + vision |
| `groq:deepseek-r1-distill-llama-70b` | 128K | Deep reasoning |
| `groq:deepseek-r1-distill-qwen-32b` | 128K | Math reasoning |
| `groq:qwen-qwq-32b` | 131K | Maths & science |
| `groq:llama-3.1-8b-instant` | 128K | Lightest, fastest |
| `groq:mixtral-8x7b-32768` | 32K | Multilingual |
| `groq:gemma2-9b-it` | 8K | Lightweight |

---

## 🌐 Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahul300rkv/BharatAI&project-name=bharatai&framework=nextjs)

**Required env vars on Vercel:**

| Variable | Value |
|---|---|
| `GROQ_API_KEY` | `gsk_...` (free at console.groq.com) |
| `DEFAULT_MODEL` | `groq:llama-3.3-70b-versatile` |

---

## 🏗️ Architecture

BharatAI is built on OpenMAIC's multi-agent engine:

```
User Input → Outline Generator → Scene Generator (parallel)
                                      ├── Slides (AI teacher lectures)
                                      ├── Quiz (MCQ with AI grading)
                                      ├── Interactive Simulation (HTML)
                                      └── PBL (Project-Based Learning)

AI Orchestration (LangGraph) → Director Agent → Teacher + Student agents
                                                       ↕ real-time discussion
```

---

## 📦 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Tailwind CSS 4 + shadcn/ui
- **AI**: Vercel AI SDK + LangGraph
- **Providers**: Groq, Anthropic, Google, OpenAI, DeepSeek + more
- **Fonts**: Yatra One (display) + Mukta (body — supports Devanagari)
- **DB**: IndexedDB (local) + optional server storage

---

## 📄 License

AGPL-3.0 — see [LICENSE](LICENSE)

---

<p align="center">ज्ञान ही शक्ति है 🙏</p>
