import { execSync } from "child_process";
import { mkdirSync, writeFileSync, rmSync } from "fs";
import path from "path";
import { build as esbuild } from "esbuild";

const isApi = process.env.API_PROJECT === "true";

async function main() {
  if (isApi) {
    console.log("=== Building API server function ===");

    const outputRoot = ".vercel/output";
    const funcDir = path.join(outputRoot, "functions", "api", "index.func");
    const staticDir = path.join(outputRoot, "static");

    rmSync(outputRoot, { recursive: true, force: true });
    mkdirSync(funcDir, { recursive: true });
    mkdirSync(staticDir, { recursive: true });

    await esbuild({
      entryPoints: ["src/vercel-entry.ts"],
      platform: "node",
      bundle: true,
      format: "esm",
      outfile: path.join(funcDir, "index.mjs"),
      logLevel: "info",
    });

    writeFileSync(
      path.join(funcDir, ".vc-config.json"),
      JSON.stringify({
        runtime: "nodejs18.x",
        handler: "index.mjs",
        launcherType: "NodeJs",
      })
    );

    writeFileSync(
      path.join(outputRoot, "config.json"),
      JSON.stringify({
        version: 3,
        routes: [
          { src: "/api/(.*)", dest: "/api/index" },
        ],
      })
    );

    console.log("=== Build completed ===");
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
