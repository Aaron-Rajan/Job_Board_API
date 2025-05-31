import React, { useState } from 'react';
import axios from 'axios';

function Login({ setToken, setRole }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      setToken(res.data.token);
      setRole(res.data.role);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
