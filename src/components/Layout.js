import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'

const Layout = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('isDarkMode') === 'true'
    setIsDarkMode(savedTheme)
    
    if (savedTheme) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }

    // Listen for theme changes
    const handleStorageChange = (e) => {
      if (e.key === 'isDarkMode') {
        const newDarkMode = e.newValue === 'true'
        setIsDarkMode(newDarkMode)
        
        if (newDarkMode) {
          document.body.classList.add('dark-mode')
        } else {
          document.body.classList.remove('dark-mode')
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  return (
    <div className={`layout ${isDarkMode ? 'dark-mode' : ''}`}>
      <main className="main-content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default Layout