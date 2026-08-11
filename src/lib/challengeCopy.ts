import type { ChallengeStatus } from "../api/types.ts";

export interface DaysLeftFields {
  challengeStatus: ChallengeStatus;
  challengeEndDate: string;
  daysLeft: number;
}

/** Shared Progress / Leaderboard copy for challenge days remaining. */
export function daysLeftCopy(progress: DaysLeftFields): string {
  if (progress.challengeStatus === "ended") {
    return `Challenge ended on ${progress.challengeEndDate}.`;
  }
  if (progress.daysLeft === 0) {
    return "Today is the last day!";
  }
  return `${progress.daysLeft} day${progress.daysLeft === 1 ? "" : "s"} left in the challenge.`;
}
