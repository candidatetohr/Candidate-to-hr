import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, ChevronRight, RefreshCcw } from 'lucide-react';
import './SkillAssessmentQuiz.css';

/**
 * SkillAssessmentQuiz Component
 * Increases Dwell Time for SEO by engaging users in a mini-assessment.
 * Renders at the bottom of Roadmap and Career Guide pages.
 */
export default function SkillAssessmentQuiz({ roleId, roleName }) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Generic tech questions adapted slightly by role if needed.
  // In a production app, we would load role-specific questions from JSON.
  const genericQuestions = [
    {
      q: "Which of the following best describes the difference between an Array and a Linked List?",
      options: [
        "Arrays have O(1) random access, Linked Lists have O(n).",
        "Arrays are dynamic in size, Linked Lists are fixed.",
        "Linked lists store elements in contiguous memory locations.",
        "Arrays cannot store objects, only primitives."
      ],
      correct: 0,
      explanation: "Arrays allow O(1) random access via index, whereas Linked Lists require O(n) traversal from the head."
    },
    {
      q: "In version control (Git), what does a 'merge conflict' indicate?",
      options: [
        "The repository server is down and cannot be reached.",
        "Two branches have changed the same part of a file differently.",
        "You do not have permission to push to the branch.",
        "The commit message is formatted incorrectly."
      ],
      correct: 1,
      explanation: "Merge conflicts occur when Git cannot automatically resolve differences in code between two commits."
    },
    {
      q: "What is the primary purpose of a load balancer in system architecture?",
      options: [
        "To compress data before sending it to the client.",
        "To encrypt traffic between the client and server.",
        "To distribute incoming network traffic across multiple servers.",
        "To prevent SQL injection attacks."
      ],
      correct: 2,
      explanation: "A load balancer distributes incoming client requests across multiple servers to ensure no single server becomes overwhelmed."
    }
  ];

  const questions = genericQuestions;

  const handleStart = () => setStarted(true);

  const handleSelect = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    if (idx === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const reset = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedAnswer(null);
  };

  if (!started) {
    return (
      <div className="saq-container card">
        <div className="saq-header text-center">
          <h3 className="text-2xl font-bold mb-8">Ready for {roleName || 'this role'}?</h3>
          <p className="text-secondary mb-24">Take this quick 3-question diagnostic quiz to test your foundational knowledge and see where you stand.</p>
          <button className="btn btn-primary btn-lg" onClick={handleStart}>
            Start Quick Assessment <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="saq-container card text-center">
        <h3 className="text-2xl font-bold mb-8">Assessment Complete!</h3>
        <div className="saq-score-circle mb-24 mx-auto">
          <span className="saq-score-text color-primary text-4xl font-bold">{percentage}%</span>
        </div>
        <p className="text-secondary mb-24">
          {percentage === 100 ? 'Excellent! You have a strong grasp of the fundamentals.' : 
           percentage >= 66 ? 'Good job! Review a few concepts and you will be ready.' : 
           'Keep learning! Use the roadmap above to strengthen your foundation.'}
        </p>
        <button className="btn btn-outline mx-auto flex items-center justify-center gap-8" onClick={reset}>
          <RefreshCcw size={16} /> Retake Assessment
        </button>
      </div>
    );
  }

  const q = questions[currentQuestion];
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="saq-container card">
      <div className="saq-progress mb-16">
        <span className="text-xs font-bold text-secondary uppercase tracking-wider">Question {currentQuestion + 1} of {questions.length}</span>
        <div className="saq-progress-bar mt-8">
          <div className="saq-progress-fill" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
        </div>
      </div>

      <h4 className="text-xl font-bold mb-24">{q.q}</h4>

      <div className="saq-options flex flex-col gap-12">
        {q.options.map((opt, i) => {
          let stateClass = '';
          let Icon = Circle;
          
          if (isAnswered) {
            if (i === q.correct) {
              stateClass = 'saq-correct';
              Icon = CheckCircle2;
            } else if (i === selectedAnswer) {
              stateClass = 'saq-incorrect';
              Icon = AlertCircle;
            } else {
              stateClass = 'saq-dimmed';
            }
          }

          return (
            <button 
              key={i} 
              className={`saq-option text-left w-full flex items-center gap-12 p-16 rounded-lg border ${stateClass || 'saq-default-option'}`}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
            >
              <Icon size={18} className={`saq-option-icon ${stateClass ? '' : 'text-secondary'}`} />
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="saq-explanation mt-24 p-16 bg-slate-800/50 rounded-lg border border-default">
          <p className="font-bold mb-4">{selectedAnswer === q.correct ? '✅ Correct!' : '❌ Incorrect.'}</p>
          <p className="text-sm text-secondary">{q.explanation}</p>
          <button className="btn btn-primary mt-16 flex items-center gap-8" onClick={handleNext}>
            {currentQuestion + 1 === questions.length ? 'See Results' : 'Next Question'} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
