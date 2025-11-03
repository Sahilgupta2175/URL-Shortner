import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authServices.js';
import { UseAuth } from '../context/AuthContext.jsx';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = UseAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if(!formData.email || !formData.password) {
            setError('Both email and password are required.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await loginUser(formData);
            
            if(response.token) {
                login(response.token);
                console.log('Token stored successfully!');
                navigate('/dashboard');
            }
            else {
                setError('Login successful, but no token was provided.');
            }
        } catch (error) {
            const errorMessage = error.error || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error('Login error: ', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='page-container'>
            <div className='auth-container card'>
                <h2>🔐 Welcome Back!</h2>
                <p>Log in to access your dashboard and manage your URLs.</p>

                <form onSubmit={handleSubmit}>
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

                <button type='submit' className='btn btn-primary' disabled={isLoading}>
                    {isLoading ? '🔄 Logging in...' : '🚀 Login'}
                </button>
            </form>

            {
                error && 
                <div className='error-message'>
                    <p>{error}</p>
                </div>
            }

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