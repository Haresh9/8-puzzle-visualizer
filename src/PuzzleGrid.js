import React from "react";
import "./PuzzleGrid.css";

const PuzzleGrid = ({ grid }) => {
  return (
    <div className="grid-container">
      {grid.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <div key={`${rowIndex}-${colIndex}`} className="grid-item">
            {tile !== 0 ? tile : ""}
          </div>
        ))
      )}
    </div>
  );
};

export default PuzzleGrid;
