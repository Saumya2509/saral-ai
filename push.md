# Push Guide (`push.md`)

This guide provides step-by-step terminal commands to stage, commit, and push the three modules (**AI Chatbot**, **Tamil Language Support**, and **Biometric Authentication**) to GitHub so you can clone and merge them cleanly into your second project.

---

## 1. Safety Pre-Check

Before pushing, verify that sensitive files and build artifacts are ignored:
- `node_modules/` is ignored (already in `.gitignore`).
- `dist/` is ignored (already in `.gitignore`).
- `.env` contains your actual key, so ensure `.env.example` exists for the repo.

### Create `.env.example` (Safe to commit)
Run in `saral-banking`:
```bash
# PowerShell / Bash:
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.example
echo "GEMINI_MODEL=gemini-3.5-flash" >> .env.example
```

---

## 2. Git Initialization & Staging

Open your terminal in `F:\Mc_load_ganj\GEC_JAMMU_HACKATHON\saral-banking`:

### Step 2.1: Initialize Git (if not already done)
```powershell
cd F:\Mc_load_ganj\GEC_JAMMU_HACKATHON\saral-banking
git init
git branch -M main
```

---

### Step 2.2: Stage Files by Module

You can either stage everything cleanly, or stage the exact feature files:

#### Option A: Stage All Project Files (Recommended)
```powershell
git add .
```

#### Option B: Stage ONLY the Three Features (Selective Staging)
```powershell
# 1. AI Chatbot
git add server/ api/ shared/mask.js
git add src/components/ui/AiFloatingButton.jsx src/components/ui/SaralAiLogo.jsx
git add src/screens/help/
git add src/utils/chat.js
git add config.js faq.js glossary.js scams.js

# 2. Tamil Language Integration
git add src/i18n/tamil/
git add src/i18n/ta.js src/i18n/tamilNumber.js
git add src/i18n/index.js
git add scripts/check-i18n.mjs

# 3. Biometric Authentication
git add biometric/
git add src/biometric/
git add scripts/test-biometric.js

# 4. Shared Tests, Manifests & Documentation
git add scripts/test-voice.js scripts/test-live-server.js
git add merge.md push.md final.md
git add package.json vite.config.js .gitignore .env.example
```

---

## 3. Commit the Changes

```powershell
git commit -m "feat: complete ai-chatbot, tamil-i18n, and biometric-auth modules"
```

---

## 4. Push to GitHub

### Scenario A: If you already have a GitHub repository created
Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub details:

```powershell
# Add remote (if not already added)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Or if origin already exists:
# git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push main branch
git push -u origin main
```

*(Optional: Push to a dedicated feature branch)*
```powershell
git checkout -b feature/ai-tamil-biometric
git push -u origin feature/ai-tamil-biometric
```

---

### Scenario B: If you use GitHub CLI (`gh`) to create a new repo automatically
```powershell
# Authenticate (if needed)
gh auth login

# Create a private or public repository and push in one command:
gh repo create saral-features-export --public --source=. --remote=origin --push
```

---

## 5. Verify the Push on GitHub

Check your repository URL on GitHub (e.g. `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`):
- [x] `biometric/` folder is visible.
- [x] `server/` and `api/` folders are visible.
- [x] `src/i18n/tamil/` folder is visible.
- [x] `merge.md`, `push.md`, and `final.md` are present.
- [x] `node_modules/` and `.env` are NOT present.

---

## Next Step
Proceed to **[`final.md`](file:///F:/Mc_load_ganj/GEC_JAMMU_HACKATHON/saral-banking/final.md)** to execute the clean, conflict-free merge in your second project.
