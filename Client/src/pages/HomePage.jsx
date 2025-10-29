import React, { useState } from 'react';
import createShortURL from '../services/apiServices';

function HomePage() {
    const [longURL, setLongURL] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!longURL) {
            alert('Please enter a URL to shorten.');
            return;
        }
        else {
            console.log('URL to be Shortened: ', longURL);
        }

        try {
            const response = await createShortURL(longURL);
            console.log('Successfully created short URL: ', response);
        } catch (error) {
            console.error('Error from API.', error.message);
            alert(`Error: ${error.error || 'Something went wrong!'}`);
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
        </div>
    );
}

export default HomePage;