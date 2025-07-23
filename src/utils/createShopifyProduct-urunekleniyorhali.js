async function createShopifyProduct(productData, base64Image, customerName) {
	
  console.log("🔍 Shopify'a gönderilen veri:", {
    productData,
    base64Image: base64Image?.slice(0, 100) + "...",
    customerName
  });

  const response = await fetch("https://shopify-api-server-v2.vercel.app/api/create-product", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ productData, base64Image, customerName })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ Shopify API cevabı:", errorText);
    throw new Error("Ürün oluşturulamadı");
  }

  return await response.json();
}

export default createShopifyProduct;


