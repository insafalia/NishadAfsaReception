/**
 * Reception invitation content (groom first).
 */
const venueQuery = "AR Kalyana Mandapam, Kozhinjampara";

export const wedding = {
  couple: {
    bride: "Hafsana. N",
    groom: "Mohammed Nishad. S",
    brideArabic: "حفصة",
    groomArabic: "نيشاد",
    shortBride: "Hafsana",
    shortGroom: "Nishad",
    brideLine: "D/o. Mr. Noor Mohammed & Mrs. Haseena",
    groomLine: "S/o. Mr. Sharfudeen. K & Mrs. Rameeja. M. J",
    groomPlace: "M.V Garden, Challapatha, Kozhinjampara",
    monogram: ["N", "H"] as const,
  },

  hosts: {
    names: "Mr. Sharfudeen. K & Mrs. Rameeja. M. J",
    address: "M.V Garden, Challapatha, Kozhinjampara",
    phones: ["9633813311", "9562034549"],
  },

  sharedBy: {
    label: "With love from",
    names: "Sharfudeen & Brothers, Sabana · Akbar Ali, Syed Sanfar, Ashika,",
    place: "Baby Ilhan, Family & Friends",
  },

  welcome: {
    title: "Sharfudeen & Family welcome you",
    place: "M.V Garden, Challapatha, Kozhinjampara",
    phones: ["9633813311", "9562034549"],
  },

  cover: {
    eyebrow: "You're invited",
    greeting: "Dear",
    defaultGuest: "Honoured Guest",
    cta: "Open the Gates",
  },

  card: {
    bismillah: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    bismillahLabel: "Bismillah ir-Rahman ir-Rahim",
    bismillahMeaning: "In the name of Allah, the Most Beneficent and Most Merciful",
    invite: [
      "We cordially invite you and your family",
      "to the Wedding Reception of our son",
    ],
    inshaAllah: "Insha Allah",
    footer: "Your presence will make our evening complete",
  },

  date: "2026-12-07",
  time: "18:00",
  endTime: "21:00",
  timeZoneOffset: "+05:30",
  hijri: { line1: "1448 Ra-Ahir 27", line2: "" },
  timingLabel: "Evening",
  timingText: "6:00 PM – 9:00 PM",

  venue: {
    name: "AR Kalyana Mandapam",
    addressLines: ["Kozhinjampara"],
    mapsUrl: "https://maps.app.goo.gl/m8HNN1fWaZHCtytQ7?g_st=aw",
    embedUrl: `https://www.google.com/maps?q=${encodeURIComponent(venueQuery)}&output=embed`,
    qrLabel: "Get directions",
  },

  scratch: {
    eyebrow: "A sealed invitation",
    cover: "Scratch gently",
    hint: "Your invitation card is hidden underneath",
  },

  countdown: {
    eyebrow: "The evening approaches",
    title: "Counting down",
    today: "Today is the reception — Alhamdulillah!",
    past: "Alhamdulillah, the reception was beautifully celebrated.",
  },



  rsvp: {
    enabled: false,
    eyebrow: "Join us",
    title: "Send your dua",
    whatsapp: "919633813311",
  },

  closing: {
    dua: "بَارَكَ ٱللَّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ",
    duaMeaning: "May Allah bless you both and unite you in goodness.",
    thanks: "With love & duas",
    signoff: "See you there",
  },

  seo: {
    title: "Nishad & Hafsana — Wedding Reception",
    description:
      "Join us for the Wedding Reception of Mohammed Nishad & Hafsana on Monday, 07 December 2026, 6–9 PM at AR Kalyana Mandapam, Kozhinjampara.",
    image: "/images/og.jpg",
  },

  shareMessage:
    "Assalamu Alaikum,\n\n" +
    "You're invited to the Wedding Reception of Nishad & Hafsana.\n\n" +
    "Monday, 07 December 2026 · 6:00 PM – 9:00 PM\n" +
    "AR Kalyana Mandapam, Kozhinjampara\n\n" +
    "We'd love to have you with us.\n\n" +
    "— Nishad & Hafsana",

  printedCard: "/images/invitation-card.jpg",

  music: {
    src: "/music/kun-fayakoon.mp3",
    volume: 0.45,
  },
};

export type Wedding = typeof wedding;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const p2 = (n: number) => String(n).padStart(2, "0");

export const eventStart = (w: Wedding = wedding) =>
  new Date(`${w.date}T${w.time}:00${w.timeZoneOffset}`);
export const eventEnd = (w: Wedding = wedding) =>
  new Date(`${w.date}T${w.endTime}:00${w.timeZoneOffset}`);

const dateParts = (d: string) => {
  const [y, m, day] = d.split("-").map(Number);
  const weekday = new Date(Date.UTC(y, m - 1, day)).getUTCDay();
  return { year: y, month: MONTHS[m - 1], day: p2(day), weekday: DAYS[weekday] };
};
export const weddingDate = dateParts(wedding.date);
export const longDate = `${weddingDate.weekday}, ${weddingDate.day} ${weddingDate.month} ${weddingDate.year}`;
