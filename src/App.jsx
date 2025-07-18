import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Step1Welcome from "./pages/Step1Welcome";
import Step2Design from "./pages/Step2Design";
import Step3Summary from "./pages/Step3Summary";
import SummaryStep from "./pages/SummaryStep";
import Step5Checkout from "./pages/Step5Checkout";
import { DesignProvider } from "./contexts/DesignContext"; // BURASI ÖNEMLİ

function App() {
  return (
    <DesignProvider> {/* Context sağlayıcı burada */}
      <Router>
        <Routes>
          <Route path="/" element={<Step1Welcome />} />
          <Route path="/step2" element={<Step2Design />} />
          <Route path="/step3" element={<Step3Summary />} />
          <Route path="/step4" element={<SummaryStep />} />
          <Route path="/step5" element={<Step5Checkout />} />
        </Routes>
      </Router>
    </DesignProvider>
  );
}

export default App;
