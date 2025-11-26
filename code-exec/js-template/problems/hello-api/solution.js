const express = require("express");
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
