import React, { useState, useEffect } from 'react'
import { CheckCircle, Circle, Clock, Book, Code, Trophy, Play, ChevronRight } from 'lucide-react'
import { geminiService } from '../services/geminiService'
import { useTranslation } from '../utils/translations'

const roadmaps = {
  software_engineer: [
    {
      id: 'se_1',
      title: 'Programming Fundamentals',
      description: 'Learn the basics of programming with a beginner-friendly language',
      level: 'beginner',
      duration: '4-6 weeks',
      resources: [
        { type: 'course', title: 'Python for Everybody', platform: 'Coursera', free: true },
        { type: 'course', title: 'CS50 Introduction to Computer Science', platform: 'Harvard/edX', free: true },
        { type: 'book', title: 'Automate the Boring Stuff with Python', platform: 'Online', free: true },
      ],
      skills: ['Variables & Data Types', 'Control Structures', 'Functions', 'Basic Algorithms'],
      projects: ['Calculator App', 'Number Guessing Game', 'Simple Text Parser']
    },
    {
      id: 'se_2',
      title: 'Web Development Basics',
      description: 'Build your first websites with HTML, CSS, and JavaScript',
      level: 'beginner',
      duration: '6-8 weeks',
      resources: [
        { type: 'course', title: 'The Complete Web Developer Bootcamp', platform: 'Udemy', free: false },
        { type: 'course', title: 'freeCodeCamp Web Development', platform: 'freeCodeCamp', free: true },
        { type: 'practice', title: 'HTML/CSS Challenges', platform: 'Frontend Mentor', free: true },
      ],
      skills: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Responsive Design'],
      projects: ['Personal Portfolio', 'Landing Page', 'Interactive Todo List']
    },
    {
      id: 'se_3',
      title: 'Frontend Frameworks',
      description: 'Master modern frontend development with React or Vue',
      level: 'intermediate',
      duration: '8-10 weeks',
      resources: [
        { type: 'course', title: 'React Complete Guide', platform: 'Udemy', free: false },
        { type: 'course', title: 'React Official Tutorial', platform: 'React.dev', free: true },
        { type: 'project', title: 'Build Real Apps', platform: 'GitHub', free: true },
      ],
      skills: ['React/Vue.js', 'State Management', 'Component Architecture', 'API Integration'],
      projects: ['E-commerce Store', 'Social Media Dashboard', 'Weather App']
    }
  ]
}

const Roadmap = () => {
  const [selectedCareer, setSelectedCareer] = useState('software_engineer')
  const [completedItems, setCompletedItems] = useState([])
  const [currentRoadmap, setCurrentRoadmap] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { t } = useTranslation()

  useEffect(() => {
    loadUserProgress()
  }, [])

  const loadUserProgress = async () => {
    try {
      const career = localStorage.getItem('selectedCareer')
      const completed = localStorage.getItem('completedRoadmapItems')
      
      if (career) {
        setSelectedCareer(career)
        await generateRoadmapFromGemini(career.replace(/_/g, ' '))
      } else {
        setCurrentRoadmap(roadmaps.software_engineer)
      }
      
      if (completed) {
        setCompletedItems(JSON.parse(completed))
      }
    } catch (error) {
      console.error('Error loading user progress:', error)
      setCurrentRoadmap(roadmaps.software_engineer)
    }
  }

  const parseRoadmapMarkdown = (markdown, field) => {
    const levels = []
    const sections = markdown.split('##').filter(section => section.trim())
    sections.forEach((section, index) => {
      const lines = section.trim().split('\n').filter(line => line.trim())
      const levelTitle = lines[0].trim()
      let level
      if (levelTitle.toLowerCase().includes('beginner')) level = 'beginner'
      else if (levelTitle.toLowerCase().includes('intermediate')) level = 'intermediate'
      else if (levelTitle.toLowerCase().includes('advanced')) level = 'advanced'
      else level = 'other'

      const topics = []
      const resources = []
      let currentSection = null
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.toLowerCase().includes('topic') || line.match(/\*\*topics:\*\*/i)) { currentSection = 'topics'; continue }
        if (line.toLowerCase().includes('resource') || line.match(/\*\*resources:\*\*/i)) { currentSection = 'resources'; continue }

        if (currentSection === 'topics' && line.match(/^\d+\.\s/)) {
          topics.push(line.replace(/^\d+\.\s/, '').trim())
        } else if (currentSection === 'resources' && line.match(/^\d+\.\s/)) {
          const resourceText = line.replace(/^\d+\.\s/, '').trim()
          let title = resourceText
          let url = ''
          let platform = 'Online'
          const urlMatch = resourceText.match(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/i)
          if (urlMatch) { title = urlMatch[1]; url = urlMatch[2] } else {
            const parts = resourceText.split(/\s-\s|\s–\s/)
            if (parts.length > 1) { title = parts[0].trim(); platform = parts[1].trim() }
          }
          resources.push({
            type: title.toLowerCase().includes('course') || title.toLowerCase().includes('tutorial') ? 'course' : title.toLowerCase().includes('book') ? 'book' : 'practice',
            title,
            platform,
            url,
            free: title.toLowerCase().includes('free')
          })
        }
      }
      levels.push({
        id: `step_${index + 1}`,
        title: levelTitle,
        description: `${levelTitle} level skills for ${field}`,
        level,
        duration: level === 'beginner' ? '4-6 weeks' : level === 'intermediate' ? '8-10 weeks' : '12+ weeks',
        resources: resources.length > 0 ? resources : [{ type: 'course', title: 'Resources coming soon', platform: 'Various', free: true }],
        skills: topics.length > 0 ? topics : ['Skills coming soon'],
        projects: []
      })
    })
    return levels
  }

  const generateRoadmapFromGemini = async (careerTitle) => {
    setLoading(true)
    setError(null)
    try {
      const lang = localStorage.getItem('language') || 'en'
      const markdown = await geminiService.getCareerRoadmap(careerTitle, lang)
      const parsed = parseRoadmapMarkdown(markdown, careerTitle)
      setCurrentRoadmap(parsed)
    } catch (e) {
      console.error('Failed to generate roadmap:', e)
      setError(t('failedToLoad') || 'Failed to load roadmap data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const toggleItemCompletion = (itemId) => {
    const newCompletedItems = completedItems.includes(itemId)
      ? completedItems.filter(id => id !== itemId)
      : [...completedItems, itemId]
    
    setCompletedItems(newCompletedItems)
    
    try {
      localStorage.setItem('completedRoadmapItems', JSON.stringify(newCompletedItems))
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#10B981'
      case 'intermediate': return '#F59E0B'
      case 'advanced': return '#EF4444'
      default: return '#8B5CF6'
    }
  }

  const getLevelIcon = (level) => {
    switch (level) {
      case 'beginner': return Play
      case 'intermediate': return Code
      case 'advanced': return Trophy
      default: return Book
    }
  }

  const getResourceIcon = (type) => {
    switch (type) {
      case 'course': return Book
      case 'book': return Book
      case 'project': return Code
      case 'practice': return Trophy
      default: return Book
    }
  }

  const completedCount = completedItems.length
  const totalCount = currentRoadmap.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('learningRoadmap') || 'Learning Roadmap'}</h1>
        <p className="page-subtitle">
          {selectedCareer.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </p>
        {loading && (
          <p className="page-subtitle">{t('processingAnswers') || 'Generating roadmap...'}</p>
        )}
        {error && (
          <p className="page-subtitle" style={{ color: '#EF4444' }}>{error}</p>
        )}
        
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', marginBottom: '8px' }}>
            {completedCount} of {totalCount} completed
          </p>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              borderRadius: '4px',
              width: `${progressPercentage}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      <div className="page-content">
        {currentRoadmap.length === 0 && !loading ? (
          <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
            <p style={{ color: '#64748B' }}>{t('noResults') || 'No roadmap generated yet.'}</p>
          </div>
        ) : null}
        {currentRoadmap.map((item, index) => {
          const isCompleted = completedItems.includes(item.id)
          const LevelIcon = getLevelIcon(item.level)
          const levelColor = getLevelColor(item.level)

          return (
            <div key={item.id} className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                marginBottom: '16px' 
              }}>
                <button 
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    marginRight: '12px',
                    marginTop: '2px',
                    cursor: 'pointer'
                  }}
                  onClick={() => toggleItemCompletion(item.id)}
                >
                  {isCompleted ? (
                    <CheckCircle size={24} color="#10B981" />
                  ) : (
                    <Circle size={24} color="#CBD5E1" />
                  )}
                </button>
                
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '8px' 
                  }}>
                    <LevelIcon size={16} color={levelColor} />
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: levelColor,
                      marginLeft: '4px',
                      textTransform: 'uppercase'
                    }}>
                      {item.level}
                    </span>
                  </div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: isCompleted ? '#64748B' : '#1E293B',
                    textDecoration: isCompleted ? 'line-through' : 'none'
                  }}>
                    {item.title}
                  </h3>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#F1F5F9',
                  padding: '4px 8px',
                  borderRadius: '8px'
                }}>
                  <Clock size={16} color="#64748B" />
                  <span style={{
                    fontSize: '12px',
                    color: '#64748B',
                    marginLeft: '4px'
                  }}>
                    {item.duration}
                  </span>
                </div>
              </div>

              <p style={{ 
                fontSize: '16px', 
                color: '#64748B', 
                lineHeight: '1.5', 
                marginBottom: '20px' 
              }}>
                {item.description}
              </p>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '12px' 
                }}>
                  Skills you'll learn:
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                  {item.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '180px' }}>
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'linear-gradient(90deg, #E0F2FE 0%, #F0F9FF 100%)',
                          color: '#0369A1',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          boxShadow: '0 2px 8px rgba(16,185,129,0.08)',
                          border: '1px solid #BAE6FD',
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s, background 0.2s',
                          marginBottom: '6px',
                        }}
                        onMouseOver={e => {
                          e.currentTarget.style.boxShadow = '0 4px 16px rgba(59,130,246,0.15)';
                          e.currentTarget.style.background = 'linear-gradient(90deg, #BAE6FD 0%, #E0F2FE 100%)';
                        }}
                        onMouseOut={e => {
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(16,185,129,0.08)';
                          e.currentTarget.style.background = 'linear-gradient(90deg, #E0F2FE 0%, #F0F9FF 100%)';
                        }}
                      >
                        <svg width="16" height="16" style={{ marginRight: '6px' }} fill="#10B981" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" fill="#D1FAE5"/><path d="M7 10.5l2 2 4-4" stroke="#10B981" strokeWidth="2" fill="none"/></svg>
                        {skill}
                      </span>
                      {/* Resources for each skill */}
                      {item.resources && item.resources[skillIndex] && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: '#F8FAFC',
                          borderRadius: '12px',
                          padding: '8px 12px',
                          marginBottom: '4px',
                          boxShadow: '0 1px 4px rgba(59,130,246,0.07)',
                          minWidth: '160px',
                        }}>
                          {item.resources[skillIndex].type === 'course' ? (
                            <svg width="16" height="16" style={{ marginRight: '8px' }} fill="#3B82F6" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="8" rx="2" fill="#DBEAFE"/><path d="M4 6h12" stroke="#3B82F6" strokeWidth="2"/></svg>
                          ) : item.resources[skillIndex].type === 'book' ? (
                            <svg width="16" height="16" style={{ marginRight: '8px' }} fill="#8B5CF6" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="2" fill="#EDE9FE"/><path d="M3 4h14" stroke="#8B5CF6" strokeWidth="2"/></svg>
                          ) : (
                            <svg width="16" height="16" style={{ marginRight: '8px' }} fill="#10B981" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="8" rx="2" fill="#D1FAE5"/><path d="M4 6h12" stroke="#10B981" strokeWidth="2"/></svg>
                          )}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                              {item.resources[skillIndex].title}
                              <div style={{ marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {item.resources[skillIndex].url && (
                                  <a href={item.resources[skillIndex].url} target="_blank" rel="noopener noreferrer" style={{
                                    fontSize: '11px',
                                    color: '#2563EB',
                                    textDecoration: 'underline',
                                    fontWeight: '500',
                                  }}>Source Link</a>
                                )}
                                <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.resources[skillIndex].title)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#FF0000', textDecoration: 'underline', fontWeight: '500' }}>YouTube</a>
                                <a href={`https://www.coursera.org/search?query=${encodeURIComponent(item.resources[skillIndex].title)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1A73E8', textDecoration: 'underline', fontWeight: '500' }}>Coursera</a>
                                <a href={`https://www.udemy.com/courses/search/?q=${encodeURIComponent(item.resources[skillIndex].title)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#EC5252', textDecoration: 'underline', fontWeight: '500' }}>Udemy</a>
                              </div>
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>
                              {item.resources[skillIndex].platform}
                            </div>
                          </div>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            backgroundColor: item.resources[skillIndex].free ? '#DCFCE7' : '#FEF3C7',
                            color: item.resources[skillIndex].free ? '#15803D' : '#92400E'
                          }}>
                            {item.resources[skillIndex].free ? 'Free' : 'Paid'}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '12px' 
                }}>
                  Learning Resources:
                </h4>
                {item.resources.slice(0, 3).map((resource, resourceIndex) => {
                  const ResourceIcon = getResourceIcon(resource.type)
                  return (
                    <div key={resourceIndex} style={{
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: '#F8FAFC',
                      padding: '12px',
                      borderRadius: '12px',
                      marginBottom: '8px',
                      cursor: 'pointer'
                    }}>
                      <ResourceIcon size={18} color="#8B5CF6" />
                      <div style={{ flex: 1, marginLeft: '12px' }}>
                        <div style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          marginBottom: '4px'
                        }}>
                          {resource.title}
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            color: '#64748B'
                          }}>
                            {resource.platform}
                          </span>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '8px',
                            fontSize: '10px',
                            fontWeight: '600',
                            textTransform: 'uppercase',
                            backgroundColor: resource.free ? '#DCFCE7' : '#FEF3C7',
                            color: resource.free ? '#15803D' : '#92400E'
                          }}>
                            {resource.free ? 'Free' : 'Paid'}
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={16} color="#CBD5E1" />
                    </div>
                  )
                })}
              </div>

              <div>
                <h4 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  marginBottom: '12px' 
                }}>
                  Practice Projects:
                </h4>
                {item.projects.map((project, projectIndex) => (
                  <div key={projectIndex} style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <Code size={16} color="#F59E0B" />
                    <span style={{
                      fontSize: '14px',
                      color: '#64748B',
                      marginLeft: '8px'
                    }}>
                      {project}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        <div className="card" style={{
          padding: '24px',
          textAlign: 'center',
          border: '2px solid #10B981',
          marginBottom: '40px'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            marginBottom: '12px' 
          }}>
            Keep Going! 🎯
          </h3>
          <p style={{ 
            fontSize: '16px', 
            color: '#64748B', 
            lineHeight: '1.5' 
          }}>
            Every expert was once a beginner. Stay consistent, practice daily, and you'll achieve your career goals.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Roadmap
