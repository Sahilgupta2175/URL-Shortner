// Import React and hooks
import React, { useEffect, useState } from 'react';
// Import navigation hook
import { useNavigate } from 'react-router-dom';
// Import authentication context
import { UseAuth } from '../context/AuthContext';
// Import link management services
import { getUserLinks, deleteLink, updateLink } from '../services/linkServices';

/**
 * DashboardPage Component - User dashboard for managing shortened URLs
 * 
 * Features:
 * - Display all user's shortened URLs in a table
 * - Statistics (total links, total clicks, average clicks)
 * - Copy URL to clipboard
 * - Generate and download QR codes
 * - Edit URL destination
 * - Delete URLs
 * - Loading and error states
 * 
 * This is a protected route - only accessible to authenticated users
 */
function DashboardPage() {
    // State for storing user's links
    const [links, setLinks] = useState([]);
    // State for loading indicator
    const [isLoading, setIsLoading] = useState(true);
    // State for error messages
    const [error, setError] = useState('');
    // State for tracking which link is being edited
    const [editingLink, setEditingLink] = useState(null);
    // State for the new URL value during editing
    const [editedUrl, setEditedUrl] = useState('');
    // State for tracking which link's QR code is being viewed
    const [qrCodeLink, setQrCodeLink] = useState(null);
    // State for storing generated QR code data
    const [qrCodeData, setQrCodeData] = useState(null);
    // Get auth token from context
    const { authToken } = UseAuth();
    // Hook for navigation
    const navigate = useNavigate();

    /**
     * useEffect - Fetch user's links when component mounts
     * Runs once when component is first rendered
     * Dependency: authToken (refetch if token changes)
     */
    useEffect(() => {
        /**
         * fetchLinks - Async function to load user's links from API
         */
        const fetchLinks = async () => {
            try {
                // Only fetch if user is authenticated
                if(authToken) {
                    const response = await getUserLinks(authToken);
                    // Store links in state
                    setLinks(response.data);
                }
            } catch (error) {
                console.error('Failed to fetch links: ', error.message);
                // Extract error message or use default
                const errorMessage = error.error || 'Could not load Your links.';
                setError(errorMessage);
            } finally {
                // Always stop loading indicator, whether success or error
                setIsLoading(false);
            }
        };

        // Call the fetch function
        fetchLinks();
    }, [authToken]); // Re-run if authToken changes

    // State for tracking which link was just copied (for visual feedback)
    const [copiedId, setCopiedId] = useState(null);

    /**
     * handleCopy - Copies URL to clipboard with visual feedback
     * 
     * @param {string} text - The URL text to copy
     * @param {string} linkId - ID of the link (for showing "Copied" feedback)
     */
    const handleCopy = async (text, linkId) => {
        try {
            // Copy text to clipboard using Clipboard API
            await navigator.clipboard.writeText(text);
            // Show "Copied" feedback for this specific link
            setCopiedId(linkId);
            // Reset feedback after 2 seconds
            setTimeout(() => setCopiedId(null), 2000);
        } catch (error) {
            console.error('Failed to copy URL. ', error.message);
            alert('Failed to copy URL.');
        }
    }

    /**
     * handleDelete - Deletes a URL from user's list
     * Shows confirmation dialog before deleting
     * 
     * @param {string} linkId - ID of the link to delete
     */
    const handleDelete = async (linkId) => {
        // Show confirmation dialog
        const confirmDelete = window.confirm('Are you sure you want to delete this URL?');
        if (!confirmDelete) return; // User cancelled

        try {
            // Call API to delete link
            await deleteLink(linkId, authToken);
            // Remove deleted link from state (update UI)
            setLinks(links.filter(link => link._id !== linkId));
            alert('URL deleted successfully!');
        } catch (error) {
            console.error('Failed to delete link:', error.message);
            alert('Failed to delete URL. Please try again.');
        }
    }

    /**
     * handleEdit - Opens edit modal for a specific link
     * 
     * @param {Object} link - The link object to edit
     */
    const handleEdit = (link) => {
        // Set the link being edited
        setEditingLink(link);
        // Pre-fill input with current URL
        setEditedUrl(link.originalUrl);
    }

    /**
     * handleUpdate - Saves the edited URL
     * Updates the destination URL while keeping the short code the same
     */
    const handleUpdate = async () => {
        // Validate new URL is provided
        if (!editedUrl) {
            alert('Please enter a valid URL.');
            return;
        }

        try {
            // Call API to update link
            const response = await updateLink(editingLink._id, { originalUrl: editedUrl }, authToken);
            // Update the link in state with new data
            setLinks(links.map(link => link._id === editingLink._id ? response.data : link));
            // Close edit modal
            setEditingLink(null);
            setEditedUrl('');
            alert('URL updated successfully!');
        } catch (error) {
            console.error('Failed to update link:', error.message);
            alert('Failed to update URL. Please try again.');
        }
    }

    /**
     * handleCancelEdit - Closes edit modal without saving
     */
    const handleCancelEdit = () => {
        setEditingLink(null);
        setEditedUrl('');
    }

    /**
     * handleGenerateQR - Generates QR code for a shortened URL
     * Opens modal with QR code image
     * 
     * @param {Object} link - The link object to generate QR code for
     */
    const handleGenerateQR = async (link) => {
        try {
            // Extract short code from full URL (e.g., "aBc123" from "http://localhost:8080/s/aBc123")
            const shortCode = link.shortUrl.split('/').pop();
            // Call API to generate QR code
            const response = await fetch(`/api/qrcode/${shortCode}`);
            const data = await response.json();
            
            if (data.success) {
                // Store link and QR code data to display in modal
                setQrCodeLink(link);
                setQrCodeData(data.qrCode); // Base64 encoded image
            }
        } catch (error) {
            console.error('Failed to generate QR code:', error);
            alert('Failed to generate QR code. Please try again.');
        }
    }

    /**
     * handleDownloadQR - Downloads QR code as PNG image
     * Creates temporary link element to trigger download
     */
    const handleDownloadQR = () => {
        if (!qrCodeData) return; // No QR code to download
        
        // Create temporary anchor element
        const link = document.createElement('a');
        link.href = qrCodeData; // Base64 data URL
        // Set filename with short code
        link.download = `qr-code-${qrCodeLink.shortUrl.split('/').pop()}.png`;
        // Add to DOM, click it, then remove (triggers download)
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * handleCloseQR - Closes QR code modal
     */
    const handleCloseQR = () => {
        setQrCodeLink(null);
        setQrCodeData(null);
    }

    // Calculate statistics from links data
    // Total number of clicks across all links
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    // Total number of links created
    const totalLinks = links.length;
    // Average clicks per link (rounded to 1 decimal)
    const avgClicks = totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0;

    return (
        <div className='dashboard-container'>
            {/* Page header */}
            <h2>My Dashboard</h2>
            <p>Welcome to your personal dashboard! Manage and track all your shortened URLs.</p>

            {/* Statistics cards displaying analytics */}
            <div className='stats-container'>
                {/* Total number of links created */}
                <div className='stat-card'>
                    <h3>{totalLinks}</h3>
                    <p>Total Links</p>
                </div>
                {/* Total clicks across all links */}
                <div className='stat-card'>
                    <h3>{totalClicks}</h3>
                    <p>Total Clicks</p>
                </div>
                {/* Average clicks per link */}
                <div className='stat-card'>
                    <h3>{avgClicks}</h3>
                    <p>Avg Clicks/Link</p>
                </div>
            </div>

            {/* QR Code Modal - only shown when qrCodeLink is set */}
            {qrCodeLink && (
                <div className='edit-modal' style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000 // Ensure modal appears on top
                }}>
                    <div className='edit-modal-content' style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '400px',
                        width: '90%',
                        textAlign: 'center'
                    }}>
                        {/* Modal header */}
                        <h3>QR Code</h3>
                        <p style={{color: '#64748b', marginBottom: '1rem'}}>
                            Scan this QR code to access your short URL
                        </p>
                        {/* Display QR code image */}
                        {qrCodeData && (
                            <img 
                                src={qrCodeData}  // Base64 encoded image data
                                alt='QR Code' 
                                style={{
                                    width: '100%',
                                    maxWidth: '300px',
                                    margin: '1rem auto',
                                    display: 'block',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '8px',
                                    padding: '1rem'
                                }}
                            />
                        )}
                        {/* Modal action buttons */}
                        <div style={{marginTop: '1rem', display: 'flex', gap: '10px', justifyContent: 'center'}}>
                            {/* Download QR code as image file */}
                            <button onClick={handleDownloadQR} className='btn btn-primary' title='Download QR Code as PNG'>
                                Download
                            </button>
                            {/* Close modal */}
                            <button onClick={handleCloseQR} className='btn btn-secondary' title='Close QR Code modal'>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit URL Modal - only shown when editingLink is set */}
            {editingLink && (
                <div className='edit-modal' style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent overlay
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000 // Ensure modal appears on top
                }}>
                    <div className='edit-modal-content' style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        width: '90%'
                    }}>
                        {/* Modal header */}
                        <h3>Edit URL</h3>
                        {/* Input field for new destination URL */}
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
                        {/* Modal action buttons */}
                        <div style={{marginTop: '1rem', display: 'flex', gap: '10px'}}>
                            {/* Save changes */}
                            <button onClick={handleUpdate} className='btn btn-primary'>
                                Update
                            </button>
                            {/* Cancel and close modal */}
                            <button onClick={handleCancelEdit} className='btn btn-secondary'>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Links table container */}
            <div className='links-list-container' style={{marginTop: '2rem'}}>
                { 
                    // Show loading spinner while fetching data
                    isLoading ? (
                        <div className='loading'>
                            <div className='spinner'></div>
                            <p style={{marginTop: '1rem', color: '#64748b'}}>Loading your links...</p>
                        </div>
                    // Show error message if fetch failed
                    ) : error ? (
                        <p className='error-message' style={{color: 'red'}}>
                            Error: {error}
                        </p>
                    // Show table if user has links
                    ) : links.length > 0 ? (
                        <table className='links-table' style={{width: '100%', borderCollapse: 'collapse'}}>
                            {/* Table header */}
                            <thead>
                                <tr style={{borderBottom: '2px solid #333'}}>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Original Url</th>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Short Url</th>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Clicks</th>
                                    <th style={{padding: '8px', textAlign: 'left'}}>Actions</th>
                                </tr>
                            </thead>
                            {/* Table body - map through links array */}
                            <tbody>
                                {/* Map through links array to create table rows */}
                                {
                                    links.map((link) => (
                                        <tr key={link._id} style={{borderBottom: '1px solid #ddd'}}>
                                            {/* Original URL column - truncated with full URL in tooltip */}
                                            <td style={{padding: '8px', wordBreak: 'break-all'}}>
                                                <a href={link.longUrl} title={link.longUrl} target='_blank' rel='noopener noreferrer'>
                                                    {link.longUrl.substring(0, 50)}...
                                                </a>
                                            </td>
                                            {/* Short URL column - clickable link */}
                                            <td style={{padding: '8px'}}>
                                                <a href={link.shortUrl} target='_blank' rel='noopener noreferrer'>
                                                    {link.shortUrl}
                                                </a>
                                            </td>
                                            {/* Click count column */}
                                            <td style={{padding: '8px', textAlign: 'center'}}>
                                                {link.clicks}
                                            </td>
                                            {/* Actions column - buttons for various operations */}
                                            <td style={{padding: '8px'}}>
                                                <div style={{display: 'flex', gap: '5px', flexWrap: 'wrap'}}>
                                                    {/* Copy URL button - changes color when clicked */}
                                                    <button 
                                                        className='btn btn-copy btn-small' 
                                                        onClick={() => handleCopy(link.shortUrl, link._id)}
                                                        style={{
                                                            background: copiedId === link._id ? '#10b981' : '',
                                                            transition: 'all 0.3s ease'
                                                        }}
                                                        title={copiedId === link._id ? 'Copied!' : 'Copy URL'}
                                                    >
                                                        {copiedId === link._id ? 'Copied' : 'Copy'}
                                                    </button>
                                                    {/* QR Code button - opens QR code modal */}
                                                    <button 
                                                        className='btn btn-primary btn-small' 
                                                        onClick={() => handleGenerateQR(link)} 
                                                        style={{background: '#8b5cf6'}}
                                                        title='Generate QR Code'
                                                    >
                                                        QR
                                                    </button>
                                                    {/* Edit button - opens edit modal */}
                                                    <button 
                                                        className='btn btn-edit btn-small' 
                                                        onClick={() => handleEdit(link)}
                                                        title='Edit URL'
                                                    >
                                                        Edit
                                                    </button>
                                                    {/* Delete button - removes URL after confirmation */}
                                                    <button 
                                                        className='btn btn-delete btn-small' 
                                                        onClick={() => handleDelete(link._id)}
                                                        title='Delete URL'
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    // Show message if user has no links yet
                    ) : (
                        <p>You haven't created any short links yet. Go to the homepage to create your first one!</p>
                    )
                }
            </div>

            {/* Button to navigate to homepage to create new URL */}
            <div style={{textAlign: 'center', marginTop: '2rem'}}>
                <button 
                    onClick={() => navigate('/')} 
                    className='btn btn-primary'
                    title='Create a new short URL'
                >
                    Create New Short URL
                </button>
            </div>
        </div> 
    );
}

// Export component
export default DashboardPage;