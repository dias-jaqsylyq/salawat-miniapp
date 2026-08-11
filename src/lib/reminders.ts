/** Match salawat-bot default TIMEZONE so "today" aligns with Progress. */
const CHALLENGE_TIMEZONE = "Asia/Hong_Kong";

export type AyahReminder = {
  kind: "ayah";
  arabic: string;
  english: string;
  reference: string;
};

export type HadithReminder = {
  kind: "hadith";
  english: string;
  narrator: string;
  reference: string;
};

export type VirtueReminder = AyahReminder | HadithReminder;

/** Verbatim ayah/hadith reminders — do not paraphrase. */
export const REMINDERS: readonly VirtueReminder[] = [
  {
    kind: "ayah",
    arabic:
      "إِنَّ ٱللَّهَ وَمَلَـٰٓئِكَتَهُۥ يُصَلُّونَ عَلَى ٱلنَّبِىِّ ۚ يَـٰٓأَيُّهَا ٱلَّذِينَ ءَامَنُوا۟ صَلُّوا۟ عَلَيْهِ وَسَلِّمُوا۟ تَسْلِيمًا",
    english:
      "Indeed, Allah confers blessing upon the Prophet, and His angels [ask Him to do so]. O you who have believed, ask [Allah to confer] blessing upon him and ask [Allah to grant him] peace.",
    reference: "Qur'an 33:56",
  },
  {
    kind: "hadith",
    english: "Whoever sends blessings upon me once, Allah will send blessings upon him ten times.",
    narrator: "Abu Huraira",
    reference: "Sahih Muslim 408",
  },
  {
    kind: "hadith",
    english: "The miser is one in whose presence I am mentioned, but he does not send blessings upon me.",
    narrator: "'Ali ibn Abi Talib",
    reference: "Jami' at-Tirmidhi 3546",
  },
  {
    kind: "hadith",
    english:
      "When one of you prays, let him begin by praising and glorifying Allah, then send blessings upon the Prophet, then supplicate for whatever he wishes.",
    narrator: "Fadalah ibn 'Ubayd",
    reference: "Jami' at-Tirmidhi 3477",
  },
] as const;

function gregorianPartsInTimezone(
  now: Date,
  timeZone: string,
): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value);

  return { year: get("year"), month: get("month"), day: get("day") };
}

/** Deterministic daily index: same HKT calendar day → same reminder for all users. */
export function reminderIndexForDate(now: Date = new Date()): number {
  const { year, month, day } = gregorianPartsInTimezone(now, CHALLENGE_TIMEZONE);
  const epochDay = Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
  return ((epochDay % REMINDERS.length) + REMINDERS.length) % REMINDERS.length;
}

export function todaysReminder(now: Date = new Date()): VirtueReminder {
  return REMINDERS[reminderIndexForDate(now)]!;
}
