// src/components/LoginModal.jsx
import React, { useState } from 'react'
import { verifyLogin, saveCurrentUser } from '../utils/auth'

export default function LoginModal({ onClose, onLogin, onSwitch }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.email.trim()) {
      return setError('Please enter your email')
    }
    if (!form.password) {
      return setError('Please enter your password')
    }

    const user = verifyLogin(form.email.trim(), form.password)
    if (!user) {
      return setError('Invalid email or password')
    }

    // success!
    saveCurrentUser(user)
    onLogin(user)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-4">Sign In</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}

        <label className="block mb-1">Email</label>
        <input
          name="email"
          type="email"
          className="w-full mb-4 p-2 border rounded"
          value={form.email}
          onChange={handleChange}
          autoFocus
        />

        <label className="block mb-1">Password</label>
        <input
          name="password"
          type="password"
          className="w-full mb-6 p-2 border rounded"
          value={form.password}
          onChange={handleChange}
        />

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="underline text-blue-600"
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  )
}
