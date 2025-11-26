const express = require("express")
const helloRouter = require("./routes/user-code")

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", helloRouter)

module.exports = app;
