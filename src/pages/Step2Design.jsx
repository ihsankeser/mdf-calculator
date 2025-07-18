import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DesignContext from "../contexts/DesignContext";
import WallPreview from "../contexts/WallPreview";

function Step2Design() {
  const navigate = useNavigate();
  const {
    wallWidth,
    setWallWidth,
    wallHeight,
    setWallHeight,
    heightOption,
    setHeightOption,
    rows,
    setRows,
    columns,
    setColumns,
    totalPrice,
    setTotalPrice,
    totalMetre,
    setTotalMetre,
    setPanelType,
  } = useContext(DesignContext);

  const moldingThickness = 7.5;

  const handlePanelTypeChange = (type) => {
    setPanelType(type);
  };

  const getEffectiveHeight = () => {
    if (heightOption === "half") return wallHeight * 0.5;
    if (heightOption === "threeQuarter") return wallHeight * 0.75;
    return wallHeight;
  };

  const effectiveHeight = getEffectiveHeight();
  const bottomStartY = wallHeight - effectiveHeight;

  const panelWidth = Math.max((wallWidth - (columns + 1) * moldingThickness) / columns, 0);
  const panelHeight = Math.max((effectiveHeight - (rows + 1) * moldingThickness) / rows, 0);

  useEffect(() => {
    const heightFactor =
      heightOption === "half"
        ? 0.5
        : heightOption === "threeQuarter"
        ? 0.75
        : 1;
    const totalVerticalLength = (columns + 1) * wallHeight * heightFactor;
    const totalHorizontalLength = (rows + 1) * wallWidth;
    const metre = (totalVerticalLength + totalHorizontalLength) / 100;

    if (typeof setTotalMetre === "function") {
      setTotalMetre(metre);
    }
    if (typeof setTotalPrice === "function") {
      setTotalPrice(metre * 7);
    }
  }, [wallWidth, wallHeight, rows, columns, heightOption]);

  return (
    <div className="flex flex-col md:flex-row p-8 space-x-0 md:space-x-8 space-y-8 md:space-y-0">
      <div className="w-full md:w-3/5">
        <div className="border rounded bg-white p-4 shadow">
          <WallPreview />
        </div>
      </div>

      <div className="w-full md:w-2/5 space-y-6">
        <h2 className="text-xl font-bold">Step 2: Create your panel design</h2>

        <div className="space-y-2">
          <label className="font-semibold">Height</label>
          <div className="flex space-x-2">
            {["full", "threeQuarter", "half"].map((option) => (
              <button
                key={option}
                onClick={() => {
                  setHeightOption(option);
                  handlePanelTypeChange(
                    option === "full"
                      ? "Full"
                      : option === "threeQuarter"
                      ? "Three Quarter"
                      : "Half"
                  );
                }}
                className={`px-4 py-2 border rounded ${
                  heightOption === option
                    ? "bg-teal-700 text-white"
                    : "bg-white text-black"
                }`}
              >
                {option.charAt(0).toUpperCase() +
                  option.slice(1).replace("Quarter", " Quarter")}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="font-semibold">Rows</label>
            <div className="flex space-x-2 items-center">
              <button
                onClick={() => setRows((prev) => Math.max(prev - 1, 1))}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                −
              </button>
              <span>{rows}</span>
              <button
                onClick={() => setRows((prev) => prev + 1)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="font-semibold">Columns</label>
            <div className="flex space-x-2 items-center">
              <button
                onClick={() => setColumns((prev) => Math.max(prev - 1, 1))}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                −
              </button>
              <span>{columns}</span>
              <button
                onClick={() => setColumns((prev) => prev + 1)}
                className="bg-gray-200 px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="font-semibold">Wall Width (cm)</label>
            <input
              type="number"
              value={wallWidth}
              onChange={(e) => setWallWidth(Number(e.target.value))}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="font-semibold">Wall Height (cm)</label>
            <input
              type="number"
              value={wallHeight}
              onChange={(e) => setWallHeight(Number(e.target.value))}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>

        <div className="mt-4 p-4 border rounded bg-gray-100 text-sm">
          <p>
            Total Length: <strong>{(totalMetre || 0).toFixed(2)} m</strong>
          </p>
          <p>
            Total Price: <strong>${(totalPrice || 0).toFixed(2)}</strong>
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/")}
            className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/step3")}
            className="bg-teal-700 text-white px-6 py-2 rounded hover:bg-teal-800"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Step2Design;
