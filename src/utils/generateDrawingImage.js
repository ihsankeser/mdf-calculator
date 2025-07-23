import html2canvas from "html2canvas";

export default async function generateDrawingImage() {
  const element = document.getElementById("design-preview");

  if (!element) {
    console.warn("design-preview elementi bulunamadı.");
    return null;
  }

  try {
    const canvas = await html2canvas(element);
    return canvas.toDataURL("image/png");
  } catch (err) {
    console.error("Resim oluşturulamadı:", err);
    return null;
  }
}
