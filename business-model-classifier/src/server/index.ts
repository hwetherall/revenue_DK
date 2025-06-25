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
  await app.register(cors, { origin: true });
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
  app.get('/health', async (request, reply) => {
    return { status: 'ok', message: 'Server is running' };
  });
  
  // Test endpoint to check AI configuration
  app.get('/test-ai', async (request, reply) => {
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
