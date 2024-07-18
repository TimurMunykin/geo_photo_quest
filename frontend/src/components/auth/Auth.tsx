import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { Tabs, Tab, Box, TextField, Button, Typography } from '@mui/material';
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

  const handleTabChange = (event: React.SyntheticEvent, newValue: boolean) => {
    setIsLogin(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={isLogin}
        onChange={handleTabChange}
        centered
      >
        <Tab label="Login" value={true} />
        <Tab label="Register" value={false} />
      </Tabs>
      <Box className="form-container" sx={{ p: 3 }}>
        <Typography variant="h5" className="text-center mb-4">
          {isLogin ? 'Login' : 'Register'}
        </Typography>
        <TextField
          variant="outlined"
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
        />
        <TextField
          variant="outlined"
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />
        <Button
          onClick={handleAuth}
          fullWidth
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          {isLogin ? 'Login' : 'Register'}
        </Button>
        <Typography color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default Auth;
