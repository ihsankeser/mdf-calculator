export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const productData = req.body;

  try {
    const response = await fetch("https://birdeco.myshopify.com/admin/api/2023-07/products.json", {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product: productData }),
    });

    const result = await response.json();
    res.status(200).json(result);
  } catch (err) {
    console.error("Shopify API Error:", err);
    res.status(500).json({ error: "Failed to create product" });
  }
}
