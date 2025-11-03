// Import React
import React from 'react';
// Import Navigate component for redirecting
import { Navigate } from 'react-router-dom';
// Import authentication context hook
import { UseAuth } from '../context/AuthContext.jsx';

/**
 * PrivateRoute Component - Protects routes from unauthenticated access
 * Wrapper component that checks authentication before rendering children
 * 
 * Usage:
 * <PrivateRoute>
 *   <DashboardPage />
 * </PrivateRoute>
 * 
 * Behavior:
 * - If loading: Shows loading message
 * - If authenticated: Renders child components (the protected page)
 * - If not authenticated: Redirects to login page
 * 
 * This prevents unauthorized users from accessing protected pages like Dashboard
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - The component(s) to render if authenticated
 */
const PrivateRoute = ({ children }) => {
    // Get authentication state from context
    const { isAuthenticated, isLoading } = UseAuth();

    // Show loading state while checking authentication
    // Prevents flash of wrong content
    if(isLoading) {
        return (
            <div>Loading ...</div>
        )
    }

    // If user is authenticated, render the protected content
    if(isAuthenticated) {
        return children;
    }

    // If user is not authenticated, redirect to login page
    // User will be redirected here from protected routes
    return <Navigate to='/login' />
}

// Export component
export default PrivateRoute;