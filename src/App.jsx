// src/App.jsx
import React, { useState, useEffect } from 'react'
import NinjaStarsBackground from './components/NinjaStarsBackground'
import Dashboard from './components/Dashboard'
import ProjectModal from './components/ProjectModal'
import FilterPanel from './components/FilterPanel'
import SearchBar from './components/SearchBar'
import { loadProjects, saveProjects } from './utils/storage'

export default function App() {
  // State
  const [projects, setProjects] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [modalProject, setModalProject] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  // Load & save
  useEffect(() => { setProjects(loadProjects()) }, [])
  useEffect(() => { saveProjects(projects) }, [projects])

  // Project modal helpers
  const openModal = proj => setModalProject(
    proj || { id: Date.now(), title: '', tasks: [], status: 'upcoming', deadline: '' }
  )
  const closeModal = () => setModalProject(null)
  function saveProject(proj) {
    setProjects(prev => {
      const exists = prev.find(p => p.id === proj.id)
      if (exists) return prev.map(p => p.id === proj.id ? proj : p)
      return [...prev, proj]
    })
    closeModal()
  }

  // Settings helper
  const clearAll = () => {
    if (window.confirm('Really clear all projects?')) {
      setProjects([])
      saveProjects([])
    }
  }

  return (
    <>
      {/* animated background */}
      <NinjaStarsBackground />

      {/* Nav Bar */}
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

          {/* Links */}
          <nav className="hidden md:flex space-x-8 text-lg">
            {['dashboard','projects','reports','settings'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`${
                  activeTab===tab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 hover:text-primary'
                  } transition pb-1`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* New Project */}
          <div className="flex items-center">
            <button
              onClick={() => { openModal(); setActiveTab('dashboard') }}
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primaryLight transition"
            >
              New Project
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
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

        {activeTab === 'reports' && (
          <ReportsView projects={projects} />
        )}

        {activeTab === 'settings' && (
          <SettingsView onClearAll={clearAll} />
        )}

        {/* Modal */}
        {modalProject && (
          <ProjectModal
            project={modalProject}
            onSave={saveProject}
            onCancel={closeModal}
          />
        )}
      </main>
    </>
  )
}

// ----- ProjectsView -----
function ProjectsView({ projects, onEdit, onDelete }) {
  return (
    <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-4 py-2 text-left">Title</th>
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
            <td className="px-4 py-2">{p.status}</td>
            <td className="px-4 py-2">{p.deadline || '—'}</td>
            <td className="px-4 py-2">{`${p.tasks.length}/${p.tasks.filter(t=>t.completed).length}`}</td>
            <td className="px-4 py-2 space-x-2">
              <button onClick={() => onEdit(p)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => onDelete(p.id)} className="text-red-600 hover:underline">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

// ----- ReportsView -----
function ReportsView({ projects }) {
  const total = projects.length
  const inProgress = projects.filter(p => p.status==='in-progress').length
  const completed = projects.filter(p => p.status==='completed').length
  const upcoming = projects.filter(p => p.status==='upcoming').length

  const stats = [
    { label: 'Total Projects', value: total },
    { label: 'In Progress', value: inProgress },
    { label: 'Completed', value: completed },
    { label: 'Upcoming', value: upcoming },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-700">{s.label}</h3>
          <p className="mt-2 text-3xl font-bold text-primary">{s.value}</p>
        </div>
      ))}
    </div>
  )
}

// ----- SettingsView -----
function SettingsView({ onClearAll }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow text-center">
      <h2 className="text-2xl font-semibold mb-4">Settings</h2>
      <button
        onClick={onClearAll}
        className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
      >
        Clear All Projects
      </button>
    </div>
  )
}
