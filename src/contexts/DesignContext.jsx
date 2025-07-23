import { createContext, useState, useEffect, useContext, useRef } from "react";

const DesignContext = createContext();

export function DesignProvider({ children }) {
  const [wallWidth, setWallWidth] = useState(300);
  const [wallHeight, setWallHeight] = useState(250);
  const [heightOption, setHeightOption] = useState("full");
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalMetre, setTotalMetre] = useState(0);
  const [panelType, setPanelType] = useState("Full");
  const [productType, setProductType] = useState("physical");
  const [walls, setWalls] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [orderMode, setOrderMode] = useState(null);


  const hasLoadedDesign = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (typeof window !== "undefined" && window.shopifyCustomer) {
        const customer = window.shopifyCustomer;
        console.log("✅ Shopify müşteri bulundu:", customer);
        setIsLoggedIn(true);
        setCustomerName(`${customer.first_name} ${customer.last_name}`);
        setCustomerId(customer.id);

        // ✅ Tasarım daha önce yüklenmediyse localStorage'dan al
        if (!hasLoadedDesign.current) {
          const saved = localStorage.getItem("mdfDesign");
          if (saved) {
            try {
              const d = JSON.parse(saved);
              setWallWidth(d.wallWidth || 300);
              setWallHeight(d.wallHeight || 250);
              setHeightOption(d.heightOption || "full");
              setRows(d.rows || 1);
              setColumns(d.columns || 1);
              setTotalPrice(d.totalPrice || 0);
              setTotalMetre(d.totalMetre || 0);
              setPanelType(d.panelType || "Full");
              setProductType(d.productType || "physical");

              hasLoadedDesign.current = true;
              //localStorage.removeItem("mdfDesign");
              console.log("🎯 Tasarım yüklendi ve silindi");
            } catch (err) {
              console.error("Tasarım verisi okunamadı:", err);
            }
          }
        }

        clearInterval(timer); // müşteri bulunduysa tekrar kontrol etme
      }
    }, 200);

    return () => clearInterval(timer);
  }, []);

  return (
    <DesignContext.Provider
      value={{
        wallWidth, setWallWidth,
        wallHeight, setWallHeight,
        heightOption, setHeightOption,
        rows, setRows,
        columns, setColumns,
        totalPrice, setTotalPrice,
        totalMetre, setTotalMetre,
        panelType, setPanelType,
        productType, setProductType,
        isLoggedIn, customerName, customerId,
		walls,  setWalls,
		orderMode, setOrderMode,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export const useDesign = () => useContext(DesignContext);
export default DesignContext;
