// src/App.jsx
import React, { useState, useEffect } from 'react'
import NinjaStarsBackground from './components/NinjaStarsBackground'
import Dashboard from './components/Dashboard'
import ProjectsView from './components/ProjectsView'
import ReportsView from './components/ReportsView'
import ProjectModal from './components/ProjectModal'
import AgentModal from './components/AddAgentModal'
import FilterPanel from './components/FilterPanel'
import SearchBar from './components/SearchBar'
import Settings from './components/Settings'
import { loadProjects, saveProjects } from './utils/storage'
import { loadUsers, saveUsers } from './utils/users'

export default function App() {
  // PROJECT STATE
  const [projects, setProjects] = useState([])
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')
  const [modalProject, setModalProject] = useState(null)

  // AGENT STATE
  const [agentModalOpen, setAgentModalOpen] = useState(false)

  // TABS: dashboard|projects|reports|settings
  const [activeTab, setActiveTab] = useState('dashboard')

  // USERS (AGENTS)
  const [users, setUsers] = useState([])

  // load + persist projects
  useEffect(() => { setProjects(loadProjects()) }, [])
  useEffect(() => { saveProjects(projects) }, [projects])

  // load users
  useEffect(() => { setUsers(loadUsers()) }, [])

  // PROJECT MODAL handlers
  const openProjectModal = (proj) =>
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
  const closeProjectModal = () => setModalProject(null)
  function saveProject(proj) {
    setProjects(ps => {
      const exists = ps.find(p => p.id === proj.id)
      return exists
        ? ps.map(p => p.id === proj.id ? proj : p)
        : [...ps, proj]
    })
    closeProjectModal()
  }

  // AGENT MODAL handlers
  const openAgentModal = () => setAgentModalOpen(true)
  const closeAgentModal = () => setAgentModalOpen(false)
  function saveAgent(agent) {
    const updated = saveUsers(agent)
    setUsers(updated)
    closeAgentModal()
  }

  // CLEAR ALL (projects)
  const clearAll = () => {
    if (window.confirm('Really clear all projects?')) {
      setProjects([])
      saveProjects([])
    }
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
              onDelete={id => setProjects(ps => ps.filter(p => p.id !== id))}
            />
          </>
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onEdit={openProjectModal}
            onDelete={id => setProjects(ps => ps.filter(p => p.id !== id))}
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
  )
}
