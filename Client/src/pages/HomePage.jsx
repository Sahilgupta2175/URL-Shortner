// Import React and hooks
import React, { useState } from 'react';
// Import navigation hook
import { useNavigate } from 'react-router-dom';
// Import API service for creating short URLs
import createShortURL from '../services/apiServices';
// Import authentication context
import { UseAuth } from '../context/AuthContext';

/**
 * HomePage Component - Main landing page for URL shortening
 * 
 * Features:
 * - URL input form with validation
 * - Loading state during API call
 * - Success display with copy-to-clipboard functionality
 * - Error handling with user-friendly messages
 * - Character count for long URLs
 * - Link to dashboard for authenticated users
 * - Call-to-action for guest users to sign up
 * 
 * Works for both authenticated and anonymous users
 */
function HomePage() {
    // State for managing form input
    const [longURL, setLongURL] = useState('');
    // State for storing the generated short URL
    const [shortUrl, setShortUrl] = useState(null);
    // State for error messages
    const [error, setError] = useState('');
    // State for loading indicator
    const [isLoading, setIsLoading] = useState(false);
    // State for copy-to-clipboard feedback
    const [isCopied, setIsCopied] = useState(false);
    // Get authentication token from context
    const { authToken } = UseAuth();
    // Hook for navigation
    const navigate = useNavigate();

    /**
     * handleSubmit - Processes the URL shortening form submission
     * 
     * Flow:
     * 1. Prevent default form submission
     * 2. Reset states (copied, error, loading)
     * 3. Validate URL is provided
     * 4. Call API to create short URL
     * 5. Display result or error
     * 
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload
        // Reset feedback states
        setIsCopied(false);
        setError('');
        setIsLoading(true); // Show loading indicator
        
        // Validate URL is provided
        if(!longURL) {
            setError('Please enter a URL to shorten.');
            setShortUrl(null);
            setIsLoading(false);
            return;
        }

        try {
            // Call API to create shortened URL
            const response = await createShortURL(longURL);
            // Store the shortened URL for display
            setShortUrl(response.data.shortUrl);
            console.log('Successfully created short URL: ', response);
        } catch (error) {
            // Extract error message from API response or use default
            const errorMessage = error.error || 'An unexpected error occurred.';
            setError(errorMessage);
            setShortUrl(null); // Clear any previous result
            console.error('Error from API.', error);
        } finally {
            // Always stop loading indicator, whether success or error
            setIsLoading(false);
        }
    }

    /**
     * handleCopy - Copies shortened URL to clipboard
     * Uses the modern Clipboard API
     * Shows visual feedback for 2 seconds
     */
    const handleCopy = async () => {
        // Don't attempt copy if no URL exists
        if(!shortUrl) return;

        try {
            // Copy URL to clipboard using Clipboard API
            await navigator.clipboard.writeText(shortUrl);
            // Show "Copied!" feedback
            setIsCopied(true);
            // Reset feedback after 2 seconds
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            // Handle browsers that don't support Clipboard API
            console.error('Failed to copy URL.', error.message);
            alert('Failed to copy URL.');
        }
    }

    /**
     * handleReset - Clears all form states for creating another URL
     * Resets the form to initial state
     */
    const handleReset = () => {
        setLongURL('');      // Clear input field
        setShortUrl(null);   // Clear result
        setError('');        // Clear errors
        setIsCopied(false);  // Reset copy feedback
    }

    return (
        <div className='page-container'>
            <div className='page-content'>
                <div className='home-container'>
                    {/* Page header */}
                    <h2>URL Shortener</h2>
                    <p>Transform long URLs into short, shareable links instantly!</p>

                    {/* URL shortening form */}
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='longUrl-input'>Enter your long URL:</label>
                            {/* URL input field */}
                            <input 
                                id='longUrl-input'
                                type='url'
                                placeholder='https://example.com/very/long/url/to/shorten'
                                value={longURL}
                                onChange={(e) => setLongURL(e.target.value)}
                                required
                                disabled={isLoading}  // Disable during API call
                                autoFocus  // Focus on page load for better UX
                            />
                            {/* Show character count for long URLs */}
                            {longURL && longURL.length > 50 && (
                                <p style={{
                                    marginTop: '0.5rem',
                                    fontSize: '0.875rem',
                                    color: '#f59e0b'
                                }}>
                                    URL Length: {longURL.length} characters
                                </p>
                            )}
                        </div>
                        {/* Submit button with loading state */}
                        <button type='submit' disabled={isLoading} title={isLoading ? 'Processing...' : 'Click to shorten your URL'}>
                            {isLoading ? 'Shortening...' : 'Shorten URL'}
                        </button>
                    </form>

                    {/* Success result display - only shown when shortUrl exists */}
                    {shortUrl && (
                        <div className='result-container'>
                            {/* Success message */}
                            <p style={{color: '#10b981', fontWeight: '600', marginBottom: '0.5rem'}}>
                                Success! Your shortened URL is ready
                            </p>
                            {/* Display shortened URL with copy button */}
                            <div className='short-url-display'>
                                <a href={shortUrl} target='_blank' rel='noopener noreferrer' title='Click to visit your shortened URL'>
                                    {shortUrl}
                                </a>
                                {/* Copy to clipboard button */}
                                <button 
                                    className='btn btn-copy' 
                                    type='button' 
                                    onClick={handleCopy}
                                    title={isCopied ? 'Copied to clipboard!' : 'Copy URL to clipboard'}
                                >
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            {/* Button to reset form and create another URL */}
                            <button 
                                className='btn btn-secondary' 
                                type='button' 
                                onClick={handleReset}
                                style={{marginTop: '1rem', width: '100%'}}
                                title='Create another short URL'
                            >
                                Create Another
                            </button>
                            {/* Show dashboard link for authenticated users */}
                            {authToken && (
                                <p style={{marginTop: '1rem', color: '#2563eb'}}>
                                    View all your links in{' '}
                                    <a href='/dashboard' onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }} title='Go to Dashboard'>
                                        Dashboard
                                    </a>
                                </p>
                            )}
                        </div>
                    )}

                    {/* Error message display - only shown when error exists */}
                    {error && (
                        <div className='error-message'>
                            <p><strong>Error:</strong> {error}</p>
                        </div>
                    )}

                    {/* Call-to-action for guest users - only shown when NOT authenticated */}
                    {!authToken && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{marginBottom: '1rem', color: '#64748b'}}>
                                Want to track your links and view analytics?
                            </p>
                            {/* Button to navigate to login/register */}
                            <button 
                                className='btn btn-primary'
                                onClick={() => navigate('/login')}
                                title='Sign in to track your shortened URLs'
                            >
                                Sign In / Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;