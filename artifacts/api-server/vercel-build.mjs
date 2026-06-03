import { execSync } from "child_process";
import { rmSync } from "fs";

const isApi = process.env.API_PROJECT === "true";

if (isApi) {
  console.log("=== Building API server ===");
  execSync("node ./build.mjs", { stdio: "inherit", shell: true });
} else {
  console.log("=== Building frontend (website) ===");
  // Remove api directory so Vercel doesn't try to compile it
  rmSync("api", { recursive: true, force: true });
  rmSync("dist", { recursive: true, force: true });
  execSync("pnpm --filter @workspace/wallpaper-minimalist run build", { stdio: "inherit", shell: true });
  execSync("cp -r ../wallpaper-minimalist/dist/. ./dist/", { stdio: "inherit", shell: true });
}
