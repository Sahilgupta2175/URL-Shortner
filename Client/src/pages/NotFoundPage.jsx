// Import React
import React from 'react';
// Import navigation hook
import { useNavigate } from 'react-router-dom';

/**
 * NotFoundPage Component - 404 Error Page
 * 
 * Displayed when user navigates to an invalid route
 * Provides navigation options to recover from error
 * 
 * Features:
 * - Large 404 display for clear error indication
 * - User-friendly error message
 * - Button to go back to home page
 * - Button to go back to previous page
 * 
 * This is the catch-all route in App.jsx (path='*')
 */
function NotFoundPage() {
    // Hook for navigation
    const navigate = useNavigate();

    return (
        <div className='page-container'>
            <div className='page-content' style={{textAlign: 'center'}}>
                <div className='card'>
                    {/* Large 404 number for visual impact */}
                    <h1 style={{fontSize: '6rem', margin: 0}}>404</h1>
                    
                    {/* Error message header */}
                    <h2>Page Not Found</h2>
                    
                    {/* Friendly explanation */}
                    <p style={{fontSize: '1.125rem', marginBottom: '2rem'}}>
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    
                    {/* Navigation buttons */}
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                        {/* Button to navigate to home page */}
                        <button 
                            onClick={() => navigate('/')} 
                            className='btn btn-primary'
                        >
                            🏠 Go Home
                        </button>
                        
                        {/* Button to go back to previous page */}
                        {/* navigate(-1) goes back one step in browser history */}
                        <button 
                            onClick={() => navigate(-1)} 
                            className='btn btn-secondary'
                        >
                            ← Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Export component
export default NotFoundPage;
