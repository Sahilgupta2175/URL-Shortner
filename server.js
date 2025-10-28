import dotenv from "dotenv";
dotenv.config();

import express, { urlencoded } from "express";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/url.js";
import indexRoutes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT;

//* Establishing DataBase Connection
connectDB();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//* Route
app.use('/api', urlRoutes);
app.use('/', indexRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
