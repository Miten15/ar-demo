import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import ProductPage from './ProductPage';

interface Props {
  params: Promise<{ productId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate metadata for the page
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const product = products.find(p => p.id === resolvedParams.productId);
  
  // If product doesn't exist, we'll handle this in the page component
  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.'
    };
  }
  
  // Using searchParams to potentially customize the metadata
  const highlight = typeof resolvedSearchParams.highlight === 'string' ? resolvedSearchParams.highlight : undefined;
  
  return {
    title: `${product.name} - AR View${highlight ? ` (${highlight})` : ''}`,
    description: product.description,
    openGraph: {
      title: `View ${product.name} in Augmented Reality`,
      description: product.description,
      images: [{ url: product.image, width: 1200, height: 630 }]
    }
  };
}

export default async function Page({ params, searchParams }: Props) {
  // Await params and searchParams
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Find the product on the server
  const product = products.find((p) => p.id === resolvedParams.productId);
  
  // If product doesn't exist, show 404 page
  if (!product) {
    notFound();
  }
  
  return <ProductPage
    product={product}
    productId={resolvedParams.productId}
    initialView={resolvedSearchParams.view as string | undefined}       
  />;
}