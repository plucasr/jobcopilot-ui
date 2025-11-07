const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new ApiError(body.detail ?? `Request failed: ${response.status}`, response.status);
  }
  return response.json() as Promise<T>;
}

export interface Posting {
  id: number;
  title: string;
  company: string;
  url: string;
  source: string;
}

export interface Score {
  posting_id: number;
  score: number;
  reasons: string[];
  model: string;
}

export interface Trace {
  step: string;
  detail: string;
  created_at: string;
}

export interface Letter {
  id: number;
  posting_id: number;
  content: string;
}

export const listPostings = () => request<Posting[]>("/postings");
export const listScores = () => request<Score[]>("/scores");
export const listTraces = (postingId: number) => request<Trace[]>(`/postings/${postingId}/traces`);
export const listLetters = (postingId: number) => request<Letter[]>(`/postings/${postingId}/letters`);
export const scorePosting = (postingId: number) =>
  request<Score>(`/postings/${postingId}/score`, { method: "POST" });
