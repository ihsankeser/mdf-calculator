// Step3Summary.jsx – Geliþmiþ versiyon

import { useContext, useState, useRef, useEffect } from "react";
import DesignContext from "../contexts/DesignContext";
import { useNavigate } from "react-router-dom";
import WallPreview from "../contexts/WallPreview";
import { createShopifyProduct } from "../utils/createShopifyProduct";
import html2canvas from "html2canvas";
import { Package, FileText, Ruler, MoveVertical, Rows, Columns, Layout, ArrowLeft } from "lucide-react";

function Step3Summary() {
  const navigate = useNavigate();
  const {
    wallWidth,
    wallHeight,
    panelType,
    rows,
    columns,
    totalMetre,
    totalPrice,
    productType,
    setProductType,
    heightOption,
    user,
  } = useContext(DesignContext);

  const [submitted, setSubmitted] = useState(false);
  const svgRef = useRef(null);
  const finalTotalPrice = productType === "digital" ? 15 : (totalPrice ?? 0);

  const generateDrawingImage = async () => {
    if (!svgRef.current) return null;
    const canvas = await html2canvas(svgRef.current);
    return canvas.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
  };

  const handleCreateProduct = async () => {
    const base64Image = await generateDrawingImage();

    const productData = {
      wallWidth,
      wallHeight,
      variants: [
        {
          price: finalTotalPrice.toFixed(2),
          sku: `mdf-${wallWidth}x${wallHeight}-${rows}x${columns}`,
          inventory_management: "shopify",
          inventory_quantity: 1,
        },
      ],
    };

    try {
      const response = await fetch("http://localhost:3000/api/create-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productData,
          base64Image,
          customerName: user.name,
        }),
      });

      const result = await response.json();
      if (result?.product?.id) {
        setSubmitted(true);
        window.location.href = `https://birdeco.myshopify.com/admin/products/${result.product.id}`;
      } else {
        throw new Error("Shopify yanýtý beklenen formatta deðil.");
      }
    } catch (err) {
      console.error("Failed to create product:", err);
      alert("Failed to create product. Please try again.");
    }
  };

  const handleLoginRedirect = () => {
  window.location.href = "https://birdeco.com/account/login?return_url=/pages/new-mdf-calculator";
};


  if (submitted) {
    return (
      <div className="p-8 text-center">
        <p className="text-green-600 font-semibold text-xl">
          ? Product successfully created on Shopify!
        </p>
        <button
          onClick={() => navigate("/step5")}
          className="mt-6 px-6 py-2 bg-teal-700 text-white rounded hover:bg-teal-800"
        >
          Go to Checkout ›
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-8 space-x-0 md:space-x-8 space-y-8 md:space-y-0">
      <div className="w-full md:w-3/5">
        <WallPreview svgRef={svgRef} />
      </div>

      <div className="w-full md:w-2/5 space-y-6">
        <h2 className="text-xl font-bold">Order Summary</h2>

        <div className="space-y-2">
          <p className="font-semibold">Select Product Type</p>
          <div className="flex gap-4">
            <button
              onClick={() => setProductType("physical")}
              className={`flex items-center gap-2 px-4 py-2 border rounded ${productType === "physical" ? "bg-green-600 text-white" : "bg-white"}`}
            >
              <Package className="w-4 h-4" /> Physical Product
            </button>
            <button
              onClick={() => setProductType("digital")}
              className={`flex items-center gap-2 px-4 py-2 border rounded ${productType === "digital" ? "bg-blue-600 text-white" : "bg-white"}`}
            >
              <FileText className="w-4 h-4" /> Digital Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="border rounded p-3 bg-gray-50 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            <span><strong>Wall Width:</strong> {wallWidth} cm</span>
          </div>
          <div className="border rounded p-3 bg-gray-50 flex items-center gap-2">
            <MoveVertical className="w-4 h-4" />
            <span><strong>Wall Height:</strong> {wallHeight} cm</span>
          </div>
          <div className="border rounded p-3 bg-gray-50 flex items-center gap-2">
            <Rows className="w-4 h-4" />
            <span><strong>Rows:</strong> {rows}</span>
          </div>
          <div className="border rounded p-3 bg-gray-50 flex items-center gap-2">
            <Columns className="w-4 h-4" />
            <span><strong>Columns:</strong> {columns}</span>
          </div>
          <div className="border rounded p-3 bg-gray-50 flex items-center gap-2">
            <Layout className="w-4 h-4" />
            <span><strong>Panel Type:</strong> {panelType}</span>
          </div>
          <div className="border rounded p-3 bg-gray-50 flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            <span><strong>Total Length:</strong> {totalMetre.toFixed(2)} m</span>
          </div>
        </div>

        <div className={`mt-4 p-4 border rounded text-sm w-full ${productType === "digital" ? "bg-blue-50" : "bg-gray-100"}`}>
          {productType === "digital" ? (
            <>
              <p className="font-semibold mb-1"><Package className="w-4 h-4" /> Included in Digital Product:</p>
              <ul className="list-disc list-inside">
                <li>Installation guide PDF</li>
                <li>Technical drawing</li>
                <li>Cutting dimensions</li>
              </ul>
            </>
          ) : (
            <>
              <p className="font-semibold mb-1 flex items-center gap-2"><Package className="w-4 h-4" /> Recommended Tools:</p>
              <ul className="list-disc list-inside">
                <li>Strong adhesive</li>
                <li>Spirit level</li>
                <li>Nails and hammer</li>
              </ul>
            </>
          )}
        </div>

        <div className="p-4 border rounded bg-white text-sm">
          <p><strong>Total Price:</strong> ${finalTotalPrice.toFixed(2)}</p>
          <p><strong>Product Type:</strong> {productType === "digital" ? "Digital" : "Physical"}</p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => navigate("/step2")}
            className="flex items-center gap-2 px-6 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          {!user?.name ? (
            <button
              onClick={handleLoginRedirect}
              className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700"
            >
              Login to Continue
            </button>
          ) : (
            <button
              onClick={handleCreateProduct}
              className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800"
            >
              Create Product on Shopify
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step3Summary;