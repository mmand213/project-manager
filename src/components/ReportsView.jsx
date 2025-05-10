// src/components/ReportsView.jsx
import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { saveProjects } from '../utils/storage';

export default function ReportsView({ projects }) {
  const [format, setFormat] = useState('json');
  const fileInput = useRef(null);

  // small helper to download a blob
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

  // Export only the project fields (omit `id`)
  const handleExport = () => {
    const stripped = projects.map(({ id, ...rest }) => rest);
    if (format === 'json') {
      download(
        `projects-${Date.now()}.json`,
        JSON.stringify(stripped, null, 2),
        'application/json'
      );
    } else {
      const csv = Papa.unparse(stripped);
      download(
        `projects-${Date.now()}.csv`,
        csv,
        'text/csv'
      );
    }
  };

  // Import just projects; save to localStorage
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        let imported;
        if (file.name.endsWith('.json')) {
          imported = JSON.parse(target.result);
        } else {
          imported = Papa.parse(target.result, { header: true }).data;
        }
        // give them fresh numeric IDs
        const withIds = imported.map((p) => ({ ...p, id: Date.now() + Math.random() }));
        saveProjects(withIds);
        window.location.reload();
      } catch (err) {
        alert('Failed to import projects: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Stats for the dashboard
  const total  = projects.length;
  const inProg = projects.filter(p => p.status === 'in-progress').length;
  const done   = projects.filter(p => p.status === 'completed').length;
  const upcom  = projects.filter(p => p.status === 'upcoming').length;
  const stats  = [
    { label: 'Total Projects', value: total },
    { label: 'In Progress',   value: inProg },
    { label: 'Completed',     value: done },
    { label: 'Upcoming',      value: upcom },
  ];

  return (
    <>
      {/* Export / Import Controls */}
      <div className="flex items-center space-x-3 mb-6">
        <select
          value={format}
          onChange={e => setFormat(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="json">Export JSON</option>
          <option value="csv">Export CSV</option>
        </select>
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Export Projects
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".json,.csv"
          className="hidden"
          onChange={handleImport}
        />
        <button
          onClick={() => fileInput.current.click()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Import Projects
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">{s.label}</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{s.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
