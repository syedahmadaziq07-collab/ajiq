import { execSync } from "child_process";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { build as esbuild } from "esbuild";

const isApi = process.env.API_PROJECT === "true";

async function main() {
  if (isApi) {
    console.log("=== Building Vercel serverless function ===");
    rmSync("api", { recursive: true, force: true });
    await esbuild({
      entryPoints: ["src/vercel-entry.ts"],
      platform: "node",
      bundle: true,
      format: "esm",
      outfile: "api/index.mjs",
      logLevel: "info",
    });
    // Vercel requires an output directory when no framework is detected
    // Even though we only deploy a function, create public/ to satisfy the check
    mkdirSync("public", { recursive: true });
    writeFileSync("public/.gitkeep", "");
  } else {
    console.log("=== Building frontend (website) ===");
    rmSync("dist", { recursive: true, force: true });
    execSync("pnpm --filter @workspace/wallpaper-minimalist run build", { stdio: "inherit", shell: true });
    execSync("cp -r ../wallpaper-minimalist/dist/. ./dist/", { stdio: "inherit", shell: true });
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
