import React, {useState, useEffect, createContext, useContext} from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!authToken);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storeToken = localStorage.getItem('authToken');
        
        if(storeToken) {
            setAuthToken(storeToken);
            setIsAuthenticated(true);
        }
        setIsLoading(false);
    }, []);

    const login = (newAuthToken) => {
        localStorage.setItem('authToken', newAuthToken);
        setAuthToken(newAuthToken);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setIsAuthenticated(false);
    };

    const contextValue = {
        authToken,
        isAuthenticated,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const UseAuth = () => {
    const context = useContext(AuthContext);
    
    if(context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider.');
    }
    return context;
}