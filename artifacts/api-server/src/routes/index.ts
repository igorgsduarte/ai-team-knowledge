import { Router, type IRouter } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import skillsRouter from "./skills";
import knowledgeRouter from "./knowledge";
import boardsRouter from "./boards";
import commentsRouter from "./comments";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(usersRouter);
router.use(skillsRouter);
router.use(knowledgeRouter);
router.use(boardsRouter);
router.use(commentsRouter);
router.use(statsRouter);

export default router;
