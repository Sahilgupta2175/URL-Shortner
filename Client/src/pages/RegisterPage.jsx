import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/authServices.js';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if(!formData.name || !formData.email || !formData.password) {
            setError('All fields are required.');
            return;
        }

        try {
            const response = await registerUser(formData);
            console.log('Registration successful. ', response);
            setSuccess('Registration successful! Please log in.');
            setFormData({
                name: '',
                email: '',
                password: ''
            });
        } catch (error) {
            const errorMessage = error.error || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration error: ', error.message);
        }
    }

    return (
        <div className='auth-container'>
            <h2>Create Your Account</h2>
            <p>Join us to start creating your own short links!</p>

            <form onSubmit={handleSubmit}>
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

                <button type='submit' className='btn'>Register</button>
            </form>

            {
                error && 
                <p className='error-message' style={{color: 'red'}}>
                    {error}
                </p>
            }

            {
                success && 
                <p className='success-message' style={{color: 'green'}}>
                    {success}
                </p>
            }

            <p className='auth-switch'>
                Already have an account? <Link to='/login'>Login here</Link>
            </p>
        </div>
    );
}

export default RegisterPage;