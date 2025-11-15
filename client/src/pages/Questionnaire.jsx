import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionnaireService } from '../services/questionnaireService';
import './Questionnaire.css';

const Questionnaire = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const headerRef = useRef(null);
  const questionRef = useRef(null);
  const optionsRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, []);

  useEffect(() => {
    // Removed scroll-triggered animations - content appears immediately
  }, [currentStep]);

  const questions = [
    {
      id: 'purchaseCategories',
      question: 'What types of products or services have you purchased in the past 5 years?',
      type: 'multi-select',
      options: [
        'Electronics (phones, computers, TVs)',
        'Automotive parts or services',
        'Food and beverages',
        'Clothing and accessories',
        'Home and garden products',
        'Health and beauty products',
        'Financial services',
        'Software or digital services',
        'Travel and hospitality',
        'Other'
      ]
    },
    {
      id: 'dataBreach',
      question: 'Have you received any data breach notifications in the past 5 years?',
      type: 'single-select',
      options: ['Yes', 'No', 'Not sure']
    },
    {
      id: 'purchasePeriod',
      question: 'When did you make most of your purchases?',
      type: 'single-select',
      options: [
        '2020-2021',
        '2022-2023',
        '2024-present',
        'Before 2020',
        'Various time periods'
      ]
    },
    {
      id: 'companies',
      question: 'Which companies have you purchased from? (Select all that apply)',
      type: 'multi-select',
      options: [
        'Amazon',
        'Target',
        'Walmart',
        'Best Buy',
        'Tech companies (Apple, Google, Microsoft, etc.)',
        'Auto parts retailers',
        'Food brands',
        'Online retailers',
        'Other major retailers'
      ]
    },
    {
      id: 'issues',
      question: 'Have you experienced any of the following issues?',
      type: 'multi-select',
      options: [
        'Misleading product labeling',
        'Price fixing or overcharging',
        'Warranty issues',
        'False advertising',
        'Data privacy violations',
        'Product defects',
        'Billing errors',
        'None of the above'
      ]
    },
    {
      id: 'notifications',
      question: 'Have you received any class action settlement notifications?',
      type: 'single-select',
      options: ['Yes, multiple', 'Yes, one or two', 'No', 'Not sure']
    },
    {
      id: 'spending',
      question: 'Approximately how much do you spend annually on consumer products?',
      type: 'single-select',
      options: [
        'Less than $1,000',
        '$1,000 - $5,000',
        '$5,000 - $10,000',
        '$10,000 - $25,000',
        'More than $25,000',
        'Prefer not to say'
      ]
    },
    {
      id: 'location',
      question: 'What state do you primarily reside in?',
      type: 'single-select',
      options: [
        'California',
        'New York',
        'Texas',
        'Florida',
        'Illinois',
        'Pennsylvania',
        'Ohio',
        'Other'
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      if (Array.isArray(currentAnswers)) {
        if (currentAnswers.includes(value)) {
          return { ...prev, [questionId]: currentAnswers.filter(a => a !== value) };
        } else {
          return { ...prev, [questionId]: [...currentAnswers, value] };
        }
      } else {
        return { ...prev, [questionId]: value };
      }
    });
  };

  const handleSingleSelect = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await questionnaireService.submit(answers);
      // Store results and navigate to AI matched page
      sessionStorage.setItem('aiMatchResults', JSON.stringify(result));
      navigate('/ai-matched');
    } catch (error) {
      console.error('Failed to submit questionnaire:', error);
      alert('Failed to process questionnaire. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = answers[currentQuestion.id] && 
    (Array.isArray(answers[currentQuestion.id]) ? answers[currentQuestion.id].length > 0 : true);

  return (
    <div className="questionnaire-page">
      <div className="questionnaire-header" ref={headerRef}>
        <h1>AI Settlement Matching</h1>
        <p>Answer a few questions to find settlements you may qualify for</p>
      </div>

      <div className="questionnaire-progress" ref={progressRef}>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="progress-text">
          Question {currentStep + 1} of {questions.length}
        </div>
      </div>

      <div className="questionnaire-content">
        <div className="question-card">
          <h2 className="question-text" ref={questionRef}>{currentQuestion.question}</h2>
          
          {currentQuestion.type === 'multi-select' ? (
            <div className="options-grid" ref={optionsRef}>
              {currentQuestion.options.map((option, index) => {
                const isSelected = Array.isArray(answers[currentQuestion.id]) && 
                  answers[currentQuestion.id].includes(option);
                return (
                  <button
                    key={index}
                    type="button"
                    className={`option-button ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleAnswer(currentQuestion.id, option)}
                  >
                    <span className="option-checkbox">
                      {isSelected ? '✓' : ''}
                    </span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="options-list" ref={optionsRef}>
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  type="button"
                  className={`option-button ${answers[currentQuestion.id] === option ? 'selected' : ''}`}
                  onClick={() => handleSingleSelect(currentQuestion.id, option)}
                >
                  <span className="option-radio">
                    {answers[currentQuestion.id] === option ? '●' : '○'}
                  </span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="questionnaire-actions">
          <button
            type="button"
            className="nav-button back-button"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            ← Back
          </button>
          
          {!isLastStep ? (
            <button
              type="button"
              className="nav-button next-button"
              onClick={handleNext}
              disabled={!canProceed}
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              className="nav-button submit-button"
              onClick={handleSubmit}
              disabled={!canProceed || submitting}
            >
              {submitting ? 'Processing...' : 'Find My Matches'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Questionnaire;

