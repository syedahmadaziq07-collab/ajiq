import { execSync } from "child_process";
import { rmSync } from "fs";
import { build as esbuild } from "esbuild";

const isApi = process.env.API_PROJECT === "true";

async function main() {
  if (isApi) {
    console.log("=== Building API server ===");
    execSync("node ./build.mjs", { stdio: "inherit", shell: true });

    console.log("=== Building Vercel serverless function ===");
    await esbuild({
      entryPoints: ["src/vercel-entry.ts"],
      platform: "node",
      bundle: true,
      format: "esm",
      outfile: "api/index.mjs",
      logLevel: "info",
    });
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
