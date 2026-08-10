import type { LeaderboardResponse, LogResponse, ProgressResponse, RegisterResponse } from "./types.ts";

const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string
  ) {
    super(`API error ${status}: ${code}`);
  }
}

async function request<T>(initData: string, path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `tma ${initData}`,
    },
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, body?.error ?? "unknown_error");
  }
  return body as T;
}

export function register(initData: string, nickname: string, goal: number): Promise<RegisterResponse> {
  return request(initData, "/api/register", {
    method: "POST",
    body: JSON.stringify({ nickname, goal }),
  });
}

export function logSalawat(initData: string, count: number): Promise<LogResponse> {
  return request(initData, "/api/log", {
    method: "POST",
    body: JSON.stringify({ count }),
  });
}

export function getProgress(initData: string): Promise<ProgressResponse> {
  return request(initData, "/api/progress");
}

export function getLeaderboard(initData: string): Promise<LeaderboardResponse> {
  return request(initData, "/api/leaderboard");
}
