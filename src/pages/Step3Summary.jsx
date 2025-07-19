import { useContext, useState, useRef, useEffect } from "react";
import DesignContext from "../contexts/DesignContext";
import { useNavigate } from "react-router-dom";
import WallPreview from "../contexts/WallPreview";
import { createShopifyProduct } from "../utils/createShopifyProduct";
import html2canvas from "html2canvas";
import {
  Package,
  FileText,
  Ruler,
  MoveVertical,
  Rows,
  Columns,
  Layout,
  ArrowLeft
} from "lucide-react";

function Step3Summary() {
  const navigate = useNavigate();
  const {
    wallWidth,
    setWallWidth,
    wallHeight,
    setWallHeight,
    panelType,
    setPanelType,
    rows,
    setRows,
    columns,
    setColumns,
    totalMetre,
    setTotalMetre,
    totalPrice,
    setTotalPrice,
    productType,
    setProductType,
    heightOption,
    setHeightOption
  } = useContext(DesignContext);

  const [submitted, setSubmitted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(false);
  const svgRef = useRef(null);

  const finalTotalPrice = productType === "digital" ? 15 : (totalPrice ?? 0);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.shopifyCustomer && window.shopifyCustomer.id) {
        setIsLoggedIn(true);
        setCustomerName(`${window.shopifyCustomer.first_name} ${window.shopifyCustomer.last_name}`);
        setCustomerId(window.shopifyCustomer.id);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error("? Failed to read Shopify customer:", error);
      setIsLoggedIn(false);
    }
  }, []);

  const generateDrawingImage = async () => {
    if (!svgRef.current) return null;
    const canvas = await html2canvas(svgRef.current, {
      scale: 0.8,
    });
    return canvas.toDataURL("image/png");
  };

  const handleLoginRedirect = () => {
    const currentUrl = window.location.href;
    const returnTo = encodeURIComponent(currentUrl);
    window.location.href = `https://birdeco.com/account/login?return_to=${returnTo}`;
  };

  const handleCreateProduct = async () => {
    if (loading) return;
    if (!wallWidth || !wallHeight || !rows || !columns || !totalMetre || !finalTotalPrice) {
      alert("Please complete your wall design before creating the product.");
      return;
    }

    setLoading(true);

    try {
      const image = await generateDrawingImage();

      const shopifyDesc = `Design your dream wall with our MDF Wall Panel Calculator — a powerful tool that lets you customize premium paneling styles like Board & Batten, Shaker, Half-Wall, and MDF Paneling to perfectly match your space.`;

      const productData = {
        title: `Personalized MDF Wall Panel Design – Created for ${customerName}`,
        body_html: `
          <p>${shopifyDesc}</p>
          <h2>?? Wall Design Summary</h2>
          <ul>
            <li>?? Wall Dimensions: ${wallWidth}×${wallHeight} cm</li>
            <li>?? Panel Type: ${panelType}</li>
            <li>?? Panel Layout: ${rows}×${columns}</li>
            <li>?? Total Molding Length: ${totalMetre.toFixed(2)} m</li>
            <li>??? Product Type: ${productType === "digital" ? "Digital" : "Physical"}</li>
          </ul>
        `,
        vendor: "Birdeco",
        product_type: "Custom MDF",
        tags: [
          "mdf wall panels", "custom wall panels", "diy wall paneling", "wall panel calculator",
          "wall panel design tool", "decorative wall panels", "wall panel layout planner",
          "made to measure wall panels", "interior wall panel ideas", "buy mdf wall panels online"
        ],
        images: image ? [{ attachment: image }] : [],
        variants: [
          {
            price: finalTotalPrice.toFixed(2),
            sku: `mdf-${wallWidth}x${wallHeight}-${rows}x${columns}`,
            inventory_management: "shopify",
            inventory_quantity: 1,
          },
        ],
        published: true,
      };

      const result = await createShopifyProduct(productData);
      console.log("? Shopify ürün oluþturuldu:", result);

      // ? Koleksiyona ekle
      const collectionId = "454212223196";
      try {
        await fetch("/api/add-to-collection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: result.product.id,
            collectionId: collectionId,
          }),
        });
        console.log("? Koleksiyona eklendi");
      } catch (e) {
        console.warn("? Koleksiyona eklenemedi:", e);
      }

      // ?? Temizlik
      localStorage.removeItem("designData");
      sessionStorage.clear();
      setWallWidth(0);
      setWallHeight(0);
      setRows(1);
      setColumns(1);
      setTotalMetre(0);
      setTotalPrice(0);
      setPanelType("");
      setProductType("physical");
      setHeightOption("full");

      // ?? Yönlendirme
      if (result?.product?.handle) {
        window.location.href = `https://birdeco.com/products/${result.product.handle}`;
      } else {
        alert("Ürün oluþturuldu ancak yönlendirme yapýlamadý.");
      }

    } catch (err) {
      console.error("? Ürün oluþturulamadý:", err);
      alert("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
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
          {isLoggedIn ? (
            <button
              onClick={handleCreateProduct}
              disabled={loading}
              className={`bg-black text-white px-6 py-3 rounded hover:bg-gray-800 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {loading ? "Creating..." : "Create Product on Shopify"}
            </button>
          ) : (
            <button
              onClick={handleLoginRedirect}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
              Login to continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step3Summary;
