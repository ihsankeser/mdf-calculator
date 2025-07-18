import { useNavigate } from "react-router-dom";

function Step1Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded shadow-md text-center max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Duvar Tasarım Aracına Hoş Geldiniz</h1>
        <p className="mb-6 text-gray-600">
          Bu araçla kendi duvar tasarımınızı oluşturabilir, ölçülerinizi belirleyebilir ve siparişinizi tamamlayabilirsiniz.
        </p>
        <button
          onClick={() => navigate("/step2")}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
        >
          Başla
        </button>
		
		
      </div>
    </div>
  );
}

export default Step1Welcome;
