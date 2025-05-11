// src/App.jsx
import React, { useState, useEffect } from 'react'
import NinjaStarsBackground from './components/NinjaStarsBackground'
import Dashboard from './components/Dashboard'
import ProjectsView from './components/ProjectsView'
import ReportsView from './components/ReportsView'
import ProjectModal from './components/ProjectModal'
import AddAgentModal from './components/AddAgentModal'
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
  const [modalAgent, setModalAgent]     = useState(false)

  // TABS: dashboard|projects|reports|settings
  const [activeTab, setActiveTab] = useState('dashboard')

  // load + persist
  useEffect(() => { setProjects(loadProjects()) }, [])
  useEffect(() => { saveProjects(projects) }, [projects])

  // users (for assign/settings)
  const [users, setUsers] = useState([])
  useEffect(() => { setUsers(loadUsers()) }, [])

  // PROJECT modal
  const openModal  = proj => setModalProject(proj || { id:Date.now(), title:'', agent:'', tasks:[], status:'upcoming', deadline:'' })
  const closeModal = ()   => setModalProject(null)
  function saveProject(p) {
    setProjects(ps => {
      const exists = ps.find(x=>x.id===p.id)
      return exists ? ps.map(x=>x.id===p.id?p:x) : [...ps,p]
    })
    closeModal()
  }

  // AGENT modal
  const openAgentModal  = () => setModalAgent(true)
  const closeAgentModal = () => setModalAgent(false)
  function saveAgent(a) {
    setUsers(us=>[...us,a])
    closeAgentModal()
  }

  // CLEAR ALL
  const clearAll = () => {
    if (window.confirm('Really clear all projects?')) {
      setProjects([]); saveProjects([])
    }
  }

  return (
    <>
      <NinjaStarsBackground/>

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
            {['dashboard','projects','reports','settings'].map(tab=>(
              <button
                key={tab}
                onClick={()=>setActiveTab(tab)}
                type="button"
                className={`${activeTab===tab?'text-primary border-b-2 border-primary':'text-gray-600 hover:text-primary'} pb-1 transition`}
              >
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={openAgentModal}
              className="px-4 py-1 bg-green-600 text-white rounded-full hover:bg-green-500 transition"
            >
              Add Agent
            </button>

            <button
              type="button"
              onClick={openModal}
              className="px-4 py-1 bg-primary text-white rounded-full hover:bg-primaryLight transition"
            >
              New Project
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative">
        {activeTab==='dashboard' && (
          <>
            {/* SEARCH + FILTER + CLEAR ALL */}
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6">
              <SearchBar value={search} onChange={setSearch}/>
              <FilterPanel filter={filter} onChange={setFilter}/>
              <button
                type="button"
                onClick={clearAll}
                className="ml-auto md:ml-0 md:mr-auto px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-400 transition"
              >
                Clear All
              </button>
            </div>

            <Dashboard
              projects={projects}
              filter={filter}
              search={search}
              onEdit={openModal}
              onDelete={id=>setProjects(ps=>ps.filter(p=>p.id!==id))}
            />
          </>
        )}

        {activeTab==='projects' && (
          <ProjectsView
            projects={projects}
            onEdit={openModal}
            onDelete={id=>setProjects(ps=>ps.filter(p=>p.id!==id))}
          />
        )}

        {activeTab==='reports' && <ReportsView projects={projects}/>}

        {activeTab==='settings' && (
          <Settings users={users} setUsers={setUsers} onClearAll={clearAll}/>
        )}

        {modalProject && (
          <ProjectModal project={modalProject} onSave={saveProject} onCancel={closeModal} users={users}/>
        )}

        {modalAgent && (
          <AddAgentModal onSave={saveAgent} onCancel={closeAgentModal}/>
        )}
      </main>
    </>
  )
}
