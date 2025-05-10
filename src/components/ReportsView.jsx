// src/components/ReportsView.jsx
import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import { saveProjects } from '../utils/storage';
import { saveUsers } from '../utils/users';

export default function ReportsView({ projects, users }) {
  const [format, setFormat] = useState('json');
  const fileInput = useRef(null);

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

  // export logic
  const handleExport = () => {
    if (format === 'json') {
      download(
        `pm-data-${Date.now()}.json`,
        JSON.stringify({ projects, users }, null, 2),
        'application/json'
      );
    } else {
      const projCsv = Papa.unparse(projects);
      const userCsv = Papa.unparse(users);
      download(
        `pm-data-${Date.now()}.csv`,
        `--- PROJECTS ---\n${projCsv}\n\n--- USERS ---\n${userCsv}`,
        'text/csv'
      );
    }
  };

  // import logic
  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        if (file.name.endsWith('.json')) {
          const { projects: pj, users: us } = JSON.parse(target.result);
          saveProjects(pj);
          saveUsers(us);
        } else {
          const text = target.result;
          const [,projBlock,userBlock] = text
            .split(/--- PROJECTS ---|--- USERS ---/)
            .map(s => s.trim());
          const pj = Papa.parse(projBlock, { header: true }).data;
          const us = Papa.parse(userBlock,  { header: true }).data;
          saveProjects(pj);
          saveUsers(us);
        }
        window.location.reload();
      } catch (err) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // stats
  const total  = projects.length;
  const inProg = projects.filter(p => p.status === 'in-progress').length;
  const done   = projects.filter(p => p.status === 'completed').length;
  const upcom  = projects.filter(p => p.status === 'upcoming').length;

  return (
    <>
      {/* Export/Import Controls */}
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
          Export
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
          Import
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[ 
          { label:'Total Projects', value: total },
          { label:'In Progress',   value: inProg },
          { label:'Completed',     value: done },
          { label:'Upcoming',      value: upcom }
        ].map(s => (
          <div key={s.label} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-700">{s.label}</h3>
            <p className="mt-2 text-3xl font-bold text-primary">{s.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
