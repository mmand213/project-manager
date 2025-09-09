import React, { useState } from 'react';
import { signInWithEmail, signUpWithEmail } from './remoteProjects';

export default function AuthBox() {
  const [mode, setMode] = useState('sign-in'); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const go = async () => {
    try {
      if (mode === 'sign-in') {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUpWithEmail(email, password);
        if (error) throw error;
        alert('Sign up successful. You are now signed in.');
      }
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">
        {mode === 'sign-in' ? 'Sign in' : 'Create an account'}
      </h2>
      <div className="space-y-3">
        <input
          className="w-full border rounded p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded p-2"
          type="password"
          placeholder="Password (min 6)"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          onClick={go}
          className="w-full bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          {mode === 'sign-in' ? 'Sign in' : 'Sign up'}
        </button>
      </div>
      <div className="mt-3 text-sm text-center">
        {mode === 'sign-in' ? (
          <button className="text-blue-600" onClick={() => setMode('sign-up')}>
            Need an account? Sign up
          </button>
        ) : (
          <button className="text-blue-600" onClick={() => setMode('sign-in')}>
            Have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
