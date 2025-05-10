// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import Papa from 'papaparse';
import NinjaStarsBackground from './components/NinjaStarsBackground';
import Dashboard from './components/Dashboard';
import ProjectModal from './components/ProjectModal';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import SignupModal from './components/SignupModal';
import Settings from './components/Settings';
import { loadProjects, saveProjects } from './utils/storage';
import { loadUsers, saveUsers } from './utils/users';

export default function App() {
  const [projects, setProjects]       = useState([]);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const [modalProject, setModalProject] = useState(null);
  const [activeTab, setActiveTab]     = useState('dashboard');

  // signup/users state
  const [users, setUsers]             = useState([]);
  const [showSignup, setShowSignup]   = useState(false);

  // load projects & users
  useEffect(() => { setProjects(loadProjects()); }, []);
  useEffect(() => { saveProjects(projects); }, [projects]);
  useEffect(() => { setUsers(loadUsers()); }, []);

  // project modal handlers
  const openModal = proj => setModalProject(
    proj || { id: Date.now(), title:'', agent:'', tasks:[], status:'upcoming', deadline:'' }
  );
  const closeModal = () => setModalProject(null);
  function saveProject(proj) {
    setProjects(prev => {
      const exists = prev.find(p => p.id === proj.id);
      if (exists) return prev.map(p => p.id===proj.id ? proj : p);
      return [...prev, proj];
    });
    closeModal();
  }

  // Clear all
  const clearAll = () => {
    if (window.confirm('Really clear all projects?')) {
      setProjects([]); saveProjects([]);
    }
  };

  return (
    <>
      <NinjaStarsBackground />

      {/* NAV */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary to-primaryLight rounded-full shadow-lg">
              <span className="text-white text-3xl font-extrabold">PM</span>
            </div>
            <span className="ml-4 text-2xl font-medium text-gray-800">Project Manager</span>
          </div>
          <nav className="hidden md:flex space-x-8 text-lg">
            {['dashboard','projects','reports','settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab===tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                  } pb-1 transition`}
              >
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowSignup(true)}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Sign Up
            </button>
            <button
              onClick={() => { openModal(); setActiveTab('dashboard'); }}
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primaryLight transition"
            >
              New Project
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        {activeTab === 'dashboard' && (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
              <SearchBar value={search} onChange={setSearch} />
              <FilterPanel filter={filter} onChange={setFilter} />
            </div>
            <Dashboard
              projects={projects}
              filter={filter}
              search={search}
              onEdit={openModal}
              onDelete={id => setProjects(projects.filter(p => p.id !== id))}
            />
          </>
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onEdit={openModal}
            onDelete={id => setProjects(projects.filter(p => p.id !== id))}
          />
        )}

        {activeTab === 'reports' && <ReportsView projects={projects} users={users} />}

        {activeTab === 'settings' && <Settings onClearAll={clearAll} />}

        {modalProject && (
          <ProjectModal
            project={modalProject}
            onSave={saveProject}
            onCancel={closeModal}
            users={users}
          />
        )}
      </main>

      {/* Signup Modal */}
      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onUsersChange={setUsers}
        />
      )}
    </>
  );
}

// Projects table view
function ProjectsView({ projects, onEdit, onDelete }) {
  return (
    <table className="min-w-full bg-white shadow-lg rounded overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Title</th>
          <th className="px-4 py-2 text-left">Agent</th>
          <th className="px-4 py-2 text-left">Status</th>
          <th className="px-4 py-2 text-left">Deadline</th>
          <th className="px-4 py-2 text-left">Tasks</th>
          <th className="px-4 py-2">&nbsp;</th>
        </tr>
      </thead>
      <tbody>
        {projects.map(p => (
          <tr key={p.id} className="border-t">
            <td className="px-4 py-2">{p.title}</td>
            <td className="px-4 py-2">{p.agent || '—'}</td>
            <td className="px-4 py-2">{p.status}</td>
            <td className="px-4 py-2">{p.deadline || '—'}</td>
            <td className="px-4 py-2">
              {`${p.tasks.filter(t=>t.completed).length}/${p.tasks.length}`}
            </td>
            <td className="px-4 py-2 space-x-2">
              <button onClick={()=> onEdit(p)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={()=> onDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Reports summary view with Export/Import
function ReportsView({ projects, users }) {
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

  // handle export
  const handleExport = () => {
    if (format === 'json') {
      const data = { projects, users };
      download(`pm-data-${Date.now()}.json`, JSON.stringify(data, null, 2), 'application/json');
    } else {
      const projCsv = Papa.unparse(projects);
      const userCsv = Papa.unparse(users);
      const combined = `--- PROJECTS ---\n${projCsv}\n\n--- USERS ---\n${userCsv}`;
      download(`pm-data-${Date.now()}.csv`, combined, 'text/csv');
    }
  };

  // handle import
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
          const [, projBlock, userBlock] = text.split(/--- PROJECTS ---|--- USERS ---/).map(s => s.trim());
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
  const inProg = projects.filter(p=>p.status==='in-progress').length;
  const done   = projects.filter(p=>p.status==='completed').length;
  const upcom  = projects.filter(p=>p.status==='upcoming').length;
  const stats  = [
    { label:'Total Projects', value: total },
    { label:'In Progress',   value: inProg },
    { label:'Completed',     value: done },
    { label:'Upcoming',      value: upcom },
  ];

  return (
    <>
      {/* Export/Import Controls */}
      <div className="flex items-center space-x-3 mb-6">
        <select
          value={format}
          onChange={e=>setFormat(e.target.value)}
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
          onClick={()=>fileInput.current.click()}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Import
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
