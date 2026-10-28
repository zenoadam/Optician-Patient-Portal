/**
 * Copyright (c) 2026 Adam Zeineddine. All rights reserved.
 */
import { Router, type IRouter } from "express";
import healthRouter from "./health";

const router: IRouter = Router();

router.use(healthRouter);

export default router;
