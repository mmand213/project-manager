// src/components/AddAgentModal.jsx
import React, { useState } from 'react'

export default function AddAgentModal({ onSave, onCancel }) {
  const [name, setName]   = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole]   = useState('')
  const [err, setErr]     = useState('')

  const handleSave = () => {
    if (!name.trim() || !email.trim() || !role.trim()) {
      setErr('All fields are required')
      return
    }
    onSave({
      id: Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: role.trim(),
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h2 className="text-2xl font-semibold mb-4">Add New Agent</h2>
        {err && <div className="text-red-600 mb-3">{err}</div>}

        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          className="w-full mb-3 p-2 border rounded"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <label className="block text-sm font-medium mb-1">Role</label>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={role}
          onChange={e => setRole(e.target.value)}
        />

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primaryLight transition"
          >
            Add Agent
          </button>
        </div>
      </div>
    </div>
  )
}
