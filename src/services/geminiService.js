import { GoogleGenerativeAI } from '@google/generative-ai';

// const API_KEY = 'AIzaSyDX2hmmFjlDQEc-aGaY7QHn59uaLHKhavs';
// const API_KEY = 'AIzaSyA-j1lC8vyADA6XBglIcklI6zWPAEbABRc';
// const API_KEY = 'AIzaSyDriD3Y8_qxDPEi7GVErhTbArhm4hssz-4';
// const API_KEY = 'AIzaSyAi4nZCXKRLg6h7RBpFV_PKppkrGNRn-20';
const API_KEY = 'AIzaSyCy7GsPnGeRHlshyYBUdwVBsXL3xqTvfKc';
const genAI = new GoogleGenerativeAI(API_KEY);

export class GeminiCareerService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getCareerRecommendation(answers, language) {
    try {
      const prompt = this.buildPrompt(answers, language);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return this.parseResponse(text);
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      throw new Error('Failed to get career recommendation. Please try again.');
    }
  }

  buildPrompt(answers, language) {
    const currentLanguage = language || (typeof localStorage !== 'undefined' ? (localStorage.getItem('language') || 'en') : 'en');
    const userAnswers = Object.entries(answers)
      .map(([id, answer]) => `Q: ${answer.question}\nA: ${answer.selectedOption}`)
      .join('\n\n');

    return `You are an AI career advisor. Based on the following user responses, provide a structured career recommendation.

User Responses:
${userAnswers}

Format your answer exactly like this:

## Recommended Career Category
[Write the broad career field here, e.g.,"Business & Commerce" instead of just "Accounting" , "Software Engineering" instead of just "Frontend Developer", etc]

## Why This Career Category Fits You
[Explain briefly why this general field suits the user's answers]

## Possible Specializations & Fit Percentage
[List top 3 subfields under this career category, and provide a percentage that shows how well the user matches each. 
Example:
- Frontend Development – 80%
- Backend Development – 70%
- Data Engineering – 65% 
]

## Required Core Skills
[List 5-7 foundational skills needed across this career category]

## Steps to Get Started
[Provide 3-5 practical steps the user should take to begin exploring this field]

## Additional Advice
[Provide tips, motivation, and encouragement for exploring the specializations that best match the user's profile]

## Alternative Career Paths
[List 2-3 alternative career paths that might also suit the user's profile with brief explanations]


`;
  } 

  parseResponse(text) {
    try {
      const lines = text.split('\n').filter(line => line.trim());

      let suggestedCareer = '';
      let confidenceLevel = 'Medium';
      const reasons = [];
      let summary = '';
      const roles = [];
      const specializations = [];
      const alternativeCareers = [];

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Handle old format
        if (line.startsWith('Suggested Career:')) {
          suggestedCareer = line.replace('Suggested Career:', '').trim();
        }

        if (line.startsWith('Confidence Level:')) {
          const level = line.replace('Confidence Level:', '').trim().toLowerCase();
          if (level.includes('high')) confidenceLevel = 'High';
          else if (level.includes('low')) confidenceLevel = 'Low';
        }

        if (line.startsWith('Reasons:')) {
          for (let j = i + 1; j < lines.length && lines[j].match(/^\d+\./); j++) {
            reasons.push(lines[j].replace(/^\d+\.\s*/, ''));
          }
        }

        if (line.startsWith('Summary of Why It Fits:')) {
          summary = line.replace('Summary of Why It Fits:', '').trim();
          if (!summary && i + 1 < lines.length) {
            summary = lines[i + 1].trim();
          }
        }

        if (line.toLowerCase().includes('roles')) {
          const parts = line.split(':');
          if (parts.length > 1) {
            parts[1].split(',').forEach(role => roles.push(role.trim()));
          }
        }

        // Handle new format with markdown headings
        if (!suggestedCareer && line.toLowerCase().startsWith('## recommended career')) {
          for (let k = i + 1; k < lines.length; k++) {
            const candidate = lines[k].trim();
            if (candidate && !candidate.startsWith('#')) {
              suggestedCareer = candidate.replace(/^[-*]\s*/, '').trim();
              break;
            }
          }
        }

        if (!summary && line.toLowerCase().startsWith('## why this career')) {
          const collected = [];
          for (let k = i + 1; k < lines.length; k++) {
            const candidate = lines[k].trim();
            if (!candidate || candidate.startsWith('##')) break;
            collected.push(candidate.replace(/^[-*]\s*/, ''));
          }
          if (collected.length > 0) summary = collected.join(' ');
        }

        if (line.toLowerCase().startsWith('## possible specializations') || 
            line.toLowerCase().includes('specializations & fit percentage')) {
          for (let j = i + 1; j < lines.length; j++) {
            const specLine = lines[j].trim();
            if (!specLine || specLine.startsWith('##')) break;
            const specMatch = specLine.match(/^[-*]\s*(.+?)\s*[–-]\s*(\d+)%/);
            if (specMatch) {
              specializations.push({
                name: specMatch[1].trim(),
                percentage: parseInt(specMatch[2], 10)
              });
            }
          }
        }

        if (line.toLowerCase().startsWith('## additional career options') || 
            line.toLowerCase().startsWith('## alternative careers') ||
            line.toLowerCase().startsWith('## alternative career paths')) {
          for (let j = i + 1; j < lines.length; j++) {
            const careerLine = lines[j].trim();
            if (!careerLine || careerLine.startsWith('##')) break;
            const careerMatch = careerLine.match(/^[-*]\s*(.+?)\s*[–-]\s*(\d+)%/);
            if (careerMatch) {
              alternativeCareers.push({
                name: careerMatch[1].trim(),
                matchPercentage: parseInt(careerMatch[2], 10)
              });
            } else if (careerLine.startsWith('-') || careerLine.startsWith('*')) {
              const careerName = careerLine.replace(/^[-*]\s*/, '').trim();
              if (careerName) {
                alternativeCareers.push({
                  name: careerName,
                  matchPercentage: 70
                });
              }
            }
          }
        }
      }

      return {
        suggestedCareer: suggestedCareer || 'Career Exploration Needed',
        confidenceLevel,
        reasons: reasons.length > 0 ? reasons : ['Further exploration is recommended.'],
        summary: summary || 'Explore different options based on your profile.',
        roles,
        specializations,
        alternativeCareers
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        suggestedCareer: 'Career Exploration Needed',
        confidenceLevel: 'Medium',
        reasons: ['Further exploration is recommended.'],
        summary: 'Explore different options based on your profile.',
        roles: [],
        specializations: [],
        alternativeCareers: []
      };
    }
  }

  async getCareerRoadmap(careerTitle, language) {
    try {
      const currentLanguage = language || (typeof localStorage !== 'undefined' ? (localStorage.getItem('language') || 'en') : 'en');
      const prompt = `You are an expert career mentor.
Create a step-by-step learning roadmap for becoming a successful ${careerTitle}, from absolute beginner to advanced.

Requirements:
- KEEP the section headings EXACTLY in English as: "## Beginner", "## Intermediate", "## Advanced"
- KEEP the section labels EXACTLY in English as: "**Topics:**" and "**Resources:**"
- Write the content (topics, resource titles, descriptions) in ${currentLanguage === 'ar' ? 'Arabic' : 'English'}
- Provide REAL, reputable resources with valid URLs (official docs, Coursera, edX, freeCodeCamp, MDN, Khan Academy, etc.)
- Prefer free, high-quality resources when possible

Format EXACTLY like this:
## Beginner
**Topics:**
1. <topic>
2. <topic>
3. <topic>

**Resources:**
1. [resource title](https://link)
2. [resource title](https://link)
3. [resource title](https://link)

## Intermediate
**Topics:**
1. <topic>
2. <topic>
3. <topic>

**Resources:**
1. [resource title](https://link)
2. [resource title](https://link)
3. [resource title](https://link)

## Advanced
**Topics:**
1. <topic>
2. <topic>
3. <topic>

**Resources:**
1. [resource title](https://link)
2. [resource title](https://link)
3. [resource title](https://link)`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error getting roadmap:", error);
      throw new Error("Failed to get career roadmap. Please try again.");
    }
  }
}

export class GeminiChatService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getChatResponse(userMessage, conversationHistory = []) {
    try {
      const prompt = this.buildChatPrompt(userMessage, conversationHistory);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error getting AI chat response:', error);
      throw new Error('Failed to get response. Please try again.');
    }
  }

  buildChatPrompt(userMessage, conversationHistory) {
    const currentLanguage = typeof localStorage !== 'undefined' ? (localStorage.getItem('language') || 'en') : 'en';
    const historyText = conversationHistory
      .slice(-6)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n');

    return `You are an expert AI career advisor and mentor with comprehensive knowledge across ALL career fields and industries. You help students and professionals discover career paths, develop skills, and navigate their professional journey.

Key Guidelines:
- Be conversational, supportive, and encouraging
- Suggest diverse career paths beyond just tech/programming
- Provide specific, actionable advice
- Include salary ranges, growth prospects, and skill requirements when relevant
- Ask follow-up questions to better understand the user's interests
- Draw from your knowledge of ALL industries: healthcare, education, arts, business, trades, sciences, etc.

Language:
- Respond in ${currentLanguage === 'ar' ? 'Arabic' : 'English'}

Previous conversation context:
${historyText}

Current user message: ${userMessage}

Provide a helpful, personalized response that addresses their question while offering valuable career insights. Keep responses concise but informative (2-4 paragraphs max).`;
  }
}

export const geminiChatService = new GeminiChatService();
export const geminiService = new GeminiCareerService();
