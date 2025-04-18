import express from "express";
import {
  getCurrentContest,
  getAllCurrentContests,
  getUpcomingContests,
  getCompletedContests,
  registerForContest,
  unregisterFromContest,
  getContestById,
} from "../controllers/contestController.js";
import { checkContestStatus } from "../middleware/checkContestStatus.js";

const router = express.Router();

// Routes with controller mappings
router.get("/current-contest", getCurrentContest);
router.get("/current", getAllCurrentContests);
router.get("/upcoming", getUpcomingContests);
router.get("/completed", getCompletedContests);
router.post("/register", registerForContest);
router.post("/unregister", unregisterFromContest);
router.get("/contest/:id", checkContestStatus, getContestById);

export default router;
