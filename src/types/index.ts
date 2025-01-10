export interface VideoSummary {
  id: string;
  youtube_url: string;
  summary: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
}