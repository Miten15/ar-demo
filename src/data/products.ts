import { Product } from "@/types/product";

// Make sure paths are absolute for deployment
export const products: Product[] = [
  {
    id: "lego-light",
    name: "Lego Modern Lamp",
    description: "A playful yet sophisticated lamp with adjustable brightness inspired by modern design aesthetics.",
    price: 79.99,
    glbUrl: "/Light Sample glb Files/Lego.glb",
    usdzUrl: "/models/table-lamp.usdz",
    image: "/images/table-lamp.jpg",
    category: "lamp"
  },
  {
    id: "relic-g-light",
    name: "Relic-G Pendant Light",
    description: "Contemporary hanging pendant light with an elegant glow, perfect for dining areas and modern interiors.",
    price: 129.99,
    glbUrl: "/Light Sample glb Files/Relic-G.glb",
    usdzUrl: "/models/pendant-light.usdz",
    image: "/images/pendant-light.jpg",
    category: "fixture"
  },
  {
    id: "streak-light",
    name: "Streak Smart LED",
    description: "Innovative streak-style LED lighting with app control and voice assistant compatibility.",
    price: 34.99,
    glbUrl: "/Light Sample glb Files/Streak.glb",
    usdzUrl: "/models/smart-bulb.usdz",
    image: "/images/smart-bulb.jpg",
    category: "bulb"
  },
  {
    id: "track-spot-light",
    name: "Track Spot Ceiling Light",
    description: "Adjustable track spot lighting for focused illumination and modern ceiling aesthetics.",
    price: 89.99,
    glbUrl: "/Light Sample glb Files/Track_Spot.glb",
    usdzUrl: "/models/ceiling-tube.usdz",
    image: "/images/ceiling-tube.jpg",
    category: "fixture"
  },
  {
    id: "watcher-light",
    name: "Watcher Wall Fixture",
    description: "Elegant wall-mounted fixture providing ambient lighting with a unique visual appeal.",
    price: 64.99,
    glbUrl: "/Light Sample glb Files/Watcher.glb",
    usdzUrl: "/models/table-lamp.usdz",
    image: "/images/table-lamp.jpg",
    category: "fixture"
  }
];