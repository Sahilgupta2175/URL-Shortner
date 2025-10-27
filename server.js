import dotenv from "dotenv";
dotenv.config();

import express from "express";

const app = express();
const PORT = process.env.PORT;

//* Testing Route
app.get('/test', (req, res) => {
    res.send("Hi, I am testing route.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/test`);
});
