# Merge Manifest (`merge.md`)

This document lists every file, folder, and relative path required to merge the following three key features into another project without merge conflicts:
1. **AI Help Chatbot** (Frontend UI, API middleware, Express server, Gemini engine, masking, and knowledge base)
2. **Tamil Language Integration** (`ta` / `தமிழ்` modular i18n engine, Indian number-to-words with Tamil sandhi, data translations, and numerals masking)
3. **Biometric Authentication** (WebAuthn platform authenticators, profile-specific credential store, 1-tap post-PIN enrollment modal, and Settings/Profile toggles)

---

## Quick Summary of Folders to Copy

| Feature | Folders to Copy Completely | Destination Path in Second Project |
|---|---|---|
| **AI Chatbot** | `server/`<br>`api/`<br>`shared/` | `server/`<br>`api/`<br>`shared/` |
| **Tamil i18n** | `src/i18n/tamil/` | `src/i18n/tamil/` |
| **Biometric** | `biometric/`<br>`src/biometric/` | `biometric/`<br>`src/biometric/` |

---

## 1. AI Chatbot Functionality

### 1.1 New Files & Folders (Copy Directly)

These files can be copied directly into the second project without altering existing code:

| File / Folder Path | Type | Description |
|---|---|---|
| `server/chatCore.js` | File | Core backend chat engine: validates messages, checks limits, builds system prompt from banking knowledge files, calls Gemini API (`gemini-3.5-flash`), and handles error fallbacks. |
| `server/systemPrompt.js` | File | Comprehensive system prompt containing assistant persona, banking safety rules, scam detection criteria, and multi-language reply rules (English, Hindi, Tamil, Tanglish, Hinglish). |
| `server/express.js` | File | Standalone Express HTTP server hosting `POST /api/chat` with CORS and JSON body parser (used if not running on Vercel/Netlify). |
| `api/chat.js` | File | Serverless function wrapper for Vercel / Netlify serverless deployment of `/api/chat`. |
| `src/components/ui/AiFloatingButton.jsx` | File | Floating circular action button fixed in the bottom-right viewport (brand teal/blue `#0f766e`, accessible pulse icon, unread badge, suppressed on `/signin`, `/splash`, `/help/chat`). |
| `src/components/ui/SaralAiLogo.jsx` | File | Custom SVG animated badge for Saral AI chatbot used in headers and transaction detail cards. |
| `src/screens/help/HelpChat.jsx` | File | Main AI Chat screen: message list, typing bubble, quick question chips, char counter (500 max), offline indicator, sensitive number warning banner, and transaction context banner. |
| `src/screens/help/HelpHome.jsx` | File | Help hub menu linking to FAQ, AI Assistant, and Fraud Reporting. |
| `src/screens/help/ReportFraud.jsx` | File | Fraud reporting screen with official helpline dials (`1930`, `1800 111 222`). |
| `src/utils/chat.js` | File | Frontend chat dispatcher: handles offline keyword fallback, sensitive number masking with warning triggers, and direct browser-side Gemini fallback. |
| `scripts/test-voice.js` | File | Automated Node test suite verifying masking, system prompt assembly, Gemini input validation, and keyword fallbacks. |
| `scripts/test-live-server.js` | File | Live endpoint integration test script for `/api/chat`. |
| `config.js` | File | Root-level re-export of `src/data/config.js` (needed for `server/systemPrompt.js`). |
| `faq.js` | File | Root-level re-export of `src/data/faq.js` (needed for `server/systemPrompt.js`). |
| `glossary.js` | File | Root-level re-export of `src/data/glossary.js` (needed for `server/systemPrompt.js`). |
| `scams.js` | File | Root-level re-export of `src/data/scams.js` (needed for `server/systemPrompt.js`). |

### 1.2 Modified Files (Merge Carefully)

| File Path | What was added / changed |
|---|---|
| `src/components/shell/AppShell.jsx` | Mount `<AiFloatingButton />` inside the root app layout container so the chatbot is accessible from all banking screens. |
| `src/router.jsx` | Register route `{ path: 'help/chat', element: <HelpChat /> }` and `{ path: 'help', element: <HelpHome /> }`. |
| `vite.config.js` | Added `chatDevApiPlugin()` middleware for `/api/chat` and added `define: { __GEMINI_KEY__, __GEMINI_MODEL__ }`. |
| `.env` | Added `GEMINI_API_KEY=your_gemini_api_key_here` and `GEMINI_MODEL=gemini-3.5-flash`. |
| `package.json` | Added dependencies: `"express": "^5.3.0"`, `"dotenv": "^18.0.9"`. Added test script: `"node scripts/test-voice.js"`. |

---

## 2. Tamil Language Integration (`ta` / `தமிழ்`)

### 2.1 New Files & Folders (Copy Directly)

These files can be copied directly into the second project without altering existing code:

| File / Folder Path | Type | Description |
|---|---|---|
| `src/i18n/tamil/` | Folder | Dedicated folder containing all Tamil translations and Indian number formatting. |
| `src/i18n/tamil/ta.core.js` | File | Complete Tamil translations for core UI: app, navigation, common buttons, settings, sign-in, alerts, and biometric keys. |
| `src/i18n/tamil/ta.pay.js` | File | Complete Tamil translations for payments: pay, send, limits, confirm, PIN pad, safety checks, and receipts. |
| `src/i18n/tamil/ta.records.js` | File | Complete Tamil translations for records: statement filters, summaries, transaction details, cards, and learn. |
| `src/i18n/tamil/ta.js` | File | Aggregated export merging `ta.core.js`, `ta.pay.js`, and `ta.records.js`. |
| `src/i18n/tamil/tamilNumber.js` | File | Indian numbering system implementation (`toTamilWords`, `amountToTamilSpeech`) supporting Lakhs (`லட்சம்`), Crores (`கோடி`), and authentic Tamil sandhi rules (`ஐம்பதாயிரம்`, `இருபத்தைந்தாயிரம்`). |
| `src/i18n/ta.js` | File | Top-level bridge re-exporting `src/i18n/tamil/ta.js`. |
| `src/i18n/tamilNumber.js` | File | Top-level bridge re-exporting `src/i18n/tamil/tamilNumber.js`. |
| `scripts/check-i18n.mjs` | File | Automated verification script that verifies 0 missing keys and exact `{{placeholder}}` token parity between English and Tamil. |

### 2.2 Modified Files (Merge Carefully)

| File Path | What was added / changed |
|---|---|
| `src/i18n/index.js` | Imported `ta` from `./ta.js`, added to `translations = { en, hi, ta }`, updated `currentLang = translations[lang] ? lang : 'en'`, and exported `ta`. |
| `src/data/customers.js` | Added `ta` translations for all customer names (`சங்கர் பிரசாத்`, `பிரியா சர்மா`, `ஆரவ் மேத்தா`) and branch names. |
| `src/data/glossary.js` | Added `ta` fields (`term`, `meaning`, `match`) for all 29 terms, including Lakh and Crore. Updated `findTermsByText` to support `lang === 'ta'`. |
| `src/data/scams.js` | Added `ta` fields (`title`, `signs`, `doThis`) for all scam entries. |
| `src/data/faq.js` | Added `ta` fields (`question`, `answer`, `keywords`) with Tamil script and Tanglish search keywords. Updated `searchFaq` for `lang === 'ta'`. |
| `src/data/config.js` | Added `ta` translations for `newPayeeRule` and `sampleCharges`. |
| `src/screens/settings/Settings.jsx` | Added `{ value: 'ta', label: 'தமிழ் (Tamil)' }` to the Language Segmented control. |
| `src/screens/signin/SignIn.jsx` | Added `தமிழ்` language switch button; updated account header, customer cards, PIN prompt, clear button, and errors to support Tamil. |
| `src/screens/profile/Profile.jsx` | Updated Logout button label to `வெளியேறு` when `lang === 'ta'`. |
| `src/components/shell/TabBar.jsx` | Updated tab labels for Home, Accounts, Cards, History, More to Tamil (`முகப்பு`, `கணக்குகள்`, `கார்டுகள்`, `வரலாறு`, `சேவைகள்`). |
| `src/components/shell/Header.jsx` | Updated button aria-labels (`QR குறியீட்டை ஸ்கேன் செய்`, `பயனர் சுயவிவரம்`). |
| `src/screens/history/TransactionDetail.jsx` | Added `ta` translations to `EXPLANATIONS` map and interactive buttons. |
| `src/screens/statements/Statements.jsx` | Added `ta` translations for filter ranges, summary labels, and history header. |

---

## 3. Biometric Authentication (WebAuthn / Passkeys)

### 3.1 New Files & Folders (Copy Directly)

These files can be copied directly into the second project without altering existing code:

| File / Folder Path | Type | Description |
|---|---|---|
| `biometric/` | Folder | Dedicated standalone root folder for biometric implementation and specification. |
| `biometric/bio.md` | File | Production biometric specification document detailing WebAuthn/FIDO2 standard, security model, and button states. |
| `biometric/biometric.js` | File | WebAuthn engine: capability check (`fingerprintSupported`), credential creation (`enableFingerprint`), assertion verification (`unlockWithFingerprint`), Base64Url converters, and error normalizer. |
| `biometric/biometricStore.js` | File | Profile-isolated persistent storage mapping public key credentials to specific customer IDs (`shankar`, `priya`, `aarav`). |
| `biometric/BiometricEnrollModal.jsx` | File | Accessible post-PIN login modal dialog offering 1-tap fingerprint setup (`"Turn on fingerprint for next time?"`) with full EN/HI/TA text. |
| `biometric/index.js` | File | Unified export module for `biometric/`. |
| `src/biometric/` | Folder | Bridge directory re-exporting `../../biometric/index.js` for clean imports across `src/`. |
| `scripts/test-biometric.js` | File | Automated end-to-end test suite testing capability detection, enrollment, strict profile isolation, unlock, error mapping, and revocation. |

### 3.2 Modified Files (Merge Carefully)

| File Path | What was added / changed |
|---|---|
| `src/screens/signin/SignIn.jsx` | Imported biometric methods; added dynamic 3-state fingerprint button (Active/Ready, Needs PIN setup, Unsupported); added post-PIN enrollment modal trigger. |
| `src/screens/settings/Settings.jsx` | Added "Fingerprint Security" toggle card allowing instant enablement/revocation per profile. |
| `src/screens/profile/Profile.jsx` | Added "Fingerprint Unlock" row to profile menu with active badge and toggle handler. |
| `src/i18n/parts/en.core.js` | Added `core.bio.*` translation keys. |
| `src/i18n/parts/hi.core.js` | Added `core.bio.*` translation keys. |
| `src/i18n/tamil/ta.core.js` | Added `core.bio.*` translation keys. |

---

## 4. Shared Security & Cross-Cutting Files

### 4.1 Masking Pipeline (`shared/mask.js`)

Used by both **AI Chatbot** (prevents sensitive numbers from reaching AI) and **Tamil Integration** (normalizes Tamil numerals):

| File Path | Type | Details |
|---|---|---|
| `shared/mask.js` | File | - Converts Devanagari (`[\u0966-\u096F]`), Gujarati (`[\u0AE6-\u0AEF]`), and Tamil (`[\u0BE6-\u0BEF]`) numerals to ASCII digits.<br>- Identifies card and account numbers (13-19 digits).<br>- Matches sensitive keywords in EN, HI, and TA (`ஓடிபி`, `ஒருமுறை எண்`, `ரகசிய எண்`, `பின்`, `கடவுச்சொல்`).<br>- Replaces sensitive short numbers with `[OTP/PIN HIDDEN]`. |

---

## 5. Configuration & Environment Variables

| File Path | Key Variables / Configuration Needed |
|---|---|
| `.env` | `GEMINI_API_KEY=your_gemini_api_key`<br>`GEMINI_MODEL=gemini-3.5-flash` |
| `vite.config.js` | 1. Import `'dotenv/config'`.<br>2. Add `chatDevApiPlugin()` middleware for `/api/chat`.<br>3. Add `define: { __GEMINI_KEY__, __GEMINI_MODEL__ }`. |
| `package.json` | 1. Dependencies: `"express": "^5.3.0"`, `"dotenv": "^18.0.9"`.<br>2. Scripts: `"test": "node scripts/test-voice.js && node scripts/test-biometric.js && node scripts/check-i18n.mjs"`. |

---

## 6. Step-by-Step Conflict-Free Merge Checklist

Follow this sequence when copying into the second project:

1. **Step 1: Copy Standalone Folders & Files**
   ```bash
   cp -r server/ <target_project>/server/
   cp -r api/ <target_project>/api/
   cp -r shared/ <target_project>/shared/
   cp -r biometric/ <target_project>/biometric/
   cp -r src/biometric/ <target_project>/src/biometric/
   cp -r src/i18n/tamil/ <target_project>/src/i18n/tamil/
   cp src/i18n/ta.js <target_project>/src/i18n/ta.js
   cp src/i18n/tamilNumber.js <target_project>/src/i18n/tamilNumber.js
   cp src/components/ui/AiFloatingButton.jsx <target_project>/src/components/ui/
   cp src/components/ui/SaralAiLogo.jsx <target_project>/src/components/ui/
   cp src/screens/help/HelpChat.jsx <target_project>/src/screens/help/
   cp src/utils/chat.js <target_project>/src/utils/
   cp scripts/check-i18n.mjs <target_project>/scripts/
   cp scripts/test-biometric.js <target_project>/scripts/
   cp scripts/test-voice.js <target_project>/scripts/
   cp config.js faq.js glossary.js scams.js <target_project>/
   ```

2. **Step 2: Update `src/i18n/index.js`**
   - Import `ta` and add it to `translations = { en, hi, ta }`.

3. **Step 3: Update `shared/mask.js`**
   - Ensure Tamil numerals regex `[\u0BE6-\u0BEF]` and Tamil keywords are present.

4. **Step 4: Update Data Files**
   - Add `ta` entries to `src/data/glossary.js`, `src/data/faq.js`, `src/data/scams.js`, `src/data/config.js`, and `src/data/customers.js`.

5. **Step 5: Wire UI Screens**
   - In `SignIn.jsx`: Import biometric helpers and add the biometric button + modal.
   - In `Settings.jsx`: Add Tamil option to language segmented control + Biometric toggle.
   - In `Profile.jsx`: Add Biometric toggle menu item.
   - In `AppShell.jsx`: Mount `<AiFloatingButton />`.
   - In `router.jsx`: Add `/help/chat` route.

6. **Step 6: Update Environment & Build Config**
   - Add Gemini keys to `.env`.
   - Add `chatDevApiPlugin` to `vite.config.js`.

7. **Step 7: Verify Everything**
   ```bash
   node scripts/check-i18n.mjs   # Checks 100% key parity
   node scripts/test-biometric.js # Tests biometric WebAuthn flows
   node scripts/test-voice.js     # Tests AI chat & masking
   npm test                      # Runs all test suites
   npm run build                 # Confirms clean production build
   ```
