import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext';
import { getUserLinks } from '../services/linkServices';

function DashboardPage() {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { authToken, logout } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                if(authToken) {
                    const response = await getUserLinks(authToken);
                    setLinks(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch links: ', error.message);
                const errorMessage = error.error || 'Could not load Your links.';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        }

        fetchLinks();
    }, [authToken]);

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