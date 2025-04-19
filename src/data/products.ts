import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "track-spot",
    name: "Track Spot Light",
    description: "Modern track spot light with adjustable head for focused illumination. Perfect for highlighting artwork, architectural features, or creating directed light in any space.",
    price: 89.99,
    category: "lamp",
    image: "/images/table-lamp.jpg", // Placeholder image
    glbUrl: "/models/Track_Spot_v02.glb",
    usdzUrl: "/models/table-lamp.usdz", // Using as fallback for iOS
    featured: true,
  }
];

// Helper function to find a product by ID
export function getProductById(id: string): Product | null {
  return products.find(product => product.id === id) || null;
}