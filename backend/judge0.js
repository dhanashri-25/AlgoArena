// judge0.js
import axios from "axios";

const JUDGE0_API_URL = "https://api.judge0.com/submissions";

export async function runCode(code, language, testCases) {
  const results = [];
  for (const testCase of testCases) {
    const response = await axios.post(
      `${JUDGE0_API_URL}?base64_encoded=false`,
      {
        source_code: code,
        language_id: 54, // Change this based on language if needed
        stdin: testCase.input,
        expected_output: testCase.expected_output,
      }
    );
    results.push(response.data);
  }
  return results;
}
