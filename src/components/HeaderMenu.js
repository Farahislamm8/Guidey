import React, { useState } from 'react'
import { FiMenu, FiLogIn, FiUserPlus, FiUser, FiMoon, FiSun, FiGlobe, FiLogOut } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from '../utils/translations'
import useTheme from '../hooks/useTheme'

const HeaderMenu = ({ isLoggedIn, userName, onToggleLang, currentLang, onLogout }) => {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  return (
    <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 100 }}>
      <FiMenu size={32} color="white" style={{ cursor: 'pointer' }} onClick={() => setOpen(!open)} />
      {open && (
        <div style={{
          position: 'absolute',
          top: 40,
          right: 0,
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          minWidth: 200,
          padding: 12,
          color: '#222'
        }}>
          {!isLoggedIn && (
            <>
              <div
                style={{ display: 'flex', alignItems: 'center', padding: 8, cursor: 'pointer', color: '#222' }}
                onClick={() => { navigate('/login'); setOpen(false); }}
              >
                <FiLogIn style={{ marginRight: 8, color: '#222' }} /> {t('login')}
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', padding: 8, cursor: 'pointer', color: '#222' }}
                onClick={() => { navigate('/signup'); setOpen(false); }}
              >
                <FiUserPlus style={{ marginRight: 8, color: '#222' }} /> {t('signup')}
              </div>
            </>
          )}
          {isLoggedIn && (
            <>
              <div
                style={{ display: 'flex', alignItems: 'center', padding: 8, cursor: 'pointer', color: '#222' }}
                onClick={() => { navigate(''); setOpen(false); }}
              >
                <FiUser style={{ marginRight: 8, color: '#222' }} /> {userName}
              </div>
              <div
                style={{ display: 'flex', alignItems: 'center', padding: 8, cursor: 'pointer', color: '#222' }}
                onClick={() => { if(onLogout) onLogout(); setOpen(false); }}
              >
                <FiLogOut style={{ marginRight: 8, color: '#222' }} /> {t('logout')}
              </div>
            </>
          )}
          <div
            style={{ display: 'flex', alignItems: 'center', padding: 8, cursor: 'pointer', color: '#222' }}
            onClick={() => { 
              toggleTheme()
              setOpen(false)
            }}
          >
            {theme === 'dark' ? (
              <>
                <FiSun style={{ marginRight: 8, color: '#222' }} /> {t('lightMode')}
              </>
            ) : (
              <>
                <FiMoon style={{ marginRight: 8, color: '#222' }} /> {t('darkMode')}
              </>
            )}
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', padding: 8, cursor: 'pointer', color: '#222' }}
            onClick={() => { onToggleLang(); setOpen(false); }}
          >
            <FiGlobe style={{ marginRight: 8, color: '#222' }} /> {t('switchLanguage')}
          </div>
        </div>
      )}
    </div>
  )
}

export default HeaderMenu

// Usage example
// <HeaderMenu
//   isLoggedIn={isLoggedIn}
//   userName={userName}
//   onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')}
//   onToggleLang={handleToggleLang}
//   theme={theme}
// />