import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  generateQuestionsFromTopic,
  generateQuestionsFromParagraph,
  generateQuestionsFromLearningOutcome,
  QUESTION_TYPES,
  DIFFICULTY_LEVELS
} from '../../services/ai/gemini';
import { saveQuestions } from '../../services/api/question';
import Button from '../common/Buttons/Button';
import Input from '../common/Forms/Input';
import Spinner from '../common/Loading/Spinner';
import Toast from '../common/Notifications/Toast';
import AIOptions from './AIOptions';
import AIQuestionPreview from './AIQuestionPreview';

const AIGenerator = () => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [generationMethod, setGenerationMethod] = useState('topic');
  const [inputText, setInputText] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState(DIFFICULTY_LEVELS.MEDIUM);
  const [selectedTypes, setSelectedTypes] = useState([QUESTION_TYPES.MCQ]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [editingQuestions, setEditingQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter the required input');
      return;
    }

    setLoading(true);
    setError('');
    setGeneratedQuestions([]);

    try {
      let result;
      
      switch (generationMethod) {
        case 'topic':
          result = await generateQuestionsFromTopic(
            inputText,
            questionCount,
            difficulty,
            selectedTypes
          );
          break;
        case 'paragraph':
          result = await generateQuestionsFromParagraph(
            inputText,
            questionCount,
            difficulty,
            selectedTypes
          );
          break;
        case 'learningOutcome':
          result = await generateQuestionsFromLearningOutcome(
            inputText,
            questionCount,
            difficulty,
            selectedTypes
          );
          break;
        default:
          setError('Invalid generation method');
          setLoading(false);
          return;
      }

      if (result.success) {
        setGeneratedQuestions(result.data);
        setEditingQuestions(result.data.map(q => ({ ...q, _edited: false })));
        setSuccess(`Successfully generated ${result.data.length} questions`);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Generation error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestions = async () => {
    if (editingQuestions.length === 0) {
      setError('No questions to save');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const questionsToSave = editingQuestions.map(q => ({
        ...q,
        organizationId: userData.organizationId,
        createdBy: userData.uid,
        isAIGenerated: true,
        status: 'draft',
      }));

      const result = await saveQuestions(questionsToSave);

      if (result.success) {
        setSuccess(`Successfully saved ${result.data.length} questions`);
        setGeneratedQuestions([]);
        setEditingQuestions([]);
        setInputText('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to save questions');
      }
    } catch (error) {
      console.error('Save error:', error);
      setError('An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleQuestionEdit = (index, updatedQuestion) => {
    const newQuestions = [...editingQuestions];
    newQuestions[index] = { ...updatedQuestion, _edited: true };
    setEditingQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = editingQuestions.filter((_, i) => i !== index);
    setEditingQuestions(newQuestions);
  };

  const handleRegenerateQuestion = async (index) => {
    const question = editingQuestions[index];
    // Regenerate a similar question
    setLoading(true);
    try {
      const result = await generateQuestionsFromTopic(
        question.topic || inputText,
        1,
        difficulty,
        [question.type]
      );
      
      if (result.success && result.data.length > 0) {
        const newQuestions = [...editingQuestions];
        newQuestions[index] = { ...result.data[0], _edited: true };
        setEditingQuestions(newQuestions);
      }
    } catch (error) {
      console.error('Regenerate error:', error);
      setError('Failed to regenerate question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <Toast
          type="success"
          message={success}
          duration={3000}
          onClose={() => setSuccess('')}
        />
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          AI Question Generator
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          Generate questions using Google's Gemini AI
        </p>

        <div className="space-y-4">
          {/* Generation Method */}
          <div>
            <label className="label">Generation Method</label>
            <select
              value={generationMethod}
              onChange={(e) => setGenerationMethod(e.target.value)}
              className="input-field"
              disabled={loading || saving}
            >
              <option value="topic">From Topic</option>
              <option value="paragraph">From Paragraph</option>
              <option value="learningOutcome">From Learning Outcome</option>
            </select>
          </div>

          {/* Input */}
          <div>
            <label className="label">
              {generationMethod === 'topic' && 'Topic'}
              {generationMethod === 'paragraph' && 'Paragraph'}
              {generationMethod === 'learningOutcome' && 'Learning Outcome'}
            </label>
            {generationMethod === 'paragraph' ? (
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter the paragraph..."
                className="input-field min-h-[100px]"
                disabled={loading || saving}
              />
            ) : (
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Enter the ${generationMethod}...`}
                className="input-field"
                disabled={loading || saving}
              />
            )}
          </div>

          {/* Options */}
          <AIOptions
            questionCount={questionCount}
            setQuestionCount={setQuestionCount}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            disabled={loading || saving}
          />

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            variant="primary"
            disabled={loading || saving || !inputText.trim()}
            className="w-full"
          >
            {loading ? <Spinner size="sm" /> : 'Generate Questions'}
          </Button>
        </div>
      </div>

      {/* Generated Questions Preview */}
      {editingQuestions.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Generated Questions ({editingQuestions.length})
            </h3>
            <Button
              onClick={handleSaveQuestions}
              variant="success"
              disabled={saving || loading}
            >
              {saving ? <Spinner size="sm" /> : 'Save All Questions'}
            </Button>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {editingQuestions.map((question, index) => (
              <AIQuestionPreview
                key={index}
                question={question}
                index={index}
                onEdit={handleQuestionEdit}
                onRemove={handleRemoveQuestion}
                onRegenerate={handleRegenerateQuestion}
                disabled={saving || loading}
              />
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => {
                setGeneratedQuestions([]);
                setEditingQuestions([]);
              }}
              variant="secondary"
              disabled={saving || loading}
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;