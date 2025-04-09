export const questions = [
  {
    quesNo: 1,
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    difficulty: "Easy",
    points: 10,
    tags: ["array", "hash-map"],
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
    testcases: [
      { input: ["nums", "[2, 7, 11, 15]", "target", "9"], output: "[0,1]" },
      { input: ["nums", "[3, 2, 4]", "target", "6"], output: "[1,2]" },
      { input: ["nums", "[3, 3]", "target", "6"], output: "[0,1]" },
      { input: ["nums", "[4, 5, 3, 7]", "target", "8"], output: "[1,2]" },
      {
        input: ["nums", "[-1, -2, -3, -4, -5]", "target", "-8"],
        output: "[2,4]",
      },
      { input: ["nums", "[0, 4, 3, 0]", "target", "0"], output: "[0,3]" },
      { input: ["nums", "[3, 2, 95, 4, -3]", "target", "92"], output: "[2,4]" },
      { input: ["nums", "[1, 3, 4, 2]", "target", "6"], output: "[2,3]" },
      { input: ["nums", "[4, 2, 6, 3]", "target", "7"], output: "[1,3]" },
      { input: ["nums", "[2, 5, 5, 11]", "target", "10"], output: "[1,2]" },
    ],
    templateCode: {
      Python:
        " from typing import List \n def two_sum(nums: list, target: int) -> list:\n   ",
      Java: "public class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}",
      Cpp: "class Solution {\n public: \n vector<int> twoSum(vector<int>& nums, int target) {\n    return {};\n} \n };",
    },

    wrapperCode: {
      Java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {nums};\n        int target = {target};\n        int[] result = sol.twoSum(nums, target);\n        System.out.print("[");\n        for (int i = 0; i < result.length; i++) {\n            System.out.print(result[i]);\n            if (i < result.length - 1) {\n                System.out.print(",");\n            }\n        }\n        System.out.println("]");\n    }\n}',

      Python:
        'if _name_ == "_main_":\n    nums = REPLACE_WITH_INPUT_ARRAY\n    target = REPLACE_WITH_TARGET\n    print(two_sum(nums, target))',

      Cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    Solution sol;\n    vector<int> nums = {nums};\n    int target = {target};\n    vector<int> result = sol.twoSum(nums, target);\n    cout << "[";\n    for (size_t i = 0; i < result.size(); i++) {\n        cout << result[i];\n        if (i != result.size() - 1) cout << ",";\n    }\n    cout << "]" << endl;\n    return 0;\n}',
    },
  },
  {
    quesNo: 2,
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    difficulty: "Easy",
    points: 10,
    tags: ["stack", "string"],
    constraints: ["1 <= s.length <= 10^4"],
    testcases: [
      { input: ["s", "()"], output: "true" },
      { input: ["s", "()[]{}"], output: "true" },
      { input: ["s", "(]"], output: "false" },
      { input: ["s", "([)]"], output: "false" },
      { input: ["s", "{[]}"], output: "true" },
      { input: ["s", "{[()]}"], output: "true" },
      { input: ["s", "(((("], output: "false" },
      { input: ["s", "}}}}"], output: "false" },
      { input: ["s", "[{({})]}"], output: "false" },
      { input: ["s", "({[()]})"], output: "true" },
    ],
    templateCode: {
      Python:
        "class Solution:\n    def isValid(self, s: str) -> bool:\n        pass",
      Java: "class Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}",
      Cpp: "class Solution {\npublic:\n    bool isValid(string s) {\n        return false;\n    }\n};",
    },
    wrapperCode: {
      Java: 'import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        String input = "{s}";\n        System.out.println(sol.isValid(input));\n    }\n}',
      Python:
        'if _name_ == "_main_":\n    sol = Solution()\n    input_str = "{s}"\n    print(sol.isValid(input_str))',
      Cpp: '#include <iostream>\n#include <string>\nusing namespace std;\nint main() {\n    Solution sol;\n    string input = "{s}";\n    cout << sol.isValid(input) << endl;\n    return 0;\n}',
    },
  },

  {
    quesNo: 3,
    title: "Merge Two Sorted Lists",
    description:
      "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list and return the head of the merged linked list.",
    difficulty: "Easy",
    points: 10,
    tags: ["linked-list", "recursion"],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
    ],
    testcases: [
      { input: ["list1", "[]", "list2", "[]"], output: "[]" },
      {
        input: ["list1", "[1,2,4]", "list2", "[1,3,4]"],
        output: "[1,1,2,3,4,4]",
      },
      { input: ["list1", "[]", "list2", "[0]"], output: "[0]" },
      {
        input: ["list1", "[2, 5, 7]", "list2", "[1, 3, 6]"],
        output: "[1,2,3,5,6,7]",
      },
      {
        input: ["list1", "[0, 3, 7]", "list2", "[1, 5, 8]"],
        output: "[0,1,3,5,7,8]",
      },
      {
        input: ["list1", "[-10, -5, 0]", "list2", "[-7, -3, 2]"],
        output: "[-10,-7,-5,-3,0,2]",
      },
      {
        input: ["list1", "[1, 3, 5, 7]", "list2", "[2, 4, 6, 8]"],
        output: "[1,2,3,4,5,6,7,8]",
      },
      {
        input: ["list1", "[5]", "list2", "[1, 2, 3, 4, 6]"],
        output: "[1,2,3,4,5,6]",
      },
      {
        input: ["list1", "[1, 2, 3]", "list2", "[4, 5, 6]"],
        output: "[1,2,3,4,5,6]",
      },
      { input: ["list1", "[1]", "list2", "[1]"], output: "[1,1]" },
    ],
    templateCode: {
      Python:
        "# Definition for singly-linked list.\n# class ListNode:\n#     def _init_(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\nclass Solution:\n    def mergeTwoLists(self, list1: ListNode, list2: ListNode) -> ListNode:\n        pass",

      Java: "// Definition for singly-linked list.\n// class ListNode {\n//     int val;\n//     ListNode next;\n//     ListNode(int val) {\n//         this.val = val;\n//         this.next = null;\n//     }\n// }\n\nclass Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        return null;\n    }\n}",

      Cpp: "// Definition for singly-linked list.\n// struct ListNode {\n//     int val;\n//     ListNode next;\n//     ListNode(int x) : val(x), next(nullptr) {}\n// };\n\nclass Solution {\npublic:\n    ListNode mergeTwoLists(ListNode* list1, ListNode* list2) {\n        return nullptr;\n    }\n};",
    },

    wrapperCode: {
      Java: 'import java.util.*;\n\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) {\n        this.val = val;\n        this.next = null;\n    }\n}\n\npublic class Main {\n    public static ListNode createLinkedList(int[] arr) {\n        if (arr.length == 0) return null;\n        ListNode head = new ListNode(arr[0]);\n        ListNode temp = head;\n        for (int i = 1; i < arr.length; i++) {\n            temp.next = new ListNode(arr[i]);\n            temp = temp.next;\n        }\n        return head;\n    }\n\n    public static void printList(ListNode head) {\n        System.out.print("[");\n        while (head != null) {\n            System.out.print(head.val);\n            head = head.next;\n            if (head != null) {\n                System.out.print(",");\n            }\n        }\n        System.out.println("]");\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] arr1 = {list1};\n        int[] arr2 = {list2};\n        ListNode list1 = createLinkedList(arr1);\n        ListNode list2 = createLinkedList(arr2);\n        ListNode result = sol.mergeTwoLists(list1, list2);\n        printList(result);\n    }\n}',

      Python:
        'class ListNode:\n    def _init(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef create_linked_list(arr):\n    if not arr: return None\n    nodes = [ListNode(val) for val in arr]\n    for i in range(len(arr) - 1):\n        nodes[i].next = nodes[i + 1]\n    return nodes[0]\n\ndef print_list(head):\n    result = []\n    while head:\n        result.append(head.val)\n        head = head.next\n    print("[" + ",".join(map(str, result)) + "]")\n\nif __name_ == "_main_":\n    sol = Solution()\n    arr1 = {list1}\n    arr2 = {list2}\n    list1 = create_linked_list(arr1)\n    list2 = create_linked_list(arr2)\n    result = sol.mergeTwoLists(list1, list2)\n    print_list(result)',

      Cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode createLinkedList(vector<int>& arr) {\n    if (arr.empty()) return nullptr;\n    ListNode* head = new ListNode(arr[0]);\n    ListNode* temp = head;\n    for (size_t i = 1; i < arr.size(); i++) {\n        temp->next = new ListNode(arr[i]);\n        temp = temp->next;\n    }\n    return head;\n}\n\nvoid printList(ListNode* head) {\n    cout << "[";\n    while (head) {\n        cout << head->val;\n        head = head->next;\n        if (head) cout << ",";\n    }\n    cout << "]" << endl;\n}\n\nint main() {\n    Solution sol;\n    vector<int> arr1 = {list1};\n    vector<int> arr2 = {list2};\n    ListNode* list1 = createLinkedList(arr1);\n    ListNode* list2 = createLinkedList(arr2);\n    ListNode* result = sol.mergeTwoLists(list1, list2);\n    printList(result);\n    return 0;\n}',
    },
  },
  {
    quesNo: 4,
    title: "Best Time to Buy and Sell Stock",
    description:
      "You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve. If no profit can be achieved, return 0.",
    difficulty: "Easy",
    points: 5,
    tags: ["array", "dynamic-programming"],
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    testcases: [
      { input: ["prices", "[7,1,5,3,6,4]"], output: "5" },
      { input: ["prices", "[7,6,4,3,1]"], output: "0" },
      { input: ["prices", "[1,2,3,4,5]"], output: "4" },
      { input: ["prices", "[2,4,1]"], output: "2" },
      { input: ["prices", "[3,3,3,3,3]"], output: "0" },
      { input: ["prices", "[1,2,4,2,5,7,2,4,9,0]"], output: "8" },
      { input: ["prices", "[2,1,2,1,2,1,2,1,2]"], output: "1" },
      { input: ["prices", "[2,1,4,5,2,9,7]"], output: "8" },
      { input: ["prices", "[1,2]"], output: "1" },
      { input: ["prices", "[3,2,6,5,0,3]"], output: "4" },
    ],
    templateCode: {
      Python:
        "from typing import List\n\nclass Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass",
      Java: "import java.util.*;\n\nclass Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}",
      Cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};",
    },
    wrapperCode: {
      Java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] prices = {prices};\n        System.out.println(sol.maxProfit(prices));\n    }\n}",
      Python:
        'if _name_ == "_main_":\n    sol = Solution()\n    prices = {prices}\n    print(sol.maxProfit(prices))',
      Cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    Solution sol;\n    vector<int> prices = {prices};\n    cout << sol.maxProfit(prices) << endl;\n    return 0;\n}",
    },
  },

  {
    quesNo: 5,
    title: "Maximum Subarray",
    description:
      "Given an integer array nums, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
    difficulty: "Medium",
    points: 10,
    tags: ["array", "dynamic-programming"],
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    testcases: [
      { input: ["nums", "[-2,1,-3,4,-1,2,1,-5,4]"], output: "6" },
      { input: ["nums", "[1]"], output: "1" },
      { input: ["nums", "[5,4,-1,7,8]"], output: "23" },
      { input: ["nums", "[-1,-2,-3,-4]"], output: "-1" },
      { input: ["nums", "[1,2,3,4,5]"], output: "15" },
      { input: ["nums", "[-5,1,2,3,-2,4,-1]"], output: "8" },
      { input: ["nums", "[0,-3,1,1,1,1,-2,3]"], output: "5" },
      { input: ["nums", "[-2,-1,-3,-4,-5]"], output: "-1" },
      { input: ["nums", "[1,2,-1,-2,2,1,-2,1,4,-5,4]"], output: "6" },
      { input: ["nums", "[3,-1,4,5,-2,6,-1,3]"], output: "15" },
    ],
    templateCode: {
      Python:
        "from typing import List\n\nclass Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass",
      Java: "import java.util.*;\n\nclass Solution {\n    public int maxSubArray(int[] nums) {\n        return 0;\n    }\n}",
      Cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        return 0;\n    }\n};",
    },
    wrapperCode: {
      Java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {nums};\n        System.out.println(sol.maxSubArray(nums));\n    }\n}",
      Python:
        'if _name_ == "_main_":\n    sol = Solution()\n    nums = {nums}\n    print(sol.maxSubArray(nums))',
      Cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    Solution sol;\n    vector<int> nums = {nums};\n    cout << sol.maxSubArray(nums) << endl;\n    return 0;\n}",
    },
  },
  {
    quesNo: 6,
    title: "Climbing Stairs",
    description:
      "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    difficulty: "Easy",
    points: 10,
    tags: ["dynamic-programming", "math"],
    constraints: ["1 <= n <= 45"],
    testcases: [
      { input: ["n", "2"], output: "2" },
      { input: ["n", "3"], output: "3" },
      { input: ["n", "4"], output: "5" },
      { input: ["n", "5"], output: "8" },
      { input: ["n", "6"], output: "13" },
      { input: ["n", "10"], output: "89" },
      { input: ["n", "1"], output: "1" },
      { input: ["n", "30"], output: "1346269" },
      { input: ["n", "40"], output: "165580141" },
      { input: ["n", "45"], output: "1836311903" },
    ],
    templateCode: {
      Python:
        "class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass",
      Java: "import java.util.*;\n\nclass Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}",
      Cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int climbStairs(int n) {\n        return 0;\n    }\n};",
    },
    wrapperCode: {
      Java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int n = {n};\n        System.out.println(sol.climbStairs(n));\n    }\n}",
      Python:
        'if _name_ == "_main_":\n    sol = Solution()\n    n = {n}\n    print(sol.climbStairs(n))',
      Cpp: "#include <iostream>\nusing namespace std;\n\nint main() {\n    Solution sol;\n    int n = {n};\n    cout << sol.climbStairs(n) << endl;\n    return 0;\n}",
    },
  },
  {
    quesNo: 7,
    title: "Linked List Cycle",
    description:
      "Given head, the head of a linked list, determine if the linked list has a cycle in it.",
    difficulty: "Easy",
    points: 10,
    tags: ["linked-list", "two-pointers"],
    constraints: [
      "The number of nodes in the list is in the range [0, 10^4].",
      "-10^5 <= Node.val <= 10^5",
    ],
    testcases: [
      { input: ["head", "[3,2,0,-4]", "pos", "1"], output: "true" },
      { input: ["head", "[1,2]", "pos", "0"], output: "true" },
      { input: ["head", "[1]", "pos", "-1"], output: "false" },
      { input: ["head", "[2,3,4,5,6,7,8,9]", "pos", "3"], output: "true" },
      { input: ["head", "[1,2,3,4,5]", "pos", "-1"], output: "false" },
      { input: ["head", "[10,20,30,40,50]", "pos", "1"], output: "true" },
      { input: ["head", "[1,2]", "pos", "-1"], output: "false" },
      { input: ["head", "[0,-1]", "pos", "0"], output: "true" },
      {
        input: ["head", "[1,2,3,4,5,6,7,8,9,10]", "pos", "-1"],
        output: "false",
      },
      { input: ["head", "[99]", "pos", "-1"], output: "false" },
    ],
    templateCode: {
      Python:
        "# Definition for singly-linked list.\n# class ListNode:\n#     def _init_(self, val=0, next=None):\n#         self.val = val\n#         self.next = next\n\nclass Solution:\n    def hasCycle(self, head: ListNode) -> bool:\n        pass",

      Java: "// Definition for singly-linked list.\n// class ListNode {\n//     int val;\n//     ListNode next;\n//     ListNode(int val) {\n//         this.val = val;\n//         this.next = null;\n//     }\n// }\n\nclass Solution {\n    public boolean hasCycle(ListNode head) {\n        return false;\n    }\n}",

      Cpp: "// Definition for singly-linked list.\n// struct ListNode {\n//     int val;\n//     ListNode *next;\n//     ListNode(int x) : val(x), next(nullptr) {}\n// };\n\nclass Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        return false;\n    }\n};",
    },

    wrapperCode: {
      Java: "import java.util.*;\n\nclass ListNode {\n    int val;\n    ListNode next;\n    ListNode(int val) {\n        this.val = val;\n        this.next = null;\n    }\n}\n\npublic class Main {\n    public static ListNode createLinkedList(int[] arr, int pos) {\n        if (arr.length == 0) return null;\n        ListNode head = new ListNode(arr[0]);\n        ListNode temp = head, cycleNode = null;\n        if (pos == 0) cycleNode = head;  // Ensure cycleNode is set for pos 0\n        for (int i = 1; i < arr.length; i++) {\n            temp.next = new ListNode(arr[i]);\n            temp = temp.next;\n            if (i == pos) cycleNode = temp;\n        }\n        if (pos != -1) temp.next = cycleNode;\n        return head;\n    }\n\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] arr = {head};\n        int pos = {pos};\n        ListNode head = createLinkedList(arr, pos);\n        System.out.println(sol.hasCycle(head));\n    }\n}",

      Python:
        'class ListNode:\n    def _init(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef create_linked_list(arr, pos):\n    if not arr:\n        return None\n    nodes = [ListNode(val) for val in arr]\n    for i in range(len(arr) - 1):\n        nodes[i].next = nodes[i + 1]\n    if pos != -1:\n        nodes[-1].next = nodes[pos]\n    return nodes[0]\n\nif __name_ == "_main_":\n    sol = Solution()\n    arr = {head}\n    pos = {pos}\n    head = create_linked_list(arr, pos)\n    print(sol.hasCycle(head))',

      Cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\n\nstruct ListNode {\n    int val;\n    ListNode next;\n    ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode createLinkedList(vector<int>& arr, int pos) {\n    if (arr.empty()) return nullptr;\n    ListNode* head = new ListNode(arr[0]);\n    ListNode* temp = head, cycleNode = nullptr;\n    if (pos == 0) cycleNode = head;  // Handle pos = 0 case\n    for (size_t i = 1; i < arr.size(); i++) {\n        temp->next = new ListNode(arr[i]);\n        temp = temp->next;\n        if (i == pos) cycleNode = temp;\n    }\n    if (pos != -1) temp->next = cycleNode;\n    return head;\n}\n\nint main() {\n    Solution sol;\n    vector<int> arr = {head};\n    int pos = {pos};\n    ListNode head = createLinkedList(arr, pos);\n    cout << (sol.hasCycle(head) ? "true" : "false") << endl;\n    return 0;\n}',
    },
  },
  {
    quesNo: 8,
    title: "Find the Duplicate Number",
    description:
      "Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n] inclusive, return the duplicate number in the array.",
    difficulty: "Medium",
    points: 10,
    tags: ["array", "binary-search", "two-pointers"],
    constraints: [
      "2 <= n <= 10^5",
      "Each integer appears only once except for one duplicate.",
    ],
    testcases: [
      { input: ["nums", "[1,3,4,2,2]"], output: "2" },
      { input: ["nums", "[3,1,3,4,2]"], output: "3" },
      { input: ["nums", "[2,2,2,2,2]"], output: "2" },
      { input: ["nums", "[1,1]"], output: "1" },
      { input: ["nums", "[9,6,3,1,7,4,2,8,5,6]"], output: "6" },
      { input: ["nums", "[10,9,8,7,6,5,4,3,2,1,1]"], output: "1" },
      { input: ["nums", "[5,5,4,3,2,1]"], output: "5" },
      { input: ["nums", "[1,2,3,4,5,6,7,8,9,9]"], output: "9" },
      { input: ["nums", "[100,99,98,97,96,95,95]"], output: "95" },
      { input: ["nums", "[2,1,2]"], output: "2" },
    ],
    templateCode: {
      Python:
        "from typing import List\n\nclass Solution:\n    def findDuplicate(self, nums: List[int]) -> int:\n        pass",

      Java: "class Solution {\n    public int findDuplicate(int[] nums) {\n        return 0;\n    }\n}",

      Cpp: "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findDuplicate(vector<int>& nums) {\n        return 0;\n    }\n};",
    },

    wrapperCode: {
      Java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {nums};\n        System.out.println(sol.findDuplicate(nums));\n    }\n}",

      Python:
        'if _name_ == "_main_":\n    sol = Solution()\n    nums = {nums}\n    print(sol.findDuplicate(nums))',

      Cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    Solution sol;\n    vector<int> nums = {nums};\n    cout << sol.findDuplicate(nums) << endl;\n    return 0;\n}",
    },
  },
  {
    quesNo: 9,
    title: "Search in Rotated Sorted Array",
    description:
      "There is an integer array nums sorted in ascending order (with distinct values) that has been rotated at some pivot unknown to you beforehand. Given nums and target, return the index of target if found, otherwise return -1.",
    difficulty: "Medium",
    points: 10,
    tags: ["array", "binary-search"],
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values are distinct.",
    ],
    testcases: [
      { input: ["nums", "[4,5,6,7,0,1,2]", "target", "0"], output: "4" },
      { input: ["nums", "[4,5,6,7,0,1,2]", "target", "3"], output: "-1" },
      { input: ["nums", "[1]", "target", "0"], output: "-1" },
      { input: ["nums", "[1]", "target", "1"], output: "0" },
      { input: ["nums", "[3,4,5,6,7,1,2]", "target", "6"], output: "3" },
      { input: ["nums", "[5,6,7,8,9,1,2,3,4]", "target", "1"], output: "5" },
      { input: ["nums", "[9,10,11,1,2,3,4,5]", "target", "10"], output: "1" },
      { input: ["nums", "[2,3,4,5,6,7,8,9,1]", "target", "1"], output: "8" },
      { input: ["nums", "[6,7,8,9,1,2,3,4,5]", "target", "5"], output: "8" },
      { input: ["nums", "[1,2,3,4,5,6,7,8,9]", "target", "7"], output: "6" },
    ],
    templateCode: {
      Python:
        " from typing import List \n \n class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass",
      Java: "class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}",
      Cpp: "class Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};",
    },
    wrapperCode: {
      Java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {nums};\n        int target = {target};\n        System.out.println(sol.search(nums, target));\n    }\n}",
      Python:
        '\nif _name_ == "_main_":\n    sol = Solution()\n    nums = {nums}\n    target = {target}\n    print(sol.search(nums, target))',
      Cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    Solution sol;\n    vector<int> nums = {nums};\n    int target = {target};\n    cout << sol.search(nums, target) << endl;\n    return 0;\n}",
    },
  },
  {
    quesNo: 10,
    title: "Longest Consecutive Sequence",
    description:
      "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
    difficulty: "Medium",
    points: 10,
    tags: ["array", "union-find", "hash-table"],
    constraints: ["0 <= nums.length <= 10^5", "-10^9 <= nums[i] <= 10^9"],
    testcases: [
      { input: ["nums", "[100,4,200,1,3,2]"], output: "4" },
      { input: ["nums", "[0,3,7,2,5,8,4,6,0,1]"], output: "9" },
      { input: ["nums", "[]"], output: "0" },
      { input: ["nums", "[1,2,0,1]"], output: "3" },
      { input: ["nums", "[9,1,4,7,3,-1,0,5,8,-1,6]"], output: "7" },
      { input: ["nums", "[5,6,7,8,9,10]"], output: "6" },
      { input: ["nums", "[1,3,5,7,9,11,13,15]"], output: "1" },
      { input: ["nums", "[10,20,30,40,50]"], output: "1" },
      { input: ["nums", "[1,2,3,4,5,6,7,8,9,10]"], output: "10" },
      { input: ["nums", "[-1,-2,-3,-4,-5]"], output: "5" },
    ],
    templateCode: {
      Python:
        " from typing import List\n \n class Solution:\n    def longestConsecutive(self, nums: List[int]) -> int:\n        pass",
      Java: "class Solution {\n    public int longestConsecutive(int[] nums) {\n        return 0;\n    }\n}",
      Cpp: "class Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        return 0;\n    }\n};",
    },
    wrapperCode: {
      Java: "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution sol = new Solution();\n        int[] nums = {nums};\n        System.out.println(sol.longestConsecutive(nums));\n    }\n}",
      Python:
        '\nif _name_ == "_main_":\n    sol = Solution()\n    nums = {nums}\n    print(sol.longestConsecutive(nums))',
      Cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    Solution sol;\n    vector<int> nums = {nums};\n    cout << sol.longestConsecutive(nums) << endl;\n    return 0;\n}",
    },
  },
];
