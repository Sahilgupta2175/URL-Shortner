import React, { useState } from 'react';

function HomePage() {
    const [longURL, setLongURL] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('URL to be Shortened: ', longURL);
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