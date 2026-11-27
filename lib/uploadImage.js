// Client-side helper: upload an image (File, Blob or data: URL) to
// /api/upload (Cloudinary) and return its URL. Images must never be stored
// in MongoDB as base64 — it bloats every page that shows them.

export async function uploadImage(source, { folder = "portfolio_assets", name = "image.jpg" } = {}) {
  const blob =
    typeof source === "string" && source.startsWith("data:")
      ? await (await fetch(source)).blob()
      : source;

  const form = new FormData();
  form.append("file", blob, blob.name || name);
  form.append("folder", folder);

  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
  return data.url;
}

/** Downscale an image file in the browser (longest side ≤ max) to a JPEG Blob. */
export function resizeImage(file, max = 1200, quality = 0.85) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Could not process image"))),
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}`));
    };
    img.src = url;
  });
}
