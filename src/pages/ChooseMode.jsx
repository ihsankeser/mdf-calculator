import { useNavigate } from "react-router-dom";
import { useDesign } from "../contexts/DesignContext";
import {
  FaBoxOpen,
  FaRulerCombined,
  FaTruck,
  FaFilePdf,
  FaDollarSign,
  FaDiagramProject,
} from "react-icons/fa6";

export default function ChooseMode() {
  const navigate = useNavigate();
  const { setOrderMode, setWalls } = useDesign();

  const handleSelect = (mode) => {
    setOrderMode(mode);

    // Yeni oturum için duvarlar temizlensin
    setWalls([]);

    if (mode === "physical") {
      navigate("/step1"); // fiziksel ürünse Step1'e
    } else {
      navigate("/step1"); // dijital için de aynı (ileride ayrıştırılabilir)
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4"
      style={{ backgroundImage: "url('/images/room-bg.jpg')" }}
    >
      <div className="bg-white/40 backdrop-blur-lg rounded-3xl shadow-xl p-6 sm:p-10 flex flex-col md:flex-row w-full max-w-5xl space-y-6 md:space-y-0 md:space-x-6">
        {/* Physical Product */}
        <div className="flex-1 bg-white/60 rounded-2xl p-6 flex flex-col justify-between text-center shadow-md">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Physical Product</h2>
            <ul className="text-gray-700 space-y-3 text-sm sm:text-base text-left mx-auto max-w-xs">
              <li className="flex items-start gap-2"><FaBoxOpen className="text-emerald-500 mt-1" /> Custom wall moulding set</li>
              <li className="flex items-start gap-2"><FaRulerCombined className="text-emerald-500 mt-1" /> Detailed measurement guide</li>
              <li className="flex items-start gap-2"><FaTruck className="text-emerald-500 mt-1" /> Delivered to your door</li>
            </ul>
          </div>
          <button
            onClick={() => handleSelect("physical")}
            className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 rounded-full transition"
          >
            Start Designing
          </button>
        </div>

        {/* Digital Product */}
        <div className="flex-1 bg-white/60 rounded-2xl p-6 flex flex-col justify-between text-center shadow-md">
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Digital Product</h2>
            <ul className="text-gray-700 space-y-3 text-sm sm:text-base text-left mx-auto max-w-xs">
              <li className="flex items-start gap-2"><FaDiagramProject className="text-blue-600 mt-1" /> Tailored technical drawing</li>
              <li className="flex items-start gap-2"><FaFilePdf className="text-blue-600 mt-1" /> Delivered as PDF</li>
              <li className="flex items-start gap-2"><FaDollarSign className="text-blue-600 mt-1" /> Only 15 USD</li>
            </ul>
          </div>
          <button
            onClick={() => handleSelect("digital")}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-full transition"
          >
            Start Designing
          </button>
        </div>
      </div>
    </div>
  );
}
