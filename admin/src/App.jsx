import './App.css'
import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import Add from './pages/Add'
import List from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export let backendUrl = import.meta.env.VITE_BACKEND_URL
export let currency = "PKR. ";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');


  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token'); // clear token on logout
    }
  }, [token]);  

  // Logout function
  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === '' ? <Login setToken={setToken} /> :
        <>
          <Navbar handleLogout={handleLogout} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/add' element={<Add token={token} />} />
                <Route path='/list' element={<List token={token} />} />
                <Route path='/orders' element={<Orders token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}
