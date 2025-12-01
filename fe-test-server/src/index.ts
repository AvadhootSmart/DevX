import express from "express";
import fs from "fs";
import path from "path";
import { runTests } from "./run-tests";
import cors from "cors";

const app = express();
const PORT = 4001; //get from env
app.use(express.json({ limit: "2mb" }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Working");
});

// app.post("/run", async (req, res) => {
//   const { code, problemId } = req.body;

//   fs.writeFileSync(path.join(__dirname, "sandbox/user-code.jsx"), code);

//   try {
//     const results = await runTests();
//     res.json(results);
//   } catch (error: any) {
//     res.json({ error: error.message });
//   }
// });

app.post("/run", async (req, res) => {
  const { code, problemId } = req.body;

  const finalCode = `import React from "react";\n${code}`;

  fs.writeFileSync(
    path.join(__dirname, "sandbox/user-code.jsx"),
    finalCode,
    "utf-8"
  );

  try {
    const results = await runTests();
    res.json(results);
  } catch (error: any) {
    res.json({ error: error.message });
  }
});

app.listen(PORT, () => console.log("Test service listening on port 4001"));
