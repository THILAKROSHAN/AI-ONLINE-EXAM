// Gemini AI Service
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Question types
export const QUESTION_TYPES = {
  MCQ: 'mcq',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  DESCRIPTIVE: 'descriptive',
  PARAGRAPH: 'paragraph',
};

// Difficulty levels
export const DIFFICULTY_LEVELS = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Generate questions based on topic
export const generateQuestionsFromTopic = async (topic, count = 5, difficulty = 'medium', types = ['mcq']) => {
  try {
    const prompt = `Generate ${count} ${difficulty} difficulty questions about "${topic}".
    
    Include these question types: ${types.join(', ')}.
    
    For each question, provide:
    - Question text
    - Type (${types.join(', ')})
    - Difficulty (${difficulty})
    - Options (for MCQ)
    - Correct answer
    - Explanation
    
    Format the response as JSON with this structure:
    {
      "questions": [
        {
          "text": "question text",
          "type": "mcq|true_false|fill_blank|descriptive|paragraph",
          "difficulty": "easy|medium|hard",
          "options": ["option1", "option2", "option3", "option4"], // for MCQ
          "correctAnswer": "correct answer",
          "explanation": "explanation of the answer",
          "topic": "${topic}"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { success: true, data: parsed.questions };
    }
    
    return { success: false, error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('Error generating questions from topic:', error);
    return { success: false, error: error.message };
  }
};

// Generate questions from paragraph
export const generateQuestionsFromParagraph = async (paragraph, count = 5, difficulty = 'medium', types = ['mcq']) => {
  try {
    const prompt = `Read the following paragraph and generate ${count} ${difficulty} difficulty questions based on it.
    
    Paragraph: "${paragraph}"
    
    Include these question types: ${types.join(', ')}.
    
    For each question, provide:
    - Question text
    - Type (${types.join(', ')})
    - Difficulty (${difficulty})
    - Options (for MCQ)
    - Correct answer
    - Explanation
    
    Format the response as JSON with this structure:
    {
      "questions": [
        {
          "text": "question text",
          "type": "mcq|true_false|fill_blank|descriptive|paragraph",
          "difficulty": "easy|medium|hard",
          "options": ["option1", "option2", "option3", "option4"], // for MCQ
          "correctAnswer": "correct answer",
          "explanation": "explanation of the answer",
          "paragraph": "${paragraph.substring(0, 100)}..."
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { success: true, data: parsed.questions };
    }
    
    return { success: false, error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('Error generating questions from paragraph:', error);
    return { success: false, error: error.message };
  }
};

// Generate questions from learning outcome
export const generateQuestionsFromLearningOutcome = async (learningOutcome, count = 5, difficulty = 'medium', types = ['mcq']) => {
  try {
    const prompt = `Generate ${count} ${difficulty} difficulty questions that assess the following learning outcome:
    
    Learning Outcome: "${learningOutcome}"
    
    Include these question types: ${types.join(', ')}.
    
    For each question, provide:
    - Question text
    - Type (${types.join(', ')})
    - Difficulty (${difficulty})
    - Options (for MCQ)
    - Correct answer
    - Explanation
    - Learning outcome assessed
    
    Format the response as JSON with this structure:
    {
      "questions": [
        {
          "text": "question text",
          "type": "mcq|true_false|fill_blank|descriptive|paragraph",
          "difficulty": "easy|medium|hard",
          "options": ["option1", "option2", "option3", "option4"], // for MCQ
          "correctAnswer": "correct answer",
          "explanation": "explanation of the answer",
          "learningOutcome": "${learningOutcome}"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { success: true, data: parsed.questions };
    }
    
    return { success: false, error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('Error generating questions from learning outcome:', error);
    return { success: false, error: error.message };
  }
};

// Generate answer key for questions
export const generateAnswerKey = async (questions) => {
  try {
    const prompt = `Generate an answer key for the following questions:
    
    ${JSON.stringify(questions, null, 2)}
    
    For each question, provide:
    - Question ID or index
    - Correct answer
    - Brief explanation
    
    Format the response as JSON with this structure:
    {
      "answerKey": [
        {
          "questionIndex": 0,
          "correctAnswer": "answer",
          "explanation": "explanation"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { success: true, data: parsed.answerKey };
    }
    
    return { success: false, error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('Error generating answer key:', error);
    return { success: false, error: error.message };
  }
};

// Generate explanation for a question
export const generateExplanation = async (question, answer) => {
  try {
    const prompt = `Provide a detailed explanation for the following question and answer:
    
    Question: ${question}
    Answer: ${answer}
    
    Provide:
    - Step-by-step explanation
    - Key concepts involved
    - Common mistakes to avoid
    - Additional context
    
    Format the response as JSON with this structure:
    {
      "explanation": "detailed explanation",
      "keyConcepts": ["concept1", "concept2"],
      "commonMistakes": ["mistake1", "mistake2"],
      "additionalContext": "additional context"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { success: true, data: parsed };
    }
    
    return { success: false, error: 'Failed to parse AI response' };
  } catch (error) {
    console.error('Error generating explanation:', error);
    return { success: false, error: error.message };
  }
};

// Generate MCQ questions
export const generateMCQ = async (topic, count = 5, difficulty = 'medium') => {
  return await generateQuestionsFromTopic(topic, count, difficulty, ['mcq']);
};

// Generate True/False questions
export const generateTrueFalse = async (topic, count = 5, difficulty = 'medium') => {
  return await generateQuestionsFromTopic(topic, count, difficulty, ['true_false']);
};

// Generate Fill in the Blank questions
export const generateFillBlank = async (topic, count = 5, difficulty = 'medium') => {
  return await generateQuestionsFromTopic(topic, count, difficulty, ['fill_blank']);
};

// Generate Descriptive questions
export const generateDescriptive = async (topic, count = 5, difficulty = 'medium') => {
  return await generateQuestionsFromTopic(topic, count, difficulty, ['descriptive']);
};

// Generate Paragraph questions
export const generateParagraphQuestions = async (paragraph, count = 5, difficulty = 'medium') => {
  return await generateQuestionsFromParagraph(paragraph, count, difficulty, ['paragraph', 'mcq']);
};

// Validate AI generated question
export const validateAIQuestion = (question) => {
  const errors = [];
  
  if (!question.text || question.text.trim().length < 5) {
    errors.push('Question text is too short');
  }
  
  if (!question.type) {
    errors.push('Question type is required');
  }
  
  if (!question.difficulty) {
    errors.push('Difficulty level is required');
  }
  
  if (question.type === 'mcq') {
    if (!question.options || question.options.length < 2) {
      errors.push('MCQ requires at least 2 options');
    }
    if (!question.correctAnswer) {
      errors.push('Correct answer is required for MCQ');
    }
  }
  
  if (['true_false', 'fill_blank', 'descriptive', 'paragraph'].includes(question.type)) {
    if (!question.correctAnswer) {
      errors.push('Correct answer is required');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Format AI question for database
export const formatAIQuestionForDB = (question, organizationId, subjectId, createdBy) => {
  return {
    ...question,
    organizationId,
    subjectId,
    createdBy,
    isAIGenerated: true,
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};