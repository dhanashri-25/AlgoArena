import cron from "node-cron";
import { Question, Contest } from "./models/User.js";

function getTodayAtHour(hour) {
  const today = new Date();
  today.setHours(hour, 0, 0, 0);
  return today;
}

function getTomorrowAtHour(hour) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(hour, 0, 0, 0);
  return tomorrow;
}

// Job 1: Run every minute from 8:00 to 8:14 AM (if needed)
cron.schedule("0-20 8 * * *", async () => {
  try {
    console.log("Job 1 (8 AM window): Starting daily contest processing.");

    const todayContestTime = getTodayAtHour(8); // Contest scheduled for today at 8 AM.
    const tomorrowContestTime = getTomorrowAtHour(8); // Tomorrow's contest at 8 AM.

    // (4) Cleanup: find any contest from before today that is still marked as "current"
    const outdatedContests = await Contest.find({
      contestDate: { $lt: todayContestTime },
      status: "current",
    });

    if (outdatedContests.length > 0) {
      for (let contest of outdatedContests) {
        // Update contest's end time to 10 AM on its original day
        let endedDate = new Date(contest.contestDate);
        endedDate.setHours(10, 0, 0, 0);
        contest.contestDate = endedDate;
        contest.status = "completed";
        await contest.save();
        console.log(
          `Marked outdated contest #${
            contest.contestNumber
          } as COMPLETED (ended at 10 AM on ${endedDate.toLocaleDateString()}).`
        );
      }
    } else {
      console.log("No outdated current contests found.");
    }

    // (2) Check for today's contest.
    let todayContest = await Contest.findOne({ contestDate: todayContestTime });
    if (todayContest) {
      // Only promote if it's still "upcoming". This prevents duplicate promotion.
      if (todayContest.status === "upcoming") {
        todayContest.status = "current";
        await todayContest.save();
        console.log(
          `Promoted contest #${todayContest.contestNumber} to CURRENT for today (8 AM).`
        );
      } else {
        console.log(
          `Today's contest is already in status: ${todayContest.status}.`
        );
      }
    } else {
      // Create a new current contest for today with 4 random questions.
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
      const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
      const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;
      todayContest = new Contest({
        contestNumber,
        questions: questions.map((q) => q._id),
        contestDate: todayContestTime,
        attemptedBy: [],
        status: "current",
      });
      await todayContest.save();
      console.log(
        `Created new CURRENT contest #${contestNumber} for today at ${todayContestTime}.`
      );
    }

    // (1) Ensure tomorrow's contest is scheduled.
    let tomorrowContest = await Contest.findOne({
      contestDate: tomorrowContestTime,
    });
    if (!tomorrowContest) {
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
      const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
      const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;
      tomorrowContest = new Contest({
        contestNumber,
        questions: questions.map((q) => q._id),
        contestDate: tomorrowContestTime,
        attemptedBy: [],
        status: "upcoming",
      });
      await tomorrowContest.save();
      console.log(
        `Created new UPCOMING contest #${contestNumber} for tomorrow at ${tomorrowContestTime}.`
      );
    } else {
      console.log("Tomorrow's contest already exists.");
    }
  } catch (error) {
    console.error("Error in Job 1 (8 AM window):", error);
  }
});

// Job 2: Runs at 10 AM to mark today's current contest as completed.
cron.schedule("0-14 10 * * *", async () => {
  try {
    console.log("Job 2 (10 AM): Ending today's contest.");
    const todayContestTime = getTodayAtHour(8); // Today's contest started at 8 AM.
    const result = await Contest.updateOne(
      { contestDate: todayContestTime, status: "current" },
      {
        $set: {
          status: "completed",
          // Update contestDate to reflect the contest ended at 10 AM.
          contestDate: getTodayAtHour(10),
        },
      }
    );
    if (result.modifiedCount > 0) {
      console.log(
        "Today's contest has been marked as COMPLETED (ended at 10 AM)."
      );
    } else {
      console.log(
        "No contest was updated. It might have been already completed or not created."
      );
    }
  } catch (error) {
    console.error("Error in Job 2 (10 AM):", error);
  }
});
