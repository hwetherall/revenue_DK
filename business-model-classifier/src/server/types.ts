import { z } from 'zod';

export const AgentResultSchema = z.object({
  main: z.string(),
  other: z.array(z.string()).optional().default([]),
  justification: z.string(),
});

export type AgentResult = z.infer<typeof AgentResultSchema>;
