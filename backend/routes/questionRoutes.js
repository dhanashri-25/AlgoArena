import express from "express";
import { getPracticeQuestions, getQuestionById } from "../controllers/questionController.js";

const router = express.Router();

router.get("/practice", getPracticeQuestions);
router.get("/:id", getQuestionById);

export default router;
