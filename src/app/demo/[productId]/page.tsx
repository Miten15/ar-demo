// Server Component
import { products } from "@/data/products";
import ProductPage from "./ProductPage";

// Remove the custom PageProps interface and use proper typing for the component parameters
export default function Page({ params }: { 
  params: { 
    productId: string 
  } 
}) {
  // Find the product on the server
  const product = products.find((p) => p.id === params.productId) || null;
  
  // Pass the product to the client component
  return <ProductPage product={product} productId={params.productId} />;
}