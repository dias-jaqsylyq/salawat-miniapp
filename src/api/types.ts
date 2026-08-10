export interface RegisterResponse {
  success: true;
  user: { id: number; nickname: string; goal: number };
}

export interface LogResponse {
  success: true;
  newTotal: number;
}

export type ProgressResponse = { registered: false } | RegisteredProgress;

export interface RegisteredProgress {
  registered: true;
  nickname: string;
  total: number;
  goal: number;
  percentComplete: number;
  daysLeft: number;
}

export interface LeaderboardEntry {
  nickname: string;
  total: number;
  rank: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
}
