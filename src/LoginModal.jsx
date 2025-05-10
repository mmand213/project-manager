// src/components/LoginModal.jsx
import React, { useState } from 'react';
import { verifyLogin, saveCurrentUser } from '../utils/auth.js';

export default function LoginModal({ onClose, onLogin }) {
  const [email, setEmail] = useState('');
  const [pw,    setPw]    = useState('');
  const [err,  setErr]    = useState('');

  const doLogin = () => {
    const user = verifyLogin(email, pw);
    if (!user) return setErr('Invalid credentials');
    saveCurrentUser(user);
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
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
          className="w-full mb-4 p-2 border rounded"
          value={pw}
          onChange={e => setPw(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={doLogin} className="px-4 py-2 bg-blue-600 text-white rounded">
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
