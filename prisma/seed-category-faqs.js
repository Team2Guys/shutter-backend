import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../generated/prisma/client.js";

/**
 * One-off seed: copy the client-supplied category FAQs into the database so
 * they can be edited and re-ordered from the dashboard (Categories → FAQs).
 *
 * The content below mirrors the static arrays in
 * shutters-new-frontend/src/data/page-faqs.ts, which the public site still
 * uses as a fallback when the API cannot be reached.
 *
 * Idempotent: a category that already has FAQs is left untouched so admin
 * edits are never overwritten. Pass --force to overwrite anyway.
 *
 *   node prisma/seed-category-faqs.js [--force]
 */

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const force = process.argv.includes("--force");

/** https://shutters.ae/shutters-by-room/ */
const shuttersByRoomFaqs = [
  {
    question: "Which rooms can I fit with plantation shutters?",
    answer: `Our made-to-measure shutters suit every space in your home — living rooms, bedrooms, kitchens, bathrooms, dining and study rooms. Each one is tailored to that room's light, privacy, heat and moisture needs. Browse all <a href="/shutters-by-room/">shutters by room</a> to begin.`,
  },
  {
    question: "Are shutters suitable for humid bathrooms in Dubai?",
    answer: `Yes. Our <a href="/shutters-by-room/bathroom-shutters/">bathroom shutters</a> are built from moisture-resistant materials such as PVC and ABS, so they won't warp, swell, rust, or fade in steam and humidity, while still giving you full privacy and easy, wipe-clean light control every day.`,
  },
  {
    question: "Can bedroom shutters help me sleep better?",
    answer: `Definitely. <a href="/shutters-by-room/bedroom-shutters/">Bedroom shutters</a> close tightly to block out harsh morning light and street glare, and the adjustable louvres let you fine-tune privacy and airflow — creating a darker, calmer and cooler space for a deeper night's sleep.`,
  },
  {
    question: "What shutters work best in a kitchen?",
    answer: `Our <a href="/shutters-by-room/kitchen-shutters/">kitchen shutters</a> are practical yet stylish — the wipe-clean surfaces easily shrug off grease, splashes and steam, and the tilting louvres control heat and daylight over sinks and worktops, with no fabric to trap cooking odours.`,
  },
  {
    question: "How do I choose shutters for my living room?",
    answer: `<a href="/shutters-by-room/living-room-shutters/">Living room shutters</a> balance elegant style with easy, everyday light control for your main space. Pair your room choice with a style such as <a href="/shutters-by-style/full-height-wooden-shutters/">full-height</a> or <a href="/shutters-by-style/tier-on-tier-window-shutters/">tier-on-tier</a> shutters for a clean, tailored finish.`,
  },
  {
    question: "Are room shutters made-to-measure?",
    answer: `Yes — every shutter is custom-built to your exact window, so each room enjoys a flawless, gap-free fit. Our own team takes precise measurements during a free home visit before we manufacture and install. <a href="/request-appointment/">Book a free visit</a> to get started today.`,
  },
  {
    question: "How can I get a price for my room shutters?",
    answer: `Use our online <a href="/estimator/">estimator</a> for a quick guide price based on your window size and material, then <a href="/request-appointment/">book a free home visit</a> for an exact, made-to-measure quote covering any room in your home. Every home visit is completely free.`,
  },
];

/** https://shutters.ae/shutters-by-style/ */
const shuttersByStyleFaqs = [
  {
    question: "What shutter styles do you offer?",
    answer: `We offer 11 shutter styles — full-height, tier-on-tier, café, solid panel, tracked, bay window, bi-fold, bypass, special shape, outdoor, and roller. Browse all <a href="/shutters-by-style/">shutters by style</a> to compare their looks, features, and functions side by side.`,
  },
  {
    question: "What's the difference between full-height and tier-on-tier shutters?",
    answer: `<a href="/shutters-by-style/full-height-wooden-shutters/">Full-height shutters</a> form one clean, unbroken panel from top to bottom for a sleek, modern look, while <a href="/shutters-by-style/tier-on-tier-window-shutters/">tier-on-tier</a> splits into two separate panels — so you can open the top for light and keep the bottom closed for privacy.`,
  },
  {
    question: "Which style gives privacy without losing daylight?",
    answer: `<a href="/shutters-by-style/cafe-style-shutters/">Café style shutters</a> cover only the lower half of the window, giving you street-level privacy while daylight streams freely in above — an ideal choice for ground-floor rooms, dining areas, kitchens and busy roadside windows.`,
  },
  {
    question: "Do you have shutters for large windows or doors?",
    answer: `Yes. <a href="/shutters-by-style/tracked-plantation-shutters/">Tracked</a>, <a href="/shutters-by-style/bypass-shutters/">bypass</a> and <a href="/shutters-by-style/bi-fold-shutters/">bi-fold shutters</a> glide or fold away neatly along a track, making them perfect for wide windows, sliding patio doors, room dividers and large openings where hinged panels aren't practical.`,
  },
  {
    question: "Can shutters fit arched or angled windows?",
    answer: `Absolutely. Our <a href="/shutters-by-style/special-shape-wooden-shutters/">special-shape shutters</a> are custom-cut to fit arches, triangles, circles and angled tops, while <a href="/shutters-by-style/bay-window-wooden-shutters/">bay window shutters</a> are precisely angled to follow the shape of your bay for a seamless, tailored finish.`,
  },
  {
    question: "Are there shutters for outdoor or balcony use?",
    answer: `Yes. <a href="/shutters-by-style/outdoor-shutters/">Outdoor shutters</a> are made from tough, weather-resistant materials that handle strong sun, heat, dust and humidity, while <a href="/shutters-by-style/roller-shutters/">roller shutters</a> add extra shade, insulation, privacy and security for balconies, terraces and exposed windows.`,
  },
  {
    question: "How do I pick the right style for my room?",
    answer: `Match the style to each room's purpose — see real ideas on our <a href="/shutters-by-room/">shutters by room</a> pages, then <a href="/request-appointment/">book a free home visit</a> and our friendly team will measure up and recommend the best style, material and fit for your windows, free of charge.`,
  },
  {
    question: "How much do shutters cost for each style?",
    answer: `Prices vary by style, size, and material — <a href="/shutters-by-style/full-height-wooden-shutters/">full-height</a>, <a href="/shutters-by-style/tier-on-tier-window-shutters/">tier-on-tier</a>, and <a href="/shutters-by-style/special-shape-wooden-shutters/">special-shape</a> shutters each differ. Get a quick guide price from our online <a href="/estimator/">estimator</a>, then <a href="/request-appointment/">book a free home visit</a> for an exact made-to-measure quote.`,
  },
  {
    question: "What warranty do you offer on your shutters?",
    answer: `All our made-to-measure shutters carry a 5-year warranty when fitted by our own team. Covering every style, from full-height to <a href="/shutters-by-style/tracked-plantation-shutters/">tracked plantation shutters</a>, it gives Dubai homeowners lasting peace of mind on quality and installation.`,
  },
  {
    question: "How do I clean and maintain shutters?",
    answer: `Easy: dust the louvres regularly and wipe with a soft, damp cloth. Our solid hardwood shutters are low-maintenance and built for Dubai homes; for kitchens and <a href="/shutters-by-room/bathroom-shutters/">bathrooms</a>, choose waterproof styles that resist humidity beautifully.`,
  },
];


/** Category `path` → FAQs to seed. */
const SEED = {
  "shutters-by-room": shuttersByRoomFaqs,
  "shutters-by-style": shuttersByStyleFaqs,
};

async function main() {
  for (const [path, faq] of Object.entries(SEED)) {
    const category = await prisma.category.findUnique({
      where: { path },
      select: { id: true, name: true, faq: true },
    });
    if (!category) {
      console.warn(`skip  ${path}: no category with this path`);
      continue;
    }
    if (category.faq.length > 0 && !force) {
      console.log(`keep  ${path}: already has ${category.faq.length} FAQ(s) (use --force to overwrite)`);
      continue;
    }
    await prisma.category.update({
      where: { id: category.id },
      data: { faq, lastEditedBy: "seed:category-faqs" },
    });
    console.log(`seed  ${path}: wrote ${faq.length} FAQ(s)`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
