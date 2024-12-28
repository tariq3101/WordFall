import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [fallingWords, setFallingWords] = useState([]); 
  const [currentWord, setCurrentWord] = useState(''); 
  const [score, setScore] = useState(0); 
  const [gameStarted, setGameStarted] = useState(false); 
  const [timer, setTimer] = useState(60);
  const [wordIndex, setWordIndex] = useState(0); 
  const [fallingSpeed, setFallingSpeed] = useState(2); 
  const [speedMode, setSpeedMode] = useState('Easy'); 
  const [fallingInterval, setFallingInterval] = useState(null); 

  const randomWords = [
    'apple', 'banana', 'orange', 'grape', 'dragonfruit', 'strawberry', 'pineapple', 
    'kiwi', 'mango', 'watermelon', 'blueberry', 'cherry', 'pear', 'peach', 'apricot', 
    'plum', 'avocado', 'papaya', 'coconut', 'lemon', 'lime', 'melon', 'passionfruit', 
    'nectarine', 'pomegranate', 'cantaloupe', 'fig', 'raspberry', 'blackberry', 'gooseberry',
    'apricot', 'tangerine', 'jackfruit', 'date', 'tomato', 'cucumber', 'carrot', 'onion', 
    'spinach', 'lettuce', 'broccoli', 'zucchini', 'celery', 'peas', 'sweetcorn', 'artichoke',
    'asparagus', 'pumpkin', 'eggplant', 'potato', 'garlic', 'ginger', 'chili', 'parsley'
  ];

  useEffect(() => {
    if (gameStarted) {
      // Initialize falling words
      const selectedWords = [];
      for (let i = 0; i < 50; i++) {
        const word = randomWords[Math.floor(Math.random() * randomWords.length)];
        selectedWords.push({ text: word, y: 0 });
      }
      setFallingWords(selectedWords);
  
      // Start the timer
      const timerInterval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
  
      return () => clearInterval(timerInterval); // Clean up on game stop or unmount
    }
  }, [gameStarted]);
  
  useEffect(() => {
    if (gameStarted && timer > 0) {
      const fallingInterval = setInterval(() => {
        setFallingWords(prev =>
          prev.map((word, index) =>
            index === wordIndex ? { ...word, y: word.y + fallingSpeed } : word
          )
        );
  
        // Check if the current word has fallen out of bounds
        if (fallingWords[wordIndex]?.y > 90) {
          setWordIndex(prevIndex => prevIndex + 1); // Move to the next word
        }
      }, 100);
  
      return () => clearInterval(fallingInterval); // Clean up on game stop or unmount
    }
  
    if (timer === 0) {
      setGameStarted(false); // Stop the game when time runs out
    }
  }, [gameStarted, timer, wordIndex, fallingWords, fallingSpeed]);
  

  // Handle user input
  const handleInputChange = (e) => {
    setCurrentWord(e.target.value);

    // Check if the user typed the correct word
    const matchedWord = fallingWords.find(word => word.text === e.target.value);
    if (matchedWord) {
      setScore(prevScore => prevScore + 10);  
      setFallingWords(fallingWords.filter(word => word.text !== matchedWord.text));  
      setCurrentWord(''); 
      setWordIndex(prevIndex => prevIndex + 1); 
    }
  };

  // Start game
  const handleStart = () => {
    setGameStarted(true);  
    setScore(0);  
    setTimer(60);  
    setWordIndex(0);  
    setSpeedMode('Easy'); 
  };

  // Stop game
  const handleStop = () => {
    setGameStarted(false);  
    clearInterval(fallingInterval); 
  };

  // Difficulty level adjustment
  const setDifficulty = (level) => {
    if (level === 'easy') {
      setFallingSpeed(1); // Slow falling speed
      setSpeedMode('Easy');
    } else if (level === 'medium') {
      setFallingSpeed(2); // Medium falling speed
      setSpeedMode('Medium');
    } else if (level === 'hard') {
      setFallingSpeed(3); // Fast falling speed
      setSpeedMode('Hard');
    }
  };

  return (
    <div className="game-container">
      <h1>WordFall</h1>
      <div className="score-timer-container">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timer}s</div>
      </div>

      {/* Display Speed Mode */}
        <div className="speed-mode">
          Speed Mode: {speedMode}
        </div>

      {/* Difficulty buttons */}
      {!gameStarted && (
        <div className="difficulty-buttons">
          <button onClick={() => setDifficulty('easy')} className="difficulty-btn">Easy</button>
          <button onClick={() => setDifficulty('medium')} className="difficulty-btn">Medium</button>
          <button onClick={() => setDifficulty('hard')} className="difficulty-btn">Hard</button>
        </div>
      )}

      {/* Start button */}
      {!gameStarted && (
        <button onClick={handleStart} className="start-btn">
          Start Game
        </button>
      )}

      {/* Game Display */}
      {gameStarted && (
        <div>
          <div className="falling-words-box">
            {fallingWords.length > 0 && fallingWords[wordIndex] && (
              <div
                className="falling-word"
                style={{
                  top: `${fallingWords[wordIndex]?.y}%`,
                  left: `50%`, 
                  transform: 'translateX(-50%)',
                }}
              >
                {fallingWords[wordIndex]?.text}
              </div>
            )}
          </div>

          {/* Input field */}
          <input
            type="text"
            value={currentWord}
            onChange={handleInputChange}
            placeholder="Type the falling word"
            className="input-field"
            disabled={timer === 0} 
          />
          <button onClick={handleStop} className="stop-btn">
            Stop Game
          </button>
        </div>
      )}

      {/* Display game over message if timer runs out */}
      {gameStarted && timer === 0 && <div className="game-over">Game Over!</div>}
    </div>
  );
};

export default App;
