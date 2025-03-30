import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import "./jobs/scheduleContest.js";
import axios from "axios";
import contestRoutes from "./routes/contestRoutes.js";
import './Scheduler.js'

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());

connectDB();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use("/api", contestRoutes);

const JUDGE0_API = "http://localhost:2358";




app.post("/api/run-code", async (req, res) => {
  try {
    console.log("inside judge0 .............................................")
    const { language, code, testCases , language_id , wrapCode } = req.body;
    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    
    console.log("got the data correctly...................................." , code)
    const results = [];
    

    
    for (let i = 0; i < Math.min(2, testCases.length); i++) {
      const tc = testCases[i];  
      const inputObject = Object.fromEntries(
        tc.input.reduce((acc, val, index) => {
          if (index % 2 === 0) {
            acc.push([val, tc.input[index + 1]]);
          }
          return acc;
        }, [])
      );
      
      let finalSourceCode = wrapCode;
      console.log(finalSourceCode)
      
      Object.entries(inputObject).forEach(([key, value]) => {

        console.log("key : " , key ," , value : " , value)

        if ((value.startsWith("[") && value.endsWith("]")) && language_id !== 71) {
          value = value.replace("[", "{").replace("]", "}");
          
        }

        finalSourceCode = finalSourceCode.replace(new RegExp(`{${key}}`, "g"), value);
      });
      let source_code= ""
      if(language_id !== 71){
        source_code = finalSourceCode + "\n" + code;
      } else {
         source_code = code + "\n" + finalSourceCode;
      }
      
      
      console.log("source code ........\n" , source_code)
    
      const submission = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
          language_id: language_id,
          source_code,
          expected_output: (tc.output),
          cpu_time_limit: 2,
          memory_limit: 128000,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = submission.data.token;
      console.log("token Found " , token)
      let result;
      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (result.data.status.id >= 3) break; 
        await new Promise((r) => setTimeout(r, 1000)); 
      }
      console.log("result................" , result.data)
      results.push(result.data);
    
    }
    res.json({results , success : true});
  } catch (error) {
    console.error("Error in /api/run-code:", error);
    res.status(500).json({ error: error.message });
  }
});




app.post("/api/submit-code", async (req, res) => {
  try {
    console.log("inside judge0 .............................................")
    const { language, code, testCases , language_id , wrapCode } = req.body;
    if (!code || !language || !testCases || !Array.isArray(testCases)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    
    console.log("got the data correctly...................................." , code)
    const results = [];
    

    
    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i]
      const inputObject = Object.fromEntries(
        tc.input.reduce((acc, val, index) => {
          if (index % 2 === 0) {
            acc.push([val, tc.input[index + 1]]);
          }
          return acc;
        }, [])
      );
      
      let finalSourceCode = wrapCode;
      console.log(finalSourceCode)
      
      Object.entries(inputObject).forEach(([key, value]) => {

        console.log("key : " , key ," , value : " , value)

        if ((value.startsWith("[") && value.endsWith("]")) && language_id !== 71) {
          value = value.replace("[", "{").replace("]", "}");
          
        }

        finalSourceCode = finalSourceCode.replace(new RegExp(`{${key}}`, "g"), value);
      });
      
      const source_code = finalSourceCode + "\n" + code;
      
      console.log("source code ........\n" , source_code)
      const submission = await axios.post(
        `${JUDGE0_API}/submissions?base64_encoded=false&wait=false`,
        {
          language_id: language_id,
          source_code,
          expected_output: (tc.output),
          cpu_time_limit: 2,
          memory_limit: 128000,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const token = submission.data.token;
      console.log("token Found" , token)
      let result;
      while (true) {
        result = await axios.get(
          `${JUDGE0_API}/submissions/${token}?base64_encoded=false`,
          { headers: { "Content-Type": "application/json" } }
        );
        if (result.data.status.id >= 3) break; 
        await new Promise((r) => setTimeout(r, 1000)); 
      }
      console.log("result................" , result.data)
      
      if(result.data.status.description !== 'Accepted'){
        const results=[];
        results.push(result.data)
        return res.json({results : results , index : i , success : false});;
      }
      
    }

    res.json({message : "Accepted" , success : true});
  } catch (error) {
    console.error("Error in /api/submit-code:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});