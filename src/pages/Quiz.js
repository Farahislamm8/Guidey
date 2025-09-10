
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
        <div className="page-header">
          <h1 className="page-title">{t('aiCareerMatch')}</h1>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '8px 16px',
            borderRadius: '20px',
            display: 'inline-block',
            marginTop: '12px'
          }}>
            <span style={{ color: confidenceColor, fontWeight: '600' }}>
              {confidenceLabel}
            </span>
          </div>
        </div>
        <div className="page-content">
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
              {result.suggestedCareer}
            </h2>
            <p style={{ color: '#64748B', marginBottom: '24px', lineHeight: '1.5' }}>
              {result.summary}
            </p>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>
               {t('whyCareerFits')}
              </h3>
              {result.reasons.map((reason, index) => (
                <div key={index} style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  marginBottom: '12px' 
                }}>
                  <Check size={16} color="#10B981" style={{ marginRight: '8px', marginTop: '2px' }} />
                  <span style={{ fontSize: '14px', color: '#64748B', lineHeight: '1.4' }}>
                    {reason}
                  </span>
                </div>
              ))}
            </div>
            {result.roles.length > 0 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
                {t('potentialRoles')}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.roles.map((role, index) => (
                    <span key={index} style={{
                      backgroundColor: '#F0F9FF',
                      color: '#0369A1',
                      padding: '6px 12px',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      border: '1px solid #BAE6FD'
                    }}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {altResult && altResult.suggestedCareer && altResult.suggestedCareer !== result.suggestedCareer && (
            <div className="card" style={{ padding: '24px', marginBottom: '24px', background: '#F8FAFC' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px', color: '#8B5CF6' }}>AI Alternative Suggestion</h2>
              <div style={{ color: '#64748B', marginBottom: '12px' }}>{altResult.suggestedCareer}</div>
              <div style={{ color: '#64748B', fontSize: '15px' }}>{altResult.summary}</div>
            </div>
          )}
          <button className="btn-primary w-full mb-4" onClick={startRoadmap}>
           {t('startLearningRoadmap')}
          </button>
          <button 
            className="btn-secondary w-full"
            onClick={() => {
              setCurrentQuestion(0)
              setAnswers({})
              setIsCompleted(false)
              setResult(null)
              setIsAnalyzing(false)
              setAltResult(null)
            }}
          >
            Retake Quiz
          </button>
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


