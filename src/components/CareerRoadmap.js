import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Circle, Clock, Book, Code, Trophy, Play, ChevronRight } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { useTranslation } from '../utils/translations';



const CareerRoadmap = () => {
  const [careerField, setCareerField] = useState('');
  const [displayCareer, setDisplayCareer] = useState('');
  const [roadmapData, setRoadmapData] = useState([]);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  // Effect to clear input on mount and handle navigation
  useEffect(() => {
    setCareerField('');
    
    // Check if there's a career in localStorage (from Home page navigation)
    const storedCareer = localStorage.getItem('selectedCareer');
    if (storedCareer) {
      const normalized = storedCareer.replace(/_/g, ' ');
      setDisplayCareer(normalized);
      loadRoadmapData(normalized);
    }
    
    // This will run when component unmounts (navigating away)
    return () => {
      localStorage.removeItem('selectedCareer');
      setRoadmapData([]);
    };
  }, [location.pathname]); // Re-run when location changes

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRoadmapData = async (field) => {
    setLoading(true);
    setError(null);
    try {
      const lang = localStorage.getItem('language') || 'en';
      const roadmapMarkdown = await geminiService.getCareerRoadmap(field, lang);
      const parsedData = parseRoadmapMarkdown(roadmapMarkdown, field);
      setRoadmapData(parsedData);
    } catch (error) {
      console.error('Error loading roadmap data:', error);
      setError(t('failedToLoad') || 'Failed to load roadmap data. Please try again.');
      // Fallback to dummy data if API fails
      const dummyRoadmapData = [
        {
          id: 'step_1',
          title: 'Fundamentals',
          description: `Learn the basics of ${field}`,
          level: 'beginner',
          duration: '4-6 weeks',
          resources: [
            { type: 'course', title: 'Introduction Course', platform: 'Coursera', free: true },
            { type: 'book', title: 'Beginner Guide', platform: 'Online', free: true },
          ],
          skills: ['Basic Concepts', 'Terminology', 'Industry Overview'],
          projects: ['Simple Project 1', 'Basic Assessment']
        },
        {
          id: 'step_2',
          title: 'Intermediate Skills',
          description: `Build your ${field} knowledge`,
          level: 'intermediate',
          duration: '8-10 weeks',
          resources: [
            { type: 'course', title: 'Advanced Techniques', platform: 'Udemy', free: false },
            { type: 'practice', title: 'Skill Challenges', platform: 'Various', free: true },
          ],
          skills: ['Advanced Concepts', 'Problem Solving', 'Specialized Tools'],
          projects: ['Portfolio Project', 'Case Study']
        }
      ];
      
      setRoadmapData(dummyRoadmapData);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to parse markdown response into structured data
  const parseRoadmapMarkdown = (markdown, field) => {
    const levels = [];
      const sections = markdown.split('##').filter(section => section.trim());
    
    sections.forEach((section, index) => {
      const lines = section.trim().split('\n').filter(line => line.trim());
      const levelTitle = lines[0].trim();
      
      let level;
      if (levelTitle.toLowerCase().includes('beginner')) {
        level = 'beginner';
      } else if (levelTitle.toLowerCase().includes('intermediate')) {
        level = 'intermediate';
      } else if (levelTitle.toLowerCase().includes('advanced')) {
        level = 'advanced';
      } else {
        level = 'other';
      }
      
      const topics = [];
      const resources = [];
      
      let currentSection = null;
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.toLowerCase().includes('topic') || line.match(/\*\*topics:\*\*/i)) {
          currentSection = 'topics';
          continue;
        } else if (line.toLowerCase().includes('resource') || line.match(/\*\*resources:\*\*/i)) {
          currentSection = 'resources';
          continue;
        }
        
        if (currentSection === 'topics' && line.match(/^\d+\.\s/)) {
          topics.push(line.replace(/^\d+\.\s/, '').trim());
        } else if (currentSection === 'resources' && line.match(/^\d+\.\s/)) {
          const resourceText = line.replace(/^\d+\.\s/, '').trim();
          let title = resourceText;
          let url = '';
          let platform = 'Online';
          
          // Try to extract URL if present
          const urlMatch = resourceText.match(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/i);
          if (urlMatch) {
            title = urlMatch[1];
            url = urlMatch[2];
          } else {
            // Check for hyphen or dash separating title and platform
            const parts = resourceText.split(/\s-\s|\s–\s/);
            if (parts.length > 1) {
              title = parts[0].trim();
              platform = parts[1].trim();
            }
          }
          
          resources.push({
            type: title.toLowerCase().includes('course') || title.toLowerCase().includes('tutorial') ? 'course' : 
                  title.toLowerCase().includes('book') ? 'book' : 'practice',
            title: title,
            platform: platform,
            url: url,
            free: title.toLowerCase().includes('free')
          });
        }
      }
      
      levels.push({
        id: `step_${index + 1}`,
        title: levelTitle,
        description: `${levelTitle} level skills for ${field}`,
        level: level,
        duration: level === 'beginner' ? '4-6 weeks' : level === 'intermediate' ? '8-10 weeks' : '12+ weeks',
        resources: resources.length > 0 ? resources : [{ type: 'course', title: 'Resources coming soon', platform: 'Various', free: true }],
        skills: topics.length > 0 ? topics : ['Skills coming soon'],
        projects: []
      });
    });
    
    return levels;
  };
  
  const handleGetRoadmap = () => {
    if (careerField.trim()) {
      localStorage.setItem('selectedCareer', careerField.toLowerCase().replace(/\s+/g, '_'));
      setDisplayCareer(careerField.trim());
      loadRoadmapData(careerField);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#10B981';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#EF4444';
      default: return '#8B5CF6';
    }
  };

  return (
    <div className="page-container">
      {roadmapData.length === 0 ? (
        <div className="page-header" style={{ textAlign: "center", padding: "40px 20px" }}>
          <h1 className="page-title">{t('learningRoadmap') || 'Learning Roadmap'}</h1>
          <p className="page-subtitle">{t('followStructuredPath') || 'Follow structured path from beginner to expert'}</p>
          
          <div style={{ maxWidth: "300px", margin: "20px auto" }}>
            <input
              type="text"
              placeholder={t('iKnowCareer') || 'Enter Career Field'}
              value={careerField}
              onChange={(e) => setCareerField(e.target.value)}
              className="career-input"
            />
            
            <button
              onClick={handleGetRoadmap}
              className="primary-button"
            >
              {t('showRoadmap') || 'Get Roadmap'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="page-header">
            <h1 className="page-title">{displayCareer || careerField} {t('roadmap') || 'Roadmap'}</h1>
            <p className="page-subtitle">{t('aiGuideJourney') || 'Your personalized learning path'}</p>
          </div>
          
          <div className="page-content">
            <div className="roadmap-container" style={{ padding: '20px' }}>
              {roadmapData.map((item, index) => (
                <div key={item.id} className="roadmap-item" style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '16px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '16px',
                      backgroundColor: getLevelColor(item.level),
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '12px',
                      fontWeight: 'bold'
                    }}>
                      {index + 1}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{item.title}</h3>
                    <div style={{
                      marginLeft: 'auto',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      color: getLevelColor(item.level)
                    }}>
                      <Clock size={16} style={{ marginRight: '4px' }} />
                      {item.duration}
                    </div>
                  </div>
                  
                  <p style={{ margin: '0 0 16px 0', color: '#64748B' }}>{item.description}</p>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Skills to Learn</h4>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '8px' }}>
                      {item.skills.map((skill, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: '180px' }}>
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
                          {item.resources && item.resources[i] && (
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
                              {item.resources[i].type === 'course' ? (
                                <svg width="16" height="16" style={{ marginRight: '8px' }} fill="#3B82F6" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="8" rx="2" fill="#DBEAFE"/><path d="M4 6h12" stroke="#3B82F6" strokeWidth="2"/></svg>
                              ) : item.resources[i].type === 'book' ? (
                                <svg width="16" height="16" style={{ marginRight: '8px' }} fill="#8B5CF6" viewBox="0 0 20 20"><rect x="3" y="4" width="14" height="12" rx="2" fill="#EDE9FE"/><path d="M3 4h14" stroke="#8B5CF6" strokeWidth="2"/></svg>
                              ) : (
                                <svg width="16" height="16" style={{ marginRight: '8px' }} fill="#10B981" viewBox="0 0 20 20"><rect x="4" y="6" width="12" height="8" rx="2" fill="#D1FAE5"/><path d="M4 6h12" stroke="#10B981" strokeWidth="2"/></svg>
                              )}
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '2px' }}>
                                  {item.resources[i].title}
                               
                                  <div style={{ marginTop: '4px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {item.resources[i].url && (
                                      <a href={item.resources[i].url} target="_blank" rel="noopener noreferrer" style={{
                                        fontSize: '11px',
                                        color: '#2563EB',
                                        textDecoration: 'underline',
                                        fontWeight: '500',
                                      }}>رابط المصدر</a>
                                    )}
                                  
                                    <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.resources[i].title)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#FF0000', textDecoration: 'underline', fontWeight: '500' }}>يوتيوب</a>
                                    <a href={`https://www.coursera.org/search?query=${encodeURIComponent(item.resources[i].title)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#1A73E8', textDecoration: 'underline', fontWeight: '500' }}>كورسيرا</a>
                                    <a href={`https://www.udemy.com/courses/search/?q=${encodeURIComponent(item.resources[i].title)}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: '11px', color: '#EC5252', textDecoration: 'underline', fontWeight: '500' }}>يوديمي</a>
                                  </div>
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748B' }}>
                                  {item.resources[i].platform}
                                </div>
                              </div>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '8px',
                                fontSize: '10px',
                                fontWeight: '600',
                                textTransform: 'uppercase',
                                backgroundColor: item.resources[i].free ? '#DCFCE7' : '#FEF3C7',
                                color: item.resources[i].free ? '#15803D' : '#92400E'
                              }}>
                                {item.resources[i].free ? 'Free' : 'Paid'}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>Resources</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {item.resources.map((resource, i) => (
                        <div key={i} style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 12px',
                          background: '#F8FAFC',
                          borderRadius: '8px'
                        }}>
                          {resource.type === 'course' ? (
                            <Play size={16} style={{ marginRight: '8px', color: '#3B82F6' }} />
                          ) : resource.type === 'book' ? (
                            <Book size={16} style={{ marginRight: '8px', color: '#8B5CF6' }} />
                          ) : (
                            <Code size={16} style={{ marginRight: '8px', color: '#10B981' }} />
                          )}
                          <span>{resource.title}</span>
                          <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#64748B' }}>
                            {resource.platform} {resource.free ? '(Free)' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerRoadmap;