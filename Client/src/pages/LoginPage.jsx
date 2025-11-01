import React from 'react';
import { Link } from 'react-router-dom';

function LoginPage() {
    return (
        <div className='auth-container'>
            <h2>Welcome Back!</h2>
            <p>Log in to access your dashboard.</p>

            <form>
                <div className='form-group'>
                    <label htmlFor='email'>Email: </label>
                    <input 
                        id='email'
                        type='email'
                        placeholder='johndoe@gmail.com'
                        required
                    />
                </div>

                <div className='form-group'>
                    <label htmlFor='password'>Password: </label>
                    <input 
                        id='password'
                        type='password'
                        placeholder='john@2084#doe/'
                        required
                    />
                </div>

                <button type='submit' className='btn'>Login</button>
            </form>

            <p className='auth-switch'>
                Don't have an account? <Link to='/register'>Register here</Link>
            </p>
        </div>
    );
}

export default LoginPage;