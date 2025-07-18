export async function createShopifyProduct(productData) {
  const res = await fetch("http://localhost:3000/api/create-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productData }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error("❌ Shopify API Error:", errorBody);
    throw new Error("Shopify API request failed");
  }

  const result = await res.json();
  console.log("✅ Shopify API Success:", result);
  return result;
}
