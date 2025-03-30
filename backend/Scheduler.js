import cron from 'node-cron';
import { Question, Contest } from './models/User.js';

// Helper functions
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

/**
 * Job 1: Runs at 10 AM every day.
 *  - It promotes an upcoming contest for today to current OR creates today’s contest as current.
 *  - It ensures that tomorrow’s contest is created as upcoming.
 */
cron.schedule('0 0 10 * * *', async () => {
  try {
    console.log("Job 1 (10 AM): Running contest promotion and creation.");

    // Scheduled contest times
    const todayContestTime = getTodayAtHour(10);
    const tomorrowContestTime = getTomorrowAtHour(10);

    // Check for today's contest
    let todayContest = await Contest.findOne({ contestDate: todayContestTime });
    if (todayContest) {
      if (todayContest.status === 'upcoming') {
        todayContest.status = 'current';
        await todayContest.save();
        console.log(`Promoted contest #${todayContest.contestNumber} to CURRENT (Today at 10 AM).`);
      } else {
        console.log(`Today's contest already in status: ${todayContest.status}.`);
      }
    } else {
      // If no contest exists for today, create one as current
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
      const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
      const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;
      todayContest = new Contest({
        contestNumber,
        questions: questions.map(q => q._id),
        contestDate: todayContestTime,
        attemptedBy: [],
        status: 'current'
      });
      await todayContest.save();
      console.log(`Created new CURRENT contest #${contestNumber} for today at ${todayContestTime}.`);
    }

    // Check for tomorrow's contest
    let tomorrowContest = await Contest.findOne({ contestDate: tomorrowContestTime });
    if (!tomorrowContest) {
      // Create tomorrow's contest as upcoming
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
      const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
      const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;
      tomorrowContest = new Contest({
        contestNumber,
        questions: questions.map(q => q._id),
        contestDate: tomorrowContestTime,
        attemptedBy: [],
        status: 'upcoming'
      });
      await tomorrowContest.save();
      console.log(`Created new UPCOMING contest #${contestNumber} for tomorrow at ${tomorrowContestTime}.`);
    } else {
      console.log("Tomorrow's contest already exists.");
    }

  } catch (error) {
    console.error('Error in Job 1 (10 AM):', error);
  }
});

/**
 * Job 2: Runs at 12 PM every day.
 *  - It marks today's contest (that started at 10 AM) as completed.
 */
cron.schedule('0 0 12 * * *', async () => {
  try {
    console.log("Job 2 (12 PM): Marking today's contest as completed.");
    const todayContestTime = getTodayAtHour(10);
    const result = await Contest.updateOne(
      { contestDate: todayContestTime, status: 'current' },
      { $set: { status: 'completed' } }
    );
    if (result.modifiedCount > 0) {
      console.log("Today's contest has been marked as COMPLETED.");
    } else {
      console.log("No contest was updated. It might have been already completed or not created.");
    }
  } catch (error) {
    console.error('Error in Job 2 (12 PM):', error);
  }
});





//for testing purpose uncomment this
// import cron from "node-cron";
// import { Question, Contest } from "./models/User.js";

// /**
//  * Job A: Create an upcoming contest if one doesn't exist.
//  * For testing, this job runs every minute.
//  */
// cron.schedule("*/1 * * * *", async () => {
//   try {
//     // Check if an upcoming contest already exists.
//     const existingUpcoming = await Contest.findOne({ status: "upcoming" });
//     if (existingUpcoming) {
//       // Already an upcoming contest exists, so do nothing.
//       return;
//     }

//     console.log("Job A: Creating an upcoming contest.");

//     // Fetch 4 random questions.
//     const questions = await Question.aggregate([{ $sample: { size: 4 } }]);

//     // Generate the next contest number.
//     const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
//     const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;

//     // Create a new contest with status "upcoming".
//     const newContest = new Contest({
//       contestNumber,
//       questions: questions.map((q) => q._id),
//       contestDate: new Date(), // record creation time
//       attemptedBy: [],
//       status: "upcoming",
//     });

//     await newContest.save();
//     console.log(
//       `Upcoming Contest #${contestNumber} created at ${newContest.contestDate}.`
//     );
//   } catch (error) {
//     console.error("Error in Job A (upcoming creation):", error);
//   }
// });

// /**
//  * Job B: Switch an upcoming contest to current.
//  * For testing, if the upcoming contest was created more than 1 minute ago,
//  * update its status to "current".
//  */
// cron.schedule("*/1 * * * *", async () => {
//   try {
//     const upcomingContest = await Contest.findOne({ status: "upcoming" });
//     if (upcomingContest) {
//       // If the contest was created more than 1 minute ago, switch to current.
//       const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
//       if (upcomingContest.contestDate <= oneMinuteAgo) {
//         upcomingContest.status = "current";
//         upcomingContest.contestDate = new Date(); // update to current time as start time
//         await upcomingContest.save();
//         console.log(
//           `Job B: Contest #${upcomingContest.contestNumber} is now CURRENT at ${upcomingContest.contestDate}.`
//         );
//       }
//     }
//   } catch (error) {
//     console.error("Error in Job B (upcoming to current):", error);
//   }
// });

// /**
//  * Job C: Switch a current contest to completed.
//  * For testing, if the current contest is older than 2 minutes, mark it as completed.
//  */
// cron.schedule("*/1 * * * *", async () => {
//   try {
//     const now = new Date();
//     const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);

//     // Update contests with status 'current' and started more than 2 minutes ago.
//     const result = await Contest.updateMany(
//       { status: "current", contestDate: { $lte: twoMinutesAgo } },
//       { $set: { status: "completed" } }
//     );

//     if (result.modifiedCount > 0) {
//       console.log(
//         `Job C: Marked ${result.modifiedCount} contest(s) as COMPLETED (older than 2 minutes).`
//       );
//     }
//   } catch (error) {
//     console.error("Error in Job C (current to completed):", error);
//   }
// });
