import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HashRouter } from "react-router-dom";

const mountApp = () => {
  const rootElement = document.getElementById("wall-calculator-root");

  // ✳️ Shopify yönlendirmesinden gelen "to" parametresini hash'e çevir
  const params = new URLSearchParams(window.location.search);
  const step = params.get("to");
  if (step && !window.location.hash.includes(step)) {
    window.location.hash = `#/${step}`;
  }

  if (rootElement) {
    createRoot(rootElement).render(
      <StrictMode>
        <HashRouter>
          <App />
        </HashRouter>
      </StrictMode>
    );
  }
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mountApp);
} else {
  mountApp();
}
