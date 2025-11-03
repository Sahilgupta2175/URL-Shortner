// Import React
import React from 'react';
// Import React Router components for navigation
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Import authentication context hook
import { UseAuth } from '../context/AuthContext';

/**
 * Navbar Component - Navigation bar displayed on all pages
 * 
 * Features:
 * - Shows different links based on authentication status
 * - Highlights active page
 * - Handles user logout
 * - Responsive brand logo link
 * 
 * For authenticated users: Shows Dashboard and Logout
 * For guests: Shows Login and Sign Up
 */
function Navbar() {
    // Get authentication state and logout function from context
    const { authToken, logout } = UseAuth();
    // Hook for programmatic navigation
    const navigate = useNavigate();
    // Hook to get current route location
    const location = useLocation();

    /**
     * handleLogout - Logs out user and redirects to home page
     */
    const handleLogout = () => {
        // Clear authentication token from context and localStorage
        logout();
        // Redirect to home page
        navigate('/');
    };

    /**
     * isActive - Checks if given path matches current location
     * Used to highlight the active navigation link
     * 
     * @param {string} path - Path to check
     * @returns {boolean} True if path is current location
     */
    const isActive = (path) => location.pathname === path;

    return (
        <nav className='navbar'>
            <div className='navbar-content'>
                {/* Brand logo - links to home page */}
                <Link to='/' className='navbar-brand' title='Go to homepage'>
                    LinkShortly
                </Link>
                
                {/* Navigation links - conditional based on authentication */}
                <div className='navbar-links'>
                    {authToken ? (
                        // Links for authenticated users
                        <>
                            {/* Dashboard link - highlighted if active */}
                            <Link 
                                to='/dashboard' 
                                className={isActive('/dashboard') ? 'active' : ''}
                                title='View your dashboard'
                            >
                                Dashboard
                            </Link>
                            
                            {/* Logout button */}
                            <button 
                                onClick={handleLogout} 
                                className='btn btn-small btn-secondary'
                                style={{padding: '0.5rem 1rem'}}
                                title='Logout from your account'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        // Links for guest users (not authenticated)
                        <>
                            {/* Login link - highlighted if active */}
                            <Link 
                                to='/login' 
                                className={isActive('/login') ? 'active' : ''}
                                title='Login to your account'
                            >
                                Login
                            </Link>
                            
                            {/* Sign Up button */}
                            <Link 
                                to='/register'
                                title='Create a new account'
                            >
                                <button className='btn btn-primary btn-small'>
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

// Export component
export default Navbar;
