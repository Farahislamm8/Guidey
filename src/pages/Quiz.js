
async function getCareerResult(formattedQuestions, formattedAnswers, quizAnswers, geminiService) {

  throw new Error('Gemini API not available');
 
  
}
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { geminiService } from '../services/geminiService.js'
import { useTranslation } from '../utils/translations'



const Quiz = () => {
  const { t } = useTranslation()
  const questions = t('quizQuestions') // يجب أن يكون هذا مصفوفة أسئلة من ملف الترجمة

  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [altResult, setAltResult] = useState(null) // نتيجة الذكاء الاصطناعي البديلة
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // helper: get unique key for each question (id or fallback to index)
  const getQuestionKey = (q, idx) => (q && q.id !== undefined ? q.id : idx)

  const handleAnswer = (optionIndex) => {
    const key = getQuestionKey(questions[currentQuestion], currentQuestion)
    setAnswers(prev => ({
      ...prev,
      [key]: optionIndex
    }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      completeQuiz()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const analyzeAnswers = async () => {
    const quizAnswers = {}
    const formattedQuestions = []
    const formattedAnswers = []
    
    Object.entries(answers).forEach(([key, answerIndex]) => {
      const qIndex = parseInt(key)
      const question = questions[qIndex]
      if (question) {
        quizAnswers[qIndex] = {
          question: question.question,
          selectedOption: question.options[answerIndex],
          optionIndex: answerIndex
        }
        
        formattedQuestions.push({ question: question.question })
        formattedAnswers.push(question.options[answerIndex])
      }
    })

    try {
      let mainResult = null;
      let altResult = null;
      try {
        mainResult = await getCareerResult(formattedQuestions, formattedAnswers, quizAnswers, geminiService);
      } catch (apiError) {
        // ignore error, fallback handled below
      }
      try {
        const currentLang = localStorage.getItem('language') || 'en'
        altResult = await geminiService.getCareerRecommendation(quizAnswers, currentLang);
      } catch (error) {
        altResult = {
          suggestedCareer: 'Career Exploration Needed',
          confidenceLevel: 'Medium',
          reasons: [
            'Based on your responses, you show diverse interests',
            'Further exploration would help identify your ideal path',
            'Consider trying different activities to discover your passion'
          ],
          summary: 'Your answers suggest you would benefit from exploring various career options and gaining more experience.',
          roles: []
        };
      }
      setAltResult(altResult);
      return mainResult || altResult;
    } catch (error) {
      console.error('Error getting AI recommendation:', error)
      return {
        suggestedCareer: 'Career Exploration Needed',
        confidenceLevel: 'Medium',
        reasons: [
          'Based on your responses, you show diverse interests',
          'Further exploration would help identify your ideal path',
          'Consider trying different activities to discover your passion'
        ],
        summary: 'Your answers suggest you would benefit from exploring various career options and gaining more experience.',
        roles: []
      }
    }
  }

  const completeQuiz = async () => {
    setIsAnalyzing(true)
    try {
      const quizResult = await analyzeAnswers()
      setResult(quizResult)
      setIsCompleted(true)
      
      localStorage.setItem('quizResult', JSON.stringify(quizResult))
      localStorage.setItem('selectedCareer', quizResult.suggestedCareer.toLowerCase().replace(/\s+/g, '_'))
    } catch (error) {
      console.error('Error completing quiz:', error)
      alert('Failed to analyze your responses. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const startRoadmap = () => {
    navigate('/roadmap')
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100
  const currentQ = questions[currentQuestion]
  const selectedAnswer = answers[getQuestionKey(currentQ, currentQuestion)]

  if (isAnalyzing) {
    return (
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">{t('analyzingResponses')}</h1>
          <p className="page-subtitle">{t('aiAnalyzing')}</p>
        </div>
        
        <div className="page-content" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '400px'
        }}>
          <div className="loading-spinner" style={{ marginBottom: '20px' }}></div>
          <p style={{ color: '#64748B', textAlign: 'center' }}>
            {t('processingAnswers')}
          </p>
        </div>
      </div>
    )
  }



  if (isCompleted && result) {
    const level = (result.confidenceLevel || '').toLowerCase()
    const confidenceColor = level.includes('high') ? '#10B981' : level.includes('medium') ? '#F59E0B' : '#EF4444'
    const confidenceLabel = level.includes('high') ? t('highConfidence') : level.includes('medium') ? t('mediumConfidence') : t('lowConfidence')

    return (
      <div className="page-container">
        <div style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)',
          color: 'white',
          padding: '60px 20px 40px',
          textAlign: 'center',
          position: 'relative'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '400',
            margin: '0',
            letterSpacing: '0.5px'
          }}>
            Your Career Result
          </h1>
        </div>
        
        <div className="page-content">
          {/* Recommended Career Category */}
          <div style={{
            background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid #0EA5E9'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#0EA5E9',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#0369A1',
                margin: '0'
              }}>
                Recommended Career Category
              </h2>
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1E293B',
              margin: '0'
            }}>
              {result.suggestedCareer}
            </h3>
          </div>
          
          {/* Why This Career Fits You */}
          <div style={{
            background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid #A855F7'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#A855F7',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#7C3AED',
                margin: '0'
              }}>
                Why This Career Category Fits You
              </h2>
            </div>
            <p style={{
              fontSize: '16px',
              lineHeight: '1.6',
              color: '#1E293B',
              margin: '0'
            }}>
              {result.summary}
            </p>
          </div>

          {/* Possible Specializations */}
          {result.specializations && result.specializations.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px',
              border: '1px solid #10B981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#10B981',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm5-18v4h3V3h-3z"/>
                  </svg>
                </div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#059669',
                  margin: '0'
                }}>
                  Possible Specializations & Fit Percentage
                </h2>
              </div>
              {result.specializations.map((spec, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: index < result.specializations.length - 1 ? '12px' : '0'
                }}>
                  <span style={{
                    fontSize: '16px',
                    color: '#1E293B',
                    fontWeight: '500'
                  }}>
                    • {spec.name}
                  </span>
                  <span style={{
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#059669'
                  }}>
                    {spec.percentage}%
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Required Core Skills */}
          <div style={{
            background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid #F59E0B'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#F59E0B',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#D97706',
                margin: '0'
              }}>
                Required Core Skills
              </h2>
            </div>
            {result.reasons.map((skill, index) => (
              <div key={index} style={{
                marginBottom: index < result.reasons.length - 1 ? '8px' : '0'
              }}>
                <span style={{
                  fontSize: '16px',
                  color: '#1E293B',
                  lineHeight: '1.5'
                }}>
                  • {skill}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!currentQ) return <div className="page-container" />

  return (
    <div className="page-container">
      <div className="page-header">
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            {t('question')} {currentQuestion + 1} {t('of')} {questions.length}
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
              width: `${progress}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      <div className="page-content">
        <h2 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          marginBottom: '32px', 
          lineHeight: '1.3' 
        }}>
          {currentQ.question}
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              className={`card ${selectedAnswer === index ? 'selected' : ''}`}
              style={{
                padding: '20px',
                cursor: 'pointer',
                border: selectedAnswer === index ? '2px solid #8B5CF6' : '2px solid #E2E8F0',
                backgroundColor: selectedAnswer === index ? '#8B5CF6' : '#FFFFFF',
                color: selectedAnswer === index ? '#FFFFFF' : '#1E293B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
              onClick={() => handleAnswer(index)}
            >
              <span style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                flex: 1, 
                lineHeight: '1.4' 
              }}>
                {option}
              </span>
              {selectedAnswer === index && (
                <Check size={20} color="#FFFFFF" style={{ marginLeft: '12px' }} />
              )}
            </div>
          ))}
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '20px 0',
          borderTop: '1px solid #E2E8F0',
          backgroundColor: '#FFFFFF',
          position: 'sticky',
          bottom: '80px'
        }}>
          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 20px',
              borderRadius: '12px',
              border: '2px solid #8B5CF6',
              backgroundColor: 'transparent',
              color: currentQuestion === 0 ? '#CBD5E1' : '#8B5CF6',
              borderColor: currentQuestion === 0 ? '#E2E8F0' : '#8B5CF6',
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft size={20} />
            <span style={{ marginLeft: '8px', fontWeight: '600' }}>{t('previous')}</span>
          </button>

          <button
            className="btn-primary"
            style={{
              display: 'flex',
              alignItems: 'center',
              opacity: selectedAnswer === undefined ? 0.5 : 1,
              cursor: selectedAnswer === undefined ? 'not-allowed' : 'pointer'
            }}
            onClick={nextQuestion}
            disabled={selectedAnswer === undefined}
          >
            <span style={{ marginRight: '8px', fontWeight: '600' }}>
              {currentQuestion === questions.length - 1 ? t('analyze') : t('next')}
            </span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz

          {/* Steps to Get Started */}
          <div style={{
            background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
            borderRadius: '20px',
            padding: '24px',
            marginBottom: '20px',
            border: '1px solid #10B981'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#10B981',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#059669',
                margin: '0'
              }}>
                Steps to Get Started
              </h2>
            </div>
            
            {/* Career Path Cards */}
            {result.specializations && result.specializations.slice(0, 3).map((spec, index) => (
              <div key={index} style={{
                background: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                border: '1px solid #0EA5E9'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0369A1',
                  marginBottom: '12px'
                }}>
                  - {spec.name}
                </h3>
                <button style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  width: '100%',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
                }} onClick={startRoadmap}>
                  Get Roadmap
                </button>
              </div>
            ))}
          </div>

          {/* Additional Advice */}
          {altResult && altResult.summary && (
            <div style={{
              background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              borderRadius: '20px',
              padding: '24px',
              marginBottom: '20px',
              border: '1px solid #F59E0B'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#F59E0B',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '12px'
                }}>
                  <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h2 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#D97706',
                  margin: '0'
                }}>
                  Additional Advice
                </h2>
              </div>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.6',
                color: '#1E293B',
                margin: '0'
              }}>
                {altResult.summary}
              </p>
            </div>
          )}

          {/* Retake Quiz Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '32px',
            marginBottom: '32px'
          }}>
            <button 
              style={{
                background: 'transparent',
                border: '2px solid #8B5CF6',
                borderRadius: '25px',
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600',
                color: '#8B5CF6',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onClick={() => {
                setCurrentQuestion(0)
                setAnswers({})
                setIsCompleted(false)
                setResult(null)
                setIsAnalyzing(false)
                setAltResult(null)
              }}
            >
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 12a8 8 0 018-8V2.5L14.5 5 12 7.5V6a6 6 0 100 12 6 6 0 006-6h2a8 8 0 01-16 0z"/>
              </svg>
              Retake Quiz
            </button>
          </div>