import React, { useContext, useState } from "react";
import DesignContext from "../contexts/DesignContext";
import { createShopifyProduct } from "../utils/createShopifyProduct";
import { useNavigate } from "react-router-dom";

export default function SummaryStep() {
  const {
    wallWidth,
    wallHeight,
    heightOption,
    rows,
    columns,
    totalPrice,
    totalMetre,
    productType,
    panelType,
  } = useContext(DesignContext);

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const finalPrice = productType === "digital" ? 15 : Number(totalPrice.toFixed(2));

  const handleCreateProduct = async () => {
    // Ürün verisi
    const productData = {
      title: `Custom Wall Design - ${wallWidth}x${wallHeight}`,
      body_html: `
        <h2 style="font-size: 16px; font-weight: bold;">🧱 Duvar Tasarımı Özeti</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px; border: 1px solid #ccc;">📐 Duvar Ölçüsü</td><td style="padding: 6px; border: 1px solid #ccc;">${wallWidth} × ${wallHeight} cm</td></tr>
          <tr><td style="padding: 6px; border: 1px solid #ccc;">🧩 Panel Tipi</td><td style="padding: 6px; border: 1px solid #ccc;">${panelType}</td></tr>
          <tr><td style="padding: 6px; border: 1px solid #ccc;">📊 Panel Dizilimi</td><td style="padding: 6px; border: 1px solid #ccc;">${rows} × ${columns}</td></tr>
          <tr><td style="padding: 6px; border: 1px solid #ccc;">📏 Çıta Uzunluğu</td><td style="padding: 6px; border: 1px solid #ccc;">${totalMetre.toFixed(2)} m</td></tr>
          <tr><td style="padding: 6px; border: 1px solid #ccc;">🛍️ Ürün Tipi</td><td style="padding: 6px; border: 1px solid #ccc;">${productType === "digital" ? "Dijital Ürün" : "Fiziksel Ürün"}</td></tr>
        </table>
      `,
      vendor: "Birdeco",
      product_type: "Custom MDF",
      variants: [
        {
          price: finalPrice.toFixed(2),
          sku: `mdf-${wallWidth}x${wallHeight}-${rows}x${columns}`,
          inventory_management: "shopify",
          inventory_quantity: 1,
        },
      ],
      published: true,
    };

    try {
      const result = await createShopifyProduct(productData);
      console.log("Shopify Ürün Oluşturuldu:", result);
      setSubmitted(true);
    } catch (error) {
      console.error("Ürün oluşturulamadı:", error);
      alert("Ürün oluşturulamadı. Lütfen tekrar deneyin.");
    }
  };

  if (submitted) {
    return (
      <div className="p-8 text-center">
        <p className="text-green-600 font-semibold text-xl">
          ✅ Shopify’da ürün başarıyla oluşturuldu!
        </p>
        <button
          onClick={() => navigate("/step5")}
          className="mt-6 px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
        >
          Checkout Sayfasına Git
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <h2 className="text-2xl font-bold">Step 4: Final Kontrol</h2>

      {/* Bilgi kutuları */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="border rounded p-3 bg-gray-50">
          <strong>Wall Width:</strong> {wallWidth} cm
        </div>
        <div className="border rounded p-3 bg-gray-50">
          <strong>Wall Height:</strong> {wallHeight} cm
        </div>
        <div className="border rounded p-3 bg-gray-50">
          <strong>Rows:</strong> {rows}
        </div>
        <div className="border rounded p-3 bg-gray-50">
          <strong>Columns:</strong> {columns}
        </div>
        <div className="border rounded p-3 bg-gray-50">
          <strong>Panel Type:</strong> {panelType}
        </div>
        <div className="border rounded p-3 bg-gray-50">
          <strong>Total Length:</strong> {totalMetre.toFixed(2)} m
        </div>
      </div>

      {/* Fiyat bilgisi */}
      <div className={`mt-4 p-4 border rounded text-sm ${productType === "digital" ? "bg-blue-50" : "bg-gray-100"}`}>
        <p><strong>Toplam Fiyat: ${finalPrice.toFixed(2)}</strong></p>
        <p><strong>Ürün Tipi:</strong> {productType === "digital" ? "Dijital Ürün" : "Fiziksel Ürün"}</p>
      </div>

      {/* Butonlar */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/step3")}
          className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
        >
          ← Geri
        </button>
        <button
          onClick={handleCreateProduct}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          Shopify’da Ürünü Oluştur
        </button>
      </div>
    </div>
  );
}
