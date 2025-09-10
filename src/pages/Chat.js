import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Lightbulb, TrendingUp, HelpCircle, Mic, Smile } from 'lucide-react'
import { geminiChatService } from '../services/geminiService.js'
import { useTranslation } from '../utils/translations'


//const emojiList = ["😀", "😂", "😍", "😎", "👍", "🙏", "🎉", "😢", "🔥", "❤️"];
const emojiList = [
  "😀", "😂", "😍", "😎", "👍", "🙏", "🎉", "😢", "🔥", "❤️",
  "🥳", "😇", "🤔", "😭", "🥺", "😡", "🤯", "🙌", "💪", "✨",
  "🌟", "🌸", "🌈", "🍕", "🍔", "🍎", "🍫", "⚽", "🏆", "🎶",
  "🎨", "📚", "✈️", "🚗", "🏠", "💡", "📱", "💻", "🖤", "💙",
  "💚", "💛", "🧡", "💜", "🤍", "🤎", "🌍", "🌞", "🌙", "⭐"
];

const Chat = () => {
  const { t } = useTranslation()
  
  const predefinedQuestions = [
    {
      text: t('skillsInDemand'),
      icon: TrendingUp,
      color: "#10B981"
    },
    {
      text: t('careerPathSuggestions'),
      icon: Lightbulb,
      color: "#F59E0B"
    },
    {
      text: t('howToGetStarted'),
      icon: HelpCircle,
      color: "#3B82F6"
    }
  ]
  
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: t('aiCareerAssistant') + ". " + t('personalizedGuidance'),
      isUser: false,
      timestamp: new Date(),
    }
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = async () => {
    if (inputText.trim() === '' || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      // Prepare conversation history for the AI
      const conversationHistory = messages
        .filter(msg => msg.id !== '1') // Exclude the initial greeting
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))

      // Get AI response using Gemini service
      const aiResponse = await geminiChatService.getChatResponse(inputText.trim(), conversationHistory)

      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePredefinedQuestion = (question) => {
    setInputText(question)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Emoji picker
  const handleEmojiClick = (emoji) => {
    setInputText(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Speech to text
  const handleRecordClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('متصفحك لا يدعم التسجيل الصوتي')
      return
    }
    setIsRecording(true)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'ar-EG'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInputText(prev => prev + ' ' + transcript)
    }
    recognition.onerror = (event) => {
      alert('حدث خطأ أثناء التسجيل الصوتي: ' + event.error)
    }
    recognition.onend = () => {
      setIsRecording(false)
    }
    recognition.start()
  }

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <div className="page-header">
        <h1 className="page-title">{t('aiCareerAssistant')}</h1>
        <p className="page-subtitle">{t('personalizedGuidance')}</p>
      </div>

      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '20px',
        paddingBottom: '100px'
      }}>
        {messages.map((message) => (
          <div
            key={message.id}
            style={{
              marginBottom: '16px',
              maxWidth: '85%',
              alignSelf: message.isUser ? 'flex-end' : 'flex-start',
              marginLeft: message.isUser ? 'auto' : '0',
              marginRight: message.isUser ? '0' : 'auto'
            }}
          >
            <div style={{
              backgroundColor: message.isUser ? '#8B5CF6' : '#FFFFFF',
              borderRadius: '16px',
              borderBottomRightRadius: message.isUser ? '4px' : '16px',
              borderBottomLeftRadius: message.isUser ? '16px' : '4px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px 8px',
              }}>
                {message.isUser ? (
                  <User size={20} color="#FFFFFF" />
                ) : (
                  <Bot size={20} color="#8B5CF6" />
                )}
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  marginLeft: '8px',
                  textTransform: 'uppercase',
                  color: message.isUser ? '#E2E8F0' : '#64748B'
                }}>
                  {message.isUser ? t('you') : t('aiCareerAssistant')}
                </span>
              </div>
              <div style={{
                padding: '0 16px 16px',
                fontSize: '15px',
                lineHeight: '1.5',
                color: message.isUser ? '#FFFFFF' : '#1E293B',
                whiteSpace: 'pre-line'
              }}>
                {message.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div
            style={{
              marginBottom: '16px',
              maxWidth: '85%',
              alignSelf: 'flex-start',
              marginLeft: '0',
              marginRight: 'auto'
            }}
          >
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              borderBottomLeftRadius: '4px',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px 8px',
              }}>
                <Bot size={20} color="#8B5CF6" />
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  marginLeft: '8px',
                  textTransform: 'uppercase',
                  color: '#64748B'
                }}>
                  {t('aiCareerAssistant')}
                </span>
              </div>
              <div style={{
                padding: '0 16px 16px',
                fontSize: '15px',
                lineHeight: '1.5',
                color: '#64748B',
                fontStyle: 'italic'
              }}>
                {t('thinking')}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '20px 20px 10px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', marginBottom: '12px' }}>
          {t('quickQuestions')}
        </h3>
        <div style={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: '12px',
          paddingBottom: '10px'
        }}>
          {predefinedQuestions.map((question, index) => (
            <button
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: '10px 16px',
                borderRadius: '20px',
                border: 'none',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
                maxWidth: '280px'
              }}
              onClick={() => handlePredefinedQuestion(question.text)}
            >
              <question.icon size={16} color={question.color} />
              <span style={{
                fontSize: '13px',
                color: '#1E293B',
                marginLeft: '8px'
              }}>
                {question.text}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'flex-end',
        padding: '20px',
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        position: 'sticky',
        bottom: '80px',
        boxShadow: '0 2px 8px rgba(139, 92, 246, 0.08)'
      }}>
        {/* زر الإيموجي */}
        <div style={{ position: 'relative', marginRight: '8px' }}>
          <button
            style={{
              backgroundColor: '#8B5CF6',
              borderRadius: '24px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              boxShadow: '0 1px 4px rgba(139, 92, 246, 0.12)',
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            title="Emoji"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
          >
            <Smile size={22} color="#FFFFFF" />
          </button>
          {showEmojiPicker && (
            <div style={{
              position: 'absolute',
              bottom: '60px',
              left: 0,
              background: '#F8FAFC',
              border: '1.5px solid #8B5CF6',
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(139, 92, 246, 0.18)',
              padding: '12px',
              zIndex: 100,
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '8px',
              minWidth: '340px',
              maxWidth: '400px',
              maxHeight: '220px',
              overflowY: 'auto',
            }}>
              {emojiList.map((emoji, idx) => (
                <button
                  key={idx}
                  style={{
                    fontSize: '22px',
                    background: '#FFF',
                    border: '1px solid #E2E8F0',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    transition: 'background 0.2s, border 0.2s',
                  }}
                  onMouseOver={e => e.currentTarget.style.background = '#E9D5FF'}
                  onMouseOut={e => e.currentTarget.style.background = '#FFF'}
                  onFocus={e => e.currentTarget.style.background = '#E9D5FF'}
                  onBlur={e => e.currentTarget.style.background = '#FFF'}
                  onClick={() => handleEmojiClick(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <textarea
          style={{
            flex: 1,
            border: '2px solid #8B5CF6',
            borderRadius: '24px',
            padding: '12px 16px',
            fontSize: '16px',
            backgroundColor: '#F8FAFC',
            color: '#1E293B',
            resize: 'none',
            maxHeight: '100px',
            minHeight: '48px',
            boxShadow: '0 1px 4px rgba(139, 92, 246, 0.10)'
          }}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={t('askAboutCareers')}
          rows={1}
          disabled={isLoading}
          autoFocus
        />

        
        <div style={{ marginLeft: '8px', marginRight: '8px' }}>
          <button
            style={{
              backgroundColor: isRecording ? '#E2E8F0' : '#8B5CF6',
              borderRadius: '24px',
              width: '48px',
              height: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              boxShadow: '0 1px 4px rgba(139, 92, 246, 0.12)',
              cursor: isRecording ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
            title="Record"
            onClick={isRecording ? undefined : handleRecordClick}
            disabled={isRecording}
          >
            <Mic size={22} color={isRecording ? "#8B5CF6" : "#FFFFFF"} />
          </button>
        </div>

        <button
          style={{
            backgroundColor: (inputText.trim() === '' || isLoading) ? '#E2E8F0' : '#8B5CF6',
            borderRadius: '24px',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: '8px',
            border: 'none',
            boxShadow: '0 1px 4px rgba(139, 92, 246, 0.12)',
            cursor: (inputText.trim() === '' || isLoading) ? 'not-allowed' : 'pointer'
          }}
          onClick={sendMessage}
          disabled={inputText.trim() === '' || isLoading}
        >
          <Send size={20} color={(inputText.trim() === '' || isLoading) ? "#CBD5E1" : "#FFFFFF"} />
        </button>
      </div>
    </div>
  )
}

export default Chat