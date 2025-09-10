import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { motion } from "framer-motion"
import logo from "../assets/bo23.png"

const SignUp = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Save user data to localStorage
      localStorage.setItem('userName', formData.username)
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
          <h1 className="page-title">Join Guidey!</h1>
          <p className="page-subtitle">Start your AI-powered career journey today</p>
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
                  <User size={18} style={{ marginRight: '8px' }} />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`form-input ${errors.username ? 'form-input-error' : ''}`}
                  placeholder="Enter your username"
                  required
                />
                {errors.username && <span className="form-error">{errors.username}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Mail size={18} style={{ marginRight: '8px' }} />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                  placeholder="Enter your email"
                  required
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} style={{ marginRight: '8px' }} />
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? 'form-input-error' : ''}`}
                    placeholder="Create a password"
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
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Lock size={18} style={{ marginRight: '8px' }} />
                  Confirm Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`form-input ${errors.confirmPassword ? 'form-input-error' : ''}`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              <button
                type="submit"
                className="btn-primary auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="loading-spinner" style={{ width: '20px', height: '20px' }}></div>
                ) : (
                  'Create Account'
                )}
              </button>

              <div className="auth-divider">
                <span>Already have an account?</span>
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SignUp