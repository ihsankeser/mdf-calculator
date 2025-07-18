// src/contexts/DesignContext.jsx

import { createContext, useState } from "react";

// 1. Context nesnesi
const DesignContext = createContext();


// 2. Provider bileşeni
export function DesignProvider({ children }) {
  const [wallWidth, setWallWidth] = useState(300);
  const [wallHeight, setWallHeight] = useState(250);
  const [heightOption, setHeightOption] = useState("full");
  const [rows, setRows] = useState(1);
  const [columns, setColumns] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalMetre, setTotalMetre] = useState(0);
 // const [extras, setExtras] = useState([]);
  const [panelType, setPanelType] = useState("Full");
  const [productType, setProductType] = useState("physical");

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
      //  extras, setExtras,
        panelType, setPanelType,
		productType, setProductType
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export default DesignContext;
