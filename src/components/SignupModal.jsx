// src/components/SignupModal.jsx
import React, { useState } from 'react';
import { loadUsers, saveUsers } from '../utils/users';
import { sha256 } from 'js-sha256';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX  = /^[A-Za-z\s]+$/;
const PWD_RULES = [
  { test: /.{8,}/,                 message: 'At least 8 characters' },
  { test: /[A-Z]/,                 message: 'One uppercase letter' },
  { test: /[a-z]/,                 message: 'One lowercase letter' },
  { test: /[0-9]/,                 message: 'One number' },
  { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'One special character' },
];

export default function SignupModal({ onClose, onUsersChange, onSwitch }) {
  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [pw,      setPw]      = useState('');
  const [confirm, setConfirm] = useState('');
  const [errs,    setErrs]    = useState([]);
  const [success, setSuccess] = useState(false);

  const doSignup = () => {
    const e = [];

    // Name
    if (!name.trim()) {
      e.push('Name is required');
    } else if (!NAME_REGEX.test(name.trim())) {
      e.push('Name can only contain letters and spaces');
    }

    // Email
    if (!email.trim()) {
      e.push('Email is required');
    } else if (!EMAIL_REGEX.test(email.toLowerCase())) {
      e.push('Enter a valid email address');
    }

    // Password
    if (!pw) {
      e.push('Password is required');
    } else {
      PWD_RULES.forEach(rule => {
        if (!rule.test.test(pw)) {
          e.push(`Password needs: ${rule.message}`);
        }
      });
    }

    // Confirm
    if (pw && confirm && pw !== confirm) {
      e.push('Passwords do not match');
    }

    if (e.length) {
      setErrs(e);
      return;
    }

    // all good → create user
    const newUser = {
      id:           Date.now(),
      name:         name.trim(),
      email:        email.toLowerCase().trim(),
      passwordHash: sha256(pw),
    };

    const users  = loadUsers();
    const updated = [...users, newUser];
    saveUsers(updated);
    onUsersChange(updated);

    // show success screen
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome, {name.trim()}!</h2>
          <p className="mb-6">You’ve successfully signed up.</p>
          <button
            onClick={onSwitch}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Proceed to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

        {errs.length > 0 && (
          <ul className="text-red-600 mb-4 list-disc list-inside">
            {errs.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}

        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Doe"
        />

        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          className="w-full mb-3 p-2 border rounded"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="••••••••"
        />

        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          className="w-full mb-4 p-2 border rounded"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
        />

        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={doSignup}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
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
