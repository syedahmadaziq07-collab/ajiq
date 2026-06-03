## Summary (as of latest fix)
- **Build:** `build.mjs` → first esbuild outputs `dist/index.mjs` (Node.js entry), second esbuild outputs `api/vercel-entry.mjs` (bundled Express app for Vercel)
- **vercel-build.mjs:** creates `api/index.mjs` wrapper that re-exports default from `./vercel-entry.mjs` (both in `api/` dir)
- **vercel.json:** `buildCommand: "node ./vercel-build.mjs"`, `outputDirectory: "dist"`, `framework: null`, routes: `/api/(.*)` → `/api/index.mjs`
- **CORS:** manual middleware in `src/app.ts` via `res.setHeader()`, no Vercel-level `headers` config
- **Frontend CORS**: already handled by API server

## Root cause
- `api/[...slug].mjs` → Vercel was serving it as static file instead of executing as Serverless Function (source code returned in response body instead of `{"status":"ok"}`)
- Switched to `api/index.mjs` + routes config — simpler, Vercel clearly recognizes `api/index.mjs` as a function

## Environment
- API server: `https://ajiq-api-server.vercel.app`, project `ajiq-api-server`
- Frontend: project `ajiq-api-server-eebi`, `VITE_API_URL=https://ajiq-api-server.vercel.app` (set in Vercel env vars)
- API env: `API_PROJECT=true`, `ADMIN_PASSWORD` set, `ADMIN_USERNAME` set
