// Import React library
import React from 'react';
// Import React Router components for navigation
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Import page components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
// Import custom components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
// Import styles
import './App.css';

/**
 * App Component - Main application component
 * Sets up routing and layout structure
 * 
 * Route Structure:
 * - / : Home page (public)
 * - /login : Login page (public)
 * - /register : Registration page (public)
 * - /dashboard : User dashboard (protected - requires authentication)
 * - * : 404 Not Found page (catch-all for invalid routes)
 */
function App() {
    return (
        // BrowserRouter enables client-side routing
        <BrowserRouter>
            <div className='app-container'>
                {/* Navigation bar - shown on all pages */}
                <Navbar />
                
                {/* Define all application routes */}
                <Routes>
                    {/* Public route - Home page for URL shortening */}
                    <Route path='/' element={ <HomePage /> } />
                    
                    {/* Public route - User login */}
                    <Route path='/login' element={ <LoginPage /> } />
                    
                    {/* Public route - User registration */}
                    <Route path='/register' element={ <RegisterPage /> } />
                    
                    {/* Protected route - Only accessible to authenticated users */}
                    {/* PrivateRoute wrapper checks authentication before rendering */}
                    <Route path='/dashboard' element={ <PrivateRoute> <DashboardPage /> </PrivateRoute> } />
                    
                    {/* Catch-all route - Shows 404 page for any undefined routes */}
                    <Route path='*' element={ <NotFoundPage /> } />
                </Routes>
                
                {/* Footer - shown on all pages */}
                <footer className='footer'>
                    <p>
                        Made with ❤️ by <a href='https://github.com/Sahilgupta2175' target='_blank' rel='noopener noreferrer'>Sahil Gupta</a> | © 2025 LinkShortly
                    </p>
                </footer>
            </div>
        </BrowserRouter>      
    );
}

// Export App component as default export
export default App;