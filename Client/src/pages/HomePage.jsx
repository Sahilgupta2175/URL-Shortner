import React, { useState } from 'react';
import createShortURL from '../services/apiServices';

function HomePage() {
    const [longURL, setLongURL] = useState('');
    const [shortUrlData, setShortUrlData] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!longURL) {
            setError('Please enter a URL to shorten.');
            setShortUrlData(null);
            return;
        }
        else {
            console.log('URL to be Shortened: ', longURL);
        }

        try {
            setError('');
            const response = await createShortURL(longURL);
            setShortUrlData(response.data);
            console.log('Successfully created short URL: ', response);
        } catch (error) {
            const errorMessage = error.error || 'An unexpected error occurred.';
            setError(errorMessage);
            console.log(errorMessage);
            setShortUrlData(null);
            console.error('Error from API.', error.message);
        }
    }

    return (
        <div>
            <h2>URL Shortener</h2>
            <p>Enter a long URL to make it short and easy to share!</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='longUrl-input'>Your Long URL:</label>
                    <input 
                        id='longUrl-input'
                        type='url'
                        placeholder='https://example.com/very/long/url/to/shorten'
                        value={longURL}
                        onChange={(e) => setLongURL(e.target.value)}
                        required
                    />
                </div>
                <button type='Submit'>Shorten URL</button>
            </form>
            {
                shortUrlData && (
                    <div className='result-container' style={{marginTop: '20px'}}>
                        <p>Your Shortened URL: </p>
                        <div className='short-url-display' style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <a href={shortUrlData.shortUrl} target='_blank' rel='noopener noreferrer'>
                                {shortUrlData.shortUrl}
                            </a>
                            <button className='btn btn-copy' type='button'>
                                Copy
                            </button>
                        </div>
                    </div>
                )
            }
            {
                error && (
                    <div className='error-message' style={{color: 'red'}}>
                        <p><strong>Error: </strong> {error}</p>
                    </div>
                )
            }
        </div>
    );
}

export default HomePage;