import { User, Contest, ContestResult } from "../models/User.js";
import mongoose from "mongoose";

export const leaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId).populate(
      "attemptedBy",
      "username profilePic"
    );

    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }
    console.log("contest", contest);

    //user id from attempted by array
    let userIds = contest.attemptedBy.map((user) => user._id);

    console.log("userid", userIds);

    if (userIds.length === 0) {
      const contestResultsFallback = await ContestResult.find(
        { contest: contestId },
        "user"
      );
      userIds = contestResultsFallback.map((result) => result.user);
      console.log(" User IDs from ContestResult:", userIds);
    }

    const results = await ContestResult.find({
      contest: contestId,
      user: { $in: userIds },
    }).populate("user", "username profilePic");

    console.log("contest result entries", results);

    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.totalTime - b.totalTime;
    });

    const leaderboardData = results.map((result, index) => ({
      rank: index + 1,
      username: result.user?.username || "Unknown",
      profilePic: result.user?.profilePic || "",
      score: result.score,
      totalTime: result.totalTime,
    }));

    res.status(200).json(leaderboardData);
  } catch (err) {
    console.error(" Error in leaderboard controller:", err);
    res.status(500).json({ error: "Server error" });
  }
};
