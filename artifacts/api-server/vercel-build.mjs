import { execSync } from "child_process";
import { existsSync } from "fs";

const isApi = process.env.API_PROJECT === "true";

if (isApi) {
  console.log("=== Building API server ===");
  execSync("node ./build.mjs", { stdio: "inherit", shell: true });
} else {
  console.log("=== Building frontend (website) ===");
  execSync("pnpm --filter @workspace/wallpaper-minimalist run build && cp -r ../wallpaper-minimalist/dist/. ./dist/", { stdio: "inherit", shell: true });
}
