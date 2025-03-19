import mongoose from "mongoose";
import { questions } from "./data.js";
import { Question, Testcase } from "../models/User.js"; // Ensure correct import path

const insertDummyQuestions = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("Connected to database...");

    for (const q of questions) {
      // Step 1: Insert Question without test cases
      const newQuestion = await Question.create({
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        tags: q.tags,
        constraints: q.constraints,
        points: q.points,
      });

      // Step 2: Insert test cases with reference to the created question
      const testcases = await Testcase.insertMany(
        q.testcases.map((tc) => ({
          input: tc.input,
          output: tc.output,
          explanation: tc.explanation,
          forQuestion: newQuestion._id, // Assign the question ID
        }))
      );

      const testcaseIds = testcases.map((tc) => tc._id);

      // Step 3: Update the Question document with the test case IDs
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
