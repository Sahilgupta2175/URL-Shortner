import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/authServices.js';

function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

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
        setIsLoading(true);

        if(!formData.name || !formData.email || !formData.password) {
            setError('All fields are required.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await registerUser(formData);
            console.log('Registration successful. ', response);
            setSuccess('Registration successful! Redirecting to login...');
            setFormData({
                name: '',
                email: '',
                password: ''
            });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            const errorMessage = error.error || 'Registration failed. Please try again.';
            setError(errorMessage);
            console.error('Registration error: ', error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className='page-container'>
            <div className='auth-container card'>
                <h2>Create Your Account</h2>
                <p>Join us to start creating and managing your own short links!</p>

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

                <button type='submit' className='btn btn-primary' disabled={isLoading} title={isLoading ? 'Creating your account...' : 'Create your account'}>
                    {isLoading ? 'Creating Account...' : 'Register'}
                </button>
            </form>

            {
                error && 
                <div className='error-message'>
                    <p>{error}</p>
                </div>
            }

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