// src/utils/auth.js
import { loadUsers } from './users'
import sha256 from 'js-sha256'         // <— correct default import

const CURRENT_KEY = 'pm-app-current-user'

/** Given email + plain-text password, return the user object
 *  if they match, or null if they don't.
 */
export function verifyLogin(email, password) {
  const users = loadUsers()
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!user) return null

  // now hash the incoming password and compare
  if (user.passwordHash === sha256(password)) {
    return user
  }
  return null
}

/** Persist “current user” to localStorage */
export function saveCurrentUser(user) {
  if (user) {
    localStorage.setItem(CURRENT_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_KEY)
  }
}

/** Retrieve the current user (or null if none) */
export function loadCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_KEY))
  } catch {
    return null
  }
}
