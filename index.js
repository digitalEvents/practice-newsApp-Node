import express from "express";

const app = express();
app.get("/", (req, res) => { res.status(200).json({ msg: "Welcome to News App", type: "Sucess" }) });
app.listen(8081, () => { console.log("Server running port at 8081") });