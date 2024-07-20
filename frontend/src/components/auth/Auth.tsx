import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { Tabs, Tab, Box, TextField, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setToken } from '../../redux/authSlice';

const Auth: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAuth = async () => {
    const isLogin = tabIndex === 0;
    try {
      const endpoint = isLogin ? `${API_URL}/auth/login` : `${API_URL}/auth/register`;
      const response = await axios.post(endpoint, { username, password });
      if (isLogin) {
        const token = response.data.token;
        dispatch(setToken(token));
        setMessage('Logged in successfully');
        navigate('/');
      } else {
        setMessage('Registered successfully');
        setTabIndex(0);
      }
    } catch (error) {
      setMessage(isLogin ? 'Login failed' : 'Registration failed');
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setMessage('');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
      >
        <Tab label="Login" />
        <Tab label="Register" />
      </Tabs>
      <Box className="form-container" sx={{ p: 3 }}>
        <Typography variant="h5" className="text-center mb-4">
          {tabIndex === 0 ? 'Login' : 'Register'}
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
          {tabIndex === 0 ? 'Login' : 'Register'}
        </Button>
        <Typography color="error" sx={{ mt: 2 }}>
          {message}
        </Typography>
      </Box>
    </Box>
  );
};

export default Auth;
