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
    setProjects((prev) => {
      const exists = prev.find((p) => p.id === proj.id);
      if (exists) return prev.map((p) => (p.id === proj.id ? proj : p));
      return [...prev, proj];
    });
    closeModal();
  }

  return (
    <>
      {/* Animated ninja-star background */}
      <NinjaStarsBackground />

      {/* Hero header */}
      <header className="bg-gradient-to-r from-primary to-accent p-6 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl text-white font-semibold">
          IT Infrastructure Projects
        </h1>
        <button
          onClick={() => openModal()}
          className="bg-white text-primary px-4 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          New Project
        </button>
      </header>

      {/* Main content */}
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
          onDelete={(id) => setProjects(projects.filter((p) => p.id !== id))}
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
