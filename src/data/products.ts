import { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "table-lamp",
    name: "Modern Table Lamp",
    description: "A sleek modern table lamp with adjustable brightness for your home office or bedside table.",
    price: 79.99,
    glbUrl: "/models/table-lamp.glb",
    usdzUrl: "/models/table-lamp.usdz",
    image: "/images/table-lamp.jpg",
    category: "lamp"
  },
  {
    id: "pendant-light",
    name: "Pendant Light Fixture",
    description: "Contemporary hanging pendant light with warm glow, perfect for dining areas.",
    price: 129.99,
    glbUrl: "/models/pendant-light.glb",
    usdzUrl: "/models/pendant-light.usdz",
    image: "/images/pendant-light.jpg",
    category: "fixture"
  },
  {
    id: "smart-bulb",
    name: "Smart LED Bulb",
    description: "Color-changing smart LED bulb with app control and voice assistant compatibility.",
    price: 34.99,
    glbUrl: "/models/smart-bulb.glb",
    usdzUrl: "/models/smart-bulb.usdz",
    image: "/images/smart-bulb.jpg",
    category: "bulb"
  },
  {
    id: "ceiling-tube",
    name: "Linear Ceiling Tube Light",
    description: "Energy-efficient LED tube light with a slim profile for modern interiors.",
    price: 89.99,
    glbUrl: "/models/ceiling-tube.glb",
    usdzUrl: "/models/ceiling-tube.usdz",
    image: "/images/ceiling-tube.jpg",
    category: "tubelight"
  }
];