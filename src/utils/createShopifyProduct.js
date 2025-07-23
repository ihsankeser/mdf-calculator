

export default async function createShopifyProduct(productData, base64Image, customerName) {
  const res = await fetch("https://shopify-api-server-v2.vercel.app/api/svgToPngShopify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      productData,
      base64Image,
      customerName,
    }),
  });
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Ürün oluşturulamadı");
  }

  return await res.json();
}
