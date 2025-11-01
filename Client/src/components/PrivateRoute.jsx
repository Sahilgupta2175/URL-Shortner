import React from 'react';
import { Navigate } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = UseAuth();

    if(isLoading) {
        return (
            <div>Loading ...</div>
        )
    }

    if(isAuthenticated) {
        return children;
    }

    return <Navigate to='/login' />
}

export default PrivateRoute;