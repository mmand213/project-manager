// src/components/SignupModal.jsx
import React, { useState } from 'react';
import { loadUsers, saveUsers } from '../utils/users';
import sha256 from 'js-sha256';

export default function SignupModal({ onClose, onUsersChange }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSignup = () => {
    if (!name || !email || !password) {
      return setError('All fields required');
    }
    if (password !== confirm) {
      return setError('Passwords must match');
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-xl mb-4">Sign Up</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <label className="block mb-1">Name</label>
        <input className="mb-3 w-full p-2 border rounded" value={name} onChange={e => setName(e.target.value)} />
        <label className="block mb-1">Email</label>
        <input type="email" className="mb-3 w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="block mb-1">Password</label>
        <input type="password" className="mb-3 w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} />
        <label className="block mb-1">Confirm Password</label>
        <input type="password" className="mb-3 w-full p-2 border rounded" value={confirm} onChange={e => setConfirm(e.target.value)} />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSignup} className="px-4 py-2 bg-blue-600 text-white rounded">Sign Up</button>
        </div>
      </div>
    </div>
  );
}
