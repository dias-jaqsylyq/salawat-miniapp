export type ChallengeStatus = "not_started" | "active" | "ended";

export interface ChallengeMeta {
  challengeStatus: ChallengeStatus;
  challengeStartDate: string;
  challengeEndDate: string;
}

export interface RegisterResponse {
  success: true;
  user: { id: number; nickname: string; goal: number };
}

export interface LogResponse {
  success: true;
  newTotal: number;
  /** Salawat logged today (challenge TIMEZONE day boundary), after this log. */
  newTodayTotal: number;
}

export type ProgressResponse =
  | ({ registered: false } & ChallengeMeta)
  | RegisteredProgress;

export interface RegisteredProgress extends ChallengeMeta {
  registered: true;
  nickname: string;
  total: number;
  /** Salawat logged today using the challenge TIMEZONE day boundary. */
  todayTotal: number;
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
