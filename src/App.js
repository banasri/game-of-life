import React, { useState, useEffect } from 'react';
import './Grid.css';
import "bootstrap/dist/css/bootstrap.min.css"
import { letterPatterns } from './LetterPattern';

const App = () => {
  const generateInitialGrid = () => {
    const rows = 30;
    const cols = 30;
    const grid = Array(rows).fill().map(() => Array(cols).fill(0));
    return grid;
  };
  const [grid, setGrid] = useState(generateInitialGrid());
  const [error, setError] = useState("");
  const [btnText, setBtnText] = useState("Start");
  const [isRunning, setIsRunning] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [toggleBtnName, setToggleBtnName] = useState("random");

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(nextGeneration, 500);
    }
    return () => clearInterval(interval);
  }, [isRunning, grid]);


  const generateGridFromName = (name) => {
    const grid = generateInitialGrid();
    const nameLength = name.length;

    const quotient = Math.floor(nameLength / 5);
    for (let i = 0; i <= quotient; i++) {
      for (let j = 0; j < 5; j++) {
        if (i * 5 + j < nameLength) {
          const char = name[i * 5 + j].toUpperCase();
          console.log("char", char);
          const pattern = letterPatterns[char];
          if (pattern) {
            for (let x = 0; x < 5; x++) {
              for (let y = 0; y < 5; y++) {
                grid[x + i * 6][y + j * 6] = pattern[x][y];
              }
            }
          }
        }

      }

    }

    return grid;
  };

  function generateRandomGrid() {
    const rows = 30;
    const cols = 30;
    const array = [];
    for (let i = 0; i < rows; i++) {
      array.push(Array.from({ length: cols }, () => Math.floor(Math.random() * 2)));
    }
    return array;
  }

  const countLiveNeighbors = (grid, x, y) => {
    const directions = [
      [0, 1], [1, 1], [1, 0], [1, -1],
      [0, -1], [-1, -1], [-1, 0], [-1, 1]
    ];
    let count = 0;
    directions.forEach(([dx, dy]) => {
      const newX = x + dx;
      const newY = y + dy;
      if (newX >= 0 && newX < 30 && newY >= 0 && newY < 30) {
        count += grid[newX][newY];
      }
    });
    return count;
  };

  const nextGeneration = () => {
    const newGrid = grid.map((row, x) =>
      row.map((cell, y) => {
        const liveNeighbors = countLiveNeighbors(grid, x, y);
        if (cell === 1) {
          if (liveNeighbors < 2 || liveNeighbors > 3) {
            return 0;
          } else {
            return 1;
          }
        } else {
          if (liveNeighbors === 3) {
            return 1;
          } else {
            return 0;
          }
        }
      })
    );
    setGrid(newGrid);
  };

  const handleStart = () => {
    console.log("playerName", playerName);
    if (toggleBtnName === "yourname" && playerName === "") {
      setError("Enter your name");
      return;
    }
    setIsRunning(true);
    handleToggleStartStop();
  };

  const handleStop = () => {
    setIsRunning(false);
    handleToggleStartStop();
  };

  const handleRandomStart = () => {
    setGrid(generateRandomGrid());
  };

  const handleNameStart = () => {
    setGrid(generateInitialGrid);
    if (playerName) {
      setGrid(generateGridFromName(playerName));
    }
  };

  const handleNameChange = (event) => {
    const name = event.target.value.slice(0, 25);
    setPlayerName(name);
    setToggleBtnName("");
    if (name !== "") {
      setError("");
    }
  };
  const handleToggleChange = (event) => {
    console.log("handleToggleChange");
    console.log("event.target.name", event.target.name);
    setToggleBtnName(event.target.name);
    console.log("toggleBtnName", toggleBtnName);
    if (event.target.name === "random") {
      console.log("setting error");
      setError("");
    }
    setIsRunning(false);
    setBtnText("Start");
  };
  const handleToggleStartStop = () => {
    if (btnText === "Start") {
      setBtnText("Stop");
      setIsRunning(true);
    } else {
      setBtnText("Start");
      setIsRunning(false);
    }

  };

  return (
    <div className="container game-container">
      <div>
        <input
          type="text"
          placeholder="Enter Player Name"
          value={playerName}
          onChange={handleNameChange}
          maxLength={25}
        />
        {error && <p className='error-msg'>{error}</p>}
      </div>
      <p className='heading-label'>Set Intial Loading </p>
      <div className="controls">
        <input type="radio" onClick={handleRandomStart} className="btn-check" name="random" id="random" autoComplete="off" checked={toggleBtnName === "random" ? true : false} onChange={handleToggleChange} />
        <label className="btn btn-outline-success rand-name-label" htmlFor="random">Random</label>

        <input type="radio" onClick={handleNameStart} className="btn-check" name="yourname" id="yourname" autoComplete="off" checked={toggleBtnName === "yourname" ? true : false} onChange={handleToggleChange} />
        <label className="btn btn-outline-danger rand-name-label" htmlFor="yourname">Your Name</label>
      </div>

      {
        btnText === "Start" ? <button type="button" onClick={handleStart} className="btn btn-primary control-btn">Start</button> :
          <button type="button" onClick={handleStop} className="btn btn-primary control-btn">Stop</button>
      }
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`grid-cell ${cell === 1 ? 'alive' : 'dead'}`}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;