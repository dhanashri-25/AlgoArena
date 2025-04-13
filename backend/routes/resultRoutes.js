import express from "express";
import { middle } from "../middleware.js";
import Result from "../controllers/ResultController.js";

const ResultRouter = express.Router();

ResultRouter.get(":/contestId/results", middle, Result);

export default ResultRouter;