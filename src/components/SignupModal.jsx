// src/components/SignupModal.jsx
import React, { useState, useEffect } from 'react';
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
  const [success, setSuccess] = useState(false);

  const [nameErr,    setNameErr]    = useState('');
  const [emailErr,   setEmailErr]   = useState('');
  const [pwdErrs,    setPwdErrs]    = useState([]);
  const [confirmErr, setConfirmErr] = useState('');

  // real-time validation
  useEffect(() => {
    const n = name.trim();
    if (!n)               setNameErr('Name is required');
    else if (!NAME_REGEX.test(n)) setNameErr('Only letters & spaces allowed');
    else                  setNameErr('');
  }, [name]);

  useEffect(() => {
    const e = email.trim().toLowerCase();
    if (!e)               setEmailErr('Email is required');
    else if (!EMAIL_REGEX.test(e)) setEmailErr('Invalid email address');
    else                  setEmailErr('');
  }, [email]);

  useEffect(() => {
    const errs = PWD_RULES
      .filter(r => !r.test.test(pw))
      .map(r => r.message);
    setPwdErrs(errs);
  }, [pw]);

  useEffect(() => {
    if (!confirm)                    setConfirmErr('Please confirm password');
    else if (pw && confirm !== pw)   setConfirmErr('Passwords do not match');
    else                             setConfirmErr('');
  }, [confirm, pw]);

  const allValid =
    !nameErr && !emailErr && pwdErrs.length === 0 && !confirmErr;

  const doSignup = () => {
    if (!allValid) return;
    const newUser = {
      id:           Date.now(),
      name:         name.trim(),
      email:        email.trim().toLowerCase(),
      passwordHash: sha256(pw),
    };
    const users = loadUsers();
    users.push(newUser);
    saveUsers(users);
    onUsersChange(users);
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

        {/* Name */}
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          className={`w-full mb-1 p-2 border rounded focus:ring ${
            nameErr ? 'border-red-500 focus:ring-red-200' : ''
          }`}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Jane Doe"
        />
        {nameErr && <p className="text-red-600 text-sm mb-2">{nameErr}</p>}

        {/* Email */}
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          className={`w-full mb-1 p-2 border rounded focus:ring ${
            emailErr ? 'border-red-500 focus:ring-red-200' : ''
          }`}
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        {emailErr && <p className="text-red-600 text-sm mb-2">{emailErr}</p>}

        {/* Password */}
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          className={`w-full mb-1 p-2 border rounded focus:ring ${
            pwdErrs.length ? 'border-red-500 focus:ring-red-200' : ''
          }`}
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="••••••••"
        />
        {pwdErrs.length > 0 && (
          <ul className="text-red-600 text-sm mb-2 list-disc list-inside">
            {pwdErrs.map((msg,i) => <li key={i}>{msg}</li>)}
          </ul>
        )}

        {/* Confirm */}
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          className={`w-full mb-4 p-2 border rounded focus:ring ${
            confirmErr ? 'border-red-500 focus:ring-red-200' : ''
          }`}
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••"
        />
        {confirmErr && <p className="text-red-600 text-sm mb-3">{confirmErr}</p>}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={doSignup}
            disabled={!allValid}
            className={`px-4 py-2 rounded transition ${
              allValid
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
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
