import { execSync } from "child_process";
import { mkdirSync, rmSync, writeFileSync } from "fs";

const isApi = process.env.API_PROJECT === "true";

if (isApi) {
  console.log("=== Building API server ===");
  execSync("node ./build.mjs", { stdio: "inherit", shell: true });
  // Create serverless function entry (JS, not TS — avoids TypeScript compilation errors)
  mkdirSync("api", { recursive: true });
  writeFileSync("api/[...slug].mjs", `export { default } from "../dist/api/vercel-entry.mjs";\n`);
} else {
  console.log("=== Building frontend (website) ===");
  rmSync("dist", { recursive: true, force: true });
  execSync("pnpm --filter @workspace/wallpaper-minimalist run build", { stdio: "inherit", shell: true });
  execSync("cp -r ../wallpaper-minimalist/dist/. ./dist/", { stdio: "inherit", shell: true });
}
