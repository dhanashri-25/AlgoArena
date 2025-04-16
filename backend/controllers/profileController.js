// import { User } from "../models/User.js";

// export const getProfileInfo = async (req, res) => {
//   const userId = req.params.id;
//   console.log("Received request for user ID:", userId);

//   try {
//     const userdata = await User.findById(userId).populate("problemSolved");

//     if (!userdata) {
//       console.log("No user found for ID:", userId);
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("User found:", userdata);
//     res.status(200).json({ message: "Found user details", userdata });
//   } catch (error) {
//     console.error("Error fetching user profile:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

import { User, Question, Contest, ContestResult } from "../models/User.js";

export const getProfileInfo = async (req, res) => {
  const userId = req.params.id;
  console.log("Received request for user ID:", userId);

  try {
    // Find user and populate problem solved with details
    const userData = await User.findById(userId)
      .populate({
        path: "problemSolved",
        select: "title difficulty createdAt quesNo tags points",
      })
      .populate({
        path: "contestsParticipated",
        select: "contestNumber contestDate status",
      })
      .populate({
        path: "contestHistory",
        match: { contest: { $ne: null } },
        select: "contest score rank startTime endTime completed",
        populate: {
          path: "contest",
          select: "contestNumber contestDate",
        },
      });

    if (!userData) {
      console.log("No user found for ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate problem stats by difficulty
    const problemStats = {
      easy: userData.problemSolved.filter(
        (p) => p.difficulty.toLowerCase() === "easy"
      ).length,
      medium: userData.problemSolved.filter(
        (p) => p.difficulty.toLowerCase() === "medium"
      ).length,
      hard: userData.problemSolved.filter(
        (p) => p.difficulty.toLowerCase() === "hard"
      ).length,
    };

    // Format contest data
    const contestsData = userData.contestHistory
      .filter((history) => history.contest !== null)
      .map((history) => ({
        contestNumber: history.contest.contestNumber,
        contestDate: history.contest.contestDate,
        score: history.score,
        rank: history.rank,
        status: history.completed ? "Participated" : "Not Participated",
      }));

    // Prepare response data
    const responseData = {
      message: "Found user details",
      userdata: {
        ...userData.toObject(),
        problemStats,
        contests: contestsData,
      },
    };

    console.log("Sending user data response");
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
