// Import from the pre-built Vercel serverless bundle
// (built by `pnpm --filter @workspace/api-server run build`)
import app from "../artifacts/api-server/dist/api/vercel-entry.mjs";
export default app;
