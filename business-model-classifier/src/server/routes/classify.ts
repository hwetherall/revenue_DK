 /**
 * POST /classify
 * Body: { name: string; description: string }
 * Returns: {
 *   customer:   AgentResult;
 *   revenue:    AgentResult;
 *   architecture: AgentResult;
 *   industry:  AgentResult;
 * }
 */

import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { OpenAI } from 'openai';
import pRetry from 'p-retry';
import { z } from 'zod';
import { customerPrompt } from '../prompts/customerPrompt';
import { revenuePrompt } from '../prompts/revenuePrompt';
import { architecturePrompt } from '../prompts/architecturePrompt';
import { industryPrompt } from '../prompts/productTypePrompt';
import { AgentResultSchema } from '../types';

// API Configuration - supports both OpenRouter and Groq
type ApiProvider = 'openrouter' | 'groq';
const API_PROVIDER = (process.env.API_PROVIDER === 'openrouter' ? 'openrouter' : 'groq') as ApiProvider;
const OPENROUTER_KEY = process.env.VITE_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
const GROQ_KEY = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;

// API keys are loaded successfully

// Configure OpenAI client based on provider
const selectedKey = API_PROVIDER === 'groq' ? GROQ_KEY : OPENROUTER_KEY;
if (!selectedKey) {
  console.error(`No API key found for provider ${API_PROVIDER}`);
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('API') || key.includes('VITE')));
}

const openai = new OpenAI({
  apiKey: selectedKey || 'dummy-key-for-mock-testing',
  baseURL: API_PROVIDER === 'groq' ? 'https://api.groq.com/openai/v1' : 'https://openrouter.ai/api/v1',
});

// Default models for each provider
const DEFAULT_MODELS: Record<ApiProvider, string> = {
  openrouter: 'openai/gpt-4o-mini',
  groq: 'meta-llama/llama-4-maverick-17b-128e-instruct'
};

const MODEL = process.env.LLM_MODEL ?? DEFAULT_MODELS[API_PROVIDER];

export default async function classifyRoutes(
  app: FastifyInstance,
  _opts: FastifyPluginOptions,
) {
  /* ---------- Request body validation ---------- */
  const InputSchema = z.object({
    name: z.string().min(1),
    description: z.string().min(10),
  });

  /* ---------- Helpers ---------- */
  type AgentFn = (name: string, desc: string) => Promise<z.infer<typeof AgentResultSchema>>;

  const callLLM = async (prompt: string, agentName: string) =>
    pRetry(
      async () => {
        console.log(`\n=== ${agentName} Agent ===`);
        console.log('Model:', MODEL);
        console.log('Provider:', API_PROVIDER);
        
        const chat = await openai.chat.completions.create({
          model: MODEL,
          messages: [
            { 
              role: 'system', 
              content: 'You are a business analyst. Always respond with ONLY valid JSON. No explanations, no markdown, just the JSON object.' 
            },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
        });
        
        const raw = chat.choices[0]?.message?.content ?? '{}';
        console.log(`Raw ${agentName} response:`, raw);
        
        // Clean the response - remove markdown code blocks if present
        const cleaned = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        console.log(`Cleaned ${agentName} response:`, cleaned);
        
        try {
          const parsed = JSON.parse(cleaned);
          console.log(`Parsed ${agentName} response:`, parsed);
          return AgentResultSchema.parse(parsed);
        } catch (parseError) {
          console.error(`Failed to parse ${agentName} response:`, cleaned);
          console.error('Parse error:', parseError);
          throw new Error(`Invalid JSON from AI: ${cleaned.substring(0, 200)}...`);
        }
      },
      { retries: 3, minTimeout: 500 },
    );

  const customerAgent: AgentFn = (n, d) => callLLM(customerPrompt(n, d), 'Customer');
  const revenueAgent: AgentFn = (n, d) => callLLM(revenuePrompt(n, d), 'Revenue');
  const architectureAgent: AgentFn = (n, d) => callLLM(architecturePrompt(n, d), 'Architecture');
  const industryAgent: AgentFn = (n, d) => callLLM(industryPrompt(n, d), 'Industry');

  /* ---------- Route ---------- */
  app.post('/', async (request, reply) => {
    try {
      // Validate incoming body
      const { name, description } = InputSchema.parse(request.body);

      // Check if API key is available
      const currentKey = API_PROVIDER === 'groq' ? GROQ_KEY : OPENROUTER_KEY;
      if (!currentKey) {
        throw new Error(`API key not found for provider: ${API_PROVIDER}`);
      }

      // Run four agents in parallel
      const [customer, revenue, architecture, industry] = await Promise.all([
        customerAgent(name, description),
        revenueAgent(name, description),
        architectureAgent(name, description),
        industryAgent(name, description),
      ]);

      reply.send({ customer, revenue, architecture, industry });
          } catch (error) {
      console.error('Classification error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes('Invalid JSON')) {
          errorMessage = 'AI returned invalid response format. Please try again.';
        } else if (error.message.includes('API key')) {
          errorMessage = 'API key configuration error. Please check your .env file.';
        }
      }
      
      reply.status(500).send({ 
        error: 'Classification failed', 
        message: errorMessage,
        provider: API_PROVIDER,
        details: process.env.NODE_ENV === 'development' ? error : undefined
      });
    }
  });
}
