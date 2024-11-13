import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const { navigate, backendUrl, token, setToken } = useContext(ShopContext);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const endpoint = currentState === 'Sign Up' ? '/user/register' : '/user/login';
    const payload = currentState === 'Sign Up' ? { name, email, password } : { email, password };

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        // save token to local storage
        localStorage.setItem('token', data.token);
        navigate('/');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  // if token is on local storage so the user is not go to login or signUp page
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  useState(() => {
    if (!token && localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'))
    }
  }, [])

  const toggleState = () => {
    setCurrentState(currentState === 'Sign Up'? 'Login' : 'Sign Up');
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  return (
    <>
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-10">
          <p className="prata-regular text-3xl">{currentState}</p>
          <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
        </div>

        <div className="w-full px-3 py-2 flex flex-col gap-4">
          {currentState === 'Sign Up' && (
            <input
              onChange={onChange}
              value={name}
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Name"
              required
            />
          )}

          <input
            onChange={onChange}
            value={email}
            name="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Email"
            required
          />
          <input
            onChange={onChange}
            value={password}
            name="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Password"
            required
          />

          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer">Forgot your password?</p>
            <p
              onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
              className="cursor-pointer"
            >
              {currentState === 'Login' ? 'Create Account' : 'Login Here'}
            </p>
          </div>
          <button className="w-1/2 m-auto bg-black text-white px-8 py-2 mt-4">
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </form>
      <ToastContainer />
    </>
  );
};

export default Login;
