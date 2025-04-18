// src/hooks/useProblemData.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { LANGUAGES } from "../constants/editorConstants";

export const useProblemData = (id, setCode) => {
  const [selectedLang, setSelectedLang] = useState("Java");
  const [isLoading, setIsLoading] = useState(true);
  const [randomProblems, setRandomProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [question, setQuestion] = useState(null);
  const [error, setError] = useState(null);

  // Function to fetch a specific question by its ID
  const fetchQuestionById = async () => {
    try {
      console.log("Fetching question with ID:", id);
      if (!id) {
        setError("No question ID provided.");
        setIsLoading(false);
        return null;
      }

      const response = await axios.get(
        `https://algoarena-gp5i.onrender.com/api/questions/${id}`
      );

      if (response.status === 200 && response.data) {
        console.log("API Response:", response.data);
        setQuestion(response.data);
        setSelectedProblem(response.data);
        setCode(
          response.data.templateCode?.[selectedLang] ||
            "# Write your solution here"
        );
        return response.data;
      } else {
        throw new Error("No question found.");
      }
    } catch (err) {
      console.error("Error fetching question:", err);
      console.log("Trying to fetch as contest instead...");
      return null;
    }
  };

  const getRandomProblems = async (contestId) => {
    try {
      const response = await fetch(
        `https://algoarena-gp5i.onrender.com/api/contests/contest/${contestId}`
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
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching contest problems:", error);
      setError("Failed to fetch contest problems");
      setIsLoading(false);
    }
  };

  //Determine which function to call based on the presence of an ID
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const question = await fetchQuestionById();
        if (!question) {
          await getRandomProblems(id);
        }
      } catch (err) {
        console.error("Error in data fetching:", err);
        setError("Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (
      selectedProblem?.templateCode &&
      selectedProblem.templateCode[selectedLang]
    ) {
      setCode(selectedProblem.templateCode[selectedLang]);
    }
  }, [selectedLang, selectedProblem]);

  return {
    selectedLang,
    setSelectedLang,
    isLoading,
    randomProblems,
    selectedProblem,
    setSelectedProblem,
    error,
  };
};
