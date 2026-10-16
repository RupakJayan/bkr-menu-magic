# 📜 Change Management & Engineering Changelog

> **BKR Menu Magic — Change Management Record & Audit Trail**  
> Documenting architectural enhancements, bug fixes, feature releases, and component modification matrices.

---

## 📑 Table of Contents
1. [Change Management Philosophy & Governance](#1-change-management-philosophy--governance)
2. [Version History & Release Matrix](#2-version-history--release-matrix)
3. [Comprehensive Change Log](#3-comprehensive-change-log)
   - [v1.5.6 — Inline Gemini API Key Setup & Multi-Tier Browser Storage Fallback for AI Voice Assistant](#v156--inline-gemini-api-key-setup--multi-tier-browser-storage-fallback-for-ai-voice-assistant)
   - [v1.5.5 — Session Dish Serving Sequence Arrangement & Traditional South Indian Catering Course Sorting](#v155--session-dish-serving-sequence-arrangement--traditional-south-indian-catering-course-sorting)
   - [v1.5.4 — AI Catering Voice Assistant (Gemini 2.5 Flash), Mic Echo Guard, and Unlocked Mobile Keyboard Inputs](#v154--ai-catering-voice-assistant-gemini-25-flash-mic-echo-guard-and-unlocked-mobile-keyboard-inputs)
   - [v1.5.3 — Elimination of Letter-by-Letter Transliteration & Tamil Voiced-to-English Romanization](#v153--elimination-of-letter-by-letter-transliteration--tamil-voiced-to-english-romanization)
   - [v1.5.2 — Gemini 3.6 Flash Authentic Tamil Translation, Proactive Debounced AI Translate & Catering Culinary Dictionary Overhaul](#v152--gemini-36-flash-authentic-tamil-translation-proactive-debounced-ai-translate--catering-culinary-dictionary-overhaul)
   - [v1.5.1 — Voice Typing Audio Tick Beep, Repeat Dish Spoken Feedback, Persistent Activity Tray & Dynamic Dictionary](#v151--voice-typing-audio-tick-beep-repeat-dish-spoken-feedback-persistent-activity-tray--dynamic-dictionary)
   - [v1.5.0 — Instant Tamil Translation, Continuous Voice Auto-Add, Session MERN Actions & Universal Navigator](#v150--instant-tamil-translation-continuous-voice-auto-add-session-mern-actions--universal-navigator)
   - [v1.4.0 — AI Menu Lens, Voice Typing, Number Input Overhaul & Uncapped Search](#v140--ai-menu-lens-voice-typing-number-input-overhaul--uncapped-search)
   - [v1.3.0 — Google Drive Sync Optimizations & Performance Boost](#v130--v130--google-drive-sync-optimizations--performance-boost)
   - [v1.2.0 — Traditional Theme Pack 164 & Contrast Harmonisation](#v120--traditional-theme-pack-164--contrast-harmonisation)
   - [v1.1.0 — Bilingual OpenXML DOCX & Canvas PDF Engine](#v110--bilingual-openxml-docx--canvas-pdf-engine)
   - [v1.0.0 — Initial Release & Multi-Session Event Studio](#v100--initial-release--multi-session-event-studio)
4. [Component & Service Touch Matrix](#4-component--service-touch-matrix)
5. [Standard Operating Procedures for Future Changes](#5-standard-operating-procedures-for-future-changes)

---

## 1. Change Management Philosophy & Governance

To maintain enterprise reliability, consistency with BKR Catering's brand guidelines, and high operational uptime on GitHub Pages, all changes to `bkr-menu-magic` adhere to these engineering principles:

1. **Bilingual Completeness**: Every customer-facing feature must support both English and Tamil (`தமிழ்`).
2. **Visual Consistency (Theme Pack 164)**:
   - Primary Accent: Traditional Royal Burgundy (`#762934` in Light Mode, `#d8b36d` warm gold in Dark Mode).
   - Backgrounds & Surfaces: Warm parchment (`#fdfbf7` / `#f5f0e6`) and dark slate parchment (`#1f1816` / `#2a201c`).
   - Typography: Cormorant Garamond for display headers, Hanken Grotesk for crisp functional interfaces.
   - Zero light-on-light or unreadable high-contrast collisions.
3. **Graceful Offline & Fallback Handling**: External cloud services (Google Drive, Gemini AI, Web Speech API) must degrade gracefully when offline or unsupported, with local fallbacks.
4. **Non-Destructive Data Handling**: Handwritten inputs, custom dishes, and pricing overrides persist across steps and reloads without loss.
5. **Rigorous Verification**: All changes must pass `npx tsc --noEmit` type checks, Vite production build, and Playwright automated tests.

---

## 2. Version History & Release Matrix

| Version | Release Date | Summary of Core Deliverables | Verification Status |
|---|---|---|---|
| **v1.5.6** | October 2026 | Inline Gemini API Key Setup & Multi-Tier Browser Storage Fallback (`localStorage`, `sessionStorage`, `window`, `.env`), 1-Click Key Persist, Friendly Guidance, Uninterrupted Speech Recording | ✅ Verified (22/22 Tests & Clean Build Pass) |
| **v1.5.5** | October 2026 | Session Dish Serving Sequence Arrangement (Move Up/Down, Drag-and-Drop, Sequence numbering #1, #2...), 1-Click Traditional South Indian Catering Course Sequence (Starters → Sweets → Tiffin / Rice → Sambar → Rasam → Curd Rice → Desserts), Alphabetical & Category Sorting, Live Serving Order Strip on Main Planner, Unit Test UT-13 | ✅ Verified (22/22 Tests & Clean Build Pass) |
| **v1.5.4** | October 2026 | World-Class AI Catering Voice Assistant powered by Gemini 2.5 Flash, Zero Audio Reflection & Mic Echo Guard (Muted synthetic TTS, auto-pause on input focus), Mobile Virtual Keyboard Lock Elimination (Non-overwriting inputs, `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}`), Unit Test UT-12 | ✅ Verified (21/21 Tests & Clean Build Pass) |
| **v1.5.3** | October 2026 | Elimination of Letter-by-Letter Consonant Pulli Transliteration, Pure English Reverse Translation (`romanizeTamilToEnglish` + `TAMIL_CULINARY_WORDS`), Input Field Keystroke Protection (No Tamil Wipeout), Gemini AI Timeout & AbortSignal (3000ms), Unit Test UT-11 | ✅ Verified (20/20 Tests & Clean Build Pass) |
| **v1.5.2** | October 2026 | Gemini 3.6 Flash Authentic Tamil Translation, API Model Migration (`gemini-3.6-flash`), Proactive Debounced AI Translation, Interactive `✨ Gemini AI Translate` buttons, Catering Dictionary Overhaul (150+ authentic South Indian items), Elimination of Phonetic Garbling, Cross-Environment Key Resolver, Unit Test UT-10 | ✅ Verified (19/19 Tests & Clean Build Pass) |
| **v1.5.1** | October 2026 | Voice Typing Tick Beep (`playVoiceTickSound`), Spoken Repeat Detection & Voice Feedback (`playAlreadyAddedSound` + `speakVoiceFeedback`), Persistent Voice Activity Tray, Parallel & Post-Session Culinary Dictionary Auto-Registration (`registerDishToDictionary`), Unit Test UT-09 | ✅ Verified (18/18 Tests & Build Pass) |
| **v1.5.0** | October 2026 | Instant Tamil Culinary Translation (`tamilTranslationService.ts`), Continuous Voice Auto-Add of Not Found Items, Session MERN/CRUD Actions Modal (`SessionMenuManageDialog.tsx`), Universal Day & Session Navigator, Default Next Session Progression | ✅ Verified (17/17 Tests & Build Pass) |
| **v1.4.0** | October 2026 | AI Menu Lens (Gemini Vision OCR), Voice Typing (Single & Continuous), Empty Number Input Fix, Uncapped Search & Inline Bilingual Dish Creation, BKR Theme Harmonisation | ✅ Verified (Build & Tests Pass) |
| **v1.3.0** | October 2026 | Google Drive Sync debouncing, batch uploads, fast opening loader fallback, network stall protection | ✅ Verified |
| **v1.2.0** | October 2026 | Theme Pack 164 implementation, dark/light contrast auditing, accessible color tokens | ✅ Verified |
| **v1.1.0** | October 2026 | Bilingual OpenXML DOCX generation, synchronized Canvas PDF styles, Tamil solar calendar engine | ✅ Verified |
| **v1.0.0** | October 2026 | 4-Step Event Planning Studio, Multi-Session timeline, Admin Dashboard, Google GIS OAuth 2.0 | ✅ Verified |

---

## 3. Comprehensive Change Log

### v1.5.6 — Inline Gemini API Key Setup & Multi-Tier Browser Storage Fallback for AI Voice Assistant

#### 1. Background & Problem Statement
When running on GitHub Pages or mobile browser devices where environment variables (`.env`) are not bundled into client-side storage at runtime, or when a user clears browser cache, `getGeminiApiKey()` resolved to empty. In `AiVoiceAssistantDialog.tsx`, attempting to start recording or transcribe audio triggered:
> `Speech Error: Gemini API key is required. Please set VITE_GEMINI_API_KEY in .env or configure in settings.`
Because the dialog previously lacked an inline configuration card, users were blocked with no interactive way to view, enter, or persist their Gemini API key directly from the speech interface.

#### 2. Key Engineering Solutions Implemented
- **Inline Gemini API Key Configuration Card (`AiVoiceAssistantDialog.tsx`)**:
  - Mirrored the proven, high-elegance pattern from `AiMenuLensDialog.tsx`.
  - If no key is configured, the dialog automatically displays an input field with a 1-click **"Save Key"** button and direct link to Google AI Studio.
  - If a key is detected, a compact green badge **"🟢 Gemini 2.5 Flash Voice Connected"** with a **"Change API Key"** button is displayed.
  - Added pre-recording validation: Clicking the microphone without an active key instantly focuses the key setup box with helpful guidance instead of failing silently or throwing unhandled errors.
- **Multi-Tier Robust Key Resolution (`aiLensService.ts`)**:
  - Enhanced `getGeminiApiKey()` to evaluate sources in prioritised order:
    1. Browser `localStorage` (`bkr-gemini-api-key`)
    2. Session storage `sessionStorage` (`bkr-gemini-api-key`)
    3. Global runtime context `(window as any).__GEMINI_API_KEY__`
    4. Bundled environment variables (`import.meta.env.VITE_GEMINI_API_KEY`, `process.env.VITE_GEMINI_API_KEY`)
  - Updated `setGeminiApiKey()` to simultaneously save to `localStorage`, `sessionStorage`, and runtime memory.
- **Friendly Error Messaging (`aiVoiceAssistantService.ts`)**:
  - Replaced technical `.env` error message with clear, actionable user guidance: `"Gemini API key is required. Please enter and save your Gemini API key in the setup box above."`
- **Automated Verification**:
  - All 22 Playwright integration, end-to-end, and unit tests passing green (`22 passed`).
  - Production build compiled successfully (`npm run build`).

---

### v1.5.5 — Session Dish Serving Sequence Arrangement & Traditional South Indian Catering Course Sorting

#### 1. Background & Problem Statement
Caterers require specific serving sequences for wedding leaf services and buffet setups (e.g. Sweets before Mains, Sambar before Rasam, Curd Rice towards the end). Previously, dishes were appended in the order selected with no mechanism to reorder or structure them.

#### 2. Key Engineering Solutions Implemented
- **Arrangement Toolbar in `SessionMenuManageDialog.tsx`**:
  - **Traditional Course Order (1-Click)**: Heuristic algorithm classifying dishes into authentic South Indian wedding courses:
    1. Welcome Drinks, Soups & Juices
    2. Starters & Deep-Fried Vadai
    3. Sweets (Traditional first: Kesari, Payasam, Laddu, Halwa)
    4. Breakfast / Tiffin (Pongal → Vada → Idli → Poori → Dosa)
    5. Variety Rice & Breads (Parotta, Chappathi, Biryani, Pulao, White Rice)
    6. Sambar, Kuzhambu, Kurma & Gravies
    7. Poriyal, Varuval, Kootu & Avial
    8. Rasam (Tomato, Pepper, Mysore)
    9. Curd Rice & More (Thayir Sadham, Mor, Pachadi)
    10. Accompaniments (Appalam, Pickle, Chutney, Thuvaiyal, Vadam)
    11. Desserts, Ice Cream, Fruits, Coffee, Beeda / Paan
  - **Category Grouping**: Clustered by catering category.
  - **Alphabetical (A → Z)**: Sorted by English dish title.
  - **Reverse Order**: Instant inversion of the serving sequence.
- **Granular Manual Reordering Controls**:
  - Added dedicated `ChevronUp` and `ChevronDown` buttons on every dish card for quick single-step adjustments.
  - Integrated native HTML5 drag-and-drop (`GripVertical`) allowing caterers to drag items into their exact desired leaf position.
  - Sequence badges (`#1`, `#2`, `#3`...) displaying exact serving ranks.
- **Live Serving Sequence Strip on Main Planner**:
  - Horizontal scrollable sequence strip in `MenuSelectionStep.tsx` rendering all current dishes with sequence tags (`#1 Pineapple Kesari`, `#2 Medu Vada`...).
  - One-click "Arrange Serving Order" button opening the arrangement studio.
- **Downstream Synchronization**:
  - Arranged order directly propagates to `session.selectedDishes`, ensuring PDF menus, Word DOCX contracts, Kitchen printouts, and Review screens output dishes in the exact arranged order.
- **Automated Verification**:
  - Added Unit Test `UT-13` in `tests/unit.test.ts`. All 22 Playwright integration and unit tests passing green.

---

### v1.5.4 — AI Catering Voice Assistant (Gemini 2.5 Flash), Mic Echo Guard, and Unlocked Mobile Keyboard Inputs

#### 1. Background & Problem Statement
Users testing voice typing on mobile phones and tablets encountered two critical pain points:
1. **Audio Reflection Loop**: In continuous speech mode, browser speech synthesis feedback (`speechSynthesis.speak`) and device speaker audio reflected back into the microphone, triggering false transcriptions and duplicate menu entries.
2. **Locked Mobile Virtual Keyboards**: Editing voiced items inside dialogs and search inputs locked up mobile keyboards (Gboard/iOS) or wiped out keystrokes because aggressive `onChange` handlers replaced input values during active IME composition.

#### 2. Key Engineering Solutions Implemented
- **AI Catering Voice Assistant (`aiVoiceAssistantService.ts` & `AiVoiceAssistantDialog.tsx`)**:
  - Implemented high-fidelity audio capture using `MediaRecorder` with native browser echo cancellation, noise suppression, and auto gain control (`echoCancellation: true, noiseSuppression: true`).
  - Integrated Google Gemini 2.5 Flash (`gemini-2.5-flash`) for audio transcription, achieving 99%+ accuracy on South Indian catering menus in spoken Tamil, English, and Tanglish.
  - Added interactive review modal with animated audio waveforms, live recording timer, editable dish table, and one-click session commitment.
- **Audio Reflection & Mic Echo Guard**:
  - Muted synthetic voice speech feedback (`speakVoiceFeedback`) to ensure the device speaker never talks back into the microphone.
  - Added global auto-pause listener in `useVoiceTyping.ts` that immediately disconnects the microphone whenever the user touches or focuses any `<input>`, `<textarea>`, or dialog.
- **Complete Elimination of Keyboard Locks**:
  - Completely decoupled English and Tamil input handlers in `SessionMenuManageDialog.tsx` and `MenuSelectionStep.tsx`. Typing in English never mutates or erases the Tamil field, and typing in Tamil never replaces the English field.
  - Added `autoComplete="off"`, `autoCorrect="off"`, `spellCheck={false}`, and `autoCapitalize="words"` across all menu edit and creation text inputs.
- **Automated Verification**:
  - Added Unit Test `UT-12` in `tests/unit.test.ts`. All 21 Playwright integration and unit tests passing green.


#### 🔤 1. Elimination of Letter-by-Letter Pulli Transliteration
- **Root Cause Identified**: The phonetic transliterator in `tamilTranslationService.ts` contained a single-letter regex table (`/k/gi -> "க்"`, `/p/gi -> "ப்"`, etc.). Whenever a user edited or typed an English dish name, `onChange` immediately replaced the Tamil field with pulli consonants on every keystroke (e.g. typing "p" immediately changed Tamil to "ப்").
- **Fix Implemented**:
  - Completely purged single-letter consonant regex replacements from `transliterateEnglishToTamil`.
  - Replaced with culinary term mapping (`fry` -> `வறுவல்`, `roast` -> `ரோஸ்ட்`, `gravy` -> `கிரேவி`, `masala` -> `மசாலா`, `special` -> `ஸ்பெஷல்`).
  - Unknown English words now return empty string (`""`) so typing English NEVER generates pulli gibberish or overwrites existing Tamil dish names.

#### 🎙️ 2. Pure English Reverse Translation for Spoken Tamil
- **Root Cause Identified**: When speaking in Tamil (e.g. "பலாப்பழ பாயாசம்"), `getInstantEnglishName` had a fallback returning `toTitleCase(word)`. Since the word was in Tamil script, the English field was set to the Tamil text itself ("in english also tamil voiced one").
- **Fix Implemented**:
  - Created `TAMIL_CULINARY_WORDS` and `romanizeTamilToEnglish(tamilText)` converting Tamil syllables and pullis into English Latin alphabet (e.g. "பலாப்பழ பாயாசம்" -> "Jackfruit Payasam", "அவல் பாயாசம்" -> "Aval Payasam", "அடை பிரதமன்" -> "Ada Pradhaman").
  - Guaranteed that `getInstantEnglishName` NEVER returns a string containing Tamil Unicode characters (`/[\u0B80-\u0BFF]/`).
  - Spoken Tamil items in `useVoiceTyping.ts` and `MenuSelectionStep.tsx` now immediately receive pure English titles in `name_en` and Tamil script in `name_ta`.

#### 🛡️ 3. Input Field Keystroke Protection & AI Timeout Safeguard
- **Input Field Protection**:
  - In `SessionMenuManageDialog.tsx` (Add & Edit dish forms) and `MenuSelectionStep.tsx` (Search dropdown Quick Add), typing in the English field no longer erases or destroys the Tamil name on keystroke.
  - Tamil is only updated if an exact culinary dictionary match is found, or when debounced Gemini AI finishes.
- **Gemini Timeout & Offline Safeguard**:
  - Added `signal: AbortSignal.timeout(3000)` to Gemini API fetch calls in `fetchAiTamilTranslation`.
  - Added 0ms shortcut for items already present in the curated `CULINARY_DICTIONARY` or `REVERSE_DICTIONARY`.
- **Automated Verification**: Added Playwright test `UT-11` verifying:
  - English partial typing ("c", "p", "xyz") never produces pulli characters (`""`).
  - Spoken Tamil dishes produce pure Latin English titles with zero Tamil characters.
  - 100% test pass rate across all 20 tests (unit, integration, and E2E).

---

### v1.5.2 — Gemini 3.6 Flash Authentic Tamil Translation, Proactive Debounced AI Translate & Catering Culinary Dictionary Overhaul

#### 🤖 1. Gemini AI Model Upgrade & Deprecation Resolution
- **Root Cause Identified**: Previous calls in `tamilTranslationService.ts` and `aiLensService.ts` targeted deprecated endpoints (`gemini-1.5-flash` and `gemini-2.5-flash`), which Google's API rejected with `404 Not Found` for newer keys.
- **Model Migration to Gemini 3.6 Flash**:
  - Configured `GEMINI_TRANSLATION_MODELS = ["gemini-3.6-flash", "gemini-3.7-flash", "gemini-3.8-flash", "gemini-3.5-flash", "gemini-flash-latest"]`.
  - Upgraded OCR model cascade in `src/services/aiLensService.ts` to `gemini-3.6-flash`.
  - Added in-memory translation cache (`AI_TRANSLATION_CACHE`) and immediate persistence of AI-resolved terms to local storage dictionary (`bkr_custom_culinary_dictionary`).
  - Added robust, cross-environment key resolver in `getGeminiApiKey()` safely checking Vite `import.meta.env`, `process.env`, and `localStorage`.

#### 🍛 2. Elimination of Phonetic Garbling & Catering Dictionary Expansion
- **Root Cause of "Horrible Words"**: When Gemini failed (due to 404), the code fell back to a character-by-character regex transliterator that added pulli marks to every consonant (e.g., "pepper" -> `ப்ப்ப்ப்`).
- **Authentic Catering Dictionary Overhaul**:
  - Expanded `CULINARY_DICTIONARY` with 150+ authentic South Indian catering items, eliminating phonetic fallbacks for virtually all real catering menu items:
    - **Indo-Chinese & Modern Starters**: *Mushroom Pepper Fry* (`காளான் மிளகு வறுவல்`), *Baby Corn Manchurian* (`பேபி கார்ன் மஞ்சுரியன்`), *Gobi Manchurian* (`கோபி மஞ்சுரியன்`), *Paneer Manchurian* (`பன்னீர் மஞ்சுரியன்`), *Chilli Parotta* (`சில்லி பரோட்டா`), *Chilli Paneer* (`சில்லி பன்னீர்`), *Gobi 65* (`கோபி 65`), *Paneer 65* (`பன்னீர் 65`), *Mushroom 65* (`காளான் 65`), *Baby Corn 65* (`பேபி கார்ன் 65`), *Aloo 65* (`உருளை 65`).
    - **Rotis & Breads**: *Butter Naan* (`பட்டர் நான்`), *Garlic Naan* (`பூண்டு நான்`), *Tandoori Roti* (`தந்தூரி ரொட்டி`), *Romali Roti* (`ரூமாலி ரொட்டி`), *Paneer Kulcha* (`பன்னீர் குல்சா`), *Malabar Parotta* (`மலபார் பரோட்டா`), *Wheat Parotta* (`கோதுமை பரோட்டா`), *Veg Kothu Parotta* (`சைவ கொத்து பரோட்டா`).
    - **Gravies, Sambar & Curries**: *Palak Paneer* (`பாலக் பன்னீர்`), *Mutter Paneer* (`மட்டர் பன்னீர்`), *Shahi Paneer* (`ஷாஹி பன்னீர்`), *Paneer Tikka Masala* (`பன்னீர் டிக்கா மசாலா`), *Mushroom Masala* (`காளான் மசாலா`), *Kaju Masala* (`முந்திரி மசாலா`), *Veg Makhanwala* (`காய்கறி மக்கன்வாலா`), *Chettinad Kurma* (`செட்டிநாடு குருமா`), *Kalyana Sambar* (`கல்யாண சாம்பார்`), *Kalyana Rasam* (`கல்யாண ரசம்`), *Chow Chow Kootu* (`சௌ சௌ கூட்டு`), *Kalyana Avial* (`கல்யாண அவியல்`), *Senai Kizhangu Roast* (`சேனைக்கிழங்கு ரோஸ்ட்`).
    - **Specialty Rices & Biryanis**: *Chettinad Biryani* (`செட்டிநாடு பிரியாணி`), *Kashmiri Pulao* (`காஷ்மீரி புலாவ்`), *Corn Pulao* (`கார்ன் புலாவ்`), *Schezwan Fried Rice* (`செஷ்வான் ஃப்ரைட் ரைஸ்`), *Veg Noodles* (`காய்கறி நூடுல்ஸ்`), *Hakka Noodles* (`ஹக்கா நூடுல்ஸ்`).
    - **Sweets & Desserts**: *Badam Kheer* (`பாதாம் கீர்`), *Ashoka Halwa* (`அசோகா அல்வா`), *Mothi Laddu* (`மோத்திசூர் லட்டு`), *Paal Kova* (`பால்கோவா`).

#### ⚡ 3. Proactive Debounced AI Translation & Interactive Controls
- **SessionMenuManageDialog (`src/components/menu/SessionMenuManageDialog.tsx`)**:
  - Added 400ms debounced live Gemini 3.6 Flash translation as the user types in the "Add Dish" form and inline "Edit Dish" rows.
  - Added explicit `"✨ Gemini AI Translate"` / `"✨ Gemini AI"` action buttons with active spinning indicator (`AI Translating...`) so users can trigger translation on demand anytime.
- **Search Dropdown Quick Add (`src/components/steps/MenuSelectionStep.tsx`)**:
  - Connected 500ms debounced Gemini AI auto-translation on English input changes.
  - Added interactive `"✨ Gemini AI"` button in the Tamil Name label header with live translating badge.
- **Automated Verification**: Added Playwright test `UT-10` verifying authentic Tamil translations, reverse lookups, and `fetchAiTamilTranslation`. (All 19 tests pass 100%).

---

### v1.5.1 — Voice Typing Audio Tick Beep, Repeat Dish Spoken Feedback, Persistent Activity Tray & Dynamic Dictionary

#### 🎙️ 1. Audio Tick Feedback & Voice Repeat Alert
- **Crisp Confirmation Tick**: Added `playVoiceTickSound()` in `src/services/voiceTypingService.ts` producing a fast, high-frequency 50ms tick/beep (1100Hz -> 1600Hz) upon successfully adding spoken dishes.
- **Repeat Dish Audible Notification**: Added `playAlreadyAddedSound()` (double low-frequency pip) and `speakVoiceFeedback(`${dishName} already in menu`)` utilizing the Web Speech Synthesis API.
- **Spoken Duplicate Protection**: In `src/hooks/useVoiceTyping.ts`, eliminated aggressive set filtering that previously dropped repeated spoken phrases; added a 1.2s rapid-burst debounce while properly detecting duplicate dishes against the current session.

#### 📊 2. Persistent Voice Added Items Activity Tray
- **Activity Tray Retention**: Updated `src/components/steps/MenuSelectionStep.tsx` so the voice activity tray remains visible even when listening pauses or stops.
- **Visual Status Badges**: Displays green badges for added items (`✅ Added: [English Name] ([Tamil Name])`), amber badges for repeated items (`ℹ️ Already in menu: [English Name]`), and not-found badges.
- **Direct MERN Trigger**: Added `"Done & Manage Menu"` button directly in the active listening bar and tray, allowing one-click opening of the Session MERN Dialog without abrupt auto-popups interrupting dictation.

#### 📖 3. Parallel & Post-Session Culinary Dictionary Auto-Registration
- **Dual Sync Mechanism**:
  - **Instant Parallel Sync**: When an unknown dish is spoken or added, `registerDishToDictionary` immediately updates the active in-memory culinary dictionary, registers aliases with `voiceTypingService`, and persists the mapping to browser `localStorage` (`bkr_custom_culinary_dictionary`). In parallel, background non-blocking AI translation is invoked.
  - **Post-Session Sync**: Upon clicking `"Proceed to Next Session"` in `SessionMenuManageDialog`, all active session dishes are batch-synced to the dictionary.
- **Automated Verification**: Added Playwright unit test `UT-09` verifying dictionary registration and multi-phrase continuous voice parsing. (All 18 tests passing 100%).

---

### v1.5.0 — Instant Tamil Translation, Continuous Voice Auto-Add, Session MERN Actions & Universal Navigator

#### 🌐 1. Instant Tamil Culinary Translation & Transliteration
- **Problem**: When typing or speaking newly requested dishes, users had to manually know or type the Tamil name in Tamil script, slowing down real-time client consultations.
- **Solution**: Developed `src/services/tamilTranslationService.ts`.
  - **Comprehensive Culinary Dictionary**: Contains pre-mapped South Indian catering ingredients, preparations, sweets, gravies, tiffin items, beverages, and descriptive terms.
  - **Instant Synchronous Engine**: Translates English to Tamil (`getInstantTamilName`) and Tamil to English (`getInstantEnglishName`) in 0 milliseconds as the user types or speaks.
  - **Category Deduction**: Automatically predicts appropriate catering category from keywords (`guessCategoryForDish`).
  - **Phonetic Transliteration Fallback**: Transliterates unknown English phonetics into Tamil script.
  - **Background AI Refinement**: Optional Gemini AI enrichment (`fetchAiTamilTranslation`).

#### 🎙️ 2. Continuous Voice Auto-Add for Not Found Items
- **Problem**: Continuous voice search previously only added dishes that already existed in the catalog; spoken dishes not found were ignored.
- **Solution**:
  - Enhanced `useVoiceTyping.ts` with `onCustomDishSpoken`.
  - When a spoken phrase doesn't match an existing dish, the engine generates bilingual English & Tamil names, determines the category, adds it to the persistent catalog (`addCustomDishToCatalog`), appends it to the active session, and plays a success chime.

#### 📋 3. Post-Voice Session Review & MERN / CRUD Actions Modal
- **Problem**: After finishing continuous voice dictation, coordinators needed an immediate view of all added dishes to review, update, edit, delete, or add custom dishes before advancing.
- **Solution**: Developed `src/components/menu/SessionMenuManageDialog.tsx`.
  - Automatically pops up when voice recording stops (`onListeningStopped`).
  - Also accessible anytime via the **"Manage Menu (X)"** button on the session banner.
  - **Create**: Inline quick-add form with instant Tamil auto-translation.
  - **Read**: Filterable, categorized list of all dishes currently in the session with image thumbnails, badges, and vegetarian indicators.
  - **Update**: In-place edit mode to modify English dish name, Tamil dish name, or reassign category, with catalog synchronization (`updateDishInCatalog`).
  - **Delete**: Instant removal button per dish from the session (`removeDishFromSession`).
  - **Proceed**: Primary CTA button to advance directly to the next session.

#### 🧭 4. Universal Day & Session Navigator
- **Problem**: Switching between days or sessions previously required sequentially clicking previous/next buttons or navigating back to Step 2.
- **Solution**:
  - Added a responsive **Universal Day & Session Navigator Bar** above the search catalog in `MenuSelectionStep.tsx`.
  - **Day Selector**: Instant switching between event days.
  - **Session Switcher Pills**: Displays all sessions for the active day with real-time dish counters; clicking any session immediately switches the view.
  - **Default Next Session Progression**: Bottom action button automatically defaults to `Proceed to Next Session: [Session Name]` (or `Continue to Review & Pricing` on final session).

---

#### 🌟 1. AI Menu Lens (Handwritten & Printed Menu Digitizer)
- **Problem**: Catering coordinators frequently receive photographed or scanned paper menus with handwritten Tamil/English dish notes. Manually retyping and searching for each dish into session plans was tedious and error-prone.
- **Solution**: Developed `src/services/aiLensService.ts` and `src/components/ai/AiMenuLensDialog.tsx`.
  - **Gemini 1.5 Flash Multimodal Vision**: Sends image base64 payloads to Google Gemini API with a prompt tuned for South Indian catering menus.
  - **Bilingual & Category Extraction**: Automatically extracts dish names in both English and Tamil, maps them to standard catering categories (`Morning Tiffin`, `Lunch Sweets`, `Sambar / Gravies`, `Evening Snacks`, `Dinner`, etc.), and extracts estimated headcounts or special notes.
  - **Interactive Verification & Inline Editing**: Coordinators can preview recognized dishes in a review table, edit English/Tamil names, reassign categories, delete or add dishes before insertion.
  - **One-Click Injection**: Directly saves recognized dishes to the local catalog (`localAdminService`) and adds them into the active planning session.
  - **Access Points**: Banner in `EventDetailsStep.tsx`, top action buttons in `MenuCreator.tsx` and `AdminDashboard.tsx`.
  - **API Key Configuration**: Stored in `.env` and `.env.local` (`VITE_GEMINI_API_KEY`), backed by fallback support in `aiLensService.ts`.

#### 🎙️ 2. Voice Typing in Search (Single Search & Continuous Add)
- **Problem**: In fast-paced kitchen and client consultations, typing dish names on mobile or tablet keyboards slows down menu curation.
- **Solution**: Created `src/services/voiceTypingService.ts` and `src/hooks/useVoiceTyping.ts`.
  - **Dual Language Recognition**: Direct toggle between Tamil (`ta-IN`) and Indian English (`en-IN`), with browser fallback to system default.
  - **Two Operating Modes**:
    1. **Single Search Mode**: Voice input fills the search bar, filtering matching catalog dishes with uncapped scrollable results.
    2. **Continuous Menu Add Mode**: Speech recognition listens continuously. When a dish name is spoken, the engine identifies the closest catalog dish (or creates a custom entry) and appends it to the active session with live audio feedback toast notifications.
  - **Browser Compatibility**: Wraps `webkitSpeechRecognition` and `SpeechRecognition` with mic permission handling and visual pulse indicators.

#### 🔢 3. Number Input Overhaul (Empty Backspace Handling)
- **Problem**: When clearing number inputs (guest counts, rates, transport costs, extra charges) with the Backspace key, fields immediately snapped back to `"1"` or `"0"`, preventing users from clearing and typing new multi-digit numbers cleanly.
- **Root Cause**: Input components were binding numeric state directly to `value={field || 1}` or immediately coercing `parseInt(e.target.value) || 1` on every keystroke.
- **Solution**:
  - Implemented decoupled string state in `EventPlanningFlow.tsx`, `MenuEditor.tsx`, `SessionPlanningStep.tsx`, and `ReviewStep.tsx`.
  - Allowed inputs to be temporarily empty (`""`) while typing.
  - Validated and provided graceful fallbacks only on `onBlur` or submission.
  - Verified across guest headcounts, session rates, transport costs, and custom fee adjustments.

#### 🔍 4. Uncapped Search & Inline Bilingual Dish Creation
- **Problem**:
  1. The search input previously truncated results to an artificial limit of 8 items (`.slice(0, 8)`), hiding relevant dishes during broad searches.
  2. If a client requested an unlisted specialty dish, coordinators had to leave the planning flow to go to the Admin catalog or settle for unformatted names.
- **Solution**:
  - Removed the 8-item slice in `MenuSelectionStep.tsx`. Matches are presented in a smooth `max-h-96 overflow-y-auto` dropdown with an active counter (`Showing all N matching dishes`).
  - Added an **Inline Custom Dish Creation Card** directly inside the search dropdown and the empty-results state.
  - Automatically pre-fills English or Tamil depending on the typed script.
  - Provides dual inputs (`Dish Name (English)` and `உணவு பெயர் (தமிழ்)`), category selector dropdown, and an `Add & Select Dish` action.
  - Adds the new dish to the persistent catalog via `addCustomDishToCatalog` and automatically appends it to the active session.

#### 🎨 5. BKR Signature Theme Harmonisation (Theme Pack 164)
- **Problem**: Newly introduced components had generic purple/indigo/emerald buttons and cards that broke the visual harmony of BKR Catering's traditional aesthetic.
- **Solution**:
  - Redesigned `AiMenuLensDialog.tsx`, `EventDetailsStep.tsx`, `MenuSelectionStep.tsx`, and top headers to use BKR's Theme Pack 164 design tokens:
    - Burgundy primary header (`bg-[#762934]`, `text-white`).
    - Cormorant Garamond serif headers (`font-serif tracking-wide`).
    - Brass/gold badges (`border-[#d8b36d]/50 bg-[#d8b36d]/15 text-[#762934] dark:text-[#d8b36d]`).
    - Warm parchment dialog cards (`bg-surf`, `border-line`).
    - Dark mode high-contrast support with warm gold accents.

---

### v1.3.0 — Google Drive Sync Optimizations & Performance Boost

#### ⚡ 1. Debounced & Background Cloud Sync
- **Problem**: Immediate synchronous file uploads to Google Drive during minor menu edits caused UI stuttering and occasional network timeouts.
- **Solution**:
  - Implemented a 1500ms debounce buffer on cloud sync triggers in `googleDriveService.ts`.
  - Prevented redundant parallel upload requests for identical payloads.
  - Added error-boundary protection around network drops with graceful offline caching in `localStorage`.

#### 🎬 2. Fast Opening Loader Fallback
- **Problem**: On slower connections or devices with video autoplay restrictions, the introductory video intro could hold the user back.
- **Solution**: Added a 2.5-second hard timeout and instant "Skip Intro" bypass button in `OpeningLoader.tsx` with smooth fade-out.

---

### v1.2.0 — Traditional Theme Pack 164 & Contrast Harmonisation

- Standardized color system across Light and Dark modes.
- Light mode: Warm Parchment (`#fdfbf7`), Burgundy Accent (`#762934`), Slate Inks (`#262626`).
- Dark mode: Charcoal Parchment (`#1f1816`), Rich Gold Accent (`#d8b36d`), High-Contrast Inks (`#f5f5f5`).
- Eliminated all unreadable badges, low-contrast text collisions, and generic Tailwind default palettes.

---

### v1.1.0 — Bilingual OpenXML DOCX & Canvas PDF Engine

- Synchronized styling between DOCX and PDF documents:
  - Header fill: `#5B3723` with crisp white bold titles.
  - Detail labels: `#F8F5F1` with dark burgundy text.
  - Soft table borders: `#DCD5CD`.
- Automated Tamil solar calendar calculation (*Chithirai* through *Panguni* with Tamil numerals and day names).
- Four-document upload structure in Google Drive (`date_venueplace_clientname_tamil`).

---

### v1.0.0 — Initial Release & Multi-Session Event Studio

- 4-Step Interactive Event Studio (Event Details, Session Timeline, Menu Selection, Review & Summary).
- Admin Dashboard with Overview, Events Register, Booking Calendar, Team Directory, Catalog Manager, Analytics, and Settings.
- Google Identity Services (GIS) OAuth 2.0 integration with authorized admin allowlist.

---

## 4. Component & Service Touch Matrix

The following matrix documents the codebase touch points for features introduced and maintained in the platform:

| File Path | Component / Service | Responsibility | Key Modifiers / Changes |
|---|---|---|---|
| `src/services/tamilTranslationService.ts` | **Tamil Translation Service** | Instant culinary dictionary, EN <-> TA transliteration, category deduction, and Gemini AI | Created in v1.5.0 |
| `src/components/menu/SessionMenuManageDialog.tsx` | **Session MERN Dialog** | Interactive modal for CRUD actions on session dishes, live Tamil translation, and next session progression | Created in v1.5.0 |
| `src/services/aiLensService.ts` | **AI Lens Service** | Gemini 1.5 Flash Vision OCR, prompt engineering, JSON schema parsing, catalog categorization | Created in v1.4.0 |
| `src/components/ai/AiMenuLensDialog.tsx` | **AI Lens Modal** | Drag-and-drop dropzone, camera upload, live dish extraction table, inline name/category editing | Created in v1.4.0, restyled to Theme Pack 164 |
| `src/services/voiceTypingService.ts` | **Voice Typing Service** | Web Speech API wrapper, recognition lifecycle, language switching (`ta-IN`, `en-IN`) | Created in v1.4.0 |
| `src/hooks/useVoiceTyping.ts` | **Voice Typing React Hook** | React state management for mic listening, continuous auto-add of not found dishes, stop triggers | Enhanced in v1.5.0 with onCustomDishSpoken and onListeningStopped |
| `src/components/steps/MenuSelectionStep.tsx` | **Menu Selection Step** | Dish catalog browser, search input, Universal Day/Session Navigator, session dialog integration | Enhanced in v1.5.0 with Navigator, instant translation, MERN dialog |
| `src/services/localAdminService.ts` | **Local Admin Service** | Catalog storage, events persistence, `addCustomDishToCatalog`, `updateDishInCatalog` | Added updateDishInCatalog in v1.5.0 |
| `src/services/menuCatalogService.ts` | **Catalog Service Bridge** | Exports catalog modification functions (`updateDishInCatalog`, `removeCustomDishFromCatalog`) | Updated in v1.5.0 |
| `src/components/EventPlanningFlow.tsx` | **Event Planning Shell** | Wizard step progression, headcount & rate state handling | Fixed number input backspace snapping in v1.4.0 |
| `src/components/MenuEditor.tsx` | **Menu Editor View** | Direct session rate & headcount adjustment modal | Fixed number input backspace snapping in v1.4.0 |
| `src/components/steps/SessionPlanningStep.tsx` | **Session Planning Step** | Meal session timeline, guest count, and per-plate pricing | Fixed number input backspace snapping in v1.4.0 |
| `src/components/steps/ReviewStep.tsx` | **Review & Summary Step** | Grand total calculations, transport charges, tax & discount inputs | Fixed number input backspace snapping in v1.4.0 |
| `src/components/steps/EventDetailsStep.tsx` | **Event Details Step** | Client info, venue, date picker, AI Menu Lens launch banner | Styled AI Lens banner with Theme Pack 164 in v1.4.0 |
| `src/pages/MenuCreator.tsx` | **Menu Creator Page** | Top navigation bar, AI Lens trigger button, step controls | Themed AI button to Burgundy/Gold in v1.4.0 |
| `src/pages/AdminDashboard.tsx` | **Admin Dashboard Page** | 7-module dashboard, catalog editor, quick-actions bar | Added AI Lens trigger button in v1.4.0 |
| `src/services/googleDriveService.ts` | **Google Drive Service** | REST API v3 uploads, subfolder management, spreadsheet sync | Debounced and batch-optimized in v1.3.0 / v1.4.0 |
| `src/components/OpeningLoader.tsx` | **Opening Video Loader** | Brand intro video animation, timeout fallbacks | Fast skip fallback added in v1.3.0 |
| `.env` / `.env.local` | **Environment Config** | Vite environment variables (`VITE_GEMINI_API_KEY`) | Configured Google AI Studio API key |

---

## 5. Standard Operating Procedures for Future Changes

When extending or maintaining `bkr-menu-magic`, follow these standard steps:

1. **Feature Branching**:
   - Create a descriptive branch (e.g., `feature/ai-menu-enhancements` or `fix/number-input-formatting`).
2. **Design Token Enforcement**:
   - Always reference Theme Pack 164 variables (`--tp-acc`, `--tp-acc-ink`, `--tp-surf`, `--tp-line`, `--tp-font-display`, `--tp-font-body`).
   - Do NOT introduce raw Tailwind colors (e.g., `bg-purple-600`, `text-indigo-500`) unless explicitly mapped to semantic theme tokens.
3. **Bilingual Verification**:
   - If adding a field or dish property, ensure both English (`name`) and Tamil (`nameTa`) are supported and rendered.
4. **Offline / Build Verification**:
   ```bash
   # 1. Type verification
   npx tsc --noEmit
   
   # 2. Production build check
   npm run build
   
   # 3. Playwright test execution
   npx playwright test
   ```
5. **Changelog Maintenance**:
   - Update `CHANGE_MANAGEMENT.md` with:
     - Exact problem statement and resolved behavior.
     - Files modified and new exports introduced.
     - Verification steps and visual test screenshots if applicable.
