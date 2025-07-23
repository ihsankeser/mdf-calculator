import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Step1Welcome from "./pages/Step1Welcome";
import Step2Design from "./pages/Step2Design";
import Step3Summary from "./pages/Step3Summary";
import SummaryStep from "./pages/SummaryStep";
import Step5Checkout from "./pages/Step5Checkout";
import LoginRedirect from "./pages/LoginRedirect"; // ✨ login sonrası yönlendirme için
import { DesignProvider } from "./contexts/DesignContext";
import ChooseMode from "./pages/ChooseMode";
import Step1WallDimensions from "./pages/Step1WallDimensions";

function App() {
  // 🔁 Shopify login sonrası ?goto=stepX varsa, o sayfaya yönlendir
  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const to = params.get("to");
  if (to) {
    window.location.replace(`/pages/new-mdf-calculator#/${to}`);
  }
}, []);






  return (
    <DesignProvider>
      <Routes>
	    <Route path="/" element={<ChooseMode />} />
        //<Route path="/" element={<Step1Welcome />} />
		<Route path="/step1" element={<Step1WallDimensions />} />
        <Route path="/step2" element={<Step2Design />} />
        <Route path="/step3" element={<Step3Summary />} />
        <Route path="/step4" element={<SummaryStep />} />
        <Route path="/step5" element={<Step5Checkout />} />
        <Route path="/login-callback" element={<LoginRedirect />} /> {/* ✨ login sonrası */}
      </Routes>
    </DesignProvider>
  );
}

export default App;

