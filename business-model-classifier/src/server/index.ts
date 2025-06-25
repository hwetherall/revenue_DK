/**
 * Fastify bootstrap for the Business-Model Classifier MVP.
 * Run with:  npx ts-node-dev src/server/index.ts
 */
import 'dotenv/config'; // This will load .env file automatically
import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import classifyRoutes from './routes/classify';
import uploadRoutes from './routes/upload';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

async function buildServer() {
  const app = Fastify({ logger: true });
  
  // Update CORS to allow your Vercel frontend
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://business-model-classifier.vercel.app'
  ].filter(Boolean);
  
  await app.register(cors, { 
    origin: (origin, cb) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return cb(null, true);
      
      // Allow any Vercel preview deployments
      if (origin.includes('vercel.app')) return cb(null, true);
      
      // Check against allowed origins
      if (allowedOrigins.includes(origin)) return cb(null, true);
      
      // Reject other origins
      cb(new Error('Not allowed by CORS'), false);
    },
    credentials: true
  });
  
  await app.register(multipart, {
    // Configure multipart limits for larger PDF files
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB max file size
      files: 1, // Allow 1 file upload
      fieldSize: 1024 * 1024, // 1MB field size
      fields: 10 // Max 10 fields
    }
  });
  
  // Health check endpoint
  app.get('/health', async (_request, _reply) => {
    return { status: 'ok', message: 'Server is running' };
  });
  
  // Test endpoint to check AI configuration
  app.get('/test-ai', async (_request, _reply) => {
    const provider = process.env.API_PROVIDER || 'openrouter';
    const model = process.env.LLM_MODEL || (provider === 'groq' ? 'llama3-8b-8192' : 'openai/gpt-4o-mini');
    return { 
      provider,
      model,
      hasApiKey: provider === 'groq' 
        ? !!process.env.VITE_GROQ_API_KEY 
        : !!process.env.VITE_OPENROUTER_API_KEY
    };
  });
  
  await app.register(classifyRoutes, { prefix: '/classify' });
  await app.register(uploadRoutes, { prefix: '/upload' });

  return app;
}

buildServer()
  .then((app) =>
    app.listen({ port: PORT, host: '0.0.0.0' }, (err, address) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`Server listening at ${address}`);
    }),
  )
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
