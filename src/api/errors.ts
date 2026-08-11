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
    case "invalid_reminder_enabled":
      return "Reminder setting is invalid.";
    case "invalid_reminder_time":
      return "Enter a valid reminder time (HH:mm).";
    case "invalid_body":
      return "Nothing to save — change something first.";
    case "rate_limited":
      return "You're doing that too fast — wait a moment and try again.";
    case "not_registered":
      return "Please register first.";
    case "not_admin":
      return "This account does not have admin access.";
    case "broadcast_in_progress":
      return "Another broadcast is still sending — wait for it to finish.";
    case "invalid_message":
      return "Enter a message before sending.";
    case "invalid_link":
      return "Enter a valid HTTP or HTTPS link.";
    case "invalid_file_url":
      return "Enter a valid HTTPS document link.";
    case "invalid_file":
    case "invalid_pdf":
      return "Choose a valid PDF file.";
    case "file_too_large":
      return "PDF must be 20 MB or smaller.";
    case "invalid_caption":
      return "The caption is too long.";
    case "missing_init_data":
    case "invalid_init_data":
      return "Telegram session expired — close and reopen the app from the bot menu.";
    default:
      return fallback;
  }
}
