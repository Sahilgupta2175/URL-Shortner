import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.js";
import urlRoutes from "./routes/url.js";
import redirectUrl from "./routes/redirectUrl.js";
import authRoute from "./routes/auth.js";
import linksRoute from "./routes/link.js";
import cookieParser from "cookie-parser";
const app = express();
const PORT = process.env.PORT;

//* Establishing DataBase Connection
connectDB();

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
//* Route
app.use('/api', urlRoutes);
app.use('/api/auth', authRoute);
app.use('/api/links', linksRoute);
app.use('/', redirectUrl);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
