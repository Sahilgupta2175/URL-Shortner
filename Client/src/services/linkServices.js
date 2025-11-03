import axios from "axios";

const API_URL = '/api/links';

export const getUserLinks = async (token) => {
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

export const deleteLink = async (linkId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.delete(`${API_URL}/${linkId}`, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('API error: Failed to delete link.', error.message);

        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            throw new Error('An unexpected error occurred while deleting link.');
        }
    }
}

export const updateLink = async (linkId, updatedData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        const response = await axios.put(`${API_URL}/${linkId}`, updatedData, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('API error: Failed to update link.', error.message);

        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            throw new Error('An unexpected error occurred while updating link.');
        }
    }
}