import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import MobileLayout from '@/components/mobile-layout';

interface QuestionnaireData {
  sourceOfIncome?: string;
  annualIncome?: string;
  investmentExperience?: string;
  plannedDeposit?: string;
  investmentGoal?: string;
}

interface Step3QuestionnaireProps {
  onNext: (data: QuestionnaireData) => void;
  onBack: () => void;
  onClose: () => void;
  initialValue?: QuestionnaireData;
}

const questions = [
  {
    id: 'sourceOfIncome',
    title: 'What is your source of income?',
    options: [
      { value: 'employment', label: 'Employment' },
      { value: 'business', label: 'Business' },
      { value: 'investments', label: 'Investments' },
      { value: 'pension', label: 'Pension' },
      { value: 'other', label: 'Other' }
    ]
  },
  {
    id: 'annualIncome',
    title: 'What is your annual income range?',
    options: [
      { value: 'below_10k', label: 'Below $10,000' },
      { value: '10k_50k', label: '$10,000–$50,000' },
      { value: '50k_100k', label: '$50,000–$100,000' },
      { value: 'above_100k', label: 'Above $100,000' }
    ]
  },
  {
    id: 'investmentExperience',
    title: 'What is your experience with investing?',
    options: [
      { value: 'none', label: 'None' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ]
  },
  {
    id: 'plannedDeposit',
    title: 'How much do you plan to deposit?',
    subtitle: 'over the course of this year.',
    options: [
      { value: 'below_500', label: 'Up to $20K' },
      { value: '500_2k', label: '$20K - $50K' },
      { value: '2k_10k', label: '$50K - $200K' },
      { value: 'above_10k', label: '$200K - $500K' },
      { value: 'very_high', label: '$500K - $1M' },
      { value: 'ultra_high', label: 'Above $1M' }
    ]
  },
  {
    id: 'investmentGoal',
    title: 'Which best describes your primary purpose in trading with us?',
    options: [
      { value: 'short_term_returns', label: 'Short-term Returns' },
      { value: 'additional_revenue', label: 'Additional Revenue' },
      { value: 'future_planning', label: 'Future Planning (Children\'s Education, Retirement, etc.)' },
      { value: 'saving_for_home', label: 'Saving for a Home' }
    ]
  }
];

export const Step3Questionnaire: React.FC<Step3QuestionnaireProps> = ({ 
  onNext, 
  onBack, 
  onClose, 
  initialValue 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionnaireData>(initialValue || {});
  const [isLoading, setIsLoading] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = ((currentQuestionIndex + 1) / questions.length) * 0.5 + 0.5; // 50% to 100%

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
  };

  const handleNext = async () => {
    const selectedAnswer = answers[currentQuestion.id as keyof QuestionnaireData];
    if (selectedAnswer) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      
      if (isLastQuestion) {
        onNext(answers);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsLoading(false);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      onBack();
    }
  };

  const selectedAnswer = answers[currentQuestion.id as keyof QuestionnaireData];

  return (
    <MobileLayout hideBottomNav>
      {/* Header - With Questionnaire title */}
      <div className="flex items-center justify-between p-4 bg-[#0a0a2e]">
        <Button variant="ghost" size="sm" onClick={handlePrevious} className="text-white p-0">
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-white text-lg font-semibold">Questionnaire</h1>
        <div className="w-6 h-6"></div> {/* Spacer for centering */}
      </div>

      {/* Progress Bar - Orange color, smaller */}
      <div className="px-4 py-1">
        <div className="w-full bg-gray-700 rounded-full h-1">
          <div className="bg-orange-500 h-1 rounded-full transition-all duration-300" style={{ width: `${progress * 100}%` }}></div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-6">
        {/* Main content area */}
        <div className="flex-1 py-8">
          {/* Question Title - Smaller font */}
          <h2 className="text-base font-medium text-white text-center mb-2">
            {currentQuestion.title}
          </h2>
          
          {currentQuestion.subtitle && (
            <p className="text-gray-400 text-center mb-8 text-xs">
              {currentQuestion.subtitle}
            </p>
          )}

          {/* Crypto Icons for investment goal question */}
          {currentQuestion.id === 'investmentGoal' && (
            <div className="flex justify-center mb-8">
              <div className="flex space-x-2">
                <div className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <span className="text-gray-400 font-bold">Ξ</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <span className="text-gray-400 font-bold">₿</span>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-gray-500 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">XRP</span>
                </div>
              </div>
            </div>
          )}

          {/* Options - Orange accent - No automatic navigation */}
          <div className="space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                disabled={isLoading}
                className={`w-full p-4 rounded-lg text-left transition-all ${
                  selectedAnswer === option.value
                    ? 'bg-gray-700 text-white border-l-4 border-orange-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{option.label}</span>
                  {selectedAnswer === option.value && (
                    <div className="w-5 h-5 text-orange-500">
                      ✓
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spacer for fixed button */}
        <div className="pb-24"></div>
      </div>

      {/* Fixed Bottom Button like home navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 p-4 border-t border-gray-700 z-50">
        <Button 
          onClick={handleNext}
          disabled={!selectedAnswer || isLoading}
          className={`w-full py-4 text-sm font-medium rounded-full ${
            selectedAnswer && !isLoading
              ? 'bg-orange-500 hover:bg-orange-600 text-white' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? "Loading..." : (isLastQuestion ? "Complete" : "Next")}
        </Button>
      </div>
    </MobileLayout>
  );
};