import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Brain, Map, MessageCircle, Briefcase } from 'lucide-react'
import { useTranslation } from '../utils/translations'

const BottomNavigation = () => {
  const { t } = useTranslation()
  
  const navItems = [
    { to: '/', icon: Home, label: t('home') },
    { to: '/quiz', icon: Brain, label: t('quiz') },
    { to: '/roadmap', icon: Map, label: t('roadmap') },
    { to: '/Chat', icon: MessageCircle, label: t('assistant') },
    { to: '/opportunities', icon: Briefcase, label: t('jobs') },
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <Icon size={24} />
          <span className="nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNavigation