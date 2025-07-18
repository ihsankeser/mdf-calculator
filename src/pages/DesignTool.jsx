import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ EKLENDİ
function DesignTool() {
  const [wallWidth, setWallWidth] = useState(300); // cm
  const [wallHeight, setWallHeight] = useState(240); // cm
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const molding = 7.5; // cm
  const pricePerMeter = 7;
  const navigate = useNavigate();

  // Panel boyutları (iç net ölçü)
  const netPanelWidth = (wallWidth - (cols + 1) * molding) / cols;
  const netPanelHeight = (wallHeight - (rows + 1) * molding) / rows;

  // Panelleri oluştur
  const panels = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      panels.push({
        x: c * (netPanelWidth + molding) + molding,
        y: r * (netPanelHeight + molding) + molding,
        width: netPanelWidth,
        height: netPanelHeight,
        key: `${r}-${c}`,
      });
    }
  }

  // Doğru metraj hesaplama (duvardaki çıta sayısına göre)
  const totalLengthCm = ((cols + 1) * wallHeight) + ((rows + 1) * wallWidth);
  const totalMeters = totalLengthCm / 100;
  const totalPrice = totalMeters * pricePerMeter;

  return (
  
  
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shaker Duvar Tasarımı</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block font-medium mb-1">Satır Sayısı</label>
          <input
            type="number"
            className="input"
            value={rows}
            onChange={e => setRows(Number(e.target.value))}
          />
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={rows}
            onChange={e => setRows(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Sütun Sayısı</label>
          <input
            type="number"
            className="input"
            value={cols}
            onChange={e => setCols(Number(e.target.value))}
          />
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={cols}
            onChange={e => setCols(Number(e.target.value))}
            className="w-full mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 my-6">
        <label>
          Duvar Genişliği (cm)
          <input
            type="number"
            className="input"
            value={wallWidth}
            onChange={e => setWallWidth(Number(e.target.value))}
          />
        </label>
        <label>
          Duvar Yüksekliği (cm)
          <input
            type="number"
            className="input"
            value={wallHeight}
            onChange={e => setWallHeight(Number(e.target.value))}
          />
        </label>
      </div>

      <svg
        viewBox={`0 0 ${wallWidth} ${wallHeight}`}
        width="100%"
        className="border bg-gray-300"
        style={{ aspectRatio: `${wallWidth} / ${wallHeight}` }}
      >
        {/* Paneller */}
        {panels.map(panel => (
          <g key={panel.key}>
            <rect
              x={panel.x}
              y={panel.y}
              width={panel.width}
              height={panel.height}
              fill="white"
              stroke="black"
              strokeWidth="0.5"
            />
            <text
              x={panel.x + panel.width / 2}
              y={panel.y + panel.height / 2}
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="5"
              fill="#000"
            >
              {panel.width.toFixed(1)} × {panel.height.toFixed(1)} cm
            </text>
          </g>
        ))}

        {/* Dikey çıtalar */}
        {[...Array(cols - 1)].map((_, i) => {
          const x = (netPanelWidth + molding) * (i + 1);
          return (
            <rect
              key={`v-${i}`}
              x={x}
              y={0}
              width={molding}
              height={wallHeight}
              fill="#ccc"
            />
          );
        })}

        {/* Yatay çıtalar */}
        {[...Array(rows - 1)].map((_, i) => {
          const y = (netPanelHeight + molding) * (i + 1);
          return (
            <rect
              key={`h-${i}`}
              x={0}
              y={y}
              width={wallWidth}
              height={molding}
              fill="#ccc"
            />
          );
        })}

        {/* Kenar çıtalar */}
        <rect x={0} y={0} width={wallWidth} height={molding} fill="#ccc" />
        <rect x={0} y={wallHeight - molding} width={wallWidth} height={molding} fill="#ccc" />
        <rect x={0} y={0} width={molding} height={wallHeight} fill="#ccc" />
        <rect x={wallWidth - molding} y={0} width={molding} height={wallHeight} fill="#ccc" />
      </svg>

            <div className="mt-6 p-4 bg-white rounded shadow text-sm border">
        <p>Toplam çıta uzunluğu: <strong>{totalMeters.toFixed(2)} m</strong></p>
        <p>Birim fiyat: <strong>{pricePerMeter} USD/m</strong></p>
        <p>Toplam fiyat: <strong>{totalPrice.toFixed(2)} USD</strong></p>
      </div>

      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        onClick={() =>
          navigate("/summary", {
            state: {
              wallWidth,
              wallHeight,
              rows,
              cols,
              molding,
              pricePerMeter,
            },
          })
        }
      >
        Özeti Gör
      </button>

	  
    </div>
	
  );
}

export default DesignTool;
