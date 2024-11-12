import React, { useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Login({ setToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
    };

    const onChangePassword = (e) => {
        setPassword(e.target.value);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            const response = await fetch(backendUrl + '/user/Admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (data.success) {
                setToken(data.token)
            } else {
                toast.error(data.message)
            }
            // setEmail('');
            // setPassword('');

        } catch (error) {
            console.error(error);
            toast.error('An error occurred while trying to login')
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center w-full'>
            <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
                <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
                <form onSubmit={onSubmitHandler}>
                    <div className='mb-3 min-w-72'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
                        <input onChange={onChangeEmail} value={email} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' type="email" placeholder="Email" required />
                    </div>
                    <div className='mb-3 min-w-72 relative'>
                        <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
                        <div className="relative">
                            <input onChange={onChangePassword} value={password} className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none pr-10' type={showPassword ? "text" : "password"} placeholder="Password" required />
                            <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-3 flex items-center text-gray-600">
                                <span className="material-icons">
                                    {showPassword ? 'visibility' : 'visibility_off'}
                                </span>
                            </button>
                        </div>
                    </div>
                    <button className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black' type="submit">Login</button>
                </form>
            </div>
        </div>
    );
}
