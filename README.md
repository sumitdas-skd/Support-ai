# 🤖 SupportAI — 24/7 Autonomous AI Customer Support Platform

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC.svg)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%20%2F%20OpenAI-orange.svg)](https://ai.google.dev/)

**SupportAI** is a customer support automation platform that enables businesses to deploy intelligent, 24/7 AI agents grounded directly in their company knowledge base. Deliver instant answers, resolve queries, and escalate to human agents seamlessly.

---

## ✨ Features

- 🧠 **Dynamic Knowledge Base (RAG):** Upload FAQs, internal documentation, product guides, or link external URLs for instant semantic ingestion.
- 💬 **Embeddable Chat Widget:** Modern, customizable floating chat widget ready to embed into any web property.
- 🛠️ **Visual Agent Builder:** Configure persona, response tone, temperature, guardrails, and custom system prompt instructions.
- 📊 **Real-time Analytics Dashboard:** Track ticket resolution rates, customer sentiment, peak hours, and resolution times with Recharts.
- ❓ **Unanswered Questions Queue:** Identify gaps in support documentation from real user inquiries and train your agent with one click.
- 🤝 **Live Human Escalation:** Smooth handoff mechanism from AI agent to human support team when complex queries arise.
- 🎨 **Modern Design:** Sleek UI with dark mode support, glassmorphism accents, and smooth Motion animations.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Lucide Icons, Recharts
- **Backend:** Node.js, Express, TSX
- **AI Integrations:** Google Gemini API (`@google/genai`) & OpenAI API (`openai`)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/support-ai.git
cd support-ai
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and provide your API keys:
```bash
cp .env.example .env
```

Set your API credentials inside `.env`:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build for Production

```bash
npm run build
npm run start
```

---

## 📄 License
This project is licensed under the MIT License.
