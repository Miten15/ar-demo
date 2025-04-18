// Server Component
import { products } from "@/data/products";
import ProductPage from "./ProductPage";
import { Metadata } from "next";

type Props = {
  params: { productId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

// Generate metadata for the page
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const product = products.find(p => p.id === params.productId);
  
  // Using searchParams to potentially customize the metadata
  const highlight = typeof searchParams.highlight === 'string' ? searchParams.highlight : undefined;
  
  return {
    title: product ? `${product.name} - AR View${highlight ? ` (${highlight})` : ''}` : 'Product Not Found',
    description: product?.description || 'View this product in augmented reality'
  };
}

// Use the appropriate type annotation and make the component async
export default async function Page({ params, searchParams }: Props) {
  // Find the product on the server
  const product = products.find((p) => p.id === params.productId) || null;
  
  // Pass both product and searchParams to the client component
  // This allows features like highlighting, initial settings, etc. to be controlled via URL
  return <ProductPage 
    product={product} 
    productId={params.productId} 
    initialView={searchParams.view as string | undefined}
  />;
}