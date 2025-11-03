import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createShortURL from '../services/apiServices';
import { UseAuth } from '../context/AuthContext';

function HomePage() {
    const [longURL, setLongURL] = useState('');
    const [shortUrl, setShortUrl] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCopied, setIsCopied] = useState(false);
    const { authToken } = UseAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCopied(false);
        setError('');
        setIsLoading(true);
        
        if(!longURL) {
            setError('Please enter a URL to shorten.');
            setShortUrl(null);
            setIsLoading(false);
            return;
        }

        try {
            const response = await createShortURL(longURL);
            setShortUrl(response.data.shortUrl);
            console.log('Successfully created short URL: ', response);
        } catch (error) {
            const errorMessage = error.error || 'An unexpected error occurred.';
            setError(errorMessage);
            setShortUrl(null);
            console.error('Error from API.', error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleCopy = async () => {
        if(!shortUrl) return;

        try {
            await navigator.clipboard.writeText(shortUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy URL.', error.message);
            alert('Failed to copy URL.');
        }
    }

    const handleReset = () => {
        setLongURL('');
        setShortUrl(null);
        setError('');
        setIsCopied(false);
    }

    return (
        <div className='page-container'>
            <div className='page-content'>
                <div className='home-container'>
                    <h2>⚡ URL Shortener</h2>
                    <p>Transform long URLs into short, shareable links instantly!</p>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor='longUrl-input'>Enter your long URL:</label>
                            <input 
                                id='longUrl-input'
                                type='url'
                                placeholder='https://example.com/very/long/url/to/shorten'
                                value={longURL}
                                onChange={(e) => setLongURL(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>
                        <button type='submit' disabled={isLoading}>
                            {isLoading ? '🔄 Shortening...' : '✨ Shorten URL'}
                        </button>
                    </form>

                    {shortUrl && (
                        <div className='result-container'>
                            <p style={{color: '#10b981', fontWeight: '600', marginBottom: '0.5rem'}}>
                                ✅ Your shortened URL is ready!
                            </p>
                            <div className='short-url-display'>
                                <a href={shortUrl} target='_blank' rel='noopener noreferrer'>
                                    {shortUrl}
                                </a>
                                <button 
                                    className='btn btn-copy' 
                                    type='button' 
                                    onClick={handleCopy}
                                >
                                    {isCopied ? '✓ Copied!' : '📋 Copy'}
                                </button>
                            </div>
                            <button 
                                className='btn btn-secondary' 
                                type='button' 
                                onClick={handleReset}
                                style={{marginTop: '1rem', width: '100%'}}
                            >
                                Create Another
                            </button>
                            {authToken && (
                                <p style={{marginTop: '1rem', color: '#64748b'}}>
                                    💡 View all your links in{' '}
                                    <a href='/dashboard' onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>
                                        Dashboard
                                    </a>
                                </p>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className='error-message'>
                            <p><strong>❌ Error:</strong> {error}</p>
                        </div>
                    )}

                    {!authToken && (
                        <div style={{
                            marginTop: '2rem',
                            padding: '1.5rem',
                            background: 'white',
                            borderRadius: '12px',
                            textAlign: 'center'
                        }}>
                            <p style={{marginBottom: '1rem', color: '#64748b'}}>
                                📊 Want to track your links and view analytics?
                            </p>
                            <button 
                                className='btn btn-primary'
                                onClick={() => navigate('/login')}
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