# 🚀 Career Guidance System

A comprehensive career guidance web application with AI-powered assistance, interactive features, and a modern user interface.

## 📁 Project Structure

```
project/
├── frontend/                 # Frontend files
│   ├── pages/               # HTML pages
│   │   ├── login.html       # User login
│   │   ├── register.html    # User registration
│   │   ├── dashboard.html   # User dashboard
│   │   ├── chat.html        # AI chat interface
│   │   ├── quiz.html        # Career assessment quiz
│   │   ├── roadmap.html     # Learning roadmap
│   │   ├── opportunities.html # Job opportunities
│   │   └── reset-password.html # Password reset
│   └── assets/              # Static assets
│       ├── css/             # Stylesheets
│       │   └── style.css    # Main stylesheet
│       ├── js/              # JavaScript files
│       │   └── main.js      # Main JavaScript
│       └── images/          # Images and icons
│           ├── hero-illustration.svg
│           └── placeholder.svg
├── backend/                 # Backend files
│   ├── api/                 # API endpoints
│   │   ├── config.php       # Database configuration
│   │   ├── chat.php         # AI chat API
│   │   ├── login.php        # Login API
│   │   ├── register.php     # Registration API
│   │   └── auth/            # Authentication APIs
│   │       ├── reset-password.php
│   │       ├── validate-reset-token.php
│   │       └── forgot-password.php
│   ├── database/            # Database files
│   ├── setup.php            # Database setup script
│   └── .htaccess            # Backend configuration
├── tests/                   # Test files
│   ├── test_ai_api.php      # AI API testing
│   ├── test_personal_chat.php # Personal chat testing
│   └── test_final_system.php # Final system testing
├── config/                  # Configuration files
│   └── docs/                # Documentation
├── index.html              # Main landing page
├── README.md               # Project documentation
├── QUICK_START.md          # Quick start guide
├── .gitignore              # Git ignore file
├── .htaccess               # Main configuration
└── LICENSE                 # Project license
```

## 🌟 Features

### 🤖 AI-Powered Career Assistant
- **Multi-API Support**: Gemini, OpenAI, Preplexity AI, DeepSeek
- **Natural Conversations**: Friendly, conversational responses with emojis
- **Personalized Experience**: Remembers user names and preferences
- **Fallback System**: Works even when external APIs are unavailable

### 📊 Interactive Dashboard
- **Progress Tracking**: Visual progress indicators
- **Recent Activity**: User activity history
- **Quick Access**: Direct links to all features
- **Statistics**: Usage analytics and insights

### 🧠 Career Assessment Quiz
- **10 Interactive Questions**: Personality and skill-based assessment
- **Career Recommendations**: Personalized career suggestions
- **Progress Tracking**: Save and review quiz results
- **Detailed Analysis**: Comprehensive career insights

### 🗺️ Learning Roadmap
- **4 Career Paths**: Web Development, Data Science, UI/UX Design, Digital Marketing
- **Interactive Modules**: Step-by-step learning paths
- **Resource Links**: Courses, books, videos, projects
- **Progress Tracking**: Visual progress indicators

### 💼 Job Opportunities
- **Comprehensive Listings**: Diverse job opportunities
- **Advanced Filtering**: Filter by category, experience, location
- **Search Functionality**: Smart job search
- **Application Tracking**: Save and track applications

### 💬 AI Chat Interface
- **Natural Conversations**: Friendly, human-like responses
- **Topic Recognition**: Automatically identifies conversation topics
- **Personal Memory**: Remembers user names and preferences
- **Multi-language Support**: Arabic and English

## 🚀 Quick Start

### Prerequisites
- PHP 7.4+
- MySQL 5.7+
- XAMPP (recommended)

### Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd project
   ```

2. **Set up the database**
   ```bash
   # Open XAMPP Control Panel
   # Start Apache and MySQL
   # Go to http://localhost/phpmyadmin
   # Create database: career_guidance
   ```

3. **Run the setup script**
   ```bash
   C:\xampp\php\php.exe backend/setup.php
   ```

4. **Start the server**
   ```bash
   C:\xampp\php\php.exe -S localhost:8000 --docroot .
   ```

5. **Access the application**
   - Main page: `http://localhost:8000`
   - Chat: `http://localhost:8000/frontend/pages/chat.html`
   - Dashboard: `http://localhost:8000/frontend/pages/dashboard.html`

## 🤖 AI Integration

### Supported APIs
1. **Gemini** ✅ (Primary - Working)
2. **OpenAI** ❌ (Invalid API key)
3. **Preplexity AI** ❌ (Invalid model)
4. **DeepSeek** ❌ (Insufficient balance)

### Fallback System
- **Intelligent Responses**: Context-aware fallback responses
- **Topic Recognition**: Automatically identifies conversation topics
- **Personal Memory**: Remembers user preferences
- **Natural Language**: Friendly, conversational responses

## 🎯 Usage Examples

### Chat with AI Assistant
```
User: "hi"
AI: "Hello! I'm here to help you with career guidance! 🎯"

User: "my name is saif"
AI: "Hey saif! 👋 Nice to meet you! I'm your AI Career Assistant..."

User: "how can I improve my resume?"
AI: "Hey! Let me help you make your resume stand out! 🎯..."
```

### Career Assessment
- Take the interactive quiz
- Get personalized career recommendations
- Review detailed analysis
- Save results for future reference

### Learning Roadmap
- Choose from 4 career paths
- Follow step-by-step modules
- Track your progress
- Access learning resources

## 🔧 Configuration

### Environment Variables
- Database configuration in `backend/api/config.php`
- API keys in `backend/api/chat.php`
- Server settings in `.htaccess`

### Customization
- Modify AI responses in `frontend/pages/chat.html`
- Update styling in `frontend/assets/css/style.css`
- Add new features in `frontend/pages/`

## 🧪 Testing

### Run Tests
```bash
# Test AI APIs
C:\xampp\php\php.exe tests/test_ai_api.php

# Test personal chat
C:\xampp\php\php.exe tests/test_personal_chat.php

# Test final system
C:\xampp\php\php.exe tests/test_final_system.php
```

## 📝 Documentation

- **Quick Start**: `QUICK_START.md`
- **API Documentation**: `config/docs/API.md`
- **User Guide**: `config/docs/USER_GUIDE.md`
- **Developer Guide**: `config/docs/DEVELOPER_GUIDE.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Documentation**: Check the `config/docs/` folder
- **Quick Help**: `QUICK_START.md`

---

**🎉 Ready to start your career journey? Visit `http://localhost:8000` and let's get started!**
