# Master Merge Guide (`final.md`)

This guide provides definitive, conflict-free instructions for merging the three completed modules from this repository into your **Second Project**:
1. 🤖 **AI Help Chatbot** (Frontend UI, Gemini API backend middleware, offline fallback, and PII masking)
2. 🇮🇳 **Tamil Language Integration (`ta` / `தமிழ்`)** (Modular translation architecture, Indian number-to-words with Tamil sandhi, and multi-language UI parity)
3. 🔐 **Biometric Authentication (WebAuthn / Passkeys)** (Platform authenticators, profile-specific credential isolation, 1-tap post-PIN enrollment modal, and Settings/Profile toggles)

---

## Architecture & Integration Overview

```
Source Repo (saral-banking)                  Target Project (second project)
├── server/ & api/                 ───►      ├── server/ & api/              [NEW]
├── shared/mask.js                 ───►      ├── shared/mask.js              [NEW/UPDATE]
├── biometric/ & src/biometric/    ───►      ├── biometric/ & src/biometric/ [NEW]
├── src/i18n/tamil/                ───►      ├── src/i18n/tamil/             [NEW]
├── src/components/ui/AiFloating.. ───►      ├── src/components/ui/...       [NEW]
├── src/screens/help/              ───►      ├── src/screens/help/           [NEW]
└── Existing Files Merged:
    ├── src/i18n/index.js          (register 'ta' dictionary)
    ├── src/screens/signin/        (biometric button + enroll modal + tamil texts)
    ├── src/screens/settings/      (tamil option + biometric toggle)
    ├── src/components/shell/      (mount floating AI button)
    ├── src/router.jsx             (add /help and /help/chat routes)
    ├── vite.config.js             (register chat dev proxy middleware)
    └── package.json               (express, dotenv, test scripts)
```

---

## Phase 1: Retrieve the Code in Your Second Project

### Option A: Clone the Pushed GitHub Repo to a Temporary Directory (Recommended)
Open a terminal next to your second project:
```bash
# Clone the repo you pushed via push.md into a temporary directory
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git temp_saral_source
```

### Option B: Local Disk Direct Copy
If your second project is on the same machine (e.g., at `F:\SecondProject`):
- Source Path: `F:\Mc_load_ganj\GEC_JAMMU_HACKATHON\saral-banking`
- Target Path: `F:\SecondProject`

---

## Phase 2: Copy Zero-Conflict Standalone Files

The following folders and files are entirely self-contained. Copying them directly into your second project will **never cause Git merge conflicts**.

### PowerShell Script (Windows)
Run this script inside your second project root, setting `$SOURCE` to your cloned source folder:

```powershell
# Set your source repo directory path:
$SOURCE = "..\temp_saral_source" # or "F:\Mc_load_ganj\GEC_JAMMU_HACKATHON\saral-banking"

# 1. AI Chatbot Backend & Middleware
Copy-Item -Path "$SOURCE\server" -Destination "server" -Recurse -Force
Copy-Item -Path "$SOURCE\api" -Destination "api" -Recurse -Force
Copy-Item -Path "$SOURCE\shared" -Destination "shared" -Recurse -Force

# 2. Biometric Engine & UI Components
Copy-Item -Path "$SOURCE\biometric" -Destination "biometric" -Recurse -Force
New-Item -ItemType Directory -Path "src\biometric" -Force | Out-Null
Copy-Item -Path "$SOURCE\src\biometric\*" -Destination "src\biometric\" -Recurse -Force

# 3. Tamil i18n Modules & Helpers
New-Item -ItemType Directory -Path "src\i18n\tamil" -Force | Out-Null
Copy-Item -Path "$SOURCE\src\i18n\tamil\*" -Destination "src\i18n\tamil\" -Recurse -Force
Copy-Item -Path "$SOURCE\src\i18n\ta.js" -Destination "src\i18n\ta.js" -Force
Copy-Item -Path "$SOURCE\src\i18n\tamilNumber.js" -Destination "src\i18n\tamilNumber.js" -Force

# 4. AI Chatbot Frontend Screens & Widgets
New-Item -ItemType Directory -Path "src\components\ui" -Force | Out-Null
Copy-Item -Path "$SOURCE\src\components\ui\AiFloatingButton.jsx" -Destination "src\components\ui\" -Force
Copy-Item -Path "$SOURCE\src\components\ui\SaralAiLogo.jsx" -Destination "src\components\ui\" -Force

New-Item -ItemType Directory -Path "src\screens\help" -Force | Out-Null
Copy-Item -Path "$SOURCE\src\screens\help\*" -Destination "src\screens\help\" -Recurse -Force

New-Item -ItemType Directory -Path "src\utils" -Force | Out-Null
Copy-Item -Path "$SOURCE\src\utils\chat.js" -Destination "src\utils\" -Force

# 5. Automated Test Suites & Root Re-Exports
New-Item -ItemType Directory -Path "scripts" -Force | Out-Null
Copy-Item -Path "$SOURCE\scripts\check-i18n.mjs" -Destination "scripts\" -Force
Copy-Item -Path "$SOURCE\scripts\test-biometric.js" -Destination "scripts\" -Force
Copy-Item -Path "$SOURCE\scripts\test-voice.js" -Destination "scripts\" -Force
Copy-Item -Path "$SOURCE\scripts\test-live-server.js" -Destination "scripts\" -Force

Copy-Item -Path "$SOURCE\config.js" -Destination "config.js" -Force
Copy-Item -Path "$SOURCE\faq.js" -Destination "faq.js" -Force
Copy-Item -Path "$SOURCE\glossary.js" -Destination "glossary.js" -Force
Copy-Item -Path "$SOURCE\scams.js" -Destination "scams.js" -Force

Write-Host "✅ All standalone modules copied cleanly without conflicts!" -ForegroundColor Green
```

### Bash Script (macOS / Linux)
```bash
SOURCE="../temp_saral_source"

# Standalone folders
cp -r "$SOURCE/server" ./
cp -r "$SOURCE/api" ./
cp -r "$SOURCE/shared" ./
cp -r "$SOURCE/biometric" ./
mkdir -p src/biometric && cp -r "$SOURCE/src/biometric/"* src/biometric/
mkdir -p src/i18n/tamil && cp -r "$SOURCE/src/i18n/tamil/"* src/i18n/tamil/
cp "$SOURCE/src/i18n/ta.js" src/i18n/ta.js
cp "$SOURCE/src/i18n/tamilNumber.js" src/i18n/tamilNumber.js

# UI & Screens
mkdir -p src/components/ui
cp "$SOURCE/src/components/ui/AiFloatingButton.jsx" src/components/ui/
cp "$SOURCE/src/components/ui/SaralAiLogo.jsx" src/components/ui/
mkdir -p src/screens/help
cp -r "$SOURCE/src/screens/help/"* src/screens/help/
mkdir -p src/utils
cp "$SOURCE/src/utils/chat.js" src/utils/

# Tests & Re-exports
mkdir -p scripts
cp "$SOURCE/scripts/check-i18n.mjs" scripts/
cp "$SOURCE/scripts/test-biometric.js" scripts/
cp "$SOURCE/scripts/test-voice.js" scripts/
cp "$SOURCE/scripts/test-live-server.js" scripts/
cp "$SOURCE/config.js" ./
cp "$SOURCE/faq.js" ./
cp "$SOURCE/glossary.js" ./
cp "$SOURCE/scams.js" ./

echo "✅ All standalone modules copied successfully!"
```

---

## Phase 3: Surgical Code Merges in Existing Files

These are the only files in your second project that require code additions. Apply these simple, isolated edits:

### 3.1 Update `src/i18n/index.js` (Tamil Engine Activation)
Add `import ta from './ta.js';` and add `ta` into `translations`:

```javascript
// At top imports:
import en from './en.js';
import hi from './hi.js';
import ta from './ta.js'; // <--- ADD THIS

// Update translations object:
export const translations = { en, hi, ta }; // <--- ADD ta HERE
```

Ensure `I18nProvider` recognizes `ta`:
```javascript
export function I18nProvider({ lang = 'en', children }) {
  const currentLang = translations[lang] ? lang : 'en'; // <--- Handles 'ta' automatically
  // ...
```

---

### 3.2 Update `src/components/shell/AppShell.jsx` (Mount AI Assistant Button)
Import `AiFloatingButton` and place it before closing `</div>`:

```jsx
import AiFloatingButton from '../ui/AiFloatingButton.jsx'; // <--- ADD IMPORT

export default function AppShell() {
  // ... existing hooks and logic ...

  return (
    <div className="app-shell min-h-screen bg-fintech-mesh text-[var(--text-primary)]">
      <Outlet />
      <AiFloatingButton /> {/* <--- ADD FLOATING BUTTON HERE */}
    </div>
  );
}
```

---

### 3.3 Update `src/router.jsx` (Register AI Help Routes)
Import the help screens and add their route definitions:

```jsx
// Add imports:
import HelpHome from './screens/help/HelpHome';
import HelpChat from './screens/help/HelpChat';
import ReportFraud from './screens/help/ReportFraud';

// Inside router routes array:
const router = createBrowserRouter([
  // ... other routes ...
  {
    path: 'help',
    element: <HelpHome />,
  },
  {
    path: 'help/chat',
    element: <HelpChat />,
  },
  {
    path: 'help/report-fraud',
    element: <ReportFraud />,
  },
]);
```

---

### 3.4 Update `src/screens/settings/Settings.jsx` (Tamil & Biometric Toggle)

1. **Imports:**
```jsx
import {
  fingerprintSupported,
  hasFingerprint,
  enableFingerprint,
  revokeFingerprint,
} from '../../biometric/index.js';
```

2. **State & Effect:**
```jsx
const [bioEnabled, setBioEnabled] = useState(false);
const currentCustomerId = state.session.customerId || 'priya';

useEffect(() => {
  setBioEnabled(hasFingerprint(currentCustomerId));
}, [currentCustomerId]);

const handleToggleBio = async (newVal) => {
  if (newVal) {
    try {
      await enableFingerprint(currentCustomer);
      setBioEnabled(true);
    } catch (err) {
      console.error('Biometric enrollment failed:', err);
    }
  } else {
    revokeFingerprint(currentCustomerId);
    setBioEnabled(false);
  }
};
```

3. **Add Tamil option to Language Segmented Control:**
```jsx
<Card heading={t('core.settings.language') || 'Language'}>
  <Segmented
    value={state.settings.lang}
    onChange={(val) => dispatch({ type: 'SET_LANG', payload: val })}
    options={[
      { value: 'en', label: 'English' },
      { value: 'hi', label: 'हिन्दी (Hindi)' },
      { value: 'ta', label: 'தமிழ் (Tamil)' }, // <--- ADD THIS
    ]}
  />
</Card>
```

4. **Add Fingerprint Security Toggle Card:**
```jsx
{/* Biometric Unlock Toggle Card */}
<Card heading={lang === 'hi' ? 'फ़िंगरप्रिंट सुरक्षा' : lang === 'ta' ? 'கைரேகை பாதுகாப்பு' : 'Fingerprint Security'}>
  <Toggle
    checked={bioEnabled}
    onChange={handleToggleBio}
    label={lang === 'hi' ? '1-टैप फ़िंगरप्रिंट लॉगिन' : lang === 'ta' ? '1-தொடுதலில் கைரேகை உள்நுழைவு' : '1-Tap Fingerprint Login'}
    description={
      bioEnabled
        ? (lang === 'hi' ? 'इस प्रोफ़ाइल के लिए सक्रिय है' : lang === 'ta' ? 'இந்த கணக்கிற்கு இயக்கப்பட்டுள்ளது' : 'Active for this profile')
        : (lang === 'hi' ? 'त्वरित लॉगिन के लिए चालू करें' : lang === 'ta' ? 'உடனடி உள்நுழைவுக்கு இயக்கவும்' : 'Enable for quick 1-tap sign in')
    }
  />
</Card>
```

---

### 3.5 Update `src/screens/signin/SignIn.jsx` (Biometric Unlock & Tamil Texts)

1. **Imports:**
```jsx
import {
  fingerprintSupported,
  hasFingerprint,
  unlockWithFingerprint,
  BiometricEnrollModal,
} from '../../biometric/index.js';
```

2. **Biometric Integration Hooks & Handlers:**
```jsx
const [isSupported, setIsSupported] = useState(false);
const [showEnrollModal, setShowEnrollModal] = useState(false);
const [pendingCustomer, setPendingCustomer] = useState(null);
const [biometricState, setBiometricState] = useState('idle');

const isEnrolled = hasFingerprint(selectedCustomerId);

useEffect(() => {
  fingerprintSupported().then(setIsSupported);
}, []);

// Fingerprint tap handler
const handleFingerprintScan = async () => {
  if (biometricState !== 'idle' || !isSupported || !isEnrolled) return;
  setBiometricState('scanning');
  try {
    await unlockWithFingerprint(selectedCustomer);
    setBiometricState('verified');
    playSuccessChime();
    setTimeout(() => {
      processSignIn(selectedCustomer);
    }, 600);
  } catch (err) {
    playErrorTone();
    setBiometricState('idle');
    setError(err.message);
  }
};
```

3. **Trigger Enrollment Modal after PIN verification:**
In your `verifyPinSubmission(enteredPin)`:
```jsx
if (isValid) {
  let asked = false;
  try { asked = sessionStorage.getItem(`bioAsked:${selectedCustomer.id}`); } catch {}
  if (!hasFingerprint(selectedCustomer.id) && !asked) {
    try { sessionStorage.setItem(`bioAsked:${selectedCustomer.id}`, '1'); } catch {}
    setPendingCustomer(selectedCustomer);
    setShowEnrollModal(true);
  } else {
    processSignIn(selectedCustomer);
  }
}
```

4. **Render Biometric Enroll Modal at bottom of JSX:**
```jsx
<BiometricEnrollModal
  isOpen={showEnrollModal}
  customer={pendingCustomer || selectedCustomer}
  onSuccess={() => {
    setShowEnrollModal(false);
    processSignIn(pendingCustomer || selectedCustomer);
  }}
  onSkip={() => {
    setShowEnrollModal(false);
    processSignIn(pendingCustomer || selectedCustomer);
  }}
/>
```

5. **Language Switcher Buttons:**
Ensure Tamil is included alongside English and Hindi:
```jsx
<div className="flex gap-2">
  <button onClick={() => dispatch({ type: 'SET_LANG', payload: 'en' })}>EN</button>
  <button onClick={() => dispatch({ type: 'SET_LANG', payload: 'hi' })}>हिन्दी</button>
  <button onClick={() => dispatch({ type: 'SET_LANG', payload: 'ta' })}>தமிழ்</button>
</div>
```

---

### 3.6 Update Data Files (`customers.js`, `faq.js`, `glossary.js`, `scams.js`, `config.js`)
If your second project has customized versions of these data files:
- Copy the `ta` properties from the source files into each item.
- For `customers.js`: Add `name: { en: '...', hi: '...', ta: '...' }`.
- For `faq.js`: Add `ta: { question: '...', answer: '...', keywords: [...] }`.
- For `glossary.js`: Add `ta: { term: '...', meaning: '...', match: [...] }`.
- For `scams.js`: Add `ta: { title: '...', signs: [...], doThis: [...] }`.
*(If your second project's data files are identical to Saral, simply overwrite them directly from the source).*

---

## Phase 4: Dependencies, Vite Proxy & Environment Variables

### 4.1 Update `package.json`
Add Express and Dotenv if not present, and register the unified test command:

```json
{
  "dependencies": {
    "dotenv": "^18.0.9",
    "express": "^5.3.0"
  },
  "scripts": {
    "test": "node scripts/test-voice.js && node scripts/test-biometric.js && node scripts/check-i18n.mjs"
  }
}
```
Run:
```bash
npm install
```

---

### 4.2 Configure `.env`
Create or update your `.env` file in the second project root:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-3.5-flash
```

---

### 4.3 Update `vite.config.js` (Dev API Middleware for `/api/chat`)
Add the `chatDevApiPlugin` middleware so `POST /api/chat` works seamlessly during `npm run dev`:

```javascript
import 'dotenv/config';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function chatDevApiPlugin() {
  return {
    name: 'chat-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        if (url === '/api/chat') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

          if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method === 'POST') {
            let body = '';
            req.on('data', (chunk) => { body += chunk; });
            req.on('end', async () => {
              try {
                const payload = body ? JSON.parse(body) : {};
                const { handleChat } = await import('./server/chatCore.js');
                const { status, body: resBody } = await handleChat(payload);
                res.statusCode = status;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify(resBody));
              } catch (err) {
                console.error('Vite /api/chat error:', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'server_error' }));
              }
            });
            return;
          }
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), chatDevApiPlugin()],
  define: {
    __GEMINI_KEY__: JSON.stringify(process.env.GEMINI_API_KEY || ''),
    __GEMINI_MODEL__: JSON.stringify(process.env.GEMINI_MODEL || 'gemini-3.5-flash'),
  },
  server: {
    port: 3000,
    open: true,
  },
});
```

---

## Phase 5: Verification and Testing Checklist

Run these automated tests in your second project to verify 100% parity and zero regressions:

```bash
# 1. Test Tamil i18n key parity (verifies 0 missing keys and matching placeholder tokens)
node scripts/check-i18n.mjs

# 2. Test Biometric WebAuthn engine (verifies Base64Url, enrollment, isolation, error handling)
node scripts/test-biometric.js

# 3. Test AI Chat backend, system prompt, and PII masking pipeline
node scripts/test-voice.js

# 4. Run all three test suites together
npm test

# 5. Build for production (verifies zero build/syntax errors)
npm run build
```

Expected output:
```
✅ check-i18n.mjs: 366/366 keys present. 0 missing. 100% token parity.
✅ test-biometric.js: All 7 test suites PASSED.
✅ test-voice.js: All masking & chat tests PASSED.
✅ Vite build: built in ~900ms.
```

---

## Phase 6: Troubleshooting & Common FAQs

| Issue | Cause | Fix |
|---|---|---|
| **`WebAuthn not supported` warning** | Tested on `http://` domain rather than `localhost` or `https://` | WebAuthn requires a Secure Context (`window.isSecureContext`). Always develop on `localhost` or serve over `https://`. |
| **Chatbot responds with fallback answers** | `GEMINI_API_KEY` missing or invalid in `.env` | Ensure `.env` is saved at the root directory and contains a valid key. The built-in offline keyword fallback (`src/utils/chat.js`) automatically protects the user when offline or when the key is unset. |
| **Missing translation warnings in console** | Target project added custom i18n keys | Run `node scripts/check-i18n.mjs` to list any keys in your `en.js` that need corresponding additions in `src/i18n/tamil/ta.*.js`. |
| **`useState is not defined` in Settings** | Missing React import in custom components | Check `import React, { useState, useEffect } from 'react';` at the top of `Settings.jsx`. |

---

**Congratulations!** All three modules are now seamlessly integrated into your second project without merge conflicts.
