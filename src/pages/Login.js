import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { motion } from "framer-motion"
import logo from "../assets/bo23.png"
import { useTranslation } from '../utils/translations'

const Login = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Save user data to localStorage
      localStorage.setItem('userName', formData.email.split('@')[0])
      localStorage.setItem('isLoggedIn', 'true')
      setIsLoading(false)
      navigate('/')
    }, 1000)
  }

  return (
    <div className="page-container">
      <div className="page-header" style={{ textAlign: "center", paddingTop: "40px", paddingBottom: "60px" }}>
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}
        >
          <img
            src={logo}
            alt="Guidey Logo"
            style={{ width: "120px", height: "auto", marginBottom: "16px" }}
          />
          <h1 className="page-title">{t('welcomeBack')}</h1>
          <p className="page-subtitle">{t('signInToContinue')}</p>
        </motion.div>
      </div>

      <div className="page-content">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="auth-container"
        >
          <div className="auth-card">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} style={{ marginRight: '8px' }} />
                  {t('emailAddress')}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder={t('enterEmail')}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} style={{ marginRight: '8px' }} />
                  {t('password')}
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder={t('enterPassword')}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <Link to="/forgot-password" className="forgot-link">
                  {t('forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                ) : (
                  t('signIn')
                )}
              </button>

              <div className="auth-divider">
                <span>{t('dontHaveAccount')}</span>
                <Link to="/signup" className="auth-link">
                  {t('signUpHere')}
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login