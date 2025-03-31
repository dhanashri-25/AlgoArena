import React from "react";
import { useLocation, Link } from "react-router-dom";

const ContestRulesPage = () => {
  // Access the contest details passed via location state
  const location = useLocation();
  const contest = location.state?.contest;

  // Static details for overview, rules, and scoring remain the same
  const DsaContestDetails = [
    {
      title: "Contest Overview",
      content:
        "The DSA Coding Challenge is a 3-hour competitive programming event focusing on data structures and algorithms. Participants will solve 7 problems of varying difficulty levels to test their problem-solving skills and coding efficiency.",
    },
    {
      title: "Eligibility",
      content:
        "Open to all developers and students aged 16+. Individual participation only - team entries are not allowed. Basic programming knowledge and familiarity with any programming language is required.",
    },
  ];
  const rules = [
    {
      title: "Competition Rules",
      content: [
        "Code copy /pasting disabled once contest starts - original solutions only",
        "Auto Submission on disabling camera",
        "Tab switching limit: Maximum 3 times before automatic submission",
        "Scoring: Points based on problem difficulty and submission time",
        "Submission lock: Once submitted, solutions cannot be modified",
        "Network stability: Multiple disconnections may lead to attempt penalties",
      ],
    },
  ];
  const score = [
    {
      title: "Scoring & Ranking",
      content: [
        "Each Question has 25 marks",
        "10% extra points for early submissions",
      ],
    },
  ];

  return (
    <div className="bg-[#E8F1FF] flex min-h-screen flex-col p-20">
      <h1 className="text-5xl font-semibold py-5 mb-5">
        DSA Coding Challenge 2024 - Rules & Guidelines
      </h1>
      
      {DsaContestDetails.map((detail, index) => (
        <div key={index} className="bg-white p-8 my-4 rounded-lg border-l-4 border-blue-300">
          <h2 className="text-3xl my-2">{detail.title}</h2>
          <p>{detail.content}</p>
        </div>
      ))}

      {rules.map((detail, index) => (
        <div key={index} className="my-2 flex gap-2 flex-col">
          <h1 className="text-3xl">{detail.title}</h1>
          <ul className="list-disc pl-6 bg-blue-50 my-4 rounded-lg">
            {detail.content.map((point, i) => (
              <li key={i} className="my-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {score.map((detail, index) => (
        <div key={index}>
          <h1 className="text-3xl">{detail.title}</h1>
          <ul className="list-disc pl-6 bg-blue-50 my-4 rounded-lg">
            {detail.content.map((point, i) => (
              <li key={i} className="my-2">
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <br />
      <br />
      <Link className="bg-[#6C7993] w-48 rounded-lg py-2 px-4 text-white text-2xl" to="/code">
        Go to contest
      </Link>
      <br />

      {/* Problems List: display contest questions from the passed contest data */}
      <div className="border border-gray-400 mt-8">
        <h1 className="bg-gray-300 py-2 px-3">Problems List</h1>
        <ul className="rounded-lg">
          {contest && contest.questions && contest.questions.length > 0 ? (
            contest.questions.map((question, i) => (
              <li key={i} className="my-2 px-3 py-2">
                {question.title || question}
              </li>
            ))
          ) : (
            <li className="my-2 px-3 py-2">No problems available.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ContestRulesPage;
