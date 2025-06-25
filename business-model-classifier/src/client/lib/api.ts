export interface AgentResult {
    main: string;
    other?: string[];
    justification: string;
  }
  
  export interface ClassificationResponse {
    customer: AgentResult;
    revenue: AgentResult;
    architecture: AgentResult;
    industry: AgentResult;
  }
  
  /**
   * Calls the backend POST /classify endpoint.
   * Adjust the URL or add a Vite proxy if your server runs on a different port.
   */
  export async function classifyBusiness(
  name: string,
  description: string,
): Promise<ClassificationResponse> {
  const res = await fetch('/classify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(
      errorData.message || `Server error (${res.status}): ${res.statusText}`
    );
  }

  return res.json() as Promise<ClassificationResponse>;
}
  