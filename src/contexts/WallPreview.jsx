import React from "react";

const WallPreview = React.forwardRef(({ wall }, svgRef) => {
  if (!wall) return null;

  const {
    width = 300,
    height = 250,
    heightOption = "full",
    rows = 1,
    columns = 1,
    thickness = 7.5,
    unit = "cm",
  } = wall;

  const unitFactor = unit === "inch" ? 2.54 : 1;
  const wallWidth = width * unitFactor;
  const wallHeight = height * unitFactor;

  const getEffectiveHeight = () => {
    if (heightOption === "half") return wallHeight * 0.5;
    if (heightOption === "threeQuarter" || heightOption === "three") return wallHeight * 0.75;
    return wallHeight;
  };

  const effectiveHeight = getEffectiveHeight();
  const bottomStartY = wallHeight - effectiveHeight;

  const panelWidth = Math.max((wallWidth - (columns + 1) * thickness) / columns, 0);
  const panelHeight = Math.max((effectiveHeight - (rows + 1) * thickness) / rows, 0);

  const moldings = [];
  for (let r = 0; r <= rows; r++) {
    moldings.push({
      x: 0,
      y: bottomStartY + r * (panelHeight + thickness),
      width: wallWidth,
      height: thickness,
    });
  }

  for (let c = 0; c <= columns; c++) {
    moldings.push({
      x: c * (panelWidth + thickness),
      y: bottomStartY,
      width: thickness,
      height: effectiveHeight,
    });
  }

  const panels = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      panels.push({
        x: c * (panelWidth + thickness) + thickness,
        y: bottomStartY + r * (panelHeight + thickness) + thickness,
        width: panelWidth,
        height: panelHeight,
        key: `${r}-${c}`,
      });
    }
  }

  return (
    <div className="border rounded bg-white shadow p-4 mx-auto max-w-[800px]">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${wallWidth + 80} ${wallHeight + 80}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: "100%", height: "auto", maxHeight: "600px", display: "block" }}
      >
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L10,5 L0,10 z" fill="black" />
          </marker>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="5" dy="5" stdDeviation="5" floodColor="#ccc" />
          </filter>
        </defs>

        {/* Dış dikdörtgen */}
        <rect
          x={40}
          y={40}
          width={wallWidth}
          height={wallHeight}
          fill="#f2f2f2"
          stroke="#f2f2f2"
          strokeWidth={thickness}
          filter="url(#shadow)"
        />

        {/* Alt çizgi */}
        <line
          x1={40}
          y1={wallHeight + 50}
          x2={wallWidth + 40}
          y2={wallHeight + 50}
          stroke="black"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <text
          x={wallWidth / 2 + 40}
          y={wallHeight + 65}
          textAnchor="middle"
          fontSize="12"
        >
          {width} {unit}
        </text>

        {/* Yan çizgi */}
        <line
          x1={25}
          y1={40}
          x2={25}
          y2={wallHeight + 40}
          stroke="black"
          markerStart="url(#arrow)"
          markerEnd="url(#arrow)"
        />
        <text
          x={10}
          y={wallHeight / 2 + 40}
          textAnchor="middle"
          fontSize="12"
          transform={`rotate(-90, 10, ${wallHeight / 2 + 40})`}
        >
          {height} {unit}
        </text>

        {/* Moldings */}
        {moldings.map((m, idx) => (
          <rect
            key={`molding-${idx}`}
            x={m.x + 40}
            y={m.y + 40}
            width={m.width}
            height={m.height}
            fill="#987252"
          />
        ))}

        {/* Paneller */}
        {panels.map((panel) => (
          <rect
            key={panel.key}
            x={panel.x + 40}
            y={panel.y + 40}
            width={panel.width}
            height={panel.height}
            fill="#f2f2f2"
            stroke="#333"
            strokeWidth="0.5"
          />
        ))}
      </svg>
    </div>
  );
});

export default WallPreview;
