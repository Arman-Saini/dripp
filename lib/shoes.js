import { promises as fs } from "fs";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "shoes.json");

export async function getShoes() {
  const file = await fs.readFile(dataFile, "utf8");
  return JSON.parse(file);
}

export async function saveShoes(shoes) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, `${JSON.stringify(shoes, null, 2)}\n`, "utf8");
}

export function normalizeShoe(input) {
  const name = String(input.name || "").trim();
  const brand = String(input.brand || "").trim();
  const description = String(input.description || "").trim();
  const image = String(input.image || "").trim();

  if (!name || !brand || !description || !image) {
    throw new Error("Name, brand, description, and image are required.");
  }

  return {
    id:
      String(input.id || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") ||
      `${name}-${Date.now()}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    name,
    brand,
    description,
    image,
    brandLogo: String(input.brandLogo || "").trim(),
    background: String(input.background || "rgb(211, 190, 153)").trim(),
    titleColor: String(input.titleColor || "beige").trim(),
    brandBackground: String(input.brandBackground || "beige").trim(),
    brandColor: String(input.brandColor || "black").trim(),
    descriptionColor: String(input.descriptionColor || "black").trim(),
    imageFit: input.imageFit === "cover" ? "cover" : "contain",
    imageScale: Number(input.imageScale) || 1,
    imageOffsetY: Number(input.imageOffsetY) || 0,
    shoeAreaWidth: Math.min(Math.max(Number(input.shoeAreaWidth) || 58, 45), 72)
  };
}
