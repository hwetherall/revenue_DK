# Business Model Classifier

An AI-powered app that classifies business models across 4 key dimensions using parallel AI agents.

## Features

- **Customer Segment Classification**: B2C, B2B-SME, B2B-Enterprise, B2G
- **Revenue Model Analysis**: Subscription, Licensing, Commission, Fee-for-Service, etc.
- **Architecture Classification**: Platform vs Pipeline business models
- **Product Type Analysis**: Physical Goods, Digital Goods, Services, Hybrid

## Tech Stack

- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: Fastify + TypeScript
- **AI**: OpenAI API (via OpenRouter)
- **Validation**: Zod

## Setup Instructions

### 1. Install Dependencies

```bash
cd business-model-classifier
npm install
```

### 2. Environment Configuration

Create a `.env` file in the project root:

```bash
# OpenRouter API Key (for accessing various models via OpenRouter)
VITE_OPENROUTER_API_KEY=sk-or-v1-your_openrouter_key_here

# Groq API Key (for fast inference, alternative to OpenRouter)
VITE_GROQ_API_KEY=gsk_your_groq_key_here

# Optional: Specify which API provider to use (openrouter or groq)
# Defaults to 'openrouter'
API_PROVIDER=openrouter

# Optional: Specify which model to use
# For OpenRouter: openai/gpt-4o-mini, anthropic/claude-3-haiku, etc.
# For Groq: llama3-8b-8192, mixtral-8x7b-32768, etc.
# Defaults to openai/gpt-4o-mini (OpenRouter) or llama3-8b-8192 (Groq)
LLM_MODEL=openai/gpt-4o-mini

# Optional: Server port (defaults to 3001)
PORT=3001
```

**API Provider Options:**
- **OpenRouter**: Access to multiple AI models including GPT-4, Claude, Llama, etc.
- **Groq**: Ultra-fast inference with Llama and Mixtral models

**Switching API Providers:**
```bash
# Use OpenRouter (default)
API_PROVIDER=openrouter
LLM_MODEL=openai/gpt-4o-mini

# Use Groq for faster responses
API_PROVIDER=groq
LLM_MODEL=llama3-8b-8192
```

### 3. Start Development Server

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:server  # Backend on http://localhost:3001
npm run dev:client  # Frontend on http://localhost:5173
```

## Usage

1. Open your browser to `http://localhost:5173`
2. Enter a business name and description
3. Click "Classify" to get AI analysis across all 4 dimensions
4. View results in the comprehensive classification table

## API Endpoints

### POST `/classify`

Classifies a business across all dimensions.

**Request Body:**
```json
{
  "name": "Business Name",
  "description": "Detailed business description..."
}
```

**Response:**
```json
{
  "customer": {
    "main": "B2B-SME",
    "other": ["B2C"],
    "justification": "Primarily targets small businesses..."
  },
  "revenue": {
    "main": "Subscription",
    "other": ["Commission"],
    "justification": "Monthly recurring revenue model..."
  },
  "architecture": {
    "main": "Platform",
    "other": [],
    "justification": "Connects multiple parties..."
  },
  "productType": {
    "main": "Digital Goods",
    "other": ["Service"],
    "justification": "Software-based solution..."
  }
}
```

## Project Structure

```
src/
├── client/          # React frontend
│   ├── components/  # UI components
│   ├── lib/        # API client
│   └── main.tsx    # Entry point
└── server/         # Fastify backend
    ├── prompts/    # AI agent prompts
    ├── routes/     # API routes
    └── types.ts    # Shared types
```

## Building for Production

```bash
npm run build
npm start
``` 