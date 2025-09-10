import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HeaderMenu from '../components/HeaderMenu'
import { Brain, Map, Target, TrendingUp, Users, Star, LogIn } from 'lucide-react'
import { motion } from "framer-motion";
import logo from "../assets/bo23.png";
import { useTranslation, getLanguageDirection } from '../utils/translations'

const Home = () => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userName, setUserName] = useState('there')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentLang, setCurrentLang] = useState('en')
  const { t } = useTranslation()

  useEffect(() => {
    const storedName = localStorage.getItem('userName')
    const loggedIn = localStorage.getItem('isLoggedIn')
    const darkMode = localStorage.getItem('isDarkMode') === 'true'
    const language = localStorage.getItem('language') || 'en'
    
    setUserName(storedName || 'there')
    setIsLoggedIn(!!loggedIn)
    setIsDarkMode(darkMode)
    setCurrentLang(language)
    
    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
    
    // Apply language direction to body
    document.body.dir = getLanguageDirection(language)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn')
    localStorage.removeItem('userName')
    setIsLoggedIn(false)
    setUserName('there')
  }

  const handleToggleTheme = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('isDarkMode', newDarkMode.toString())
    
    // Apply/remove dark mode class to body
    if (newDarkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }

  const handleToggleLang = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en'
    setCurrentLang(newLang)
    localStorage.setItem('language', newLang)
    
    // Apply language direction to body
    document.body.dir = getLanguageDirection(newLang)
    
    // Reload page to apply translations
    window.location.reload()
  }
  const features = [
    {
      icon: Brain,
      title: t('aiCareerQuiz'),
      description: t('discoverIdealCareer'),
      color: '#8B5CF6',
      action: () => navigate('/quiz'),
    },
    {
      icon: Map,
      title: t('learningRoadmap'),
      description: t('followStructuredPath'),
      color: '#3B82F6',
      action: () => navigate('/career-roadmap'),
    },
    {
      icon: Target,
      title: t('projectRecommendations'),
      description: t('buildRealWorldProjects'),
      color: '#10B981',
      action: () => navigate('/career-roadmap'),
    },
    {
      icon: TrendingUp,
      title: t('careerOpportunities'),
      description: t('findInternshipsJobs'),
      color: '#F59E0B',
      action: () => navigate('/opportunities'),
    },
  ]

  const stats = [
    { icon: Users, value: '60', label: t('studentsGuided') },
    { icon: Target, value: '200+', label: t('careerPaths') },
    { icon: Star, value: '4.9', label: t('appRating') },
  ]

  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: "center", paddingTop: "20px", position: "relative" }}>
        {/* Menu icon and menu */}
        <HeaderMenu
          isLoggedIn={isLoggedIn}
          userName={userName}
          onToggleTheme={handleToggleTheme}
          onToggleLang={handleToggleLang}
          isDarkMode={isDarkMode}
          currentLang={currentLang}
          onLogout={handleLogout}
        />

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
          <motion.img
            src={logo}
            alt="Guidey Logo"
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 15,
              duration: 1
            }}
            style={{ width: "200px", height: "auto", marginBottom: "0px", maxWidth: "95vw" }}
          />

          <h1 className="page-title">{t('hello')} {userName}! 👋</h1>
          <p className="page-subtitle">{t('readyToDiscover')}</p>
          <p style={{ fontSize: '14px', marginTop: '8px', opacity: 0.8 }}>
            {t('aiGuideJourney')}
          </p>
        </div>
      </div>

      <div className="page-content">
        {/* Get Started Section */}
        <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '8px' }}>{t('getStarted')}</h2>
          <p style={{ color: '#64748B', marginBottom: '20px' }}>
            {t('chooseBegin')}
          </p>

          <button
            className="btn-primary"
            style={{
              width: '100%',
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
            onClick={() => navigate('/quiz')}
          >
            <Brain size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600' }}>{t('takeCareerQuiz')}</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>{t('notSurePath')}</div>
            </div>
          </button>

          <button
            className="btn-secondary"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px'
            }}
            onClick={() => navigate('/career-roadmap')}
          >
            <Map size={24} />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: '600' }}>{t('iKnowCareer')}</div>
              <div style={{ fontSize: '14px', opacity: 0.8 }}>{t('showRoadmap')}</div>
            </div>
          </button>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {stats.map((stat, index) => (
            <div key={index} className="card" style={{
              flex: 1,
              padding: '16px',
              textAlign: 'center'
            }}>
              <stat.icon size={24} color="#8B5CF6" style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '16px' }}>
          {t('exploreFeatures')}
        </h2>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              onClick={feature.action}
            >
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '28px',
                backgroundColor: `${feature.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <feature.icon size={28} color={feature.color} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.4' }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home
import { FiLogIn, FiUserPlus, FiUser, FiSun, FiMoon, FiGlobe } from 'react-icons/fi'