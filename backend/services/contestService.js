// backend/services/contestService.js

import { Contest, ContestResult, User, Question } from "../models/User.js";

/**
 * Update user and contest statistics when a user completes a contest
 * @param {string} userId - The user ID
 * @param {string} contestId - The contest ID
 */
export const updateUserContestStats = async (userId, contestId) => {
  try {
    // Get the contest result
    const contestResult = await ContestResult.findOne({
      user: userId,
      contest: contestId
    }).populate("solvedQuestions");
    
    if (!contestResult) {
      throw new Error("Contest result not found");
    }
    
    // Get the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    
    // Update user's contest history if not already there
    if (!user.contestHistory.includes(contestResult._id)) {
      user.contestHistory.push(contestResult._id);
    }
    
    // Update user's participated contests if not already there
    if (!user.contestsParticipated.includes(contestId)) {
      user.contestsParticipated.push(contestId);
    }
    
    // Update user's solved problems
    contestResult.solvedQuestions.forEach(question => {
      if (!user.problemSolved.includes(question._id)) {
        user.problemSolved.push(question._id);
      }
    });
    
    // Save the user
    await user.save();
    
    // Get the contest
    const contest = await Contest.findById(contestId);
    if (!contest) {
      throw new Error("Contest not found");
    }
    
    // Update contest's attempted by users if not already there
    if (!contest.attemptedBy.includes(userId)) {
      contest.attemptedBy.push(userId);
      await contest.save();
    }
    
    // Return the updated contest result
    return contestResult;
  } catch (error) {
    console.error("Error updating user contest stats:", error);
    throw error;
  }
};

/**
 * Calculate rank and update all contest results for a contest
 * @param {string} contestId - The contest ID
 */
export const calculateAndUpdateRanks = async (contestId) => {
  try {
    // Get all results for this contest
    const results = await ContestResult.find({ contest: contestId }).lean();
    
    // Sort by score (descending) and time (ascending if scores tie)
    results.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      return a.totalTime - b.totalTime; // Lower time first if scores tie
    });
    
    // Update ranks
    for (let i = 0; i < results.length; i++) {
      await ContestResult.findByIdAndUpdate(
        results[i]._id,
        { rank: i + 1 }
      );
    }
    
    return results.length; // Return the number of results updated
  } catch (error) {
    console.error("Error calculating ranks:", error);
    throw error;
  }
};