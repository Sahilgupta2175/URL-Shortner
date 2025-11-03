import React from 'react';
import { useNavigate } from 'react-router-dom';

function NotFoundPage() {
    const navigate = useNavigate();

    return (
        <div className='page-container'>
            <div className='page-content' style={{textAlign: 'center'}}>
                <div className='card'>
                    <h1 style={{fontSize: '6rem', margin: 0}}>404</h1>
                    <h2>Page Not Found</h2>
                    <p style={{fontSize: '1.125rem', marginBottom: '2rem'}}>
                        Oops! The page you're looking for doesn't exist.
                    </p>
                    <div style={{display: 'flex', gap: '1rem', justifyContent: 'center'}}>
                        <button 
                            onClick={() => navigate('/')} 
                            className='btn btn-primary'
                        >
                            🏠 Go Home
                        </button>
                        <button 
                            onClick={() => navigate(-1)} 
                            className='btn btn-secondary'
                        >
                            ← Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NotFoundPage;
