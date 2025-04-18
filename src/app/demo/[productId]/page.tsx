"use client";

import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { Product } from "@/types/product";
import ARViewer from "@/components/ARViewer";
import QRCode from "@/components/QRCode";
import Link from "next/link";
import Image from "next/image";

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [isARSupported, setIsARSupported] = useState<boolean | null>(null);

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === params.productId);
    if (foundProduct) {
      setProduct(foundProduct);
    }
    
    // Get the current URL for QR code generation
    setCurrentUrl(window.location.href);
    
    // Check if AR is supported
    const checkARSupport = () => {
      // iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      // Android Chrome
      const isAndroid = /android/i.test(navigator.userAgent);
      setIsARSupported(isIOS || isAndroid);
    };
    
    checkARSupport();
  }, [params.productId]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-blue-600 dark:text-blue-400 flex items-center gap-2 font-semibold">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                Back to products
              </Link>
            </div>
            <div>
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                LightingAR Showcase
              </h1>
            </div>
            <div className="w-10"></div> {/* Placeholder for balance */}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Product Details */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <div className="md:grid md:grid-cols-2">
              {/* AR Viewer Section */}
              <div className="h-[400px] md:h-[600px] relative">
                <ARViewer
                  glbUrl={product.glbUrl}
                  usdzUrl={product.usdzUrl}
                  alt={product.name}
                  poster={product.image}
                />
                
                {/* AR Support Message */}
                {isARSupported === false && (
                  <div className="absolute bottom-4 left-4 right-4 bg-amber-50 dark:bg-amber-900/70 text-amber-800 dark:text-amber-200 rounded-md p-3 text-sm flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>AR may not be supported on your current device. Try scanning the QR code with a mobile device.</span>
                  </div>
                )}
              </div>
              
              {/* Product Info Section */}
              <div className="p-6 md:p-8">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Description</h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    {product.description}
                  </p>
                </div>
                
                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    View in Your Space
                  </h3>
                  
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 md:p-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      <div className="border-2 border-gray-200 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800">
                        <QRCode url={currentUrl} size={150} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Scan with your phone</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                          To view this {product.category} in AR, scan this QR code with your mobile device, then tap the "View in AR" button.
                        </p>
                        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          <span className="font-medium">AR compatible with iOS and Android devices</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 grid grid-cols-1 gap-4">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                      <path d="M3 6h18"></path>
                      <path d="M16 10a4 4 0 0 1-8 0"></path>
                    </svg>
                    Add to Cart
                  </button>
                </div>
                
                {/* Deployment Note for Development */}
                <div className="mt-6 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <h4 className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <path d="M12 9v4"></path>
                      <path d="M12 17h.01"></path>
                    </svg>
                    Development Note
                  </h4>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-400">
                    For AR functionality to work correctly, this application must be deployed to a secure (HTTPS) domain. 
                    Local development may not fully support AR features. We recommend deploying to Vercel, Netlify, or another hosting provider.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Related Products */}
      <section className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 mt-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          You might also like
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products
            .filter(p => p.id !== product.id)
            .slice(0, 4)
            .map((relatedProduct) => (
              <Link 
                key={relatedProduct.id}
                href={`/demo/${relatedProduct.id}`}
                className="group"
              >
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 relative">
                  <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    {/* Replace with actual images when available */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 dark:text-gray-400">
                      <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                      <circle cx="9" cy="9" r="2"></circle>
                      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                  </div>
                </div>
                <h3 className="mt-2 text-sm text-gray-700 dark:text-gray-200">
                  {relatedProduct.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                  ${relatedProduct.price.toFixed(2)}
                </p>
              </Link>
            ))}
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-inner mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} LightingAR Showcase. All rights reserved.
          </p>
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-2">
            AR functionality powered by model-viewer
          </p>
        </div>
      </footer>
    </div>
  );
}