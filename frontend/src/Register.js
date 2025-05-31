import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegistered }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('APPLICANT'); // default role

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/register', {
        email,
        password,
        role
      });
      alert('Registration successful. Please log in.');
      onRegistered(); // switch to login view
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="APPLICANT">Applicant</option>
        <option value="EMPLOYER">Employer</option>
      </select>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;
