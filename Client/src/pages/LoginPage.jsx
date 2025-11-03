// Import React and hooks
import React, { useState } from 'react';
// Import navigation components
import { Link, useNavigate } from 'react-router-dom';
// Import authentication service
import { loginUser } from '../services/authServices.js';
// Import authentication context
import { UseAuth } from '../context/AuthContext';

/**
 * LoginPage Component - User login form
 * 
 * Features:
 * - Email and password input fields
 * - Form validation
 * - Loading state during authentication
 * - Error handling with user-friendly messages
 * - Automatic redirect to dashboard on success
 * - Link to registration page for new users
 * 
 * After successful login:
 * - Stores JWT token in context and localStorage
 * - Redirects user to dashboard
 */
function LoginPage() {
    // State for form inputs
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    // State for error messages
    const [error, setError] = useState('');
    // State for loading indicator
    const [isLoading, setIsLoading] = useState(false);
    // Get login function from auth context
    const { login } = UseAuth();
    // Hook for navigation
    const navigate = useNavigate();

    /**
     * handleChange - Updates form data when user types
     * Uses computed property names to update the correct field
     * 
     * @param {Event} e - Input change event
     */
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value  // Dynamic key based on input name
        });
    }

    /**
     * handleSubmit - Processes login form submission
     * 
     * Flow:
     * 1. Prevent default form submission
     * 2. Validate fields are filled
     * 3. Call API to authenticate user
     * 4. Store token in context and localStorage
     * 5. Redirect to dashboard
     * 
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page reload
        setError('');        // Clear previous errors
        setIsLoading(true);  // Show loading indicator

        // Validate both fields are provided
        if(!formData.email || !formData.password) {
            setError('Both email and password are required.');
            setIsLoading(false);
            return;
        }

        try {
            // Call API to authenticate user
            const response = await loginUser(formData);
            
            // Check if token was returned
            if(response.token) {
                // Store token in context and localStorage
                login(response.token);
                console.log('Token stored successfully!');
                // Redirect to dashboard
                navigate('/dashboard');
            }
            else {
                // Unexpected: login succeeded but no token
                setError('Login successful, but no token was provided.');
            }
        } catch (error) {
            // Extract error message from API response or use default
            const errorMessage = error.error || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error('Login error: ', error);
        } finally {
            // Always stop loading indicator
            setIsLoading(false);
        }
    }

    return (
        <div className='page-container'>
            <div className='auth-container card'>
                {/* Page header */}
                <h2>Welcome Back!</h2>
                <p>Log in to access your dashboard and manage your URLs.</p>

                {/* Login form */}
                <form onSubmit={handleSubmit}>
                {/* Email input field */}
                <div className='form-group'>
                    <label htmlFor='email'>Email: </label>
                    <input 
                        id='email'
                        type='email'
                        placeholder='johndoe@gmail.com' 
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Password input field */}
                <div className='form-group'>
                    <label htmlFor='password'>Password: </label>
                    <input 
                        id='password'
                        type='password'
                        placeholder='john@2084#doe/'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Submit button with loading state */}
                <button type='submit' className='btn btn-primary' disabled={isLoading} title={isLoading ? 'Logging in...' : 'Login to your account'}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            {/* Error message display - only shown when error exists */}
            {
                error && 
                <div className='error-message'>
                    <p>{error}</p>
                </div>
            }

                {/* Link to registration page for new users */}
                <div className='auth-footer'>
                    <p>
                        Don't have an account? <Link to='/register'>Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;