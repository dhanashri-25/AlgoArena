// import cron from 'node-cron';
// import { Question, Contest } from './models/User.js';

// // Helper functions
// function getTodayAtHour(hour) {
//   const today = new Date();
//   today.setHours(hour, 0, 0, 0);
//   return today;
// }

// function getTomorrowAtHour(hour) {
//   const tomorrow = new Date();
//   tomorrow.setDate(tomorrow.getDate() + 1);
//   tomorrow.setHours(hour, 0, 0, 0);
//   return tomorrow;
// }

// /**
//  * Job 1: Runs at 10 AM every day.
//  *  - It promotes an upcoming contest for today to current OR creates today’s contest as current.
//  *  - It ensures that tomorrow’s contest is created as upcoming.
//  */
// cron.schedule('0 0 10 * * *', async () => {
//   try {
//     console.log("Job 1 (10 AM): Running contest promotion and creation.");

//     // Scheduled contest times
//     const todayContestTime = getTodayAtHour(10);
//     const tomorrowContestTime = getTomorrowAtHour(10);

//     // Check for today's contest
//     let todayContest = await Contest.findOne({ contestDate: todayContestTime });
//     if (todayContest) {
//       if (todayContest.status === 'upcoming') {
//         todayContest.status = 'current';
//         await todayContest.save();
//         console.log(`Promoted contest #${todayContest.contestNumber} to CURRENT (Today at 10 AM).`);
//       } else {
//         console.log(`Today's contest already in status: ${todayContest.status}.`);
//       }
//     } else {
//       // If no contest exists for today, create one as current
//       const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
//       const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
//       const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;
//       todayContest = new Contest({
//         contestNumber,
//         questions: questions.map(q => q._id),
//         contestDate: todayContestTime,
//         attemptedBy: [],
//         status: 'current'
//       });
//       await todayContest.save();
//       console.log(`Created new CURRENT contest #${contestNumber} for today at ${todayContestTime}.`);
//     }

//     // Check for tomorrow's contest
//     let tomorrowContest = await Contest.findOne({ contestDate: tomorrowContestTime });
//     if (!tomorrowContest) {
//       // Create tomorrow's contest as upcoming
//       const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
//       const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
//       const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;
//       tomorrowContest = new Contest({
//         contestNumber,
//         questions: questions.map(q => q._id),
//         contestDate: tomorrowContestTime,
//         attemptedBy: [],
//         status: 'upcoming'
//       });
//       await tomorrowContest.save();
//       console.log(`Created new UPCOMING contest #${contestNumber} for tomorrow at ${tomorrowContestTime}.`);
//     } else {
//       console.log("Tomorrow's contest already exists.");
//     }

//   } catch (error) {
//     console.error('Error in Job 1 (10 AM):', error);
//   }
// });

// /**
//  * Job 2: Runs at 12 PM every day.
//  *  - It marks today's contest (that started at 10 AM) as completed.
//  */
// cron.schedule('0 0 12 * * *', async () => {
//   try {
//     console.log("Job 2 (12 PM): Marking today's contest as completed.");
//     const todayContestTime = getTodayAtHour(10);
//     const result = await Contest.updateOne(
//       { contestDate: todayContestTime, status: 'current' },
//       { $set: { status: 'completed' } }
//     );
//     if (result.modifiedCount > 0) {
//       console.log("Today's contest has been marked as COMPLETED.");
//     } else {
//       console.log("No contest was updated. It might have been already completed or not created.");
//     }
//   } catch (error) {
//     console.error('Error in Job 2 (12 PM):', error);
//   }
// });

import cron from "node-cron";
import { Question, Contest } from "./models/User.js";

// Helper functions for production scheduling
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

// New helper function for testing: returns a Date object a few minutes ahead
function getTestTime(minutesAhead) {
  const date = new Date();
  date.setMinutes(date.getMinutes() + minutesAhead);
  return date;
}

// Toggle test mode
const testMode = true;

// For testing, schedule contests relative to the current time.
// Otherwise, use the production times (10 AM for today and tomorrow).
const contestTime = testMode ? getTestTime(1) : getTodayAtHour(10);
const upcomingTime = testMode ? getTestTime(2) : getTomorrowAtHour(10);

/**
 * Job 1: In production, runs at 10 AM daily.
 * In test mode, it runs at contestTime (1 minute ahead of now).
 *  - Promotes an upcoming contest for "today" to current OR creates today’s contest as current.
 *  - Ensures that tomorrow’s contest is created as upcoming.
 */
cron.schedule(
  testMode
    ? `0 ${contestTime.getMinutes()} ${contestTime.getHours()} * * *`
    : "0 0 10 * * *",
  async () => {
    try {
      console.log("Job 1: Running contest promotion and creation.");

      // Use scheduled times based on the mode
      const todayContestTime = contestTime;
      const tomorrowContestTime = upcomingTime;

      // Check for today's contest
      let todayContest = await Contest.findOne({
        contestDate: todayContestTime,
      });
      if (todayContest) {
        if (todayContest.status === "upcoming") {
          todayContest.status = "current";
          await todayContest.save();
          console.log(
            `Promoted contest #${todayContest.contestNumber} to CURRENT (Scheduled contest time).`
          );
        } else {
          console.log(
            `Today's contest already in status: ${todayContest.status}.`
          );
        }
      } else {
        // Create a new contest as current if none exists
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
          `Created new CURRENT contest #${contestNumber} for test at ${todayContestTime}.`
        );
      }

      // Check for tomorrow's contest
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
          `Created new UPCOMING contest #${contestNumber} for test at ${tomorrowContestTime}.`
        );
      } else {
        console.log("Tomorrow's contest already exists.");
      }
    } catch (error) {
      console.error("Error in Job 1:", error);
    }
  }
);

/**
 * Job 2: In production, runs at 12 PM daily.
 * In test mode, it runs at upcomingTime (2 minutes ahead of now).
 *  - Marks today's contest (that was scheduled in Job 1) as completed.
 */
cron.schedule(
  testMode
    ? `0 ${upcomingTime.getMinutes()} ${upcomingTime.getHours()} * * *`
    : "0 0 12 * * *",
  async () => {
    try {
      console.log("Job 2: Marking today's contest as completed.");
      const todayContestTime = contestTime;
      const result = await Contest.updateOne(
        { contestDate: todayContestTime, status: "current" },
        { $set: { status: "completed" } }
      );
      if (result.modifiedCount > 0) {
        console.log("Today's contest has been marked as COMPLETED.");
      } else {
        console.log(
          "No contest was updated. It might have been already completed or not created."
        );
      }
    } catch (error) {
      console.error("Error in Job 2:", error);
    }
  }
);
