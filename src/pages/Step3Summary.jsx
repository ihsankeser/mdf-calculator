import { useState, useRef, useEffect } from "react";
import { useDesign } from "../contexts/DesignContext";
import createShopifyProduct from "../utils/createShopifyProduct";
import WallPreview from "../contexts/WallPreview";
import { useNavigate } from "react-router-dom";

export default function Step3Summary() {
  const {
    wallWidth,
    wallHeight,
    heightOption,
    rows,
    columns,
    totalPrice,
    totalMetre,
    panelType,
    productType,
    customerName,
    customerId,
    isLoggedIn,
  } = useDesign();

  const navigate = useNavigate();
  const svgRef = useRef();
  const [loading, setLoading] = useState(false);

  // ? Fake login override
  const fakeCustomerName = "Test User";
  const fakeCustomerId = 1234567890;
  const fakeLoggedIn = true;

  const actualName = customerName || fakeCustomerName;
  const actualId = customerId || fakeCustomerId;
  const loggedIn = isLoggedIn || fakeLoggedIn;

  const handleCreateProduct = async () => {
    setLoading(true);

    const title = `Custom Wall Molding Kit – ${actualName}'s Layout`;

    const productData = {
      title,
      body_html: `
        <p>This product was created using our MDF Wall Panel Calculator.</p>
        <p><strong>Customer:</strong> ${actualName}</p>
        <p><strong>Wall:</strong> ${wallWidth} × ${wallHeight} cm</p>
        <p><strong>Layout:</strong> ${rows} × ${columns}</p>
        <p><strong>Total Length:</strong> ${totalMetre.toFixed(2)} m</p>
        <p><strong>Estimated Price:</strong> $${totalPrice.toFixed(2)}</p>
        <p><strong>Product Type:</strong> ${productType}</p>`,
      product_type: "Custom MDF",
      tags: [
        "mdf wall panels",
        "custom wall panels",
        "wall panel calculator",
        "shaker wall panels",
        "board and batten wall panels",
        "diy wall paneling",
        "half wall panels",
        "made to measure wall panels",
        "decorative wall panels"
      ],
      variants: [
        {
          price: totalPrice?.toFixed(2) || "0.00",
          sku: `${actualName.toLowerCase()}-mdf-1-${wallWidth}x${wallHeight}-${totalMetre.toFixed(2)}`,
          inventory_management: "shopify",
          inventory_quantity: 1,
        },
      ],
    };

    try {
      const svgString = svgRef.current?.outerHTML || "<svg></svg>";
      const result = await createShopifyProduct(productData, svgString, actualName);

      const productHandle = result.product?.handle;
      const productId = result.product?.variants?.[0]?.id;

      if (!productHandle || !productId) throw new Error("Shopify ürün bilgileri eksik");

      const redirectUrl = `https://birdeco.com/products/${productHandle}?variant=${productId}&add-to-cart=${productId}`;
      window.location.href = redirectUrl;
    } catch (err) {
      console.error("? Ürün oluþturma hatasý:", err);
      alert("Ürün oluþturulamadý.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sol */}
      <div className="w-full lg:w-2/3 border p-4" ref={svgRef}>
        <WallPreview />
      </div>

      {/* Sað Panel */}
      <div className="w-full lg:w-1/3 border p-4 space-y-4">
        <h2 className="text-xl font-semibold">Tasarým Özeti</h2>
        <p><strong>Duvar:</strong> {wallWidth} × {wallHeight} cm</p>
        <p><strong>Yükseklik Seçimi:</strong> {heightOption}</p>
        <p><strong>Satýr × Sütun:</strong> {rows} × {columns}</p>
        <p><strong>Panel Tipi:</strong> {panelType}</p>
        <p><strong>Toplam Metre:</strong> {totalMetre.toFixed(2)} m</p>
        <p><strong>Ürün Tipi:</strong> {productType}</p>
        <p><strong>Fiyat:</strong> ${totalPrice.toFixed(2)}</p>
        <p><strong>Müþteri:</strong> {actualName}</p>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/step1")}
            className="flex-1 py-2 px-4 rounded bg-gray-300 hover:bg-gray-400 text-black"
          >
            Yeni Tasarým Yap
          </button>

          <button
            onClick={handleCreateProduct}
            disabled={loading}
            className={`flex-1 py-2 px-4 rounded text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Ürün hazýrlanýyor..." : "Shopify Ürünü Oluþtur"}
          </button>
        </div>
      </div>
    </div>
  );
}
