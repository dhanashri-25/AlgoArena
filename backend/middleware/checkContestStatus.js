import { Contest } from "../models/User.js";

export const checkContestStatus = async (req, res, next) => {
  try {
    const contestId = req.params.id || req.body.contestId;

    if (!contestId) {
      return res.status(400).json({ error: "contest id is required " });
    }

    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    if (contest.status !== "current") {
      return res.status(403).json({
        error: `You can't access this contest because it is '${contest.status}'.`,
      });
    }

    next();
  } catch (error) {
    console.error("Error in checkContestStatus middleware:", error);
    res.status(500).json({ error: "Server error" });
  }
};
