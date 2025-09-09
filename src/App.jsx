// src/App.jsx
import React, { useState, useEffect } from 'react';

import NinjaStarsBackground from './components/NinjaStarsBackground';
import Dashboard from './components/Dashboard';
import ProjectsView from './components/ProjectsView';
import ReportsView from './components/ReportsView';
import ProjectModal from './components/ProjectModal';
import AgentModal from './components/AddAgentModal';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import Settings from './components/Settings';
import AuthBox from './components/AuthBox';

import { loadUsers, saveUsers } from './utils/users';

// ✅ Supabase client & remote CRUD helpers (you put these under src/components/)
import { supabase } from './components/supabaseClient';
import {
  fetchProjects,
  upsertProject,
  deleteProject as removeProject,
  clearAllProjects,
  subscribeProjects,
  signOut,
} from './components/remoteProjects';

export default function App() {
  /** AUTH **/
  const [authUser, setAuthUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  /** PROJECT STATE (remote via Supabase) **/
  const [projects, setProjects] = useState([]);
  const [filter,   setFilter]   = useState('all');
  const [search,   setSearch]   = useState('');
  const [modalProject, setModalProject] = useState(null);

  /** AGENT STATE (your local “users” list stays as-is for now) **/
  const [agentModalOpen, setAgentModalOpen] = useState(false);

  /** TABS: dashboard | projects | reports | settings **/
  const [activeTab, setActiveTab] = useState('dashboard');

  /** Local agents list (unchanged) **/
  const [users, setUsers] = useState([]);
  useEffect(() => { setUsers(loadUsers()) }, []);

  /* ---------- AUTH WIRING ---------- */
  useEffect(() => {
    // initial load
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user ?? null);
      setAuthReady(true);
    });
    // react to sign-in/out
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setAuthUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  /* ---------- LOAD PROJECTS AFTER LOGIN ---------- */
  useEffect(() => {
    if (!authReady || !authUser) return;

    let mounted = true;
    (async () => {
      try {
        const data = await fetchProjects();
        if (mounted) setProjects(data);
      } catch (e) {
        console.error(e);
      }
    })();

    // Optional realtime refresh on any change to projects
    const unsubscribe = subscribeProjects(async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (e) {
        console.error(e);
      }
    });

    return () => {
      mounted = false;
      unsubscribe && unsubscribe();
    };
  }, [authReady, authUser]);

  /* ---------- PROJECT MODAL HANDLERS ---------- */
  const openProjectModal = (proj) =>
    setModalProject(
      proj || {
        // id is created by DB; keep undefined for new
        id: undefined,
        title: '',
        agent: '',
        tasks: [],
        status: 'upcoming',
        deadline: ''
      }
    );
  const closeProjectModal = () => setModalProject(null);

  async function saveProject(proj) {
    try {
      await upsertProject(proj);
      const data = await fetchProjects();
      setProjects(data);
      closeProjectModal();
    } catch (e) {
      alert(e.message);
    }
  }

  /* ---------- AGENT (LOCAL) MODAL ---------- */
  const openAgentModal = () => setAgentModalOpen(true);
  const closeAgentModal = () => setAgentModalOpen(false);
  function saveAgent(agent) {
    const updated = saveUsers(agent);
    setUsers(updated);
    closeAgentModal();
  }

  /* ---------- CLEAR ALL (REMOTE) ---------- */
  const clearAll = async () => {
    if (window.confirm('Really clear all projects?')) {
      try {
        await clearAllProjects();
        setProjects([]);
      } catch (e) {
        alert(e.message);
      }
    }
  };

  /* ---------- RENDER ---------- */

  // Wait until we know auth state
  if (!authReady) {
    return <div className="p-6 text-gray-600">Loading…</div>;
  }

  // Not signed in? Show Auth
  if (!authUser) {
    return <AuthBox />;
  }

  return (
    <>
      <NinjaStarsBackground />

      {/* NAV */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary to-primaryLight rounded-full shadow-lg">
              <span className="text-white text-3xl font-extrabold">PM</span>
            </div>
            <span className="ml-4 text-2xl font-medium text-gray-800">Project Manager</span>
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
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => openProjectModal()}
              className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primaryLight transition"
            >
              New Project
            </button>

            <button
              onClick={openAgentModal}
              className="px-4 py-2 border-2 border-primary text-primary rounded-full hover:bg-primaryLight hover:text-white transition"
            >
              Add Agent
            </button>

            <button
              onClick={() => signOut()}
              className="px-3 py-2 border rounded text-gray-600 hover:bg-gray-50"
              title={authUser?.email || 'Sign out'}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        {activeTab === 'dashboard' && (
          <>
            {/* Search + Filters + ClearAll pill */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
              <SearchBar value={search} onChange={setSearch} />
              <FilterPanel filter={filter} onChange={setFilter} />
              <button
                onClick={clearAll}
                className="mt-3 md:mt-0 px-3 py-1 border rounded-full text-red-600 border-red-600 hover:bg-red-600 hover:text-white transition"
              >
                Clear All
              </button>
            </div>

            <Dashboard
              projects={projects}
              filter={filter}
              search={search}
              onEdit={openProjectModal}
              onDelete={async id => {
                await removeProject(id);
                setProjects(await fetchProjects());
              }}
            />
          </>
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onEdit={openProjectModal}
            onDelete={async id => {
              await removeProject(id);
              setProjects(await fetchProjects());
            }}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView projects={projects} />
        )}

        {activeTab === 'settings' && (
          <Settings
            onClearAll={clearAll}
            users={users}
            setUsers={setUsers}
          />
        )}

        {/* MODALS */}
        {modalProject && (
          <ProjectModal
            project={modalProject}
            onSave={saveProject}
            onCancel={closeProjectModal}
            users={users}
          />
        )}
        {agentModalOpen && (
          <AgentModal
            onSave={saveAgent}
            onCancel={closeAgentModal}
          />
        )}
      </main>
    </>
  );
}
