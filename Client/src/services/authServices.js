import axios from "axios";

const API_URL = '/api/auth/';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(API_URL + 'register', userData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('API error: User registration failed', error.message);

        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            throw new Error('An unexpected error occurred during registration.');
        }
    }
}

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(API_URL + 'login', credentials);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('API error: User login failed', error.message);
        
        if(error.response && error.response.data) {
            throw error.response.data;
        }
        else {
            throw new Error('An unexpected error occurred during login.');
        }
    }
}