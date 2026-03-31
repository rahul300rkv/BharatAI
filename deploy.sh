#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# BharatAI — One-shot GitHub push + Vercel deploy script
# Usage: bash deploy.sh
# ─────────────────────────────────────────────────────────────
set -e

REPO_URL="https://github.com/rahul300rkv/BharatAI.git"
PROJECT_NAME="bharatai"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   BharatAI — Deploy Script 🇮🇳               ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Check we are in the right directory ──────────────
if [ ! -f "package.json" ] || ! grep -q "bharatai\|BharatAI\|openmaic\|OpenMAIC" package.json 2>/dev/null; then
  echo "❌  Run this from your BharatAI project root."
  exit 1
fi

# ── Step 2: Install dependencies ────────────────────────────
echo "📦  Installing dependencies..."
pnpm install
echo "✅  Dependencies installed"
echo ""

# ── Step 3: Check .env.local exists ─────────────────────────
if [ ! -f ".env.local" ]; then
  cp .env.example .env.local
  echo "⚠️   Created .env.local from .env.example"
  echo "    → Edit .env.local and add your API keys, then re-run this script."
  echo ""
  echo "    Minimum required (choose one):"
  echo "    GROQ_API_KEY=gsk_...        ← Free at console.groq.com"
  echo "    ANTHROPIC_API_KEY=sk-ant-..."
  echo "    GOOGLE_API_KEY=AIza..."
  echo ""
  exit 1
fi

# Check at least one LLM key is set
HAS_KEY=false
for KEY in GROQ_API_KEY ANTHROPIC_API_KEY GOOGLE_API_KEY OPENAI_API_KEY DEEPSEEK_API_KEY; do
  VAL=$(grep "^${KEY}=" .env.local | cut -d= -f2- | tr -d ' ')
  if [ -n "$VAL" ] && [ "$VAL" != "gsk_..." ] && [ "$VAL" != "sk-ant-..." ]; then
    HAS_KEY=true
    echo "✅  Found API key: $KEY"
    break
  fi
done

if [ "$HAS_KEY" = false ]; then
  echo "❌  No API key found in .env.local"
  echo "    Add at least one (Groq is free): https://console.groq.com"
  exit 1
fi
echo ""

# ── Step 4: Git setup ────────────────────────────────────────
echo "📡  Setting up Git..."

# Initialize if needed
if [ ! -d ".git" ]; then
  git init
  echo "✅  Git initialized"
fi

# Set remote
if git remote get-url origin &>/dev/null; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi
echo "✅  Remote: $REPO_URL"
echo ""

# ── Step 5: Commit everything ────────────────────────────────
echo "📝  Staging changes..."
git add -A

# Check if there's anything to commit
if git diff --cached --quiet; then
  echo "ℹ️   Nothing new to commit — working tree clean"
else
  git commit -m "feat: BharatAI complete revamp — saffron theme, Groq integration, Indian fonts

- Complete UI overhaul: saffron/marigold/parchment palette replacing purple
- Fonts: Yatra One (display) + Mukta (Hindi+Latin body)
- Groq provider: Llama 4 Maverick/Scout, Llama 3.3 70B, DeepSeek R1, Qwen QwQ
- Groq Whisper ASR: ultra-fast Hindi voice input, 12 Indian languages
- BharatAI branding: Namaste greeting, CBSE/JEE/NEET/UPSC prompts
- Indian design system: 580+ color replacements across 50+ files
- vercel.json: proper function timeouts for long-running AI operations"
  echo "✅  Committed"
fi
echo ""

# ── Step 6: Push to GitHub ───────────────────────────────────
echo "🚀  Pushing to GitHub..."
BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
if [ -z "$BRANCH" ]; then BRANCH="main"; fi

git push -u origin "$BRANCH" 2>&1 || {
  echo ""
  echo "⚠️   Push failed. If this is your first push, try:"
  echo "    git push -u origin main --force"
  echo ""
  echo "    Or if GitHub asks for credentials, set up a Personal Access Token:"
  echo "    https://github.com/settings/tokens"
}
echo ""

# ── Step 7: Vercel deploy ────────────────────────────────────
echo "☁️   Deploying to Vercel..."
if ! command -v vercel &>/dev/null; then
  echo "📦  Installing Vercel CLI..."
  npm install -g vercel --quiet
fi

echo ""
echo "    Vercel will ask you to:"
echo "    1. Log in (or confirm existing login)"
echo "    2. Link to project (create new: $PROJECT_NAME)"
echo "    3. Confirm settings (Next.js auto-detected)"
echo ""

vercel --prod

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  🎉 BharatAI deployed!                       ║"
echo "║                                              ║"
echo "║  Add env vars on Vercel dashboard:           ║"
echo "║  vercel.com → Project → Settings → Env Vars  ║"
echo "║                                              ║"
echo "║  Key env vars:                               ║"
echo "║    GROQ_API_KEY       (free groq.com)        ║"
echo "║    DEFAULT_MODEL      groq:llama-3.3-70b-... ║"
echo "║    ANTHROPIC_API_KEY  (optional)             ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "ज्ञान ही शक्ति है 🙏"
echo ""
