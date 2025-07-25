// Step2PanelDesign.jsx - Updated with Shopify product creation logic

import React, { useContext, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { useNavigate } from "react-router-dom";
import { DesignContext } from "../contexts/DesignContext";
import WallPreviewSVG from "../components/WallPreviewSVG";

export default function Step2PanelDesign() {
  const navigate = useNavigate();
  const previewRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const {
    walls,
    unit,
    totalMetre,
    totalPrice,
    orderMode,
    customer,
    resetDesign,
  } = useContext(DesignContext);

  const handleCreateProduct = async () => {
    if (!customer) {
      window.location.href = "/account/login?return_to=/pages/new-mdf-calculator";
      return;
    }

    setLoading(true);

    try {
      const wallImages = await Promise.all(
        previewRefs.current.map(async (ref) => {
          const canvas = await html2canvas(ref);
          const base64 = canvas.toDataURL("image/png").split(",")[1];
          return { svgContent: `<img src='data:image/png;base64,${base64}' />` };
        })
      );

      const wallDimensions = walls.map((w) => `${w.width}x${w.height}`).join("-");
      const sku = `${customer.first_name.toLowerCase()}-mdf-${walls.length}-${wallDimensions}-${totalMetre.toFixed(2)}`;

      const productData = {
        title: `Custom Wall Molding Kit – ${customer.first_name}’s Layout`,
        body_html:
          "<strong>This product was generated by our Wall Designer Tool.</strong>",
        product_type: "Custom MDF",
        vendor: "Birdeco",
        tags: [
          "mdf wall panels",
          "custom wall panels",
          "wall panel calculator",
          "shaker wall panels",
          "board and batten wall panels",
          "diy wall paneling",
          "half wall panels",
          "wall panel design tool",
          "made to measure wall panels",
          "decorative wall panels",
        ],
        status: "active",
        variants: [
          {
            price: totalPrice.toFixed(2),
            sku,
            inventory_management: "shopify",
            inventory_quantity: 1,
          },
        ],
        collections: ["MDF Wall Panel Calculator"],
      };

      const res = await fetch(
        "https://shopify-api-server-v2.vercel.app/api/createShopifyProduct",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productData,
            customerName: customer.first_name,
            walls: wallImages,
          }),
        }
      );

      const data = await res.json();
      if (data?.product?.handle) {
        window.location.href = `/products/${data.product.handle}`;
      } else {
        alert("Ürün oluşturulamadı.");
      }
    } catch (error) {
      console.error("Ürün oluşturma hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-8">
      {walls.map((wall, index) => (
        <div key={index} className="flex gap-4 items-start">
          <div className="w-[70%] bg-white p-2 shadow rounded">
            <WallPreviewSVG
              ref={(el) => (previewRefs.current[index] = el)}
              wall={wall}
              wallIndex={index}
            />
          </div>
          <div className="w-[30%] bg-gray-50 p-4 rounded shadow text-sm">
            <div className="mb-2 font-semibold text-lg">WALL {index + 1}</div>
            <p>Width: {wall.width} {unit}</p>
            <p>Height: {wall.height} {unit}</p>
            <p>Rows: {wall.rows}</p>
            <p>Columns: {wall.columns}</p>
            <p>Total Length: {totalMetre.toFixed(2)} m</p>
            <p>Estimated Price: ${totalPrice.toFixed(2)}</p>
          </div>
        </div>
      ))}

      <div className="flex gap-4 justify-end mt-6">
        <button
          onClick={resetDesign}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Yeni Tasarım Yap
        </button>
        <button
          disabled={loading}
          onClick={handleCreateProduct}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          {loading ? "Oluşturuluyor..." : "Shopify Ürünü Oluştur"}
        </button>
      </div>
    </div>
  );
}
