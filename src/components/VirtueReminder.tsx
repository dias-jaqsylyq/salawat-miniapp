import { todaysReminder, type VirtueReminder } from "../lib/reminders.ts";

const ARABIC_FONT =
  "Scheherazade New, Amiri, 'Noto Naskh Arabic', serif";

function ReminderBody({ reminder }: { reminder: VirtueReminder }) {
  if (reminder.kind === "ayah") {
    return (
      <>
        <p
          lang="ar"
          dir="rtl"
          className="text-2xl leading-relaxed text-foreground"
          style={{ fontFamily: ARABIC_FONT }}
        >
          {reminder.arabic}
        </p>
        <p className="text-sm text-muted-foreground">{reminder.english}</p>
        <p className="text-xs text-muted-foreground">{reminder.reference}</p>
      </>
    );
  }

  return (
    <>
      <p className="text-sm text-muted-foreground">{reminder.english}</p>
      <p className="text-sm text-muted-foreground">— {reminder.narrator}</p>
      <p className="text-xs text-muted-foreground">{reminder.reference}</p>
    </>
  );
}

export default function VirtueReminder() {
  const reminder = todaysReminder();

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Today&apos;s reminder
      </p>
      <section className="space-y-3 rounded-lg bg-secondary/30 px-4 py-5 text-center">
        <ReminderBody reminder={reminder} />
      </section>
    </div>
  );
}
