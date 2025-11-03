import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UseAuth } from '../context/AuthContext';

function Navbar() {
    const { authToken, logout } = UseAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <nav className='navbar'>
            <div className='navbar-content'>
                <Link to='/' className='navbar-brand' title='Go to homepage'>
                    LinkShortly
                </Link>
                <div className='navbar-links'>
                    {authToken ? (
                        <>
                            <Link 
                                to='/dashboard' 
                                className={isActive('/dashboard') ? 'active' : ''}
                                title='View your dashboard'
                            >
                                Dashboard
                            </Link>
                            <button 
                                onClick={handleLogout} 
                                className='btn btn-small btn-secondary'
                                style={{padding: '0.5rem 1rem'}}
                                title='Logout from your account'
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to='/login' 
                                className={isActive('/login') ? 'active' : ''}
                                title='Login to your account'
                            >
                                Login
                            </Link>
                            <Link 
                                to='/register'
                                title='Create a new account'
                            >
                                <button className='btn btn-primary btn-small'>
                                    Sign Up
                                </button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
