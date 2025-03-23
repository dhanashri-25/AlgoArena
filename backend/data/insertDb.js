import mongoose from "mongoose";
import { questions } from "./data.js";
import { Question, Testcase } from "../models/User.js"; // Ensure this path is correct
import dotenv from "dotenv";

dotenv.config();

const insertDummyQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database...");

    // Delete existing questions and test cases (if desired)
    await Question.deleteMany({});
    await Testcase.deleteMany({});
    console.log("Old dummy questions and test cases deleted.");

    for (const q of questions) {
      // Insert the question without its test cases first.
      const newQuestion = await Question.create({
        quesNo: q.quesNo,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        tags: q.tags,
        constraints: q.constraints,
        points: q.points,
      });

      // Insert test cases for the question and associate them with the question's _id.
      const testcases = await Testcase.insertMany(
        q.testcases.map((tc) => ({
          input: tc.input,
          output: tc.output,
          explanation: tc.explanation,
          forQuestion: newQuestion._id,
        }))
      );

      // Collect the inserted test case IDs.
      const testcaseIds = testcases.map((tc) => tc._id);

      // Update the question document to reference its test cases.
      await Question.findByIdAndUpdate(newQuestion._id, {
        testcases: testcaseIds,
      });

      console.log(`Inserted: ${q.title}`);
    }

    console.log("All dummy questions inserted successfully.");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting questions:", error);
    mongoose.connection.close();
  }
};

insertDummyQuestions();
