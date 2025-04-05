// src/hooks/useQuestion.js
import { useEffect, useState } from "react";
import axios from "axios";

const useQuestion = (id, selectedLang) => {
  const [question, setQuestion] = useState(null);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [randomProblems, setRandomProblems] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [code, setCode] = useState("# Write your solution here");

  // Fetch a question by its ID
  const fetchQuestionById = async () => {
    try {
      if (!id) {
        setError("No question ID provided.");
        return;
      }
      console.log("Fetching question with ID:", id);
      const response = await axios.get(
        `http://localhost:5000/api/questions/${id}`
      );
      console.log("API Response:", response.data);
      // If data is returned, assume it's a question
      setQuestion(response.data);
      setSelectedProblem(response.data);
      setCode(
        response.data.templateCode?.[selectedLang] ||
          "# Write your solution here"
      );
    } catch (err) {
      console.error("Error fetching question:", err);
      setError("Failed to load question.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch contest problems as a fallback (if question fetch fails)
  const fetchContestProblems = async (contestId) => {
    try {
      console.log("Fetching contest problems for ID:", contestId);
      const response = await fetch(
        `http://localhost:5000/api/contests/contest/${contestId}`
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch contest problems");
      }
      setRandomProblems(data.contest.questions);
      if (data.contest.questions && data.contest.questions.length > 0) {
        setSelectedProblem(data.contest.questions[0]);
        setCode(
          data.contest.questions[0]?.templateCode?.[selectedLang] ||
            "# Write your solution here"
        );
      }
    } catch (err) {
      console.error("Error fetching contest problems:", err);
      setError("Failed to load contest problems.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always reset loading state when id or selectedLang changes
    setIsLoading(true);
    // First, try to fetch a question
    fetchQuestionById().catch(() => {
      // If it fails (404 or error), try fetching contest problems
      fetchContestProblems(id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, selectedLang]);

  return {
    question,
    selectedProblem,
    setSelectedProblem,
    randomProblems,
    error,
    isLoading,
    code,
    setCode,
  };
};

export default useQuestion;
