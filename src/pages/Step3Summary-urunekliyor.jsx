import { useState, useRef } from "react";
import { useDesign } from "../contexts/DesignContext";
import createShopifyProduct from "../utils/createShopifyProduct";
import html2canvas from "html2canvas";
import WallPreview from "../contexts/WallPreview";
import { useNavigate } from "react-router-dom";

export default function Step3Summary() {
  const {
    customerName,
    wallWidth,
    wallHeight,
    heightOption,
    rows,
    columns,
    totalMetre,
    totalPrice,
    panelType,
    productType,
    isLoggedIn,
  } = useDesign();

  const navigate = useNavigate();
  const svgRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleCreateProduct = async () => {
    if (!customerName || customerName.trim() === "") {
      alert("Lütfen müþteri adýný girin");
      return;
    }

    setLoading(true);

    const title = `Custom MDF Wall Panel for ${customerName}`;
    const productData = {
      title,
      body_html: `
        <p><strong>Wall Design Summary:</strong></p>
        <ul>
          <li>Wall: ${wallWidth}×${wallHeight} cm</li>
          <li>Panel Type: ${panelType}</li>
          <li>Layout: ${rows}×${columns}</li>
          <li>Total Length: ${totalMetre.toFixed(2)} m</li>
          <li>Product Type: ${productType}</li>
        </ul>`,
      variants: [
        {
          price: totalPrice?.toFixed(2) || "0.00",
          sku: `mdf-${wallWidth}x${wallHeight}-${rows}x${columns}-${totalMetre}`,
          inventory_management: "shopify",
          inventory_quantity: 1,
        },
      ],
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      //const canvas = await html2canvas(svgRef.current);
	  const svgString = svgRef.current?.outerHTML;
      const image = canvas.toDataURL("image/png");

      //const result = await createShopifyProduct(productData, image, customerName);
	  const result = await createShopifyProduct(productData, svgString, customerName);

      const productHandle = result.product?.handle;
      const productId = result.product?.variants?.[0]?.id;

      if (!productHandle || !productId) throw new Error("Shopify ürün bilgileri eksik");

      // ? Ürün oluþturulduktan sonra localStorage temizlenir
      localStorage.removeItem("mdfDesign");

      const redirectUrl = `https://birdeco.com/products/${productHandle}?variant=${productId}&add-to-cart=${productId}`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("? Ürün oluþturma hatasý:", error);
      alert("Ürün oluþturulamadý.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    const design = {
      wallWidth,
      wallHeight,
      heightOption,
      rows,
      columns,
      totalPrice,
      totalMetre,
      panelType,
      productType,
    };
    localStorage.setItem("mdfDesign", JSON.stringify(design));
    window.location.href = "/account/login?checkout_url=/pages/new-mdf-calculator?to=step3";
  };

  const handleNewDesign = () => {
    localStorage.removeItem("mdfDesign");
    navigate("/step1");
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
        <p><strong>Müþteri:</strong> {customerName || "Giriþ yapýlmadý"}</p>

        <div className="flex gap-2">
          <button
            onClick={handleNewDesign}
            className="flex-1 py-2 px-4 rounded bg-gray-300 hover:bg-gray-400 text-black"
          >
            Yeni Tasarým Yap
          </button>

          {isLoggedIn ? (
            <button
              onClick={handleCreateProduct}
              disabled={loading}
              className={`flex-1 py-2 px-4 rounded text-white transition ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              {loading ? "Ürün hazýrlanýyor..." : "Shopify Ürünü Oluþtur"}
            </button>
          ) : (
            <button
              onClick={handleLoginRedirect}
              className="flex-1 py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white"
            >
              Shopify’a Giriþ Yap
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
