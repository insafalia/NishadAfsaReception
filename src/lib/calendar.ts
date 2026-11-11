import { eventEnd, eventStart, wedding, type Wedding } from "@/data/wedding";

const p2 = (n: number) => String(n).padStart(2, "0");
const utcStamp = (d: Date) =>
  `${d.getUTCFullYear()}${p2(d.getUTCMonth() + 1)}${p2(d.getUTCDate())}T${p2(d.getUTCHours())}${p2(d.getUTCMinutes())}00Z`;

const title = (w: Wedding) => `Wedding Reception of ${w.couple.groom} & ${w.couple.bride}`;
const location = (w: Wedding) => `${w.venue.name}, ${w.venue.addressLines.join(" ").replace(/\.$/, "")}`;
const details = (w: Wedding) =>
  `Insha Allah, join us for the Wedding Reception. ${w.timingText}.\nDirections: ${w.venue.mapsUrl}`;

export const googleCalendarUrl = (w: Wedding = wedding) => {
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: title(w),
    dates: `${utcStamp(eventStart(w))}/${utcStamp(eventEnd(w))}`,
    location: location(w),
    details: details(w),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
};

const esc = (s: string) =>
  s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export const icsContent = (w: Wedding = wedding) =>
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Reception Invitation Modern//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:reception-modern-${w.date}@invitation`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(eventStart(w))}`,
    `DTEND:${utcStamp(eventEnd(w))}`,
    `SUMMARY:${esc(title(w))}`,
    `LOCATION:${esc(location(w))}`,
    `DESCRIPTION:${esc(details(w))}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(title(w))} tomorrow`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

export function downloadIcs(w: Wedding = wedding) {
  const blob = new Blob([icsContent(w)], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reception-invitation.ics";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
