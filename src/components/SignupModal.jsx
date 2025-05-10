// src/components/SignupModal.jsx
import React, { useState } from 'react';
import { loadUsers, saveUsers } from '../utils/users';
import sha256 from 'js-sha256';

export default function SignupModal({ onClose, onUsersChange }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [showPwd, setShowPwd]   = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password) {
      return setError('All fields are required.');
    }
    if (password !== confirm) {
      return setError('Passwords do not match.');
    }
    const users = loadUsers();
    users.push({
      id: Date.now(),
      name,
      email,
      passwordHash: sha256(password),
    });
    saveUsers(users);
    onUsersChange(users);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        {/* Name */}
        <label className="block mb-2 text-gray-700">Full Name</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Doe"
        />

        {/* Email */}
        <label className="block mb-2 text-gray-700">Email Address</label>
        <input
          type="email"
          className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {/* Password */}
        <label className="block mb-2 text-gray-700">Password</label>
        <div className="relative mb-4">
          <input
            type={showPwd ? 'text' : 'password'}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            onClick={() => setShowPwd(v => !v)}
          >
            {showPwd ? 'Hide' : 'Show'}
          </button>
        </div>

        {/* Confirm Password */}
        <label className="block mb-2 text-gray-700">Confirm Password</label>
        <input
          type="password"
          className="w-full mb-6 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
        />

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSignup}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
