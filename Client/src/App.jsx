import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import './App.css';

function App() {
    return (
        <BrowserRouter>
            <div className='app-container'>
                <Navbar />
                <Routes>
                    <Route path='/' element={ <HomePage /> } />
                    <Route path='/login' element={ <LoginPage /> } />
                    <Route path='/register' element={ <RegisterPage /> } />
                    <Route path='/dashboard' element={ <PrivateRoute> <DashboardPage /> </PrivateRoute> } />
                </Routes>
                <footer className='footer'>
                    <p>
                        Made with ❤️ by <a href='https://github.com/Sahilgupta2175' target='_blank' rel='noopener noreferrer'>Sahil Gupta</a> | © 2025 LinkShortly
                    </p>
                </footer>
            </div>
        </BrowserRouter>      
    );
}

export default App;