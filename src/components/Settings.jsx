// src/components/Settings.jsx
import React, { useState, useEffect } from 'react';
import { loadUsers, saveUsers } from '../utils/users';

export default function Settings({ onClearAll }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(loadUsers());
  }, []);

  const deleteUser = (id) => {
    if (!window.confirm('Delete this user?')) return;
    const updated = users.filter(u => u.id !== id);
    setUsers(updated);
    saveUsers(updated);
  };

  return (
    <div className="space-y-8">
      {/* — Project Settings */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Project Settings</h2>
        <button
          onClick={onClearAll}
          className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
        >
          Clear All Projects
        </button>
      </section>

      {/* — User Management */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">User Management</h2>

        {users.length === 0 ? (
          <p className="text-gray-500">No users have signed up yet.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => deleteUser(u.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
);
}
