import { db, blogPostsTable, wallpapersTable, templatesTable, guidesTable } from "@workspace/db";

const BLOG_IMGS = [
  "https://framerusercontent.com/images/dVyW0kMnnDotk1u5hwmW8b7Rqo.png",
  "https://framerusercontent.com/images/CjRZ7Bi4Hwr2Tgg9Vyp3aaQQGA.png",
  "https://framerusercontent.com/images/hcUrluPToM9nbVrcIY7yVNNFDk.png",
];

const WALLPAPERS_IMG = "https://framerusercontent.com/images/edkUWDLREszDiq4vgt975wDDFM.jpg";
const GUIDES_IMG = "https://framerusercontent.com/images/DTNpaBh0Djuey5Ql5HpaJWi3lWg.jpg";
const TEMPLATES_IMG = "https://framerusercontent.com/images/KkKh1T6zK6twdxDPmlYsFJTj6lg.jpg";

async function seed() {
  const existingPosts = await db.select({ id: blogPostsTable.id }).from(blogPostsTable).limit(1);
  if (existingPosts.length > 0) {
    console.log("Database already seeded, skipping");
    return;
  }

  await db.insert(blogPostsTable).values([
    {
      title: "Ergonomic Essentials: Comfort Meets Productivity",
      slug: "ergonomic-essentials-comfort-meets-productivity",
      excerpt: "Discover how the right setup can transform your productivity and comfort throughout the day.",
      content: "Ergonomics is more than just a buzzword. It's the science of designing your workspace to fit your needs, reducing strain and boosting efficiency.\n\nStart with your chair. Your feet should rest flat on the floor, knees at a 90-degree angle, and lower back supported. Next, position your monitor at arm's length, top of the screen at or slightly below eye level.\n\nYour keyboard and mouse should be close enough that your elbows stay at a comfortable 90-degree angle. Consider a wrist rest if you experience discomfort during long typing sessions.\n\nSmall adjustments lead to big improvements. Take breaks every hour, stretch, and listen to your body.",
      imageUrl: BLOG_IMGS[0],
      author: "Askalm",
      publishedAt: new Date("2026-02-02"),
    },
    {
      title: "5 Color Palettes for Your Workspace",
      slug: "5-color-palettes-for-your-workspace",
      excerpt: "Transform your desk with these carefully curated color schemes.",
      content: "Color has a profound effect on mood and productivity. Here are five palettes that can transform your workspace:\n\n1. Monochrome Minimal – Whites, grays, and black accents for a clean, focused environment.\n\n2. Earth Tones – Warm browns, greens, and terracotta for a grounding, calming atmosphere.\n\n3. Ocean Blue – Various shades of blue with white accents, proven to boost productivity.\n\n4. Warm Neutrals – Beige, cream, and soft brown for a cozy yet professional look.\n\n5. Accent Pop – Neutral base with a single vibrant color (like yellow or coral) for energy.\n\nWhichever you choose, consistency is key. Stick to 2-3 main colors and use accents sparingly.",
      imageUrl: BLOG_IMGS[1],
      author: "Askalm",
      publishedAt: new Date("2026-01-12"),
    },
    {
      title: "Optimizing Wall Space Around Your Desk",
      slug: "optimizing-wall-space-around-your-desk",
      excerpt: "Make the most of vertical space with these practical tips.",
      content: "Your desk might be limited, but your walls offer untapped potential.\n\nShelving is the obvious starting point. Floating shelves keep items accessible without taking up desk space. Use them for plants, books, or decorative pieces that inspire you.\n\nPegboards are incredibly versatile. They can hold everything from stationery to headphones, and they're easy to reconfigure as your needs change.\n\nConsider a magnetic board for notes and inspiration. It keeps important items visible without cluttering your desk surface.\n\nDon't forget about cable management. Route cables along the wall or under your desk to maintain a clean visual line.",
      imageUrl: BLOG_IMGS[2],
      author: "Askalm",
      publishedAt: new Date("2026-01-05"),
    },
  ]);

  await db.insert(wallpapersTable).values([
    { title: "Minimal Dawn", slug: "minimal-dawn", category: "Minimalist", imageUrl: WALLPAPERS_IMG, downloadUrl: "/downloads/minimal-dawn.jpg" },
    { title: "Serene Landscape", slug: "serene-landscape", category: "Nature", imageUrl: WALLPAPERS_IMG, downloadUrl: "/downloads/serene-landscape.jpg" },
    { title: "Abstract Flow", slug: "abstract-flow", category: "Abstract", imageUrl: WALLPAPERS_IMG, downloadUrl: "/downloads/abstract-flow.jpg" },
  ]);

  await db.insert(templatesTable).values([
    { title: "Clean Resume", slug: "clean-resume", category: "Documents", imageUrl: TEMPLATES_IMG, downloadUrl: "/downloads/clean-resume.pdf" },
    { title: "Project Planner", slug: "project-planner", category: "Productivity", imageUrl: TEMPLATES_IMG, downloadUrl: "/downloads/project-planner.pdf" },
    { title: "Meeting Notes", slug: "meeting-notes", category: "Productivity", imageUrl: TEMPLATES_IMG, downloadUrl: "/downloads/meeting-notes.pdf" },
  ]);

  await db.insert(guidesTable).values([
    { title: "Setting Up Your Dream Workspace", slug: "setting-up-dream-workspace", description: "A step-by-step guide to creating the perfect desk setup.", imageUrl: GUIDES_IMG, content: "Step 1: Choose the right desk height...\n\nStep 2: Lighting matters..." },
    { title: "Digital Declutter 101", slug: "digital-declutter-101", description: "Clean up your digital life with these actionable steps.", imageUrl: GUIDES_IMG, content: "Start by organizing your files..." },
  ]);

  console.log("Database seeded successfully");
}

seed().catch(console.error);
