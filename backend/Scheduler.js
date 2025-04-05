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




import cron from 'node-cron';
import { Question, Contest } from './models/User.js';

// 🔧 Helper function for testing: returns current time rounded to the minute
function getCurrentMinuteRoundedTime() {
  const now = new Date();
  now.setSeconds(0, 0); // truncate seconds and milliseconds
  return now;
}

/**
 * 🔁 Job 1: Runs every 1 minute
 * - Creates a new contest with current minute timestamp
 * - Simulates "current" and "upcoming" status logic
 */
cron.schedule('* * * * *', async () => {
  try {
    console.log("\n[Job 1] Running at:", new Date().toLocaleString());

    const currentTime = getCurrentMinuteRoundedTime();

    // Check if a contest already exists for this timestamp
    let existingContest = await Contest.findOne({ contestDate: currentTime });

    if (existingContest) {
      console.log(`ℹ️ Contest at ${currentTime.toLocaleString()} already exists with status: ${existingContest.status}`);
    } else {
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
      const lastContest = await Contest.findOne().sort({ contestNumber: -1 });
      const contestNumber = lastContest ? lastContest.contestNumber + 1 : 1;

      const newContest = new Contest({
        contestNumber,
        questions: questions.map(q => q._id),
        contestDate: currentTime,
        attemptedBy: [],
        status: 'current'
      });

      await newContest.save();
      console.log(`✅ Created NEW contest #${contestNumber} at ${currentTime.toLocaleString()} with status: CURRENT`);
    }

  } catch (error) {
    console.error('❌ Error in Job 1:', error);
  }
});

/**
 * 🟥 Job 2: Runs every 2 minutes
 * - Marks any contest from exactly 2 minutes ago as "completed"
 */
cron.schedule('*/2 * * * *', async () => {
  try {
    console.log("\n[Job 2] Running at:", new Date().toLocaleString());

    const timeTwoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    timeTwoMinutesAgo.setSeconds(0, 0);

    const result = await Contest.updateOne(
      { contestDate: timeTwoMinutesAgo, status: 'current' },
      { $set: { status: 'completed' } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Marked contest at ${timeTwoMinutesAgo.toLocaleString()} as COMPLETED`);
    } else {
      console.log(`ℹ️ No contest to complete at ${timeTwoMinutesAgo.toLocaleString()}`);
    }

  } catch (error) {
    console.error('❌ Error in Job 2:', error);
  }
});
