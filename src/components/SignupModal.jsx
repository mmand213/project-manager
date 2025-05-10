// src/components/SignupModal.jsx
import React, { useState } from 'react';
import { saveUsers } from '../utils/users';
import { sha256 } from 'js-sha256';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PWD_RULES = [
  { test: /.{8,}/,         message: 'At least 8 characters' },
  { test: /[A-Z]/,         message: 'One uppercase letter' },
  { test: /[a-z]/,         message: 'One lowercase letter' },
  { test: /[0-9]/,         message: 'One number' },
  { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'One special character' },
];

export default function SignupModal({ onClose, onUsersChange, onSwitch }) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [confirm, setConfirm] = useState('');
  const [errs,    setErrs]    = useState([]);

  const doSignup = () => {
    let e = [];

    // Required fields
    if (!name.trim())    e.push('Name is required');
    if (!email.trim())   e.push('Email is required');
    if (!pw)             e.push('Password is required');

    // Email format
    if (email && !EMAIL_REGEX.test(email.toLowerCase())) {
      e.push('Enter a valid email address');
    }

    // Password rules
    PWD_RULES.forEach(rule => {
      if (pw && !rule.test.test(pw)) {
        e.push(`Password needs: ${rule.message}`);
      }
    });

    // Confirm match
    if (pw && confirm && pw !== confirm) {
      e.push('Passwords do not match');
    }

    if (e.length) {
      setErrs(e);
      return;
    }

    // All good → save
    const newUser = { 
      id: Date.now(), 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      passwordHash: sha256(pw) 
    };
    const updated = saveUsers(newUser);
    onUsersChange(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

        {errs.length > 0 && (
          <ul className="text-red-600 mb-4 list-disc list-inside">
            {errs.map((msg,i) => <li key={i}>{msg}</li>)}
          </ul>
        )}

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
          <button
            onClick={doSignup}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
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
