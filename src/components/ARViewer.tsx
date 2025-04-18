"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface ARViewerProps {
  glbUrl: string;
  usdzUrl: string;
  alt: string;
  poster?: string;
  exposure?: number;
  shadowIntensity?: number;
  cameraControls?: boolean;
  autoRotate?: boolean;
}

export default function ARViewer({
  glbUrl,
  usdzUrl,
  alt,
  poster,
  exposure = 1,
  shadowIntensity = 1,
  cameraControls = true,
  autoRotate = false,
}: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Make sure this code only runs on the client
    if (typeof window !== 'undefined' && containerRef.current && scriptLoaded) {
      try {
        // Clear previous content
        containerRef.current.innerHTML = '';
        
        // Create model-viewer element with proper type casting
        const modelViewer = document.createElement('model-viewer') as HTMLElement;
        
        // Set attributes - use setAttribute consistently instead of direct property assignment
        modelViewer.setAttribute('src', glbUrl);
        modelViewer.setAttribute('ios-src', usdzUrl);
        modelViewer.setAttribute('alt', alt);
        if (poster) modelViewer.setAttribute('poster', poster);
        modelViewer.setAttribute('ar', '');
        modelViewer.setAttribute('ar-modes', 'scene-viewer webxr quick-look');
        modelViewer.setAttribute('ar-scale', 'fixed');
        if (cameraControls) modelViewer.setAttribute('camera-controls', '');
        if (autoRotate) modelViewer.setAttribute('auto-rotate', '');
        modelViewer.setAttribute('exposure', exposure.toString());
        modelViewer.setAttribute('shadow-intensity', shadowIntensity.toString());
        modelViewer.setAttribute('environment-image', 'neutral');
        modelViewer.setAttribute('camera-orbit', '0deg 75deg 2m');
        modelViewer.style.width = '100%';
        modelViewer.style.height = '100%';
        modelViewer.classList.add('w-full', 'h-full', 'min-h-[400px]', 'max-w-full');

        // Create AR button
        const button = document.createElement('button');
        button.slot = 'ar-button';
        button.className = 'absolute bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2';
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('stroke', 'currentColor');
        svg.setAttribute('stroke-width', '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M17.25 8.25 21 12m0 0-3.75 3.75M21 12h-9');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', '8');
        circle.setAttribute('cy', '12');
        circle.setAttribute('r', '6');
        
        svg.appendChild(path);
        svg.appendChild(circle);
        button.appendChild(svg);
        button.appendChild(document.createTextNode('View in AR'));
        
        modelViewer.appendChild(button);
        containerRef.current.appendChild(modelViewer);
      } catch (err) {
        console.error("Error creating model-viewer:", err);
        setError("Failed to load 3D viewer");
      }
    }
  }, [glbUrl, usdzUrl, alt, poster, cameraControls, autoRotate, exposure, shadowIntensity, scriptLoaded]);

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setError("Failed to load 3D viewer library")}
      />
      
      <div className="w-full h-full flex items-center justify-center">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">Try refreshing the page or using another browser</p>
          </div>
        ) : (
          <div 
            ref={containerRef} 
            className="w-full h-full flex items-center justify-center"
          >
            {!scriptLoaded && (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Loading 3D viewer...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}