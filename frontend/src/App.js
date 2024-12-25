import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [fallingWords, setFallingWords] = useState([]); // Array to store falling words
  const [currentWord, setCurrentWord] = useState(''); // User input
  const [score, setScore] = useState(0); // Score
  const [gameStarted, setGameStarted] = useState(false); // Game state
  const [timer, setTimer] = useState(60); // Timer - 60 seconds
  const [wordIndex, setWordIndex] = useState(0); // Keeps track of the current word index
  const [fallingSpeed, setFallingSpeed] = useState(2); // Falling speed control for difficulty
  const [speedMode, setSpeedMode] = useState('Easy'); // Speed mode for display
  const [fallingInterval, setFallingInterval] = useState(null); // Interval for falling words

  // List of random words
  const randomWords = [
    'apple', 'banana', 'orange', 'grape', 'dragonfruit', 'strawberry', 'pineapple', 
    'kiwi', 'mango', 'watermelon', 'blueberry', 'cherry', 'pear', 'peach', 'apricot', 
    'plum', 'avocado', 'papaya', 'coconut', 'lemon', 'lime', 'melon', 'passionfruit', 
    'nectarine', 'pomegranate', 'cantaloupe', 'fig', 'raspberry', 'blackberry', 'gooseberry',
    'apricot', 'tangerine', 'jackfruit', 'date', 'tomato', 'cucumber', 'carrot', 'onion', 
    'spinach', 'lettuce', 'broccoli', 'zucchini', 'celery', 'peas', 'sweetcorn', 'artichoke',
    'asparagus', 'pumpkin', 'eggplant', 'potato', 'garlic', 'ginger', 'chili', 'parsley'
  ];

  // Fetch words and set them for falling
  useEffect(() => {
    if (gameStarted) {
      const selectedWords = [];
      for (let i = 0; i < 50; i++) {
        const word = randomWords[Math.floor(Math.random() * randomWords.length)];
        selectedWords.push({ text: word, y: 0 });
      }
      setFallingWords(selectedWords);
    }
  }, [gameStarted]);

  // Handle the timer countdown
  useEffect(() => {
    if (gameStarted && timer > 0) {
      const timerInterval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000); // Update the timer every second

      return () => clearInterval(timerInterval);
    } else if (timer === 0) {
      setGameStarted(false); // Stop the game when time runs out
    }
  }, [gameStarted, timer]);

  // Handle word falling effect
  useEffect(() => {
    if (gameStarted && timer > 0) {
      const interval = setInterval(() => {
        setFallingWords(prev =>
          prev.map((word, index) =>
            index === wordIndex
              ? { ...word, y: word.y + fallingSpeed } // Move word down
              : word
          )
        );
      }, 100); // Move word every 100ms

      setFallingInterval(interval); // Save the falling words interval

      // Check if the current word reaches the bottom of the screen
      if (fallingWords[wordIndex]?.y > 90) {
        setWordIndex(prevIndex => prevIndex + 1); // Move to the next word
      }

      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, [gameStarted, fallingWords, wordIndex, fallingSpeed, timer]);

  // Handle user input
  const handleInputChange = (e) => {
    setCurrentWord(e.target.value);

    // Check if the user typed the correct word
    const matchedWord = fallingWords.find(word => word.text === e.target.value);
    if (matchedWord) {
      setScore(prevScore => prevScore + 10);  // Increase score for correct word
      setFallingWords(fallingWords.filter(word => word.text !== matchedWord.text));  // Remove word
      setCurrentWord('');  // Reset input field
      setWordIndex(prevIndex => prevIndex + 1); // Move to the next word
    }
  };

  // Start game
  const handleStart = () => {
    setGameStarted(true);  // Start the game
    setScore(0);  // Reset score
    setTimer(60);  // Reset timer to 60 seconds
    setWordIndex(0);  // Start from the first word
    setSpeedMode('Easy'); // Set default speed mode
  };

  // Stop game
  const handleStop = () => {
    setGameStarted(false);  // Stop the game
    clearInterval(fallingInterval); // Clear falling words interval immediately
  };

  // Difficulty level adjustment
  const setDifficulty = (level) => {
    if (level === 'easy') {
      setFallingSpeed(2); // Slow falling speed
      setSpeedMode('Easy');
    } else if (level === 'medium') {
      setFallingSpeed(4); // Moderate falling speed
      setSpeedMode('Medium');
    } else if (level === 'hard') {
      setFallingSpeed(6); // Fast falling speed
      setSpeedMode('Hard');
    }
  };

  return (
    <div className="game-container">
      <h1>Word Fall</h1>
      <div className="score-timer-container">
        <div className="score">Score: {score}</div>
        <div className="timer">Time: {timer}s</div>
      </div>

      {/* Display Speed Mode */}
      {gameStarted && (
        <div className="speed-mode">
          Speed Mode: {speedMode}
        </div>
      )}

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
            {/* Display falling words in a box */}
            {fallingWords.length > 0 && fallingWords[wordIndex] && (
              <div
                className="falling-word"
                style={{
                  top: `${fallingWords[wordIndex]?.y}%`,
                  left: `50%`, // Fixed horizontal position in the middle
                  transform: 'translateX(-50%)', // Center the word horizontally
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
            disabled={timer === 0} // Disable input after timer ends
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
