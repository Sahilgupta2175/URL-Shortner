import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext.jsx';

function DashboardPage() {
    const { logout } = UseAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }

    return (
        <div className='dashboard-container'>
            <h2>My Dashboard</h2>
            <p>Welcome to your personal dashboard! Here you will be able to see all the links you have created.</p>

            <div className='links-list-placeholder'>
                <p>Your links will appear here soon...</p>
            </div>

            <button 
                onClick={handleLogout} 
                className='btn btn-logout'
                style={{marginTop: '2rem'}}
            >
                logout
            </button>
        </div> 
    );
}

export default DashboardPage;