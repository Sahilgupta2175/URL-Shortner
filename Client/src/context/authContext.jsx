// Import React hooks for state management and context
import React, {useState, useEffect, createContext, useContext} from 'react';

/**
 * AuthContext - Global authentication state management
 * Provides authentication status and token to all components
 * Uses React Context API to avoid prop drilling
 */
const AuthContext = createContext(null);

/**
 * AuthProvider Component - Wraps the app to provide authentication context
 * Manages authentication state and persists token in localStorage
 * 
 * State:
 * - authToken: JWT token for API authentication
 * - isAuthenticated: Boolean indicating if user is logged in
 * - isLoading: Boolean for initial load state
 * 
 * Methods:
 * - login(token): Save token and mark user as authenticated
 * - logout(): Clear token and mark user as unauthenticated
 */
export const AuthProvider = ({ children }) => {
    // Get token from localStorage on initial load
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    // Set authenticated state based on token existence
    const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);
    // Loading state to prevent flash of wrong content
    const [isLoading, setIsLoading] = useState(true);

    // Effect runs once on component mount
    useEffect(() => {
        // Try to retrieve token from localStorage
        const storeToken = localStorage.getItem('authToken');
        
        // If token exists, user is authenticated
        if(storeToken) {
            setAuthToken(storeToken);
            setIsAuthenticated(true);
        }
        // Mark loading as complete
        setIsLoading(false);
    }, []); // Empty dependency array = run once on mount

    /**
     * login - Store authentication token
     * Called after successful login
     * 
     * @param {string} newAuthToken - JWT token from login response
     */
    const login = (newAuthToken) => {
        // Persist token in localStorage (survives page refresh)
        localStorage.setItem('authToken', newAuthToken);
        // Update state
        setAuthToken(newAuthToken);
        setIsAuthenticated(true);
    };

    /**
     * logout - Clear authentication token
     * Called when user logs out or token expires
     */
    const logout = () => {
        // Remove token from localStorage
        localStorage.removeItem('authToken');
        // Update state
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    // Package all values and methods to provide to child components
    const contextValue = {
        authToken,          // The JWT token
        isAuthenticated,    // Boolean: is user logged in?
        isLoading,          // Boolean: is initial load complete?
        login,              // Function to log in
        logout              // Function to log out
    };

    // Provide context to all child components
    // Only render children after initial loading is complete
    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

/**
 * UseAuth Hook - Access authentication context in any component
 * Custom hook to consume AuthContext
 * 
 * Usage in components:
 * const { authToken, isAuthenticated, login, logout } = UseAuth();
 * 
 * @returns {Object} Authentication context value
 */
export const UseAuth = () => {
    const context = useContext(AuthContext);
    
    // Throw error if hook is used outside AuthProvider
    // Helps catch mistakes during development
    if(context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}