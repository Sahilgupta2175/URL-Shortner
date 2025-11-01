import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authServices.js';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
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

        if(!formData.email || !formData.password) {
            setError('Both email and password are required.');
            return;
        }

        try {
            const response = await loginUser(formData);
            
            if(response.token) {
                localStorage.setItem('authToken', response.token);
                console.log('Token stored in localStorage successfully!.');
                navigate('/dashboard');
            }
            else {
                setError('Login successful, but no token was provided.');
            }
        } catch (error) {
            const errorMessage = error.error || 'Login failed. Please check your credentials.';
            setError(errorMessage);
            console.error('Login error: ', error.message);
        }
    }

    return (
        <div className='auth-container'>
            <h2>Welcome Back!</h2>
            <p>Log in to access your dashboard.</p>

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

                <button type='submit' className='btn'>Login</button>
            </form>

            {
                error && 
                <p className='error-message' style={{color: 'red'}}>
                    {error}
                </p>
            }

            <p className='auth-switch'>
                Don't have an account? <Link to='/register'>Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;