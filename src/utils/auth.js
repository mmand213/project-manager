// src/utils/auth.js

import { loadUsers } from './users'

const CURRENT_KEY = 'pm-app-current-user'

/**
 * Given email + plain-text password, return the user object
 * (with id, name, email, passwordHash) if credentials match,
 * or `null` if they don’t.
 */
export function verifyLogin(email, password) {
  const users = loadUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return null

  // The stored password is hashed with sha256
  // We need the same lib you used in SignupModal
  const { sha256 } = require('js-sha256')
  if (user.passwordHash === sha256(password)) {
    return user
  }
  return null
}

/** Persist the “current user” to localStorage */
export function saveCurrentUser(user) {
  localStorage.setItem(CURRENT_KEY, JSON.stringify(user))
}

/** Retrieve the current user (or null if none) */
export function loadCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY))
  } catch {
    return null
  }
}
