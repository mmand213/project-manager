// src/App.jsx
import React, { useState, useEffect } from 'react';
import NinjaStarsBackground from './components/NinjaStarsBackground';
import Dashboard from './components/Dashboard';
import ProjectModal from './components/ProjectModal';
import FilterPanel from './components/FilterPanel';
import SearchBar from './components/SearchBar';
import { loadProjects, saveProjects } from './utils/storage';

export default function App() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalProject, setModalProject] = useState(null);

  useEffect(() => {
    setProjects(loadProjects());
  }, []);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  const openModal = (proj) =>
    setModalProject(
      proj || { id: Date.now(), title: '', tasks: [], status: 'upcoming', deadline: '' }
    );
  const closeModal = () => setModalProject(null);

  function saveProject(proj) {
    setProjects(prev => {
      const exists = prev.find(p => p.id === proj.id);
      if (exists) return prev.map(p => p.id === proj.id ? proj : p);
      return [...prev, proj];
    });
    closeModal();
  }

  return (
    <>
      {/* Ninja-star animated background */}
      <NinjaStarsBackground />

      {/* Updated modern nav bar */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          
          {/* Left: Big PM + subtitle */}
          <div className="flex items-baseline">
            <span className="text-6xl font-extrabold text-primary leading-none">
              PM
            </span>
            <span className="ml-3 text-2xl font-medium text-gray-800">
              Project Manager
            </span>
          </div>

          {/* Center: Navigation links */}
          <nav className="hidden md:flex space-x-8 text-lg">
            <a href="#" className="text-gray-600 hover:text-primary transition">
              Dashboard
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              Projects
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              Reports
            </a>
            <a href="#" className="text-gray-600 hover:text-primary transition">
              Settings
            </a>
          </nav>

          {/* Right: New Project button */}
          <div className="flex items-center">
            <button
              onClick={() => openModal()}
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primaryLight transition"
            >
              New Project
            </button>
          </div>
        </div>
      </header>

      {/* Main content area */}
      <main className="p-6 min-h-screen relative">
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

        {modalProject && (
          <ProjectModal
            project={modalProject}
            onSave={saveProject}
            onCancel={closeModal}
          />
        )}
      </main>
    </>
  );
}
