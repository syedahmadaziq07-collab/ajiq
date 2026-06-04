import { execSync } from "child_process";
import { mkdirSync, rmSync, writeFileSync } from "fs";
import { build as esbuild } from "esbuild";

const isApi = process.env.API_PROJECT === "true";

async function main() {
  if (isApi) {
    console.log("=== Building Vercel serverless function ===");
    try { rmSync("api/index.js", { force: true }) } catch {}
    await esbuild({
      entryPoints: ["artifacts/api-server/src/vercel-entry.ts"],
      platform: "node",
      bundle: true,
      format: "cjs",
      outfile: "api/index.js",
      logLevel: "info",
    });
    console.log("=== api/index.js created ===");
    mkdirSync("public", { recursive: true });
    writeFileSync("public/index.html", "<html><body>API server</body></html>");
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