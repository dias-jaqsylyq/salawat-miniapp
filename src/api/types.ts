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

export interface DayBreakdown {
  /** YYYY-MM-DD in the challenge TIMEZONE. */
  date: string;
  total: number;
  metGoal: boolean;
}

export interface RegisteredProgress extends ChallengeMeta {
  registered: true;
  nickname: string;
  /** All-time salawat total. */
  total: number;
  /** Salawat logged today using the challenge TIMEZONE day boundary. */
  todayTotal: number;
  /** Daily salawat target (`users.goal` on the backend). */
  dailyGoal: number;
  /** Consecutive met days (TIMEZONE-aware; see backend streak rules). */
  streak: number;
  /** Past 7 days including today, oldest → newest. */
  last7Days: DayBreakdown[];
  daysLeft: number;
}

export interface LeaderboardEntry {
  nickname: string;
  total: number;
  rank: number;
  telegramId: number;
}

export interface LeaderboardResponse {
  /** Sum of all registered users' all-time totals. */
  jamaatTotal: number;
  leaderboard: LeaderboardEntry[];
}

export interface ProfileResponse {
  nickname: string;
  dailyGoal: number;
  reminderEnabled: boolean;
  /** Effective HH:mm in challenge TIMEZONE. */
  reminderTime: string;
}

export interface ProfileUpdate {
  nickname?: string;
  dailyGoal?: number;
  reminderEnabled?: boolean;
  /** HH:mm, or null to clear override to the global default. */
  reminderTime?: string | null;
}
