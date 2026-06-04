import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import blogPostsRouter from "./blog-posts.js";
import newsletterRouter from "./newsletter.js";
import contactRouter from "./contact.js";
import wallpapersRouter from "./wallpapers.js";
import templatesRouter from "./templates.js";
import guidesRouter from "./guides.js";
import settingsRouter from "./settings.js";
import adminRouter from "./admin.js";
import stripeRouter from "./stripe.js";
import downloadsRouter from "./downloads.js";
import statsRouter from "./stats.js";
import uploadRouter from "./upload.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(blogPostsRouter);
router.use(newsletterRouter);
router.use(contactRouter);
router.use(wallpapersRouter);
router.use(templatesRouter);
router.use(guidesRouter);
router.use(settingsRouter);
router.use(adminRouter);
router.use(stripeRouter);
router.use(downloadsRouter);
router.use(statsRouter);
router.use(uploadRouter);

export default router;
