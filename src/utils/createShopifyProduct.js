export async function createShopifyProduct(productData) {
  const response = await fetch("/api/create-product", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });

  if (!response.ok) throw new Error("Failed to create product");
  return await response.json();
}
