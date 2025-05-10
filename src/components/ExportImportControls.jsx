// src/components/ExportImportControls.jsx
import React, { useRef, useState } from 'react';
import { saveProjects, loadProjects } from '../utils/storage';
import { saveUsers, loadUsers } from '../utils/users';
import Papa from 'papaparse';

export default function ExportImportControls() {
  const fileInput = useRef();
  const [format, setFormat] = useState('json');

  // trigger browser download
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

  const handleExport = () => {
    const projects = loadProjects();
    const users    = loadUsers();
    if (format === 'json') {
      const blob = JSON.stringify({ projects, users }, null, 2);
      download(`pm-data-${Date.now()}.json`, blob, 'application/json');
    } else if (format === 'csv') {
      // flatten projects + users into two CSVs in one file
      const projCsv = Papa.unparse(projects);
      const userCsv = Papa.unparse(users);
      download(
        `pm-data-${Date.now()}.csv`,
        `--- PROJECTS ---\n${projCsv}\n\n--- USERS ---\n${userCsv}`,
        'text/csv'
      );
    }
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ({ target }) => {
      try {
        if (file.name.endsWith('.json')) {
          const { projects, users } = JSON.parse(target.result);
          saveProjects(projects);
          saveUsers(users);
          alert('JSON data imported!');
        } else if (file.name.endsWith('.csv')) {
          const text = target.result;
          // simple split on our markers
          const [_, projBlock, userBlock] = text.split(/--- PROJECTS ---|--- USERS ---/).map(s => s.trim());
          const projects = Papa.parse(projBlock, { header: true }).data;
          const users    = Papa.parse(userBlock,  { header: true }).data;
          saveProjects(projects);
          saveUsers(users);
          alert('CSV data imported!');
        } else {
          throw new Error('Unsupported format');
        }
        window.location.reload();
      } catch (err) {
        alert('Import failed: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center space-x-4 my-4">
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
  );
}
