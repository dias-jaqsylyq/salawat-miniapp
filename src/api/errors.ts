import { ApiError } from "./client.ts";

/** Map API error codes to short user-facing copy. */
export function messageForApiError(err: unknown, fallback: string): string {
  if (!(err instanceof ApiError)) {
    return "Network error — please try again.";
  }

  switch (err.code) {
    case "challenge_not_started":
      return "The challenge hasn't started yet.";
    case "challenge_ended":
      return "The challenge has ended.";
    case "invalid_count":
      return "Enter a whole number between 1 and 10,000.";
    case "invalid_goal":
      return "Enter a valid positive daily goal.";
    case "invalid_nickname":
      return "Nickname must be 1–50 characters.";
    case "nickname_taken":
      return "That nickname is taken — try another.";
    case "rate_limited":
      return "You're logging too fast — wait a moment and try again.";
    case "not_registered":
      return "Please register first.";
    case "missing_init_data":
    case "invalid_init_data":
      return "Telegram session expired — close and reopen the app from the bot menu.";
    default:
      return fallback;
  }
}
