const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export interface Posting {
  id: number;
  title: string;
  company: string;
  url: string;
  source: string;
}

export async function listPostings(): Promise<Posting[]> {
  const response = await fetch(`${API_URL}/postings`);
  if (!response.ok) {
    throw new Error(`Failed to list postings: ${response.status}`);
  }
  return response.json() as Promise<Posting[]>;
}
