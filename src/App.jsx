// src/App.jsx
import React, { useState, useEffect } from 'react'
import NinjaStarsBackground from './components/NinjaStarsBackground'
import Dashboard from './components/Dashboard'
import ProjectsView from './components/ProjectsView'
import ReportsView from './components/ReportsView'
import ProjectModal from './components/ProjectModal'
import FilterPanel from './components/FilterPanel'
import SearchBar from './components/SearchBar'
import Settings from './components/Settings'
import { loadProjects, saveProjects } from './utils/storage'
import { loadUsers } from './utils/users'

export default function App() {
  // PROJECT STATE
  const [projects, setProjects] = useState([])
  const [filter, setFilter]     = useState('all')
  const [search, setSearch]     = useState('')
  const [modalProject, setModalProject] = useState(null)

  // CONFIRM CLEAR STATE
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // TABS: dashboard|projects|reports|settings
  const [activeTab, setActiveTab] = useState('dashboard')

  // load + persist projects
  useEffect(() => { setProjects(loadProjects()) }, [])
  useEffect(() => { saveProjects(projects) }, [projects])

  // load users (for assigning projects, settings)
  const [users, setUsers] = useState([])
  useEffect(() => { setUsers(loadUsers()) }, [])

  // PROJECT MODAL
  const openModal = proj =>
    setModalProject(
      proj || {
        id: Date.now(),
        title: '',
        agent: '',
        tasks: [],
        status: 'upcoming',
        deadline: ''
      }
    )
  const closeModal = () => setModalProject(null)
  function saveProject(proj) {
    setProjects(ps => {
      const exists = ps.find(p => p.id === proj.id)
      return exists
        ? ps.map(p => p.id === proj.id ? proj : p)
        : [...ps, proj]
    })
    closeModal()
  }

  // trigger in-app confirmation
  const askClearAll = () => setShowClearConfirm(true)

  // actually clear
  const confirmClear = () => {
    setProjects([])
    saveProjects([])
    setShowClearConfirm(false)
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => openModal()}
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
            {/* Search + Filters + “Clear All” pill */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 w-full md:w-auto">
                <SearchBar value={search} onChange={setSearch} />
                <FilterPanel filter={filter} onChange={setFilter} />
              </div>
              <button
                onClick={askClearAll}
                className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
              >
                Clear All Projects
              </button>
            </div>
            <Dashboard
              projects={projects}
              filter={filter}
              search={search}
              onEdit={openModal}
              onDelete={id => setProjects(ps => ps.filter(p => p.id !== id))}
            />
          </>
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onEdit={openModal}
            onDelete={id => setProjects(ps => ps.filter(p => p.id !== id))}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView projects={projects} />
        )}

        {activeTab === 'settings' && (
          <Settings
            onClearAll={() => askClearAll()}
            users={users}
            setUsers={setUsers}
          />
        )}

        {modalProject && (
          <ProjectModal
            project={modalProject}
            onSave={saveProject}
            onCancel={closeModal}
            users={users}
          />
        )}
      </main>

      {/* IN-APP CLEAR CONFIRMATION */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-sm mx-4">
            <h3 className="text-xl font-semibold mb-4">Clear All Projects?</h3>
            <p className="mb-6 text-gray-700">
              This action will permanently delete <strong>all</strong> projects. Are you sure you want to continue?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmClear}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Yes, Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
