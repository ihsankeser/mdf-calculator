export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const productData = req.body;

  try {
    const response = await fetch("https://birdeco.myshopify.com/admin/api/2023-07/products.json", {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": "184c790c4dbcefca20ec8cfab41eb55f", // 🔒 Doğrudan token
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: productData }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Shopify API response error:", errorText);
      return res.status(response.status).json({ error: errorText });
    }

    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    console.error("Shopify API Error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
}
