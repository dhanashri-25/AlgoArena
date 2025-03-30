import mongoose from "mongoose";
import { questions } from "./data.js";
import { Question, Testcase } from "../models/User.js"; 
import dotenv from "dotenv";

dotenv.config();

const insertDummyQuestions = async () => {
  try {
    await mongoose.connect("mongodb+srv://dhanashrikuwar25:I089DvVEMxAsw1hJ@contest-platform.wht88.mongodb.net/contestify?retryWrites=true&w=majority&appName=contest-Platform");

    console.log("Connected to database...");

    await Question.deleteMany({});
    await Testcase.deleteMany({});

    console.log("Old dummy questions and test cases deleted.");

    for (const q of questions) {
      const newQuestion = await Question.create({
        quesNo: q.quesNo,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        tags: q.tags,
        constraints: q.constraints,
        points: q.points,
        templateCode: q.templateCode,
        wrapperCode : q.wrapperCode
      });

     
      const testcases = await Testcase.insertMany(
        q.testcases.map((tc) => ({
          input: tc.input,
          output: tc.output,
          explanation: tc.explanation,
          forQuestion: newQuestion._id,
        }))
      );

      const testcaseIds = testcases.map((tc) => tc._id);

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