import React from "react";

export default function WallPreviewSVG({ width, height, rows, columns, heightOption, unit }) {
  if (!width || !height) return null;

  // Ölçü birimi inch ise cm’ye çevir
  const scale = 2; // SVG boyutu için sadeleştirme
  const unitFactor = unit === "inch" ? 2.54 : 1;
  const usableHeight = height * unitFactor * getHeightMultiplier(heightOption);
  const usableWidth = width * unitFactor;

  const svgWidth = usableWidth / scale;
  const svgHeight = usableHeight / scale;

  const rowSpacing = svgHeight / (rows + 1);
  const colSpacing = svgWidth / (columns + 1);

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-64">
      {/* Duvar dış çizgi */}
      <rect
        x={0}
        y={0}
        width={svgWidth}
        height={svgHeight}
        stroke="#94a3b8"
        fill="#f8fafc"
        strokeWidth={1}
        rx={4}
      />

      {/* Yatay çizgiler */}
      {Array.from({ length: rows }, (_, i) => (
        <line
          key={`row-${i}`}
          x1={0}
          x2={svgWidth}
          y1={(i + 1) * rowSpacing}
          y2={(i + 1) * rowSpacing}
          stroke="#cbd5e1"
          strokeDasharray="4"
          strokeWidth={0.6}
        />
      ))}

      {/* Dikey çizgiler */}
      {Array.from({ length: columns }, (_, i) => (
        <line
          key={`col-${i}`}
          y1={0}
          y2={svgHeight}
          x1={(i + 1) * colSpacing}
          x2={(i + 1) * colSpacing}
          stroke="#cbd5e1"
          strokeDasharray="4"
          strokeWidth={0.6}
        />
      ))}

      {/* Alt ve yan ölçü yazısı */}
      <text x={svgWidth / 2} y={svgHeight + 3} fontSize="3" fill="#64748b" textAnchor="middle">
        {width} {unit}
      </text>
      <text
        x={-svgHeight / 2}
        y={-5}
        fontSize="3"
        fill="#64748b"
        textAnchor="middle"
        transform="rotate(-90)"
      >
        {height} {unit}
      </text>
    </svg>
  );
}

function getHeightMultiplier(option) {
  if (option === "three") return 0.75;
  if (option === "half") return 0.5;
  return 1;
}
