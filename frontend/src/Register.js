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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-700">Register</h2>
        <input
          type="email"
          placeholder="Email"
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full px-4 py-2 mb-6 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="APPLICANT">Applicant</option>
          <option value="EMPLOYER">Employer</option>
        </select>
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
