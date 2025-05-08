import React, { useState, useEffect } from 'react';
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

  useEffect(() => { setProjects(loadProjects()); }, []);
  useEffect(() => { saveProjects(projects); }, [projects]);

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
    <div className="min-h-screen p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">IT Infrastructure Projects</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          New Project
        </button>
      </header>
      <div className="flex space-x-4 mb-4">
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
    </div>
  );
}
