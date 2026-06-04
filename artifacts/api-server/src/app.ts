import express, { type Express, type Request, type Response, type NextFunction } from "express";
import pinoHttp from "pino-http";
import router from "./routes/index.js";
import { logger } from "./lib/logger.js";

const app: Express = express();

// Manual CORS (avoids cors package compatibility issues with Express v5)
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (_req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.use(
  (pinoHttp as any)({
    logger,
    serializers: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// Stripe webhook needs raw body for signature verification (must be before express.json)
app.use("/api/stripe-webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
