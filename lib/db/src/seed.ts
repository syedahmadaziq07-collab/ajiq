import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;
import { wallpapers, templates } from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

const wallpaperSeeds = [
  { id: 1, description: "Minimal mountain landscape with clean lines and soft gradients", content: "High resolution 4K\nOptimized for all devices\nMinimal color palette\nInstant download" },
  { id: 2, description: "Abstract geometric shapes with smooth transitions", content: "4K Ultra HD\nGeometric pattern\nMultiple color variants\nReady to use" },
  { id: 3, description: "Dark minimal wallpaper with subtle gradient", content: "Dark mode optimized\nOLED friendly\n4K resolution\nEye comfort" },
  { id: 4, description: "Clean and modern wallpaper with pastel tones", content: "Pastel color palette\nHigh resolution\nVersatile design\nPrintable" },
  { id: 5, description: "Simple elegant design with nature-inspired elements", content: "Nature theme\n4K quality\nCalm aesthetic\nDevice agnostic" },
];

const templateSeeds = [
  { id: 1, description: "Modern resume template with clean typography", content: "ATS friendly\nFully editable\nPrint ready\nCustom sections" },
  { id: 2, description: "Creative portfolio template for designers", content: "Showcase your work\nBuilt-in lightbox\nMobile responsive\nEasy to customize" },
  { id: 3, description: "Professional business card template", content: "Print ready CMYK\nDual sided\nBleed marks included\nMultiple formats" },
  { id: 4, description: "Social media kit with consistent branding", content: "All platform sizes\nBrand guidelines\nEditable assets\nColor coded" },
  { id: 5, description: "Minimal presentation deck template", content: "16:9 widescreen\nCustom animations\nMaster slides\nIcon pack included" },
];

async function main() {
  console.log("Seeding wallpapers...");
  for (const s of wallpaperSeeds) {
    await db.update(wallpapers).set({ description: s.description, content: s.content }).where(eq(wallpapers.id, s.id));
    console.log(`  wallpaper id=${s.id}`);
  }

  console.log("Seeding templates...");
  for (const s of templateSeeds) {
    await db.update(templates).set({ description: s.description, content: s.content }).where(eq(templates.id, s.id));
    console.log(`  template id=${s.id}`);
  }

  console.log("Done!");
  await pool.end();
}

import { eq } from "drizzle-orm";
main().catch((e) => { console.error(e); process.exit(1); });
