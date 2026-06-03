import { execSync } from "child_process";
import { mkdirSync, rmSync, writeFileSync } from "fs";

const isApi = process.env.API_PROJECT === "true";

if (isApi) {
  console.log("=== Building API server ===");
  execSync("node ./build.mjs", { stdio: "inherit", shell: true });
  // Copy the bundled Express app into the api/ directory so Vercel can access it
  mkdirSync("api", { recursive: true });
  execSync("cp dist/api/vercel-entry.mjs api/vercel-entry.mjs", { shell: true });
  writeFileSync("api/[...slug].mjs", `export { default } from "./vercel-entry.mjs";\n`);
} else {
  console.log("=== Building frontend (website) ===");
  rmSync("dist", { recursive: true, force: true });
  execSync("pnpm --filter @workspace/wallpaper-minimalist run build", { stdio: "inherit", shell: true });
  execSync("cp -r ../wallpaper-minimalist/dist/. ./dist/", { stdio: "inherit", shell: true });
}
