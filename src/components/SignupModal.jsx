// src/components/SignupModal.jsx
import React, { useState, useEffect } from 'react'
import { loadUsers, saveUsers } from '../utils/users'
import { sha256 } from 'js-sha256'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const NAME_REGEX  = /^[A-Za-z\s]+$/
const PWD_RULES = [
  { test: /.{8,}/,                 message: 'At least 8 characters' },
  { test: /[A-Z]/,                 message: 'One uppercase letter' },
  { test: /[a-z]/,                 message: 'One lowercase letter' },
  { test: /[0-9]/,                 message: 'One number' },
  { test: /[!@#$%^&*(),.?":{}|<>]/, message: 'One special character' },
]

export default function SignupModal({ onClose, onUsersChange, onSwitch }) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [pw,      setPw]      = useState('')
  const [confirm, setConfirm] = useState('')
  const [success, setSuccess] = useState(false)

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    pw: false,
    confirm: false
  })

  const [nameErr,    setNameErr]    = useState('')
  const [emailErr,   setEmailErr]   = useState('')
  const [pwdErrs,    setPwdErrs]    = useState([])     // ← no generics here
  const [confirmErr, setConfirmErr] = useState('')

  // name validation
  useEffect(() => {
    if (!name && touched.name) {
      setNameErr('Name is required')
    } else if (name && !NAME_REGEX.test(name)) {
      setNameErr('Only letters and spaces allowed')
    } else {
      setNameErr('')
    }
  }, [name, touched.name])

  // email validation
  useEffect(() => {
    if (!email && touched.email) {
      setEmailErr('Email is required')
    } else if (email && !EMAIL_REGEX.test(email)) {
      setEmailErr('Invalid email address')
    } else {
      setEmailErr('')
    }
  }, [email, touched.email])

  // password rules
  useEffect(() => {
    if (touched.pw) {
      const errs = PWD_RULES
        .filter(r => !r.test.test(pw))
        .map(r => r.message)
      setPwdErrs(errs)
    } else {
      setPwdErrs([])
    }
  }, [pw, touched.pw])

  // confirm password
  useEffect(() => {
    if (!confirm && touched.confirm) {
      setConfirmErr('Please confirm password')
    } else if (confirm && confirm !== pw) {
      setConfirmErr('Passwords do not match')
    } else {
      setConfirmErr('')
    }
  }, [confirm, pw, touched.confirm])

  const allValid =
    !nameErr &&
    !emailErr &&
    pwdErrs.length === 0 &&
    !confirmErr &&
    name &&
    email &&
    pw &&
    confirm

  const doSignup = () => {
    if (!allValid) return
    const users = loadUsers()
    const newUser = {
      id:           Date.now(),
      name:         name.trim(),
      email:        email.trim().toLowerCase(),
      passwordHash: sha256(pw)
    }
    users.push(newUser)
    saveUsers(users)
    onUsersChange(users)
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-sm text-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome, {name.trim()}!
          </h2>
          <p className="mb-6">You’ve successfully signed up.</p>
          <button
            onClick={onSwitch}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Proceed to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>

        {/* Name */}
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onBlur={() => setTouched(t => ({...t, name: true}))}
          placeholder="Jane Doe"
          className={`w-full mb-1 p-2 border rounded focus:ring ${
            nameErr ? 'border-red-500 focus:ring-red-200' : ''
          }`}
        />
        {nameErr && <p className="text-red-600 text-sm mb-2">{nameErr}</p>}

        {/* Email */}
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onBlur={() => setTouched(t => ({...t, email: true}))}
          placeholder="you@example.com"
          className={`w-full mb-1 p-2 border rounded focus:ring ${
            emailErr ? 'border-red-500 focus:ring-red-200' : ''
          }`}
        />
        {emailErr && <p className="text-red-600 text-sm mb-2">{emailErr}</p>}

        {/* Password */}
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onBlur={() => setTouched(t => ({...t, pw: true}))}
          placeholder="••••••••"
          className={`w-full mb-1 p-2 border rounded focus:ring ${
            pwdErrs.length ? 'border-red-500 focus:ring-red-200' : ''
          }`}
        />
        {pwdErrs.length > 0 && (
          <ul className="text-red-600 text-sm mb-2 list-disc list-inside">
            {pwdErrs.map((msg,i) => <li key={i}>{msg}</li>)}
          </ul>
        )}

        {/* Confirm Password */}
        <label className="block mb-1 font-medium">Confirm Password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onBlur={() => setTouched(t => ({...t, confirm: true}))}
          placeholder="••••••••"
          className={`w-full mb-4 p-2 border rounded focus:ring ${
            confirmErr ? 'border-red-500 focus:ring-red-200' : ''
          }`}
        />
        {confirmErr && (
          <p className="text-red-600 text-sm mb-3">{confirmErr}</p>
        )}

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
  )
}
