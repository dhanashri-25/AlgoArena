export const questions = [
  {
    quesNo: 1,
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
    quesNo: 2,
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
    quesNo: 3,
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
    quesNo: 4,
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
    quesNo: 5,
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
  {
    quesNo: 6,
    title: "Longest Palindromic Substring",
    description:
      "Given a string s, return the longest palindromic substring in s.",
    difficulty: "Medium",
    points: 20,
    tags: ["string", "dynamic-programming"],
    constraints: [
      "1 <= s.length <= 1000",
      "s consists of digits and English letters",
    ],
    testcases: [
      {
        input: JSON.stringify({ s: "babad" }),
        output: JSON.stringify("bab"),
        explanation:
          "One possible longest palindrome is 'bab'. (Note: 'aba' is also acceptable)",
      },
      {
        input: JSON.stringify({ s: "cbbd" }),
        output: JSON.stringify("bb"),
        explanation: "The longest palindromic substring is 'bb'.",
      },
      {
        input: JSON.stringify({ s: "a" }),
        output: JSON.stringify("a"),
        explanation: "A single character is a palindrome by itself.",
      },
    ],
  },
  {
    quesNo: 7,
    title: "Add Two Numbers",
    description:
      "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.",
    difficulty: "Medium",
    points: 25,
    tags: ["linked-list", "math"],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100]",
      "0 <= Node.val <= 9",
    ],
    testcases: [
      {
        input: JSON.stringify({ l1: [2, 4, 3], l2: [5, 6, 4] }),
        output: JSON.stringify([7, 0, 8]),
        explanation: "342 + 465 = 807, which is represented as [7,0,8].",
      },
      {
        input: JSON.stringify({ l1: [0], l2: [0] }),
        output: JSON.stringify([0]),
        explanation: "0 + 0 = 0.",
      },
      {
        input: JSON.stringify({ l1: [9, 9, 9, 9, 9, 9, 9], l2: [9, 9, 9, 9] }),
        output: JSON.stringify([8, 9, 9, 9, 0, 0, 0, 1]),
        explanation:
          "Addition with multiple carries results in [8,9,9,9,0,0,0,1].",
      },
    ],
  },
  {
    quesNo: 8,
    title: "Longest Common Prefix",
    description:
      "Given an array of strings, return the longest common prefix string amongst them.",
    difficulty: "Easy",
    points: 8,
    tags: ["string"],
    constraints: ["All strings consist of lowercase letters"],
    testcases: [
      {
        input: JSON.stringify({ strs: ["flower", "flow", "flight"] }),
        output: JSON.stringify("fl"),
        explanation: "The longest common prefix is 'fl'.",
      },
      {
        input: JSON.stringify({ strs: ["dog", "racecar", "car"] }),
        output: JSON.stringify(""),
        explanation: "There is no common prefix among the strings.",
      },
      {
        input: JSON.stringify({ strs: ["interspecies", "interstellar", "interstate"] }),
        output: JSON.stringify("inters"),
        explanation: "The common prefix is 'inters'.",
      },
    ],
  },
  {
    quesNo: 9,
    title: "Valid Anagram",
    description:
      "Given two strings s and t, determine if t is an anagram of s.",
    difficulty: "Easy",
    points: 8,
    tags: ["hash-table", "sorting"],
    constraints: ["Strings consist of lowercase alphabets"],
    testcases: [
      {
        input: JSON.stringify({ s: "anagram", t: "nagaram" }),
        output: JSON.stringify(true),
        explanation: "t is an anagram of s.",
      },
      {
        input: JSON.stringify({ s: "rat", t: "car" }),
        output: JSON.stringify(false),
        explanation: "t is not an anagram of s.",
      },
      {
        input: JSON.stringify({ s: "a", t: "a" }),
        output: JSON.stringify(true),
        explanation: "Both strings are identical.",
      },
    ],
  },
  {
    quesNo: 10,
    title: "Binary Tree Inorder Traversal",
    description:
      "Given the root of a binary tree, return the inorder traversal of its nodes' values.",
    difficulty: "Medium",
    points: 15,
    tags: ["tree", "depth-first-search"],
    constraints: ["The number of nodes in the tree is in the range [0, 100]"],
    testcases: [
      {
        input: JSON.stringify({ root: [1, null, 2, 3] }),
        output: JSON.stringify([1, 3, 2]),
        explanation:
          "The inorder traversal visits nodes in left-root-right order.",
      },
      {
        input: JSON.stringify({ root: [] }),
        output: JSON.stringify([]),
        explanation: "An empty tree returns an empty array.",
      },
      {
        input: JSON.stringify({ root: [1] }),
        output: JSON.stringify([1]),
        explanation: "A single-node tree returns an array with that node.",
      },
    ],
  },
  {
    quesNo: 11,
    title: "Symmetric Tree",
    description:
      "Given a binary tree, check whether it is a mirror of itself (symmetric around its center).",
    difficulty: "Easy",
    points: 10,
    tags: ["tree", "recursion"],
    constraints: ["The number of nodes is between 1 and 1000"],
    testcases: [
      {
        input: JSON.stringify({ root: [1, 2, 2, 3, 4, 4, 3] }),
        output: JSON.stringify(true),
        explanation: "The tree is symmetric.",
      },
      {
        input: JSON.stringify({ root: [1, 2, 2, null, 3, null, 3] }),
        output: JSON.stringify(false),
        explanation: "The tree is not symmetric due to mismatched child nodes.",
      },
      {
        input: JSON.stringify({ root: [] }),
        output: JSON.stringify(true),
        explanation: "An empty tree is considered symmetric.",
      },
    ],
  },
  {
    quesNo: 12,
    title: "Best Time to Buy and Sell Stock",
    description:
      "Given an array prices where prices[i] is the price of a given stock on the i-th day, find the maximum profit you can achieve. You may complete at most one transaction.",
    difficulty: "Easy",
    points: 10,
    tags: ["array", "dynamic-programming"],
    constraints: ["1 <= prices.length <= 10^5"],
    testcases: [
      {
        input: JSON.stringify({ prices: [7, 1, 5, 3, 6, 4] }),
        output: JSON.stringify(5),
        explanation: "Buy at 1 and sell at 6 to yield a profit of 5.",
      },
      {
        input: JSON.stringify({ prices: [7, 6, 4, 3, 1] }),
        output: JSON.stringify(0),
        explanation: "No profit is possible as the price decreases each day.",
      },
      {
        input: JSON.stringify({ prices: [3, 2, 6, 5, 0, 3] }),
        output: JSON.stringify(4),
        explanation: "Buy at 2 and sell at 6 for a maximum profit of 4.",
      },
    ],
  },
  {
    quesNo: 13,
    title: "Climbing Stairs",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "Easy",
    points: 8,
    tags: ["dynamic-programming"],
    constraints: ["1 <= n <= 45"],
    testcases: [
      {
        input: JSON.stringify({ n: 2 }),
        output: JSON.stringify(2),
        explanation: "Two ways: 1+1 or 2.",
      },
      {
        input: JSON.stringify({ n: 3 }),
        output: JSON.stringify(3),
        explanation: "Three ways: 1+1+1, 1+2, and 2+1.",
      },
      {
        input: JSON.stringify({ n: 1 }),
        output: JSON.stringify(1),
        explanation: "Only one way to climb one step.",
      },
    ],
  },
  {
    quesNo: 14,
    title: "Course Schedule",
    description:
      "There are a total of n courses you have to take, labeled from 0 to n - 1. Some courses may have prerequisites. Determine if it is possible to finish all courses.",
    difficulty: "Medium",
    points: 15,
    tags: ["graph", "topological-sort"],
    constraints: ["1 <= numCourses <= 2000"],
    testcases: [
      {
        input: JSON.stringify({ numCourses: 2, prerequisites: [[1, 0]] }),
        output: JSON.stringify(true),
        explanation: "It is possible to finish all courses.",
      },
      {
        input: JSON.stringify({ numCourses: 2, prerequisites: [[1, 0], [0, 1]] }),
        output: JSON.stringify(false),
        explanation: "A cycle exists, making it impossible to finish all courses.",
      },
      {
        input: JSON.stringify({ numCourses: 3, prerequisites: [] }),
        output: JSON.stringify(true),
        explanation: "With no prerequisites, all courses can be completed.",
      },
    ],
  },
  {
    quesNo: 15,
    title: "Minimum Path Sum",
    description:
      "Given a m x n grid filled with non-negative numbers, find a path from the top left to the bottom right which minimizes the sum of all numbers along its path.",
    difficulty: "Medium",
    points: 15,
    tags: ["dynamic-programming", "array"],
    constraints: ["The dimensions of the grid are at most 200"],
    testcases: [
      {
        input: JSON.stringify({
          grid: [
            [1, 3, 1],
            [1, 5, 1],
            [4, 2, 1],
          ],
        }),
        output: JSON.stringify(7),
        explanation:
          "The path 1→3→1→1→1 minimizes the sum to 7.",
      },
      {
        input: JSON.stringify({
          grid: [
            [1, 2, 3],
            [4, 5, 6],
          ],
        }),
        output: JSON.stringify(12),
        explanation:
          "The path 1→2→3→6 yields the minimum path sum of 12.",
      },
      {
        input: JSON.stringify({ grid: [[5]] }),
        output: JSON.stringify(5),
        explanation: "Only one cell exists, so the sum is 5.",
      },
    ],
  },
  {
    quesNo: 16,
    title: "Decode Ways",
    description:
      "A message containing letters is encoded to digits using 'A' -> 1, 'B' -> 2, ... 'Z' -> 26. Given a non-empty string containing only digits, determine the total number of ways to decode it.",
    difficulty: "Medium",
    points: 15,
    tags: ["string", "dynamic-programming"],
    constraints: ["The input string contains only digits and may have leading zeros"],
    testcases: [
      {
        input: JSON.stringify({ s: "12" }),
        output: JSON.stringify(2),
        explanation:
          "It can be decoded as '1 2' (AB) or '12' (L).",
      },
      {
        input: JSON.stringify({ s: "226" }),
        output: JSON.stringify(3),
        explanation:
          "Possible decodings are '2 2 6' (BBF), '22 6' (VF), and '2 26' (BZ).",
      },
      {
        input: JSON.stringify({ s: "0" }),
        output: JSON.stringify(0),
        explanation: "No valid decoding exists for '0'.",
      },
    ],
  },
  {
    quesNo: 17,
    title: "Word Break",
    description:
      "Given a string s and a dictionary of strings wordDict, determine if s can be segmented into a space-separated sequence of one or more dictionary words.",
    difficulty: "Medium",
    points: 15,
    tags: ["dynamic-programming", "backtracking"],
    constraints: ["Words in wordDict may be reused multiple times"],
    testcases: [
      {
        input: JSON.stringify({ s: "leetcode", wordDict: ["leet", "code"] }),
        output: JSON.stringify(true),
        explanation: "The string can be segmented as 'leet code'.",
      },
      {
        input: JSON.stringify({ s: "applepenapple", wordDict: ["apple", "pen"] }),
        output: JSON.stringify(true),
        explanation: "The string can be segmented as 'apple pen apple'.",
      },
      {
        input: JSON.stringify({
          s: "catsandog",
          wordDict: ["cats", "dog", "sand", "and", "cat"],
        }),
        output: JSON.stringify(false),
        explanation: "The string cannot be segmented into dictionary words.",
      },
    ],
  },
  {
    quesNo: 18,
    title: "Subarray Sum Equals K",
    description:
      "Given an array of integers and an integer k, find the total number of continuous subarrays whose sum equals to k.",
    difficulty: "Medium",
    points: 15,
    tags: ["array", "hash-table"],
    constraints: ["The array length is at most 20000"],
    testcases: [
      {
        input: JSON.stringify({ nums: [1, 1, 1], k: 2 }),
        output: JSON.stringify(2),
        explanation:
          "There are two subarrays ([1,1] starting at index 0 and 1) that sum to 2.",
      },
      {
        input: JSON.stringify({ nums: [1, 2, 3], k: 3 }),
        output: JSON.stringify(2),
        explanation:
          "Subarrays [1,2] and [3] both sum to 3.",
      },
      {
        input: JSON.stringify({ nums: [1], k: 0 }),
        output: JSON.stringify(0),
        explanation: "No subarray sums to 0.",
      },
    ],
  },
  {
    quesNo: 19,
    title: "Maximum Subarray",
    description:
      "Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.",
    difficulty: "Easy",
    points: 10,
    tags: ["array", "divide-and-conquer"],
    constraints: ["The array contains at least one element"],
    testcases: [
      {
        input: JSON.stringify({ nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }),
        output: JSON.stringify(6),
        explanation:
          "The subarray [4,-1,2,1] has the largest sum of 6.",
      },
      {
        input: JSON.stringify({ nums: [1] }),
        output: JSON.stringify(1),
        explanation: "Only one element exists, so the maximum sum is that element.",
      },
      {
        input: JSON.stringify({ nums: [5, 4, -1, 7, 8] }),
        output: JSON.stringify(23),
        explanation:
          "The entire array forms the subarray with the maximum sum of 23.",
      },
    ],
  },
  {
    quesNo: 20,
    title: "Coin Change",
    description:
      "Given coins of different denominations and a total amount, determine the fewest number of coins needed to make up that amount. If it is not possible, return -1.",
    difficulty: "Medium",
    points: 20,
    tags: ["dynamic-programming"],
    constraints: ["An infinite number of each coin type is available"],
    testcases: [
      {
        input: JSON.stringify({ coins: [1, 2, 5], amount: 11 }),
        output: JSON.stringify(3),
        explanation: "11 can be made with 5+5+1, so 3 coins are needed.",
      },
      {
        input: JSON.stringify({ coins: [2], amount: 3 }),
        output: JSON.stringify(-1),
        explanation: "It is impossible to form the amount with the given coin.",
      },
      {
        input: JSON.stringify({ coins: [1], amount: 0 }),
        output: JSON.stringify(0),
        explanation: "Zero amount requires zero coins.",
      },
    ],
  },
];