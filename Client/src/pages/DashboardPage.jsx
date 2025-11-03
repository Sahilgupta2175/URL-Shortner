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
        };

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

            <div className='links-list-container' style={{marginTop: '2rem'}}>
                { 
                    isLoading ? (
                        <p>Loading your Links...</p>
                    ) : error ? (
                        <p className='error-message' style={{color: 'red'}}>
                            Error: {error}
                        </p>
                    ) : links.length > 0 ? (
                        <table className='links-table' style={{width: '100%', borderCollapse: 'collapse'}}>
                            <thead>
                                <tr style={{borderBottom: '2px solid #333'}}>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Original Url</th>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Short Url</th>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Clicks</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    links.map((link) => (
                                        <tr key={link._id} style={{borderBottom: '1px solid #ddd'}}>
                                            <td style={{padding: '8px', wordBreak: 'break-all'}}>
                                                <a href={link.longUrl} title={link.longUrl} target='_blank' rel='noopener noreferrer'>
                                                    {link.longUrl.substring(0, 50)}...
                                                </a>
                                            </td>
                                            <td style={{padding: '8px'}}>
                                                <a href={link.shortUrl} target='_blank' rel='noopener noreferrer'>
                                                    {link.shortUrl}
                                                </a>
                                            </td>
                                            <td style={{padding: '8px', textAlign: 'center'}}>
                                                {link.clicks}
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    ) : (
                        <p>You haven't created any short links yet. Go to the homepage to create your first one!</p>
                    )
                }
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