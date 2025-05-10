// src/App.jsx
import React, { useState, useEffect } from 'react';
import NinjaStarsBackground from './components/NinjaStarsBackground';
import Dashboard             from './components/Dashboard';
import ProjectsView          from './components/ProjectsView';
import ReportsView           from './components/ReportsView';
import ProjectModal          from './components/ProjectModal';
import FilterPanel           from './components/FilterPanel';
import SearchBar             from './components/SearchBar';
import SignupModal           from './components/SignupModal';
import LoginModal from './LoginModal';    // <-- point at the src/ root';
import Settings              from './components/Settings';
import { loadProjects, saveProjects } from './utils/storage';
import { loadUsers }               from './utils/users';
import { loadCurrentUser, saveCurrentUser } from './utils/auth';

export default function App() {
  // Projects & Filters
  const [projects,   setProjects]   = useState([]);
  const [filter,     setFilter]     = useState('all');
  const [search,     setSearch]     = useState('');
  const [modalProject, setModalProject] = useState(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [authMode,    setAuthMode]    = useState<'login'|'signup'>('login');

  // “Router” tab
  const [activeTab,   setActiveTab]   = useState('dashboard');

  // Load projects from localStorage
  useEffect(() => { setProjects(loadProjects()); }, []);
  useEffect(() => { saveProjects(projects);  }, [projects]);

  // Load currentUser
  useEffect(() => {
    const user = loadCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  // Handlers for project modal
  const openModal = proj =>
    setModalProject(
      proj || { id: Date.now(), title:'', agent:'', tasks:[], status:'upcoming', deadline:'' }
    );
  const closeModal = () => setModalProject(null);

  function saveProject(proj) {
    setProjects(prev => {
      const exists = prev.find(p => p.id===proj.id);
      if (exists) return prev.map(p => p.id===proj.id ? proj : p);
      return [...prev, proj];
    });
    closeModal();
  }

  // Log out
  const doLogout = () => {
    saveCurrentUser(null);
    setCurrentUser(null);
    setAuthMode('login');
  };

  // If not signed in yet, show the auth screens:
  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        {authMode === 'login' ? (
          <LoginModal
            onClose={() => {}}
            onLogin={user => {
              saveCurrentUser(user);
              setCurrentUser(user);
            }}
          />
        ) : (
          <SignupModal
            onClose={()   => setAuthMode('login')}
            onUsersChange={() => {}}
          />
        )}
        <div className="absolute bottom-8 text-center w-full">
          {authMode === 'login' ? (
            <button
              onClick={() => setAuthMode('signup')}
              className="underline text-blue-600"
            >
              Don’t have an account? Sign Up
            </button>
          ) : (
            <button
              onClick={() => setAuthMode('login')}
              className="underline text-blue-600"
            >
              Already have an account? Log In
            </button>
          )}
        </div>
      </div>
    );
  }

  // Once signed in, render the real app:
  return (
    <>
      <NinjaStarsBackground />

      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary to-primaryLight rounded-full shadow-lg">
              <span className="text-white text-3xl font-extrabold">PM</span>
            </div>
            <span className="ml-4 text-2xl font-medium text-gray-800">
              Project Manager
            </span>
          </div>

          {/* Tabs */}
          <nav className="hidden md:flex space-x-8 text-lg">
            {['dashboard','projects','reports','settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab === tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                } pb-1 transition`}
              >
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Log Out & New Project */}
          <div className="flex items-center space-x-4">
            <button
              onClick={doLogout}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Log Out
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
              onDelete={id=> setProjects(projects.filter(p=>p.id!==id))}
            />
          </>
        )}
        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onEdit={openModal}
            onDelete={id=> setProjects(projects.filter(p=>p.id!==id))}
          />
        )}
        {activeTab === 'reports' && (
          <ReportsView projects={projects} />
        )}
        {activeTab === 'settings' && (
          <Settings onClearAll={()=>{
            if(window.confirm('Clear all?')){
              setProjects([]); saveProjects([]);
            }
          }} />
        )}

        {modalProject && (
          <ProjectModal
            project={modalProject}
            onSave={saveProject}
            onCancel={closeModal}
            users={loadUsers()}
          />
        )}
      </main>
    </>
  );
}
