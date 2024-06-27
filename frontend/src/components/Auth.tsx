import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import './Auth.css';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
      const response = await axios.post(endpoint, { username, password });
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        setMessage('Logged in successfully');
        navigate('/');
      } else {
        setMessage('Registered successfully');
        setIsLogin(true);
      }
    } catch (error) {
      setMessage(isLogin ? 'Login failed' : 'Registration failed');
    }
  };

  return (
    <>
      <div className="tabs">
        <button
          className={`tab ${isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`tab ${!isLogin ? 'active' : ''}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>
      <div className="form-container">
        <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="mb-2 p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="mb-2 p-2 border rounded"
        />
        <button onClick={handleAuth} className="w-full py-2 bg-blue-500 text-white rounded">
          {isLogin ? 'Login' : 'Register'}
        </button>
        <p className="text-red-500 mt-2">{message}</p>
      </div>
    </>
  );
};

export default Auth;
