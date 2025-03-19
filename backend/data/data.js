export const questions = [
  {
    title: "Two Sum",
    description:
      "Given an array of integers (nums) and an integer target, return the indices of the two numbers such that they add up to the target. Assume that each input has exactly one solution and you may not use the same element twice.",
    difficulty: "Easy",
    points: 10,
    tags: ["array", "hash-table"],
    constraints: [
      "Each input would have exactly one solution",
      "You may not use the same element twice",
    ],
    testcases: [
      {
        input: JSON.stringify({ nums: [2, 7, 11, 15], target: 9 }),
        output: JSON.stringify([0, 1]),
        explanation: "The numbers at index 0 and 1 (2 + 7) add up to 9.",
      },
      {
        input: JSON.stringify({ nums: [-3, 4, 3, 90], target: 0 }),
        output: JSON.stringify([0, 2]),
        explanation: "The numbers -3 and 3 at indices 0 and 2 sum to 0.",
      },
      {
        input: JSON.stringify({ nums: [3, 3], target: 6 }),
        output: JSON.stringify([0, 1]),
        explanation: "Both elements are 3, which add up to 6.",
      },
      {
        input: JSON.stringify({ nums: [0, 4, 3, 0], target: 0 }),
        output: JSON.stringify([0, 3]),
        explanation: "The zeros at indices 0 and 3 sum to 0.",
      },
      {
        input: JSON.stringify({ nums: [1, 2, 3, 4], target: 5 }),
        output: JSON.stringify([0, 3]),
        explanation: "1 (index 0) + 4 (index 3) equals 5.",
      },
      {
        input: JSON.stringify({ nums: [1, 2, 3, 4, 5], target: 9 }),
        output: JSON.stringify([3, 4]),
        explanation: "4 (index 3) + 5 (index 4) equals 9.",
      },
      {
        input: JSON.stringify({ nums: [2, 5, 5, 11], target: 10 }),
        output: JSON.stringify([1, 2]),
        explanation: "The two 5s at indices 1 and 2 add up to 10.",
      },
      {
        input: JSON.stringify({ nums: [0, 1, 2, 3, 4], target: 7 }),
        output: JSON.stringify([3, 4]),
        explanation: "3 (index 3) + 4 (index 4) equals 7.",
      },
      {
        input: JSON.stringify({ nums: [-1, -2, -3, -4], target: -6 }),
        output: JSON.stringify([1, 3]),
        explanation:
          "The numbers -2 (index 1) and -4 (index 3) sum to -6.",
      },
      {
        input: JSON.stringify({
          nums: [10, 20, 10, 40, 50, 60, 70],
          target: 50,
        }),
        output: JSON.stringify([0, 3]),
        explanation: "10 (index 0) + 40 (index 3) equals 50.",
      },
    ],
  },
  {
    title: "Valid Parentheses",
    description:
      "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if every opening bracket has a corresponding closing bracket in the correct order.",
    difficulty: "Easy",
    points: 8,
    tags: ["stack", "string"],
    constraints: ["An empty string is considered valid"],
    testcases: [
      {
        input: JSON.stringify({ s: "()" }),
        output: JSON.stringify(true),
        explanation: "A simple valid pair of parentheses.",
      },
      {
        input: JSON.stringify({ s: "()[]{}" }),
        output: JSON.stringify(true),
        explanation: "Multiple valid pairs of different types.",
      },
      {
        input: JSON.stringify({ s: "(]" }),
        output: JSON.stringify(false),
        explanation: "Mismatched types: '(' does not match ']'.",
      },
      {
        input: JSON.stringify({ s: "([)]" }),
        output: JSON.stringify(false),
        explanation: "Incorrect nesting causes invalid order.",
      },
      {
        input: JSON.stringify({ s: "{[]}" }),
        output: JSON.stringify(true),
        explanation: "Properly nested and matching brackets.",
      },
      {
        input: JSON.stringify({ s: "" }),
        output: JSON.stringify(true),
        explanation: "An empty string is considered valid.",
      },
      {
        input: JSON.stringify({ s: "[" }),
        output: JSON.stringify(false),
        explanation: "A single opening bracket without a match is invalid.",
      },
      {
        input: JSON.stringify({ s: "([])" }),
        output: JSON.stringify(true),
        explanation: "Brackets are correctly nested.",
      },
      {
        input: JSON.stringify({ s: "((({{{[[[]]]}}})))" }),
        output: JSON.stringify(true),
        explanation: "Deeply nested valid sequence of brackets.",
      },
      {
        input: JSON.stringify({ s: "({[)]}" }),
        output: JSON.stringify(false),
        explanation: "The closing brackets do not match the opening order.",
      },
    ],
  },
  {
    title: "Merge Intervals",
    description:
      "Given an array of intervals where each interval is represented as [start, end], merge all overlapping intervals and return an array of the non-overlapping intervals.",
    difficulty: "Medium",
    points: 12,
    tags: ["array", "sorting"],
    constraints: [
      "Intervals may not be sorted",
      "Intervals with a single element should be returned as is",
    ],
    testcases: [
      {
        input: JSON.stringify({
          intervals: [
            [1, 3],
            [2, 6],
            [8, 10],
            [15, 18],
          ],
        }),
        output: JSON.stringify([
          [1, 6],
          [8, 10],
          [15, 18],
        ]),
        explanation: "Intervals [1,3] and [2,6] overlap and are merged.",
      },
      {
        input: JSON.stringify({
          intervals: [
            [1, 4],
            [4, 5],
          ],
        }),
        output: JSON.stringify([[1, 5]]),
        explanation: "Touching intervals merge into one interval.",
      },
      {
        input: JSON.stringify({ intervals: [[1, 4]] }),
        output: JSON.stringify([[1, 4]]),
        explanation: "A single interval remains unchanged.",
      },
      {
        input: JSON.stringify({ intervals: [] }),
        output: JSON.stringify([]),
        explanation: "An empty input returns an empty array.",
      },
      {
        input: JSON.stringify({
          intervals: [
            [6, 8],
            [1, 9],
            [2, 4],
            [4, 7],
          ],
        }),
        output: JSON.stringify([[1, 9]]),
        explanation: "All overlapping intervals merge into one.",
      },
      {
        input: JSON.stringify({
          intervals: [
            [1, 10],
            [2, 3],
            [4, 8],
            [11, 12],
          ],
        }),
        output: JSON.stringify([
          [1, 10],
          [11, 12],
        ]),
        explanation:
          "Intervals within [1,10] merge; non-overlapping interval [11,12] remains separate.",
      },
      {
        input: JSON.stringify({
          intervals: [
            [1, 3],
            [5, 7],
            [2, 4],
            [6, 8],
          ],
        }),
        output: JSON.stringify([
          [1, 4],
          [5, 8],
        ]),
        explanation: "Two separate groups of overlapping intervals are merged.",
      },
      {
        input: JSON.stringify({
          intervals: [
            [1, 100],
            [2, 50],
            [51, 100],
          ],
        }),
        output: JSON.stringify([[1, 100]]),
        explanation: "All intervals overlap to form one large interval.",
      },
      {
        input: JSON.stringify({
          intervals: [
            [5, 6],
            [1, 2],
            [3, 4],
          ],
        }),
        output: JSON.stringify([
          [1, 2],
          [3, 4],
          [5, 6],
        ]),
        explanation: "Non-overlapping intervals sorted by their start times.",
      },
      {
        input: JSON.stringify({
          intervals: [
            [1, 4],
            [0, 2],
            [3, 5],
          ],
        }),
        output: JSON.stringify([[0, 5]]),
        explanation:
          "Intervals overlap when considering the edge case with a smaller starting value.",
      },
    ],
  },
  {
    title: "Longest Substring Without Repeating Characters",
    description:
      "Given a string s, find the length of the longest substring without repeating characters.",
    difficulty: "Medium",
    points: 15,
    tags: ["string", "sliding-window"],
    constraints: [
      "The string length can be 0",
      "Character set is typically ASCII",
    ],
    testcases: [
      {
        input: JSON.stringify({ s: "abcabcbb" }),
        output: JSON.stringify(3),
        explanation: "The longest substring is 'abc', which has length 3.",
      },
      {
        input: JSON.stringify({ s: "bbbbb" }),
        output: JSON.stringify(1),
        explanation: "All characters are the same, so the longest substring is 'b'.",
      },
      {
        input: JSON.stringify({ s: "pwwkew" }),
        output: JSON.stringify(3),
        explanation: "The longest substring without repeating characters is 'wke'.",
      },
      {
        input: JSON.stringify({ s: "" }),
        output: JSON.stringify(0),
        explanation: "An empty string returns 0.",
      },
      {
        input: JSON.stringify({ s: " " }),
        output: JSON.stringify(1),
        explanation: "A single space is counted as a valid substring.",
      },
      {
        input: JSON.stringify({ s: "au" }),
        output: JSON.stringify(2),
        explanation: "Both characters are unique, so the answer is 2.",
      },
      {
        input: JSON.stringify({ s: "dvdf" }),
        output: JSON.stringify(3),
        explanation: "The longest substring is 'vdf'.",
      },
      {
        input: JSON.stringify({ s: "anviaj" }),
        output: JSON.stringify(5),
        explanation: "The longest substring is 'nviaj'.",
      },
      {
        input: JSON.stringify({ s: "aab" }),
        output: JSON.stringify(2),
        explanation: "The longest substring is 'ab'.",
      },
      {
        input: JSON.stringify({ s: "abcdefg" }),
        output: JSON.stringify(7),
        explanation: "All characters are unique; the length is 7.",
      },
    ],
  },
  {
    title: "Container With Most Water",
    description:
      "Given an array of non-negative integers (height) where each element represents the height of a line on the x-axis, find two lines that together with the x-axis form a container such that the container holds the most water. The area is determined by the shorter line and the distance between the lines.",
    difficulty: "Medium",
    points: 15,
    tags: ["array", "two-pointers"],
    constraints: [
      "At least two lines are needed to form a container",
      "Width is determined by the distance between indices",
    ],
    testcases: [
      {
        input: JSON.stringify({
          height: [1, 8, 6, 2, 5, 4, 8, 3, 7],
        }),
        output: JSON.stringify(49),
        explanation:
          "Max area is achieved between index 1 (height 8) and index 8 (height 7): min(8,7)*(8-1)=49.",
      },
      {
        input: JSON.stringify({ height: [1, 1] }),
        output: JSON.stringify(1),
        explanation: "Only two lines exist, forming a container of area 1.",
      },
      {
        input: JSON.stringify({ height: [4, 3, 2, 1, 4] }),
        output: JSON.stringify(16),
        explanation:
          "The container between the first and last index gives max area: min(4,4)*(4)=16.",
      },
      {
        input: JSON.stringify({ height: [1, 2, 1] }),
        output: JSON.stringify(2),
        explanation: "The container between indices 0 and 2 holds area 2.",
      },
      {
        input: JSON.stringify({ height: [2, 3, 10, 5, 7, 8, 9] }),
        output: JSON.stringify(36),
        explanation:
          "Optimal area found between indices with a good balance of height and width.",
      },
      {
        input: JSON.stringify({ height: [1, 3, 2, 5, 25, 24, 5] }),
        output: JSON.stringify(24),
        explanation:
          "Max area is achieved by using the high values (25 and 24) even with reduced width.",
      },
      {
        input: JSON.stringify({ height: [1, 2, 4, 3] }),
        output: JSON.stringify(4),
        explanation:
          "The container formed between the first and last lines gives an area of 4.",
      },
      {
        input: JSON.stringify({ height: [1, 2, 4, 3, 5] }),
        output: JSON.stringify(6),
        explanation:
          "An increasing then decreasing pattern yields a max container area of 6.",
      },
      {
        input: JSON.stringify({
          height: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
        }),
        output: JSON.stringify(25),
        explanation:
          "A descending sequence where the maximum area is determined by the limited width.",
      },
      {
        input: JSON.stringify({ height: [1, 2, 1, 2, 1, 2, 1, 2] }),
        output: JSON.stringify(8),
        explanation:
          "Alternating heights allow multiple container possibilities; the optimal area here is 8.",
      },
    ],
  },
];

// Example: Inserting into the database (using Mongoose)
// questions.forEach(async (q) => {
//   const questionDoc = new Question(q);
//   await questionDoc.save();
// });

