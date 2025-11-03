import axios from "axios";

const API_URL = '/api/links/';

const getUserLinks = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.get(API_URL + '/my-links', config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('API error: Failed to fetch user links.', error.message);

        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            throw new Error('An unexpected error occurred while fetching links.');
        }
    }
}

export default getUserLinks;