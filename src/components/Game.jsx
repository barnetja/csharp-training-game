import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

// Server API helpers
async function fetchGlossaryFromServer() {
  try {
    const res = await fetch(`${SERVER_URL}/api/glossary`);
    if (!res.ok) throw new Error('Failed to fetch glossary');
    return await res.json();
  } catch (e) {
    console.warn('Could not fetch glossary from server:', e.message);
    return null;
  }
}

async function syncGlossaryToServer(glossary) {
  try {
    const res = await fetch(`${SERVER_URL}/api/glossary`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(glossary)
    });
    if (!res.ok) throw new Error('Failed to sync glossary');
    return await res.json();
  } catch (e) {
    console.warn('Could not sync glossary to server:', e.message);
  }
}

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
  const [showGlossary, setShowGlossary] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  const initialGlossary = [
    { term: 'class', definition: "A blueprint for objects; defines properties and methods.", examples: [], link: '' },
    { term: 'struct', definition: "A value type used for small data structures; stored on the stack.", examples: [], link: '' },
    { term: 'interface', definition: "Defines a contract of members that implementing types must provide.", examples: [], link: '' },
    { term: 'delegate', definition: "A type-safe function pointer; used for callbacks and events.", examples: [], link: '' },
    { term: 'LINQ', definition: "Language Integrated Query: query syntax for collections and data sources.", examples: [], link: '' },
    { term: 'async/await', definition: "Keywords for asynchronous programming; 'async' marks a method and 'await' pauses until a task completes.", examples: [], link: '' },
    { term: 'Task', definition: "Represents an asynchronous operation, higher-level abstraction than Thread.", examples: [], link: '' },
    { term: 'null-coalescing (??)', definition: "Operator that returns left operand if not null, otherwise the right operand.", examples: [], link: '' },
    { term: 'generics', definition: "Type parameters that allow classes and methods to operate on different types while providing type safety.", examples: [], link: '' },
    { term: 'reflection', definition: "Inspect and manipulate types and metadata at runtime.", examples: [], link: '' },
    { term: 'covariance/contravariance', definition: "Generics features that control how types relate in inheritance positions (out/in).", examples: [], link: '' },
    { term: 'expression-bodied member', definition: "Concise syntax using '=>' for simple methods/properties.", examples: [], link: '' },
    { term: 'namespace', definition: "A container for classes and other types that helps avoid naming collisions.", examples: [], link: '' },
    { term: 'property', definition: "A member that provides a flexible mechanism to read, write, or compute the value of a private field.", examples: [], link: '' },
    { term: 'indexer', definition: "Allows instances of a class or struct to be indexed like arrays.", examples: [], link: '' }
  ];

  const [glossary, setGlossary] = useState(() => {
    try {
      const raw = localStorage.getItem('csharp_glossary');
      return raw ? JSON.parse(raw) : initialGlossary;
    } catch (e) {
      return initialGlossary;
    }
  });

  // Load glossary from server on mount
  useEffect(() => {
    (async () => {
      const serverGlossary = await fetchGlossaryFromServer();
      if (serverGlossary && Array.isArray(serverGlossary) && serverGlossary.length > 0) {
        setGlossary(serverGlossary);
        try {
          localStorage.setItem('csharp_glossary', JSON.stringify(serverGlossary));
        } catch (e) {
          // ignore storage errors
        }
      }
    })();
  }, []);

  // Persist glossary to localStorage AND server on changes
  useEffect(() => {
    try {
      localStorage.setItem('csharp_glossary', JSON.stringify(glossary));
    } catch (e) {
      // ignore storage errors
    }
    // sync to server (fire and forget)
    syncGlossaryToServer(glossary);
  }, [glossary]);

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

  const filteredGlossary = glossary.filter(g =>
    g.term.toLowerCase().includes(glossarySearch.toLowerCase()) ||
    g.definition.toLowerCase().includes(glossarySearch.toLowerCase())
  );

  // Glossary management helpers
  const addTerm = ({ term, definition, link }) => {
    if (!term || !definition) return;
    setGlossary(prev => [{ term, definition, examples: [], link: link || '' }, ...prev]);
    setGlossarySearch('');
  };

  const addExampleToTerm = (index, example) => {
    if (!example) return;
    setGlossary(prev => prev.map((t, i) => i === index ? { ...t, examples: [...t.examples, example] } : t));
  };

  const deleteTerm = (index) => {
    setGlossary(prev => prev.filter((_, i) => i !== index));
  };

  const exportGlossary = () => {
    const data = JSON.stringify(glossary, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glossary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const importGlossaryFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) return;
        // merge without duplicates (by term)
        setGlossary(prev => {
          const map = new Map(prev.map(p => [p.term.toLowerCase(), p]));
          parsed.forEach(p => {
            if (p.term) map.set(p.term.toLowerCase(), { term: p.term, definition: p.definition || '', examples: p.examples || [], link: p.link || '' });
          });
          return Array.from(map.values()).reverse();
        });
      } catch (e) {
        // ignore parse errors
      }
    };
    reader.readAsText(file);
  };

  // CSV export/import helpers
  const exportCSV = () => {
    const rows = [['term', 'definition', 'link', 'examples']];
    glossary.forEach(g => {
      const examples = (g.examples || []).map(e => e.replace(/"/g, '""')).join('|');
      const row = [g.term, g.definition, g.link || '', examples];
      rows.push(row.map(field => `"${(field || '').replace(/"/g, '""')}"`));
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glossary.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const parseCSV = (text) => {
    // Simple CSV parser supporting quoted fields and commas inside quotes
    const lines = [];
    let cur = '';
    let inQuotes = false;
    const rows = [];
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const next = text[i+1];
      if (ch === '"') {
        if (inQuotes && next === '"') { cur += '"'; i++; continue; }
        inQuotes = !inQuotes; continue;
      }
      if (ch === ',' && !inQuotes) { rows.push(cur); cur = ''; continue; }
      if ((ch === '\n' || ch === '\r') && !inQuotes) {
        if (cur !== '' || rows.length) { rows.push(cur); lines.push(rows.slice()); }
        cur = ''; rows.length = 0; continue;
      }
      cur += ch;
    }
    if (cur !== '' || rows.length) { rows.push(cur); lines.push(rows.slice()); }
    return lines.map(r => r.map(cell => cell.trim()));
  };

  const importCSVFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result;
        const parsed = parseCSV(text);
        if (!parsed || parsed.length === 0) return;
        // first row header
        const [header, ...data] = parsed;
        const termIdx = header.findIndex(h => /term/i.test(h));
        const defIdx = header.findIndex(h => /def/i.test(h));
        const linkIdx = header.findIndex(h => /link/i.test(h));
        const exIdx = header.findIndex(h => /example/i.test(h));
        const imported = data.map(row => {
          const term = (row[termIdx] || '').replace(/^"|"$/g, '').trim();
          const definition = (row[defIdx] || '').replace(/^"|"$/g, '').trim();
          const link = (row[linkIdx] || '').replace(/^"|"$/g, '').trim();
          const examplesRaw = (row[exIdx] || '').replace(/^"|"$/g, '').trim();
          const examples = examplesRaw ? examplesRaw.split('|').map(s => s.replace(/""/g, '"')) : [];
          return { term, definition, examples, link };
        }).filter(i => i.term);
        setGlossary(prev => {
          const map = new Map(prev.map(p => [p.term.toLowerCase(), p]));
          imported.forEach(p => map.set(p.term.toLowerCase(), p));
          return Array.from(map.values()).reverse();
        });
      } catch (e) {
        // ignore
      }
    };
    reader.readAsText(file);
  };

  const resetGlossary = () => {
    setGlossary(initialGlossary);
    try { localStorage.removeItem('csharp_glossary'); } catch (e) {}
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

          <div className="mb-4">
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startGame}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Start Game
          </motion.button>
          </div>

          <div className="mb-2">
            <button
              onClick={() => setShowGlossary(true)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg transition"
            >
              View Glossary of C# Terms
            </button>
          </div>
        </motion.div>
          <GlossaryModal
            open={showGlossary}
            onClose={() => setShowGlossary(false)}
            items={filteredGlossary}
            search={glossarySearch}
            setSearch={setGlossarySearch}
            addTerm={addTerm}
            exportGlossary={exportGlossary}
            exportCSV={exportCSV}
            importGlossaryFile={importGlossaryFile}
            importCSVFile={importCSVFile}
            addExampleToTerm={addExampleToTerm}
            deleteTerm={deleteTerm}
            resetGlossary={resetGlossary}
          />
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
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-600">Score: {score}</span>
            <button
              onClick={() => setShowGlossary(true)}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1 rounded"
            >
              Glossary
            </button>
          </div>
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

// Small inline glossary modal component
function GlossaryModal({ open, onClose, items, search, setSearch, addTerm, exportGlossary, exportCSV, importGlossaryFile, importCSVFile, addExampleToTerm, deleteTerm, resetGlossary }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">C# Terms & Definitions</h3>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">Close</button>
        </div>
          <div className="mb-4 flex gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search terms or definitions..."
            className="flex-1 border rounded px-3 py-2"
          />
          <button onClick={exportGlossary} className="px-3 py-2 bg-gray-100 rounded">Export JSON</button>
          <button onClick={exportCSV} className="px-3 py-2 bg-gray-100 rounded">Export CSV</button>
          <label className="px-3 py-2 bg-gray-100 rounded cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" className="hidden" onChange={(e)=> importGlossaryFile(e.target.files && e.target.files[0])} />
          </label>
          <label className="px-3 py-2 bg-gray-100 rounded cursor-pointer">
            Import CSV
            <input type="file" accept="text/csv,application/csv" className="hidden" onChange={(e)=> importCSVFile(e.target.files && e.target.files[0])} />
          </label>
          {!showResetConfirm ? (
            <button onClick={() => setShowResetConfirm(true)} className="px-3 py-2 bg-red-100 text-red-700 rounded">Reset</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => { resetGlossary(); setShowResetConfirm(false); onClose(); }} className="px-3 py-2 bg-red-600 text-white rounded">Yes, reset</button>
              <button onClick={() => setShowResetConfirm(false)} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
            </div>
          )}
        </div>

        {/* Add term form */}
        <AddTermForm onAdd={(t) => addTerm(t)} />
        <div className="space-y-3 max-h-80 overflow-auto">
          {items.length === 0 && <p className="text-gray-600">No terms found.</p>}
                {items.map((g, i) => (
                  <div key={i} className="p-3 border rounded">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-gray-800">{g.term}</div>
                        <div className="text-sm text-gray-700">{g.definition}</div>
                        {g.link && (
                          <div className="text-sm mt-1">
                            <a href={g.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">Docs</a>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <button onClick={() => deleteTerm(i)} className="text-sm text-red-600">Delete</button>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="text-sm font-semibold">Examples</div>
                      {g.examples && g.examples.length === 0 && <div className="text-sm text-gray-500">No examples yet.</div>}
                      {g.examples && g.examples.map((ex, idx) => (
                        <div key={idx} className="text-sm text-gray-700">• {ex}</div>
                      ))}
                      <AddExampleForm onAdd={(example) => addExampleToTerm(i, example)} />
                    </div>
                  </div>
                ))}
        </div>
      </div>
    </div>
  );
}

      // Small helper form to add a term
      function AddTermForm({ onAdd }) {
        const [term, setTerm] = useState('');
        const [definition, setDefinition] = useState('');
        const [link, setLink] = useState('');
        return (
          <div className="mb-4 p-3 border rounded">
            <div className="text-sm font-semibold mb-2">Add Term</div>
            <input value={term} onChange={e=>setTerm(e.target.value)} placeholder="Term" className="w-full border rounded px-2 py-1 mb-2" />
            <input value={definition} onChange={e=>setDefinition(e.target.value)} placeholder="Definition" className="w-full border rounded px-2 py-1 mb-2" />
            <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Optional link (https://...)" className="w-full border rounded px-2 py-1 mb-2" />
            <div className="flex gap-2">
              <button onClick={() => { onAdd({ term: term.trim(), definition: definition.trim(), link: link.trim() }); setTerm(''); setDefinition(''); setLink(''); }} className="px-3 py-1 bg-blue-600 text-white rounded">Add</button>
            </div>
          </div>
        );
      }

      // Small helper form to add an example to a term
      function AddExampleForm({ onAdd }) {
        const [example, setExample] = useState('');
        return (
          <div className="mt-2 flex gap-2">
            <input value={example} onChange={e=>setExample(e.target.value)} placeholder="Add example (one-liner)" className="flex-1 border rounded px-2 py-1" />
            <button onClick={() => { onAdd(example.trim()); setExample(''); }} className="px-3 py-1 bg-gray-100 rounded">Add</button>
          </div>
        );
      }

