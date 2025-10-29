import axios from "axios";

const createShortURL = async (longURL) => {
    try {
        const response = await axios.post('/api/shorten', {longURL});
        return response.data;
    } catch (error) {
        console.error('API error: Failed to create short URL.', error.message);
        
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            throw new Error('An unexpected error occurred. Please try again.');
        }
    }
}

export default createShortURL;