import { Router, type IRouter } from "express";
import healthRouter from "./health";
import blogPostsRouter from "./blog-posts";
import newsletterRouter from "./newsletter";
import contactRouter from "./contact";
import wallpapersRouter from "./wallpapers";
import templatesRouter from "./templates";
import guidesRouter from "./guides";
import adminRouter from "./admin";
import stripeRouter from "./stripe";
import downloadsRouter from "./downloads";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use("/admin/login", (req, res) => {
  res.json({ method: req.method, path: req.path, url: req.url, baseUrl: req.baseUrl, originalUrl: req.originalUrl });
});
router.use(healthRouter);
router.use(blogPostsRouter);
router.use(newsletterRouter);
router.use(contactRouter);
router.use(wallpapersRouter);
router.use(templatesRouter);
router.use(guidesRouter);
router.use(adminRouter);
router.use(stripeRouter);
router.use(downloadsRouter);
router.use(statsRouter);

export default router;
