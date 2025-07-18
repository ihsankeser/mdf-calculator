import { useNavigate } from "react-router-dom";

function StepNavigation({ backTo, nextTo }) {
  const navigate = useNavigate();

  return (
    <div className="mt-10 flex justify-between">
      <button
        onClick={() => navigate(backTo)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        ← Geri
      </button>
      <button
        onClick={() => navigate(nextTo)}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
      >
        İleri →
      </button>
    </div>
  );
}

export default StepNavigation;