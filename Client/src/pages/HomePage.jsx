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
                error && (
                    <div className='error-container' style={{color: 'red', marginTop: '1rem'}}>
                        <p><strong>Error: </strong> {error}</p>
                    </div>
                )
            }
            {
                shortUrlData && (
                    <div className='result-container' style={{marginTop: '1rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '5px'}}>
                        <h3>Your Short URL is ready!</h3>
                        <p>
                            <strong>Short Link: </strong>
                            <a 
                                href={shortUrlData.shortUrl}
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{marginLeft: '0.5rem', fontWeight: 'bold', color: '#007bff'}}
                            >
                                {shortUrlData.shortUrl}
                            </a>
                        </p>
                        <p style={{fontsize: '0.8rem', color: '#555'}}>
                            <strong>Original URL: </strong>{shortUrlData.originalUrl.substring(0,70)}...
                        </p>
                    </div>
                )
            }
        </div>
    );
}

export default HomePage;