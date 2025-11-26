package problems


type Test struct  {
	Input string `json:"input"`
	Output string `json:"output"`
	Explanation string `json:"explanation"`
};
type IProblem struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Difficulty  string `json:"difficulty"`
	Boilerplate string `json:"boilerplate"`
	Tests       []Test `json:"tests"`
	Topics      []string `json:"topics"`
}

var PROBLEM_HELLO_BOILERPLATE = `const express = require("express");
const router = express.Router();

//WRITE YOUR CODE BELOW

module.exports = router;`

var PROBLEM_HELLO_TESTS = []Test{
	{
		Input: "",
		Output: "Hello World",
		Explanation: "",
	},
}
var PROBLEM_HELLO = IProblem{
	ID: "hello-api",
	Name: "Hello World",
	Description: "Write a function that returns 'Hello World'",
	Difficulty: "easy",
	Boilerplate: PROBLEM_HELLO_BOILERPLATE,
	Tests: PROBLEM_HELLO_TESTS,
	Topics: []string{"strings", "functions", "API", "ExpressJS", "Beginner"},
}

var SOLUTION_HELLO = `const express = require("express");
	const router = express.Router();

	//WRITE YOUR CODE BELOW
	router.get("/hello", (req, res) => {
	res.send("Hello World");
	});

	router.post("/sum", (req, res) => {
	const numA = req.body.numA;
	const numB = req.body.numB;
	let sum = numA + numB;

	res.send("sum:" + sum);
	});

	module.exports = router;
	`
