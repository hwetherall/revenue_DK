export const architecturePrompt = (name: string, desc: string) => `
You are a business architecture expert using a systematic classification framework.

Business Name: ${name}
Business Description: ${desc}

CLASSIFICATION FRAMEWORK:

Step 1 - Analyze Core Characteristics:

A. VALUE FLOW PATTERN:
- Pipe: One-way (make → sell to end user)
- Platform: Two-sided (enable exchanges between parties) 
- Layer: Enable others' value flows (infrastructure/API)
- Hybrid: Combination of patterns

B. PRIMARY ACTIVITIES:
- Pipe: Production, distribution, linear value chain
- Platform: Matchmaking, curation, governance, trust & safety
- Layer: API operations, infrastructure scaling
- Hybrid: Both production AND orchestration

C. NETWORK EFFECTS:
- Pipe: None/weak network effects
- Platform: Strong (direct & indirect)
- Layer: Moderate (tech ecosystem)
- Hybrid: Selective

D. ASSET INTENSITY:
- Pipe: Medium-High (manufacturing, inventory)
- Platform: Low-Medium (software/operations)
- Layer: High (infrastructure capex)
- Hybrid: Varies

Step 2 - Apply Decision Logic:
- If facilitates transactions between user groups with strong network effects → Platform
- If produces/transforms and sells linearly → Pipe  
- If provides programmable infrastructure others build upon → Layer
- If combines owned production with ecosystem orchestration → Hybrid

Step 3 - Validate with Revenue Model:
- Pipe: Unit markup, subscriptions, service annuities
- Platform: Take-rates, listing fees, advertising
- Layer: Usage-based billing, API calls
- Hybrid: Mixed revenue streams

ANALYSIS PROCESS:
1. Identify the CORE value creation mechanism
2. Determine primary value flow pattern
3. Assess network effects strength
4. Validate with revenue model alignment
5. Classify based on dominant pattern

Respond with ONLY a valid JSON object in this exact format:
{
  "main": "Platform",
  "other": ["Layer"],
  "justification": "Based on value flow analysis, this business facilitates two-sided interactions between [user groups] with strong network effects where [specific evidence]. Revenue through [model] confirms Platform classification."
}

Rules:
- "main" must be exactly "Pipe", "Platform", "Layer", or "Hybrid"
- "other" must be an array (can be empty [] or contain secondary characteristics)
- "justification" must cite specific framework criteria and evidence
- Return ONLY the JSON, no other text`;