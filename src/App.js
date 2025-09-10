import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Quiz from './pages/Quiz'
import Roadmap from './pages/Roadmap'
import CareerRoadmap from './components/CareerRoadmap'
import Chat from './pages/Chat'
import Opportunities from './pages/Opportunities'
import Login from './pages/Login'
import SignUp from './pages/SignUp'

import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
  
    const savedTheme = localStorage.getItem('isDarkMode') === 'true'
    setIsDarkMode(savedTheme)
    
    if (savedTheme) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [])

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('isDarkMode', newDarkMode.toString())
    
    if (newDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : ''}`}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="roadmap" element={<Roadmap />} />
          <Route path="career-roadmap" element={<CareerRoadmap />} />
          <Route path="chat" element={<Chat />} />
          <Route path="opportunities" element={<Opportunities />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  )
}

export default App