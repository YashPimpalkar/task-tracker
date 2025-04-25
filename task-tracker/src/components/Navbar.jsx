import React from 'react'
import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import API from '../services/api.js';

export default function Navbar({ isAuthenticated, setIsAuthenticated }) {
    const [userData, setUserData] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const token = localStorage.getItem('token');
    const uid = localStorage.getItem('uid');
  
    useEffect(() => {
      if (token && uid) {
        const verifyUser = async () => {
          try {
            const res = await API.get(`/auth/user/${uid}`, {
                'uid': uid
            });
            console.log(res.data)
            setUserData(res.data.user);
          } catch (err) {
            console.error('Verification failed:', err);
            localStorage.removeItem('token');
            localStorage.removeItem('uid');
          }
        };
        verifyUser();
      }
    }, [token, uid]);
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('uid');
      window.location.reload();
      setIsAuthenticated(false);
    };
  
    return (
      <nav className="w-full bg-white shadow-md py-4 px-6">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center">
              <svg className="h-8 w-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">Task Tracker</span>
            </NavLink>
            <NavLink to="/" className="flex items-center">
              
              <span className="ml-2 text-xl text-gray-800">Dashboard</span>
            </NavLink>
          </div>
  
          {userData ? (
            <div className="relative">
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
              </button>
  
              {showProfile && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b">
                    <p className="text-sm font-medium text-gray-800">{userData.name}</p>
                    <p className="text-xs text-gray-500">{userData.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <NavLink 
                to="/login" 
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                Login
              </NavLink>
              <Link 
                to="/register" 
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
               <span className='text-white'>Register</span> 
              </Link>
            </div>
          )}
        </div>
      </nav>
    );
}






