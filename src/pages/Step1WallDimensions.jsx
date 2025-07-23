import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDesign } from "../contexts/DesignContext";
import WallPreview from "../contexts/WallPreview";

export default function Step1() {
  const navigate = useNavigate();
  const { walls, setWalls } = useDesign();
  const [unit, setUnit] = useState("inch");
  const [openWallId, setOpenWallId] = useState(null);
  const pricePerMetre = 7;

  useEffect(() => {
    if (walls.length === 0) {
      const id = Date.now();
      setWalls([
        {
          id,
          name: "Wall 1",
          width: 200,
          height: 110,
          rows: 1,
          columns: 1,
          heightOption: "full",
          unit,
          thickness: 7.5,
        },
      ]);
      setOpenWallId(id);
    }
  }, []);

  const addNewWall = () => {
    const newId = Date.now();
    const nextIndex = walls.length + 1;
    setWalls([
      ...walls,
      {
        id: newId,
        name: `Wall ${nextIndex}`,
        width: 200,
          height: 110,
        rows: 1,
        columns: 1,
        heightOption: "full",
        unit,
        thickness: 7.5,
      },
    ]);
    setOpenWallId(newId);
  };

  const removeWall = (id) => {
    if (walls.length <= 1) return;
    const updated = walls.filter((w) => w.id !== id);
    setWalls(updated);
    if (openWallId === id && updated.length) {
      setOpenWallId(updated[0].id);
    }
  };

  const handleChange = (id, field, value) => {
    setWalls(
      walls.map((wall) =>
        wall.id === id ? { ...wall, [field]: value } : wall
      )
    );
  };

  const handleUnitChange = (u) => {
    setUnit(u);
    setWalls(
      walls.map((w) => ({
        ...w,
        unit: u,
      }))
    );
  };

  const getHeightMultiplier = (opt) => {
    if (opt === "three") return 0.75;
    if (opt === "half") return 0.5;
    return 1;
  };

  const calculateWallLength = (wall) => {
    const factor = wall.unit === "inch" ? 2.54 : 1;
    const usableHeight = wall.height * factor * getHeightMultiplier(wall.heightOption);
    const usableWidth = wall.width * factor;
    const hLines = wall.rows + 1;
    const vLines = wall.columns + 1;
    return (hLines * usableWidth + vLines * usableHeight) / 100;
  };

  const totalMetre = walls.reduce((sum, w) => sum + calculateWallLength(w), 0);
  const totalPrice = totalMetre * pricePerMetre;

  const handleNext = () => navigate("/step2");
  const handleBack = () => navigate("/choose");

  return (
    <div className="min-h-screen bg-[#EAF0F5] px-4 py-8">
      <div className="max-w-5xl mx-auto mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Wall Design</h1>
        <div className="flex flex-col items-end">
          <label className="text-sm text-gray-600 mb-1">Units:</label>
          <select
            value={unit}
            onChange={(e) => handleUnitChange(e.target.value)}
            className="border rounded px-3 py-2 text-gray-700 bg-white shadow-sm"
          >
            <option value="cm">📏 Centimeters</option>
            <option value="inch">📐 Inches</option>
          </select>
        </div>
      </div>

      <div className="max-w-5xl mx-auto space-y-4">
        {walls.map((wall, index) => {
          const wallLength = calculateWallLength(wall);
          const displayLength =
            wall.unit === "inch"
              ? `${(wallLength / 0.0254).toFixed(2)} in`
              : `${wallLength.toFixed(2)} m`;

          return (
            <div key={wall.id} className="bg-white rounded-2xl shadow relative">
              <button
                className="w-full text-left px-6 py-4 text-lg font-medium text-gray-800 flex justify-between items-center"
                onClick={() => setOpenWallId(openWallId === wall.id ? null : wall.id)}
              >
                {wall.name}
                <span className="text-sm text-gray-500">
                  {openWallId === wall.id ? "▲" : "▼"}
                </span>
              </button>

              {walls.length > 1 && index !== 0 && (
                <button
                  onClick={() => removeWall(wall.id)}
                  className="absolute top-4 right-6 text-red-500 hover:underline"
                >
                  Remove
                </button>
              )}

              {openWallId === wall.id && (
                <div className="border-t px-6 py-4 flex flex-col lg:flex-row gap-8">
                  {/* SVG */}
                  <div className="flex-1 min-w-[60%]">
                    <WallPreview wall={wall} />
                  </div>

                  {/* Form */}
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-2">
                      {[
                        { label: "Full", value: "full" },
                        { label: "Three Quarter", value: "three" },
                        { label: "Half", value: "half" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleChange(wall.id, "heightOption", opt.value)}
                          className={`px-4 py-2 rounded-full border ${
                            wall.heightOption === opt.value
                              ? "bg-emerald-500 text-white"
                              : "bg-white text-gray-600"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Rows</label>
                        <input
                          type="number"
                          value={wall.rows}
                          min={1}
                          onChange={(e) =>
                            handleChange(wall.id, "rows", parseInt(e.target.value))
                          }
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Columns</label>
                        <input
                          type="number"
                          value={wall.columns}
                          min={1}
                          onChange={(e) =>
                            handleChange(wall.id, "columns", parseInt(e.target.value))
                          }
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Width ({unit})</label>
                        <input
                          type="number"
                          step="0.01"
                          value={wall.width}
                          onChange={(e) =>
                            handleChange(wall.id, "width", parseFloat(e.target.value.replace(",", ".")))
                          }
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Height ({unit})</label>
                        <input
                          type="number"
                          step="0.01"
                          value={wall.height}
                          onChange={(e) =>
                            handleChange(wall.id, "height", parseFloat(e.target.value.replace(",", ".")))
                          }
                          className="border rounded px-3 py-2 w-full"
                        />
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 mt-4">
                      Total Length: <strong>{displayLength}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="max-w-5xl mx-auto mt-6 flex flex-col gap-4">
        <button
          onClick={addNewWall}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium px-6 py-2 rounded-full transition self-start"
        >
          + Add Another Wall
        </button>

        <div className="bg-white mt-6 p-4 rounded-xl shadow text-right text-gray-800">
          <p>Total Length: <strong>{totalMetre.toFixed(2)} m</strong></p>
          <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
        </div>

        <div className="flex gap-4 justify-end mt-4">
          <button
            onClick={handleBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
