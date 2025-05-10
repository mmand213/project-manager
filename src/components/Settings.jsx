// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { loadUsers, saveUsers } from '../utils/users';

export default function Settings({ onClearAll }) {
  const [users, setUsers] = useState([]);
  const [filterText, setFilterText] = useState('');

  // load existing users on mount
  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  // remove a single user
  const handleDelete = (id) => {
    if (!window.confirm('Remove this user?')) return;
    const next = users.filter(u => u.id !== id);
    setUsers(next);
    saveUsers(next);
  };

  // filter by name or email
  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(filterText.toLowerCase()) ||
      u.email.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Project Settings */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Project Settings</h2>
        <button
          onClick={onClearAll}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Clear All Projects
        </button>
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>

        {/* Filter bar */}
        <input
          type="search"
          placeholder="🔍 Filter by name or email..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
          className="w-full p-2 mb-4 border rounded focus:ring-primary focus:border-primary"
        />

        {/* Users table */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map(u => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-2">{u.name}</td>
                    <td className="px-4 py-2">{u.email}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
