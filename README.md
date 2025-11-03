# LinkShortly - URL Shortener

A full-stack URL shortening application that transforms long URLs into short, shareable links. Built with **Node.js**, **Express**, **MongoDB**, **React**, and **Vite**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-18.3.1-blue.svg)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Authentication Flow](#-authentication-flow)
- [Environment Variables](#-environment-variables)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Functionality
- ✅ **URL Shortening** - Convert long URLs into short, memorable links
- ✅ **Custom Short URLs** - Auto-generated unique short codes using nanoid
- ✅ **Click Tracking** - Monitor how many times each short link is clicked
- ✅ **QR Code Generation** - Generate and download QR codes for any short URL
- ✅ **Instant Redirection** - Fast 301 redirects to original URLs

### User Management
- 🔐 **User Authentication** - Secure registration and login with JWT tokens
- 🔒 **Password Security** - Bcrypt hashing for password protection
- 👤 **User Dashboard** - Manage all your shortened URLs in one place
- 📊 **Analytics** - View statistics (total links, total clicks, average clicks)

### Link Management
- ✏️ **Edit URLs** - Update the destination of existing short links
- 🗑️ **Delete URLs** - Remove unwanted short links
- 📋 **Copy to Clipboard** - One-click URL copying
- 🔗 **Link History** - View all previously created short URLs

### Additional Features
- 🌐 **Guest Access** - Create short URLs without registration
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **Fast Performance** - Optimized for speed with Vite
- 🎨 **Modern UI** - Clean and intuitive user interface

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt.js
- **URL Validation**: valid-url
- **Unique ID Generation**: nanoid
- **QR Code Generation**: qrcode
- **Environment Variables**: dotenv
- **CORS Handling**: cors
- **Cookie Parsing**: cookie-parser

### Frontend
- **Library**: React 18.3.1
- **Build Tool**: Vite 5.4.10
- **Routing**: React Router DOM 6.27.0
- **HTTP Client**: Axios 1.7.7
- **Linting**: ESLint

### Development Tools
- **Version Control**: Git & GitHub
- **Package Manager**: npm
- **Code Editor**: VS Code (recommended)

---

## 📁 Project Structure

```
URL-Shortner/
├── server.js                 # Main server file
├── package.json              # Backend dependencies
├── .env                      # Environment variables (not in repo)
│
├── config/
│   └── db.js                # MongoDB connection configuration
│
├── models/
│   ├── user.js              # User schema (name, email, password)
│   └── url.js               # URL schema (shortUrl, originalUrl, clicks, user)
│
├── controllers/
│   ├── authController.js    # Registration & login logic
│   ├── urlController.js     # URL shortening, redirect, QR code generation
│   └── linkController.js    # Get, update, delete user's links
│
├── middleware/
│   ├── authMiddleware.js    # Required authentication middleware
│   └── optionalAuthMiddleware.js  # Optional authentication
│
├── routes/
│   ├── auth.js              # Authentication routes (/api/auth/*)
│   ├── url.js               # URL shortening routes (/api/*)
│   ├── link.js              # Link management routes (/api/links/*)
│   └── redirectUrl.js       # Redirect route (/s/:shortUrl)
│
└── Client/                  # Frontend React application
    ├── package.json         # Frontend dependencies
    ├── vite.config.js       # Vite configuration
    ├── index.html           # HTML entry point
    │
    ├── public/              # Static assets
    │
    └── src/
        ├── main.jsx         # React entry point
        ├── App.jsx          # Main app component with routing
        ├── App.css          # Global styles
        ├── index.css        # Base styles
        │
        ├── components/
        │   ├── Navbar.jsx           # Navigation bar
        │   └── PrivateRoute.jsx     # Protected route wrapper
        │
        ├── context/
        │   └── AuthContext.jsx      # Global auth state management
        │
        ├── pages/
        │   ├── HomePage.jsx         # URL shortening page
        │   ├── LoginPage.jsx        # User login
        │   ├── RegisterPage.jsx     # User registration
        │   ├── DashboardPage.jsx    # User dashboard
        │   └── NotFoundPage.jsx     # 404 error page
        │
        └── services/
            ├── apiServices.js       # URL shortening API calls
            ├── authServices.js      # Authentication API calls
            └── linkServices.js      # Link management API calls
```

---

## 🔄 How It Works

### URL Shortening Process

1. **User Input**: User enters a long URL on the homepage
2. **Validation**: System validates the URL format (must include protocol)
3. **Duplicate Check**: Checks if URL already exists in database
4. **Short Code Generation**: If new, generates unique 10-character code using nanoid
5. **Database Storage**: Saves the URL mapping with metadata
6. **Response**: Returns the shortened URL to user

```javascript
// Example: https://example.com/very/long/url/path
// Becomes: http://localhost:8080/s/aBc123XyZ9
```

### Redirection Process

1. **User Clicks**: User visits short URL (e.g., `/s/aBc123XyZ9`)
2. **Database Lookup**: Server finds original URL by short code
3. **Click Tracking**: Increments click counter
4. **Redirect**: Sends 301 redirect to original URL

### Authentication Flow

1. **Registration**: User provides name, email, password
2. **Password Hashing**: Password hashed with bcrypt (salt rounds: 10)
3. **Storage**: User saved to database
4. **Login**: User provides credentials
5. **Verification**: Server validates email and password
6. **Token Generation**: JWT token created with user ID
7. **Token Storage**: Token sent in HTTP-only cookie and response
8. **Protected Access**: Token required for dashboard and link management

---

## 🔌 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/api/auth/register` | Register new user | ❌ | `{ name, email, password }` |
| POST | `/api/auth/login` | Login user | ❌ | `{ email, password }` |

### URL Routes (`/api`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| POST | `/api/shorten` | Create short URL | 🔓 Optional | `{ longUrl }` |
| GET | `/api/qrcode/:shortUrl` | Generate QR code | ❌ | - |

### Link Management Routes (`/api/links`)

| Method | Endpoint | Description | Auth Required | Request Body |
|--------|----------|-------------|---------------|--------------|
| GET | `/api/links/my-links` | Get user's all links | ✅ | - |
| DELETE | `/api/links/:id` | Delete a link | ✅ | - |
| PUT | `/api/links/:id` | Update link destination | ✅ | `{ originalUrl }` |

### Redirect Route

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/s/:shortUrl` | Redirect to original URL | ❌ |

**Response Formats:**

```javascript
// Success Response
{
  success: true,
  data: { /* response data */ },
  message: "Operation successful"
}

// Error Response
{
  success: false,
  error: "Error message description"
}
```

---

## 🗄️ Database Schema

### User Model

```javascript
{
  name: String,           // Required, user's full name
  email: String,          // Required, unique, validated email
  password: String,       // Required, min 6 chars, hashed with bcrypt
  createdAt: Date,        // Auto-generated timestamp
  updatedAt: Date         // Auto-generated timestamp
}
```

### URL Model

```javascript
{
  shortUrl: String,       // Required, unique short code (e.g., "aBc123XyZ9")
  originalUrl: String,    // Required, original long URL
  longUrl: String,        // Required, full shortened URL with domain
  clicks: Number,         // Default: 0, tracks number of visits
  user: ObjectId,         // Optional, references User model
  createdAt: Date,        // Auto-generated timestamp
  updatedAt: Date         // Auto-generated timestamp
}
```

**Relationships:**
- One User can have many URLs (One-to-Many)
- URLs can exist without a user (for guest users)

---

## 🔐 Authentication Flow

### JWT Token Structure

```javascript
{
  user: {
    id: "user_mongodb_id"
  },
  iat: 1234567890,      // Issued at timestamp
  exp: 1234571490       // Expiration timestamp (1 hour)
}
```

### Token Storage

- **Cookie**: Stored in HTTP-only cookie named `authToken`
- **LocalStorage**: Stored in browser's localStorage
- **Header**: Can be sent as `Authorization: Bearer <token>`

### Protected Routes

Routes that require authentication:
- `/dashboard` (Frontend)
- `/api/links/*` (Backend)

### Middleware Flow

```
Request → Optional/Required Auth Middleware → Verify JWT → Attach User to req.user → Controller
```

---

## 🌍 Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_ATLAS_URL=mongodb+srv://username:password@cluster.mongodb.net/urlshortener

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Base URL (for generating short URLs)
BASE_URL=http://localhost:8080

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Important Notes:**
- Never commit `.env` file to version control
- Use strong, random JWT secret in production
- Update BASE_URL to your production domain when deploying
- MONGO_ATLAS_URL should point to your MongoDB instance

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn package manager
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/Sahilgupta2175/URL-Shortner.git
cd URL-Shortner
```

### Step 2: Backend Setup

```bash
# Install backend dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Start backend server
npm start
```

Backend will run on `http://localhost:8080`

### Step 3: Frontend Setup

```bash
# Navigate to client directory
cd Client

# Install frontend dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

### Step 4: Database Setup

1. Create a MongoDB database (local or Atlas)
2. Add connection string to `.env` file
3. Database and collections will be created automatically on first use

---

## 📖 Usage Guide

### For Guest Users

1. **Visit Homepage**: Navigate to `http://localhost:5173`
2. **Enter URL**: Paste your long URL in the input field
3. **Shorten**: Click "Shorten URL" button
4. **Copy & Share**: Copy the generated short URL
5. **Test**: Visit the short URL to verify it redirects correctly

### For Registered Users

1. **Register**: Click "Sign Up" and create an account
2. **Login**: Enter your credentials to access dashboard
3. **Create URLs**: Use homepage to create short URLs (automatically linked to your account)
4. **View Dashboard**: Access `/dashboard` to see all your links
5. **Manage Links**: 
   - Copy URLs to clipboard
   - Generate QR codes
   - Edit destination URLs
   - Delete unwanted links
   - View click statistics

### Dashboard Features

**Statistics Cards:**
- Total Links: Number of short URLs created
- Total Clicks: Sum of all clicks across all URLs
- Average Clicks: Mean clicks per URL

**Link Table:**
- Original URL (truncated, hover for full URL)
- Short URL (clickable)
- Click count
- Action buttons (Copy, QR, Edit, Delete)

**QR Code Generation:**
1. Click "QR" button on any link
2. View QR code in modal
3. Download as PNG file
4. Share QR code with others

**Edit URL:**
1. Click "Edit" button
2. Enter new destination URL
3. Save changes (short code remains same)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Code Style

- Follow existing code formatting
- Add comments for complex logic
- Write meaningful commit messages
- Test your changes before submitting

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sahil Gupta**

- GitHub: [@Sahilgupta2175](https://github.com/Sahilgupta2175)
- Repository: [URL-Shortner](https://github.com/Sahilgupta2175/URL-Shortner)

---

## 🙏 Acknowledgments

- Built with ❤️ using MERN stack
- Inspired by services like bit.ly and TinyURL
- Thanks to all open-source contributors

---

## 📞 Support

If you encounter any issues or have questions:

1. Check existing [Issues](https://github.com/Sahilgupta2175/URL-Shortner/issues)
2. Create a new issue with detailed description
3. Star ⭐ the repository if you find it helpful!

---

**Made with ❤️ by Sahil Gupta | © 2025 LinkShortly**

