// Server Component
import { products } from "@/data/products";
import ProductPage from "./ProductPage";

interface PageProps {
  params: {
    productId: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default function Page({ params }: PageProps) {
  // Find the product on the server
  const product = products.find((p) => p.id === params.productId) || null;
  
  // Pass the product to the client component
  return <ProductPage product={product} productId={params.productId} />;
}