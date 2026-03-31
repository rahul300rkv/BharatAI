# BharatAI — Setup & Deployment Guide

## 🚀 Quick Start (Local)

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local — add at least one API key

# 3. Run
pnpm dev
# Open http://localhost:3000
```

---

## 🔑 API Keys

### Groq (Free & Ultra-Fast — Recommended!)
1. Go to **https://console.groq.com** → Sign up free
2. Create API Key → copy it
3. Add to `.env.local`:
   ```
   GROQ_API_KEY=gsk_...
   ASR_GROQ_API_KEY=gsk_...   # Same key — enables voice input
   DEFAULT_MODEL=groq:llama-3.3-70b-versatile
   ```

### Anthropic Claude
```
ANTHROPIC_API_KEY=sk-ant-...
DEFAULT_MODEL=anthropic:claude-sonnet-4-20250514
```

### Google Gemini
```
GOOGLE_API_KEY=AIza...
DEFAULT_MODEL=google:gemini-2.0-flash-exp
```

---

## 🌐 Vercel Deployment

### One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/rahul300rkv/BharatAI)

### Manual Deploy
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables on Vercel
Go to: **Vercel Dashboard → Your Project → Settings → Environment Variables**

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Recommended | Ultra-fast free inference |
| `ANTHROPIC_API_KEY` | Optional | Claude models |
| `GOOGLE_API_KEY` | Optional | Gemini models |
| `OPENAI_API_KEY` | Optional | GPT models |
| `DEFAULT_MODEL` | Optional | e.g. `groq:llama-3.3-70b-versatile` |
| `ASR_GROQ_API_KEY` | Optional | Groq Whisper voice input |
| `TAVILY_API_KEY` | Optional | Web search in classroom |

---

## 🎓 Available Groq Models

| Model | Context | Speed | Best For |
|---|---|---|---|
| `groq:llama-3.3-70b-versatile` | 128K | ⚡⚡⚡ | General classroom |
| `groq:meta-llama/llama-4-maverick-17b-128e-instruct` | 131K | ⚡⚡⚡ | Vision + tools |
| `groq:meta-llama/llama-4-scout-17b-16e-instruct` | 131K | ⚡⚡⚡ | Fast + vision |
| `groq:deepseek-r1-distill-llama-70b` | 128K | ⚡⚡ | Deep reasoning |
| `groq:qwen-qwq-32b` | 131K | ⚡⚡ | Math & science |
| `groq:llama-3.1-8b-instant` | 128K | ⚡⚡⚡⚡ | Lightest & fastest |

---

## 🇮🇳 BharatAI Features

- **Hinglish mode** — AI teachers speak in natural Hindi+English mix
- **Indian curriculum** — CBSE, ICSE, JEE, NEET, UPSC support
- **Groq Whisper ASR** — Ultra-fast voice input in Hindi & 12 Indian languages
- **Saffron UI** — Complete Indian design system with warm palette
- **Multi-agent classroom** — AI teachers + AI students in real-time discussion

---

## 📞 Support
GitHub: https://github.com/rahul300rkv/BharatAI
