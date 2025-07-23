import { useNavigate } from "react-router-dom";
import { useDesign } from "../contexts/DesignContext";
import WallPreview from "../contexts/WallPreview";
import {
  FaRulerCombined,
  FaExpandArrowsAlt,
  FaThLarge,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function Step2PanelDesign() {
  const navigate = useNavigate();
  const { walls } = useDesign();
  const pricePerMetre = 7;

  const getHeightMultiplier = (opt) => {
    if (opt === "three") return 0.75;
    if (opt === "half") return 0.5;
    return 1;
  };

  const parseNum = (val) =>
    typeof val === "string" ? parseFloat(val.replace(",", ".")) : val;

  const calculateWallLength = (wall) => {
    const factor = wall.unit === "inch" ? 2.54 : 1;
    const width = parseNum(wall.width) || 0;
    const height = parseNum(wall.height) || 0;
    const usableHeight = height * factor * getHeightMultiplier(wall.heightOption);
    const usableWidth = width * factor;
    const hLines = wall.rows + 1;
    const vLines = wall.columns + 1;
    return (hLines * usableWidth + vLines * usableHeight) / 100;
  };

  const totalLength = walls.reduce((sum, wall) => sum + calculateWallLength(wall), 0);
  const totalPrice = totalLength * pricePerMetre;

  const handleBack = () => navigate("/step1");
  const handleNext = () => navigate("/step3");

  return (
    <div className="min-h-screen bg-[#EAF0F5] px-4 py-6 flex flex-col items-center">
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Your Panel Summary</h1>

      <div className="w-full max-w-6xl space-y-10">
        {walls.map((wall, index) => {
          const wallLength = calculateWallLength(wall);
          const price = wallLength * pricePerMetre;

          return (
            <div
              key={wall.id}
              className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Left - Wall Preview */}
              <div className="md:w-[70%] w-full p-4 relative">
                <WallPreview wall={wall} />
                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-4 py-1 rounded-full text-sm shadow">
                  WALL {index + 1}
                </div>
              </div>

              {/* Right - Info Boxes */}
              <div className="md:w-[30%] w-full p-4 flex flex-col gap-4 justify-center">
                {/* Width x Height */}
                <div className="flex items-center gap-3 bg-gray-50 rounded shadow p-4">
                  <FaExpandArrowsAlt className="text-emerald-600 text-lg" />
                  <div>
                    <div className="text-xs text-gray-500">Dimensions</div>
                    <div className="font-semibold text-gray-700">
                      {wall.width} × {wall.height} {wall.unit}
                    </div>
                  </div>
                </div>

                {/* Rows x Columns */}
                <div className="flex items-center gap-3 bg-gray-50 rounded shadow p-4">
                  <FaThLarge className="text-emerald-600 text-lg" />
                  <div>
                    <div className="text-xs text-gray-500">Grid</div>
                    <div className="font-semibold text-gray-700">
                      {wall.rows} Rows × {wall.columns} Columns
                    </div>
                  </div>
                </div>

                {/* Total Length */}
                <div className="flex items-center gap-3 bg-gray-50 rounded shadow p-4">
                  <FaRulerCombined className="text-emerald-600 text-lg" />
                  <div>
                    <div className="text-xs text-gray-500">Total Length</div>
                    <div className="font-semibold text-gray-700">
                      {wallLength.toFixed(2)} m
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center gap-3 bg-gray-50 rounded shadow p-4">
                  <FaMoneyBillWave className="text-emerald-600 text-lg" />
                  <div>
                    <div className="text-xs text-gray-500">Estimated Price</div>
                    <div className="font-semibold text-gray-700">${price.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Info */}
      <div className="bg-white mt-10 p-6 rounded-xl shadow max-w-5xl w-full text-right text-gray-800">
        <p>Total Length: <strong>{totalLength.toFixed(2)} m</strong></p>
        <p>Total Price: <strong>${totalPrice.toFixed(2)}</strong></p>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex gap-4">
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
  );
}
