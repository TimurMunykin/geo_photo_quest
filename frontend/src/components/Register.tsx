import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setToken } from '../redux/authSlice';
import { API_URL } from '../config';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { username, password });
      setMessage('Registered successfully');
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      setMessage('Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
        <Typography variant="h4" gutterBottom>Register</Typography>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          fullWidth
        />
        <Button variant="contained" color="primary" onClick={handleRegister}>Register</Button>
        {message && <Typography color="error" marginTop="20px">{message}</Typography>}
      </Box>
    </Container>
  );
};

export default Register;
