import { useLocation } from "react-router-dom";

function SummaryPage() {
  const location = useLocation();
  const {
    wallWidth,
    wallHeight,
    rows,
    cols,
    molding,
    pricePerMeter,
  } = location.state || {};

  if (!wallWidth || !wallHeight || !rows || !cols) {
    return <div className="p-6">Veriler eksik. Lütfen önce tasarım oluşturun.</div>;
  }

  const netPanelWidth = (wallWidth - (cols + 1) * molding) / cols;
  const netPanelHeight = (wallHeight - (rows + 1) * molding) / rows;

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

  const totalLengthCm = ((cols + 1) * wallHeight) + ((rows + 1) * wallWidth);
  const totalMeters = totalLengthCm / 100;
  const totalPrice = totalMeters * pricePerMeter;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">Tasarım Özeti</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Müşteri Önizleme */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Müşteri Önizleme</h2>
          <svg
            viewBox={`0 0 ${wallWidth} ${wallHeight}`}
            className="border bg-white w-full"
            style={{ aspectRatio: `${wallWidth} / ${wallHeight}` }}
          >
            {/* Paneller */}
            {panels.map(panel => (
              <rect
                key={panel.key}
                x={panel.x}
                y={panel.y}
                width={panel.width}
                height={panel.height}
                fill="white"
                stroke="black"
                strokeWidth="0.5"
              />
            ))}

            {/* Dikey ve Yatay Çıtalar */}
            {[...Array(cols - 1)].map((_, i) => {
              const x = (netPanelWidth + molding) * (i + 1);
              return <rect key={`v-${i}`} x={x} y={0} width={molding} height={wallHeight} fill="#ccc" />;
            })}
            {[...Array(rows - 1)].map((_, i) => {
              const y = (netPanelHeight + molding) * (i + 1);
              return <rect key={`h-${i}`} x={0} y={y} width={wallWidth} height={molding} fill="#ccc" />;
            })}
            {/* Kenar Çıtalar */}
            <rect x={0} y={0} width={wallWidth} height={molding} fill="#ccc" />
            <rect x={0} y={wallHeight - molding} width={wallWidth} height={molding} fill="#ccc" />
            <rect x={0} y={0} width={molding} height={wallHeight} fill="#ccc" />
            <rect x={wallWidth - molding} y={0} width={molding} height={wallHeight} fill="#ccc" />
          </svg>
        </div>

        {/* Teknik Çizim */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Teknik Çizim</h2>
          <svg
            viewBox={`0 0 ${wallWidth + 50} ${wallHeight + 50}`}
            className="border bg-white w-full"
            style={{ aspectRatio: `${wallWidth + 50} / ${wallHeight + 50}` }}
          >
            {/* Paneller + ölçü metni */}
            {panels.map(panel => (
              <g key={panel.key}>
                <rect
                  x={panel.x}
                  y={panel.y}
                  width={panel.width}
                  height={panel.height}
                  fill="none"
                  stroke="black"
                  strokeWidth="0.5"
                />
                {/* Panel ölçüsü */}
                <text
                  x={panel.x + panel.width / 2}
                  y={panel.y - 3}
                  textAnchor="middle"
                  fontSize="4"
                  fill="black"
                >
                  {panel.width.toFixed(1)} cm
                </text>
                <text
                  x={panel.x - 5}
                  y={panel.y + panel.height / 2}
                  textAnchor="end"
                  fontSize="4"
                  fill="black"
                  alignmentBaseline="middle"
                >
                  {panel.height.toFixed(1)} cm
                </text>
              </g>
            ))}

            {/* Dış duvar ölçü okları */}
            {/* Yatay */}
            <line x1="0" y1={wallHeight + 10} x2={wallWidth} y2={wallHeight + 10} stroke="black" />
            <polygon points={`0,${wallHeight + 10} 5,${wallHeight + 7} 5,${wallHeight + 13}`} fill="black" />
            <polygon points={`${wallWidth},${wallHeight + 10} ${wallWidth - 5},${wallHeight + 7} ${wallWidth - 5},${wallHeight + 13}`} fill="black" />
            <text
              x={wallWidth / 2}
              y={wallHeight + 25}
              textAnchor="middle"
              fontSize="5"
              fill="black"
            >
              {wallWidth} cm
            </text>

            {/* Dikey */}
            <line x1={wallWidth + 10} y1="0" x2={wallWidth + 10} y2={wallHeight} stroke="black" />
            <polygon points={`${wallWidth + 10},0 ${wallWidth + 7},5 ${wallWidth + 13},5`} fill="black" />
            <polygon points={`${wallWidth + 10},${wallHeight} ${wallWidth + 7},${wallHeight - 5} ${wallWidth + 13},${wallHeight - 5}`} fill="black" />
            <text
              x={wallWidth + 25}
              y={wallHeight / 2}
              textAnchor="middle"
              fontSize="5"
              fill="black"
              transform={`rotate(90, ${wallWidth + 25}, ${wallHeight / 2})`}
            >
              {wallHeight} cm
            </text>
          </svg>
        </div>
      </div>
	  
	  

      {/* Bilgi Kutusu */}
      <div className="p-4 bg-white rounded shadow text-sm border">
        <p>Duvar Ölçüsü: <strong>{wallWidth} × {wallHeight} cm</strong></p>
        <p>Çıta Kalınlığı: <strong>{molding} cm</strong></p>
        <p>Satır × Sütun: <strong>{rows} × {cols}</strong></p>
        <p>Panel iç ölçüleri: <strong>{netPanelWidth.toFixed(1)} × {netPanelHeight.toFixed(1)} cm</strong></p>
        <p>Toplam çıta uzunluğu: <strong>{totalMeters.toFixed(2)} m</strong></p>
        <p>Birim fiyat: <strong>{pricePerMeter} USD/m</strong></p>
        <p>Toplam fiyat: <strong>{totalPrice.toFixed(2)} USD</strong></p>
      </div>
	  
	  {/* Geri/İleri Butonları */}
      <div className="mt-10 flex justify-between">
        {/* GERİ Butonu */}
        <button
          onClick={() => navigate("/design")} // Geri gitmek istediğin rotaya göre ayarla
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Geri
        </button>

        {/* İLERİ Butonu */}
        <button
          onClick={() => navigate("/checkout")} // Sonraki sayfa örnek
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Siparişi Tamamla →
        </button>
      </div>
	  
	  
	  
	  
    </div>
	


  );
}

export default SummaryPage;
