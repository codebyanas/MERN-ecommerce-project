import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../Context/ShopContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { navigate, backendUrl, token, setToken } = useContext(ShopContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const endpoint = currentState === 'Sign Up' ? '/user/register' : '/user/login';
    const payload = currentState === 'Sign Up' 
      ? { name: formData.name, email: formData.email, password: formData.password } 
      : { email: formData.email, password: formData.password };

    try {
      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId); // Store userId in localStorage
        navigate('/');

        const ut = localStorage.getItem('token')
        console.log(ut)
        
        const uid = localStorage.getItem('userId')
        console.log(uid)
      } else {
        const error = await response.json();
        toast.error(error.message || 'Authentication failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      navigate('/');
    }
  }, [navigate, setToken]);

  const toggleState = () => {
    setCurrentState((prevState) => (prevState === 'Sign Up' ? 'Login' : 'Sign Up'));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
              value={formData.name}
              name="name"
              type="text"
              className="w-full px-3 py-2 border border-gray-800"
              placeholder="Name"
              required
            />
          )}

          <input
            onChange={onChange}
            value={formData.email}
            name="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Email"
            required
          />
          <input
            onChange={onChange}
            value={formData.password}
            name="password"
            type="password"
            className="w-full px-3 py-2 border border-gray-800"
            placeholder="Password"
            required
          />

          <div className="w-full flex justify-between text-sm mt-[-8px]">
            <p className="cursor-pointer">Forgot your password?</p>
            <p onClick={toggleState} className="cursor-pointer">
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
