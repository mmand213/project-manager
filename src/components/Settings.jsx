// src/components/Settings.jsx
import React, { useRef } from 'react';
import Papa from 'papaparse';
import { loadUsers, saveUsers } from '../utils/users';
import { loadProjects, saveProjects } from '../utils/storage';

export default function Settings({ onClearAll }) {
  const users = loadUsers();
  const fileUsers = useRef(null);

  // download helper
  const download = (filename, content, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Export users
  const handleExportUsers = () => {
    const minimal = users.map(({ id, passwordHash, ...rest }) => rest);
    const csv = Papa.unparse(minimal);
    download(`users-${Date.now()}.csv`, csv, 'text/csv');
  };

  // Import users
  const handleImportUsers = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        let parsed;
        if (file.name.endsWith('.json')) {
          parsed = JSON.parse(target.result);
        } else {
          parsed = Papa.parse(target.result, { header: true }).data;
        }
        // give each new user an id & empty passwordHash
        const withIds = parsed.map(u => ({
          ...u,
          id: Date.now() + Math.random(),
          passwordHash: u.passwordHash || '',
        }));
        saveUsers(withIds);
        window.location.reload();
      } catch (err) {
        alert('Failed to import users: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <>
      {/* Project Settings */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Project Settings</h2>
        <button
          onClick={onClearAll}
          className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Clear All Projects
        </button>
      </div>

      {/* User Management */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>

        {/* Export / Import Controls */}
        <div className="flex items-center space-x-3 mb-4">
          <button
            onClick={handleExportUsers}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Export Users
          </button>
          <input
            ref={fileUsers}
            type="file"
            accept=".json,.csv"
            className="hidden"
            onChange={handleImportUsers}
          />
          <button
            onClick={() => fileUsers.current.click()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Import Users
          </button>
        </div>

        {/* Users Table */}
        <table className="min-w-full bg-gray-50">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-t">
                <td className="px-4 py-2">{u.name}</td>
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this user?')) {
                        const updated = loadUsers().filter(x => x.id !== u.id);
                        saveUsers(updated);
                        window.location.reload();
                      }
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
