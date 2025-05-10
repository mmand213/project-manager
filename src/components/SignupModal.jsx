// src/components/SignupModal.jsx
import React, { useState } from 'react';
import { loadUsers, saveUsers } from '../utils/users';
import { sha256 } from 'js-sha256';

export default function SignupModal({ onClose, onUsersChange, onSwitch }) {
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [pw, setPw]           = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr]         = useState('');

  const doSignup = () => {
    if (!name || !email || !pw) {
      return setErr('All fields are required');
    }
    if (pw !== confirm) {
      return setErr('Passwords do not match');
    }

    // build the new user record
    const newUser = {
      id: Date.now(),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash: sha256(pw)
    };

    // load existing, append, save back
    const users = loadUsers();
    const updated = [...users, newUser];
    saveUsers(updated);

    // inform parent
    onUsersChange(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}

        <label>Name</label>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label>Email</label>
        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          value={pw}
          onChange={e => setPw(e.target.value)}
        />

        <label>Confirm Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        />

        <div className="flex justify-between items-center">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button onClick={doSignup} className="px-4 py-2 bg-green-600 text-white rounded">
            Sign Up
          </button>
        </div>

        <p className="mt-4 text-sm text-center">
          Already have an account?{' '}
          <button onClick={onSwitch} className="text-blue-600 underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
