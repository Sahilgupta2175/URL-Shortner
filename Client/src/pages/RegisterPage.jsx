import React from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {
    return (
        <div className='auth-container'>
            <h2>Create Your Account</h2>
            <p>Join us to start creating your own short links!</p>

            <form>
                <div className='form-group'>
                    <label htmlFor='name'>Name: </label>
                    <input
                        id='name'
                        type='text'
                        placeholder='John Doe'
                        required
                    />
                </div>

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

                <button type='submit' className='btn'>Register</button>
            </form>

            <p className='auth-switch'>
                Already have an account? <Link to='/login'>Login here</Link>
            </p>
        </div>
    );
}

export default RegisterPage;