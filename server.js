// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";
dotenv.config(); // Initialize environment variables

// Import required packages
import express from "express"; // Express framework for building the server
import cors from "cors"; // CORS middleware to handle cross-origin requests
import connectDB from "./config/db.js"; // Database connection function
import urlRoutes from "./routes/url.js"; // Routes for URL shortening and QR code generation
import redirectUrl from "./routes/redirectUrl.js"; // Routes for redirecting short URLs to original URLs
import authRoute from "./routes/auth.js"; // Routes for user authentication (register/login)
import linksRoute from "./routes/link.js"; // Routes for managing user's links
import cookieParser from "cookie-parser"; // Middleware to parse cookies from requests

// Initialize Express application
const app = express();
const PORT = process.env.PORT; // Get port from environment variables

// Establishing DataBase Connection
connectDB(); // Connect to MongoDB database

// Middlewares - Functions that execute before route handlers

// CORS middleware - Allows frontend to make requests to this backend
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Allow requests from this origin (frontend URL)
    credentials: true, // Allow cookies to be sent with requests
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed request headers
}));

// Parse incoming JSON payloads in request body
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({extended: true}));

// Parse cookies from incoming requests
app.use(cookieParser());

// URL shortening and QR code routes (e.g., /api/shorten, /api/qrcode/:shortUrl)
app.use('/api', urlRoutes);

// Authentication routes (e.g., /api/auth/register, /api/auth/login)
app.use('/api/auth', authRoute);

// User's link management routes (e.g., /api/links/my-links)
app.use('/api/links', linksRoute);

// Redirect route - handles short URL redirects (e.g., /s/abc123 redirects to original URL)
app.use('/s', redirectUrl);

// Start the server and listen on specified port
app.listen(PORT, () => {
    (`Server is running on http://localhost:${PORT}`);
});
