import React, { useState, useEffect } from "react";
import PuzzleGrid from "./PuzzleGrid";
import axios from "axios";

const App = () => {

  const [grid, setGrid] = useState([
    [2, 8, 3],
    [1, 6, 4],
    [7, 0, 5]
  ]);
  const [goal] = useState([
    [1, 2, 3],
    [8, 0, 4],
    [7, 6, 5]
  ]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSolving, setIsSolving] = useState(false);

  const solvePuzzle = async () => {
    try {
      const response = await axios.post("https://eight-puzzle-backend-7f3c.onrender.com/solve", {
        initial: grid,
        goal: goal,
        row: 2,
        col: 1, // Initial blank tile position
      });
      const { success, path } = response.data;
      if (success) {
        setSteps(path);
        setCurrentStep(0);
        setIsSolving(true); // Start automatic animation
      } else {
        alert("Solution not found!");
      }
    } catch (error) {
      console.error("Error solving puzzle:", error);
    }
  };

  useEffect(() => {
    if (isSolving && currentStep < steps.length) {
      const interval = setInterval(() => {
        const direction = steps[currentStep];
        const newGrid = JSON.parse(JSON.stringify(grid));
        let row, col;
        grid.forEach((r, i) =>
          r.forEach((c, j) => {
            if (c === 0) {
              row = i;
              col = j;
            }
          })
        );

        // Apply the next step to the grid
        if (direction === "Left") [newGrid[row][col], newGrid[row][col - 1]] = [newGrid[row][col - 1], newGrid[row][col]];
        if (direction === "Right") [newGrid[row][col], newGrid[row][col + 1]] = [newGrid[row][col + 1], newGrid[row][col]];
        if (direction === "Up") [newGrid[row][col], newGrid[row - 1][col]] = [newGrid[row - 1][col], newGrid[row][col]];
        if (direction === "Down") [newGrid[row][col], newGrid[row + 1][col]] = [newGrid[row + 1][col], newGrid[row][col]];

        setGrid(newGrid); // Update the grid state
        setCurrentStep((prev) => prev + 1); // Move to the next step

        // Stop the interval when all steps are complete
        if (currentStep + 1 >= steps.length) {
          clearInterval(interval);
          setIsSolving(false);
        }
      }, 500); // Delay in milliseconds between steps (adjust as needed)

      return () => clearInterval(interval);
    }
  }, [isSolving, currentStep, steps, grid]);

  return (
    <div>
      <h1>8-Puzzle Visualizer</h1>
      <PuzzleGrid grid={grid} />
      <button onClick={solvePuzzle} disabled={isSolving}>
        {isSolving ? "Solving..." : "Solve Puzzle"}
      </button>
    </div>
  );
};

export default App;
