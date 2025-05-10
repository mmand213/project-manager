// src/components/SignupModal.jsx
import React, { useState } from 'react';
import { loadUsers, saveUsers, makeUser, saveCurrentUser } from '../utils/auth';

export default function SignupModal({ onClose, onLogin }) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [confirm, setConfirm] = useState('');
  const [error,   setError]   = useState('');

  const handleSignup = () => {
    if (!name || !email || !pw) return setError('All fields are required');
    if (pw !== confirm)        return setError('Passwords must match');

    const users = loadUsers();
    if (users.some(u => u.email === email)) {
      return setError('That email is already in use');
    }

    const newUser = makeUser({ name, email, password: pw });
    users.push(newUser);
    saveUsers(users);

    // auto-login new user
    saveCurrentUser(newUser);
    onLogin(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <label className="block mb-1 font-medium">Name</label>
        <input
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          value={pw}
          onChange={e => setPw(e.target.value)}
        />

        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSignup}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
