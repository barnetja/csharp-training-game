import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Game() {
  const allQuestions = [
    // Beginner
    {
      id: 1,
      difficulty: 'beginner',
      question: "What is the correct syntax to declare a variable in C#?",
      options: ["var name;", "variable name;", "declare name;", "int name;"],
      correct: 0,
      explanation: "In C#, you can use 'var' for implicit typing, or 'int', 'string', 'bool', etc. for explicit typing."
    },
    {
      id: 2,
      difficulty: 'beginner',
      question: "Which of the following is a reference type in C#?",
      options: ["int", "string", "bool", "double"],
      correct: 1,
      explanation: "In C#, 'string' is a reference type. int, bool, and double are value types."
    },
    {
      id: 3,
      difficulty: 'beginner',
      question: "What keyword is used to define a class in C#?",
      options: ["class", "Class", "CLASS", "def"],
      correct: 0,
      explanation: "In C#, use the lowercase 'class' keyword to define a class. C# is case-sensitive."
    },
    {
      id: 4,
      difficulty: 'beginner',
      question: "What is the entry point of a C# console application?",
      options: ["main()", "Main()", "Start()", "Begin()"],
      correct: 1,
      explanation: "The 'Main()' method is the entry point for console applications in C#. Note the capital 'M'."
    },
    {
      id: 5,
      difficulty: 'beginner',
      question: "Which namespace is required for basic I/O operations?",
      options: ["System.IO", "System", "IO", "System.Console"],
      correct: 1,
      explanation: "The 'System' namespace is fundamental and covers Console I/O. For file operations, use System.IO."
    },
    // Intermediate
    {
      id: 6,
      difficulty: 'intermediate',
      question: "What does LINQ stand for?",
      options: ["Language Integrated Network Query", "Language Integrated Query", "Library Integrated Query", "Linear Integrated Query"],
      correct: 1,
      explanation: "LINQ stands for Language Integrated Query, a powerful feature in C# for querying data sources."
    },
    {
      id: 7,
      difficulty: 'intermediate',
      question: "How do you define an async method in C#?",
      options: ["function async myMethod()", "async void myMethod()", "async myMethod()", "procedure async myMethod()"],
      correct: 1,
      explanation: "In C#, async methods are defined with the 'async' keyword before the return type (void, Task, Task<T>)."
    },
    {
      id: 8,
      difficulty: 'intermediate',
      question: "What is the purpose of 'null-coalescing operator' (??) in C#?",
      options: ["Combine two strings", "Return left operand if not null, otherwise right", "Check if value is zero", "Compare two values"],
      correct: 1,
      explanation: "The null-coalescing operator (??) returns the left operand if it's not null; otherwise, it returns the right operand."
    },
    {
      id: 9,
      difficulty: 'intermediate',
      question: "What is the difference between 'struct' and 'class' in C#?",
      options: ["No difference", "struct is value type, class is reference type", "struct is public, class is private", "struct is faster always"],
      correct: 1,
      explanation: "Structs are value types (stored on stack), while classes are reference types (stored on heap). This affects memory management and behavior."
    },
    {
      id: 10,
      difficulty: 'intermediate',
      question: "What does the 'yield' keyword do in C#?",
      options: ["Stop execution", "Simplify iterator implementation", "Create threads", "Release memory"],
      correct: 1,
      explanation: "The 'yield' keyword simplifies writing iterator methods, automatically maintaining state between calls."
    },
    // Advanced
    {
      id: 11,
      difficulty: 'advanced',
      question: "What is the difference between 'Task' and 'Thread' in C#?",
      options: ["Same thing", "Task is higher-level abstraction on thread pool", "Thread is better for I/O", "No practical difference"],
      correct: 1,
      explanation: "Task is a higher-level abstraction that uses the ThreadPool, while Thread creates an OS-level thread. Task is generally preferred in modern C#."
    },
    {
      id: 12,
      difficulty: 'advanced',
      question: "What is a 'delegate' in C#?",
      options: ["A class member", "Type-safe function pointer", "An interface", "A loop construct"],
      correct: 1,
      explanation: "A delegate is a type-safe reference type that defines the signature of a method. It's similar to a function pointer in C/C++."
    },
    {
      id: 13,
      difficulty: 'advanced',
      question: "What is the purpose of 'reflection' in C#?",
      options: ["Mirror images", "Inspect/manipulate type information at runtime", "Deep copy objects", "Reverse a string"],
      correct: 1,
      explanation: "Reflection allows you to inspect and manipulate metadata and type information at runtime, enabling dynamic loading and invocation."
    },
    {
      id: 14,
      difficulty: 'advanced',
      question: "What is 'covariance' and 'contravariance' in C# generics?",
      options: ["Same concept", "Covariance allows derived types, contravariance allows base types in variance positions", "Related to math only", "Not supported in C#"],
      correct: 1,
      explanation: "Covariance (out) allows you to use a more derived type, while contravariance (in) allows a more base type in generic type parameters."
    },
    {
      id: 15,
      difficulty: 'advanced',
      question: "What is 'expression-bodied members' in C#?",
      options: ["Members in expressions", "Shorthand syntax for methods/properties using '=>'", "Genetic programming feature", "Performance optimization"],
      correct: 1,
      explanation: "Expression-bodied members use the '=>' operator to define methods or properties in a concise, functional style (introduced in C# 6.0)."
    }
  ];

  const [difficulty, setDifficulty] = useState('beginner');
  const [gameStarted, setGameStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    const filtered = allQuestions.filter(q => q.difficulty === difficulty);
    setQuestions(filtered);
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setGameOver(false);
  };

  const handleAnswer = (index) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    if (index === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setGameStarted(false);
    setDifficulty('beginner');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setGameOver(false);
  };

  if (!gameStarted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">C# Learning Game</h1>
          <p className="text-gray-600 mb-8">Master C# concepts with our interactive quiz!</p>

          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Difficulty</h2>
            <div className="space-y-3">
              {['beginner', 'intermediate', 'advanced'].map((level) => (
                <motion.button
                  key={level}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDifficulty(level)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                    difficulty === level
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                  <span className="text-sm ml-2">
                    ({allQuestions.filter(q => q.difficulty === level).length} questions)
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Start Game
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  if (gameOver) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-2xl p-8 max-w-md text-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Game Over!</h2>
          <p className="text-6xl font-bold text-blue-600 mb-2">{score}/{questions.length}</p>
          <p className="text-gray-600 capitalize mb-2 font-semibold">Difficulty: {difficulty}</p>
          <p className="text-xl text-gray-600 mb-6">
            {score === questions.length
              ? "Perfect score! 🎉"
              : score >= questions.length * 0.8
              ? "Excellent work! 🌟"
              : score >= questions.length * 0.6
              ? "Good effort! 👍"
              : "Keep practicing! 💪"}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={restartGame}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition mb-3"
          >
            Try Another Difficulty
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startGame()}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Play Again
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correct;
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${difficultyColor[difficulty]}`}>
            {difficulty}
          </span>
          <span className="font-semibold text-gray-600">Score: {score}</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1}/{questions.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question */}
        <motion.h2
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-6"
        >
          {question.question}
        </motion.h2>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={answered ? {} : { scale: 1.02 }}
              whileTap={answered ? {} : { scale: 0.98 }}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 text-left rounded-lg font-semibold transition-all ${
                selectedAnswer === index
                  ? isCorrect
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  : answered && index === question.correct
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
              disabled={answered}
            >
              {option}
            </motion.button>
          ))}
        </div>

        {/* Explanation */}
        {answered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-100' : 'bg-yellow-100'}`}
          >
            <p className="text-sm font-semibold text-gray-800">
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'} {question.explanation}
            </p>
          </motion.div>
        )}

        {/* Next Button */}
        {answered && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            {currentQuestion + 1 === questions.length ? 'See Results' : 'Next Question'}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}
