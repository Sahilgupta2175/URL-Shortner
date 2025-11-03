// Import React and hooks
import React, { useState } from 'react';
// Import navigation components
import { Link, useNavigate } from 'react-router-dom';
// Import authentication service
import { registerUser } from '../services/authServices.js';

/**
 * RegisterPage Component - User registration form
 * 
 * Features:
 * - Name, email, and password input fields
 * - Form validation (all fields required)
 * - Loading state during registration
 * - Error handling with user-friendly messages
 * - Success message with automatic redirect
 * - Link to login page for existing users
 * 
 * After successful registration:
 * - Shows success message
 * - Clears form
 * - Redirects to login page after 2 seconds
 */
function RegisterPage() {
    // State for form inputs
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    // State for error and success messages
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // State for loading indicator
    const [isLoading, setIsLoading] = useState(false);
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
            [e.target.name]: e.target.value,  // Dynamic key based on input name
        });
    }

    /**
     * handleSubmit - Processes registration form submission
     * 
     * Flow:
     * 1. Prevent default form submission
     * 2. Validate all fields are filled
     * 3. Call API to register user
     * 4. Show success message
     * 5. Clear form
     * 6. Redirect to login page after 2 seconds
     * 
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent page reload
        setError('');        // Clear previous errors
        setSuccess('');      // Clear previous success messages
        setIsLoading(true);  // Show loading indicator

        // Validate all fields are provided
        if(!formData.name || !formData.email || !formData.password) {
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }

        try {
            // Call API to register user
            const response = await registerUser(formData);
            console.log('Registration successful. ', response);
            
            // Show success message
            setSuccess('Registration successful! Redirecting to login...');
            
            // Clear form fields
            setFormData({
                name: '',
                email: '',
                password: ''
            });
            
            // Redirect to login page after 2 seconds
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            // Extract error message from API response or use default
            const errorMessage = error.error || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration error: ', error);
        } finally {
            // Always stop loading indicator
            setIsLoading(false);
        }
    }

    return (
        <div className='page-container'>
            <div className='auth-container card'>
                {/* Page header */}
                <h2>Create Your Account</h2>
                <p>Join us to start creating and managing your own short links!</p>

                {/* Registration form */}
                <form onSubmit={handleSubmit}>
                {/* Name input field */}
                <div className='form-group'>
                    <label htmlFor='name'>Name: </label>
                    <input
                        id='name'
                        type='text'
                        placeholder='John Doe'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

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
                <button type='submit' className='btn btn-primary' disabled={isLoading} title={isLoading ? 'Creating your account...' : 'Create your account'}>
                    {isLoading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            {/* Error message display - only shown when error exists */}
            {
                error && 
                <div className='error-message'>
                    <p>{error}</p>
                </div>
            }

            {/* Success message display - only shown when success message exists */}
            {
                success && 
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#d1fae5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    color: '#065f46',
                    fontWeight: '500'
                }}>
                    <p>{success}</p>
                </div>
            }

                {/* Link to login page for existing users */}
                <div className='auth-footer'>
                    <p>
                        Already have an account? <Link to='/login'>Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;