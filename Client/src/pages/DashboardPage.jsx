import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext';
import { getUserLinks, deleteLink, updateLink } from '../services/linkServices';

function DashboardPage() {
    const [links, setLinks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingLink, setEditingLink] = useState(null);
    const [editedUrl, setEditedUrl] = useState('');
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

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            alert('URL copied to clipboard.');
        } catch (error) {
            console.error('Failed to copy URL. ', error.message);
            alert('Failed to copy URL.');
        }
    }

    const handleDelete = async (linkId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this URL?');
        if (!confirmDelete) return;

        try {
            await deleteLink(linkId, authToken);
            setLinks(links.filter(link => link._id !== linkId));
            alert('URL deleted successfully!');
        } catch (error) {
            console.error('Failed to delete link:', error.message);
            alert('Failed to delete URL. Please try again.');
        }
    }

    const handleEdit = (link) => {
        setEditingLink(link);
        setEditedUrl(link.originalUrl);
    }

    const handleUpdate = async () => {
        if (!editedUrl) {
            alert('Please enter a valid URL.');
            return;
        }

        try {
            const response = await updateLink(editingLink._id, { originalUrl: editedUrl }, authToken);
            setLinks(links.map(link => link._id === editingLink._id ? response.data : link));
            setEditingLink(null);
            setEditedUrl('');
            alert('URL updated successfully!');
        } catch (error) {
            console.error('Failed to update link:', error.message);
            alert('Failed to update URL. Please try again.');
        }
    }

    const handleCancelEdit = () => {
        setEditingLink(null);
        setEditedUrl('');
    }

    return (
        <div className='dashboard-container'>
            <h2>My Dashboard</h2>
            <p>Welcome to your personal dashboard! Here you will be able to see all the links you have created.</p>

            {editingLink && (
                <div className='edit-modal' style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div className='edit-modal-content' style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        <h3>Edit URL</h3>
                        <input
                            type='url'
                            value={editedUrl}
                            onChange={(e) => setEditedUrl(e.target.value)}
                            placeholder='Enter new URL'
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginTop: '1rem',
                                borderRadius: '4px',
                                border: '1px solid #ccc'
                            }}
                        />
                        <div style={{marginTop: '1rem', display: 'flex', gap: '10px'}}>
                            <button onClick={handleUpdate} className='btn btn-primary'>
                                Update
                            </button>
                            <button onClick={handleCancelEdit} className='btn btn-secondary'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                                    <th style={{padding: '8px', textAlign: 'left'}}>Actions</th>
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
                                            <td style={{padding: '8px'}}>
                                                <button className='btn btn-copy btn-small' onClick={() => handleCopy(link.shortUrl)}>
                                                    Copy
                                                </button>
                                                <button className='btn btn-edit btn-small' onClick={() => handleEdit(link)} style={{marginLeft: '5px'}}>
                                                    Edit
                                                </button>
                                                <button className='btn btn-delete btn-small' onClick={() => handleDelete(link._id)} style={{marginLeft: '5px'}}>
                                                    Delete
                                                </button>
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