import dotenv from "dotenv";
dotenv.config();

import express, { urlencoded } from "express";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/url.js";

const app = express();
const PORT = process.env.PORT;

//* Establishing DataBase Connection
connectDB();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//* Route
app.get('/', (req, res) => {
    res.send("Hi, I am root of website.");
});

app.use('/api', urlRoutes);

//* Testing Route
app.get('/test', (req, res) => {
    res.send("Hi, I am testing route.");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
