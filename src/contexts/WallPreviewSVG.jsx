// WallPreviewSVG.jsx - Güvenli satır/sütun kontrolü
import React from "react";

const WallPreviewSVG = ({ wall, wallIndex }) => {
  const {
    width = 300,
    height = 250,
    rows = 1,
    columns = 1,
  } = wall || {};

  const safeRows = Math.max(1, parseInt(rows) || 1);
  const safeCols = Math.max(1, parseInt(columns) || 1);

  const cellWidth = width / safeCols;
  const cellHeight = height / safeRows;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className="bg-white border border-gray-300"
    >
      <text x="10" y="20" fontSize="14" fontWeight="bold">WALL {wallIndex + 1}</text>

      {[...Array(safeCols)].map((_, colIdx) => (
        [...Array(safeRows)].map((_, rowIdx) => (
          <rect
            key={`${colIdx}-${rowIdx}`}
            x={colIdx * cellWidth}
            y={rowIdx * cellHeight + 30} // Offset for wall label
            width={cellWidth}
            height={cellHeight}
            fill="none"
            stroke="#555"
            strokeWidth="0.5"
          />
        ))
      ))}
    </svg>
  );
};

export default WallPreviewSVG;
