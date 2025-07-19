export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { productId, collectionId } = req.body;

  try {
    const response = await fetch("https://birdeco.myshopify.com/admin/api/2023-07/collects.json", {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": "b4824b763e03032e7b8e3a22c8f9e6a4", // 💡 token direkt yazıldı
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collect: {
          product_id: productId,
          collection_id: collectionId,
        },
      }),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ Shopify collection error:", err);
    res.status(500).json({ error: "Failed to add product to collection" });
  }
}
