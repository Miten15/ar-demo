"use client";

import { useEffect, useRef } from "react";
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

// Define model-viewer as a custom element in JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        src: string;
        'ios-src': string;
        alt: string;
        poster?: string;
        ar?: boolean;
        'ar-modes'?: string;
        'ar-scale'?: string;
        'camera-controls'?: boolean;
        'auto-rotate'?: boolean;
        exposure?: number;
        'shadow-intensity'?: number;
        'environment-image'?: string;
        'camera-orbit'?: string;
      }, HTMLElement>;
    }
  }
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
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Any client-side setup if needed
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="afterInteractive"
      />
      
      <div className="w-full h-full flex items-center justify-center">
        <model-viewer
          ref={modelViewerRef}
          src={glbUrl}
          ios-src={usdzUrl}
          alt={alt}
          poster={poster}
          ar
          ar-modes="scene-viewer webxr quick-look"
          ar-scale="fixed"
          camera-controls={cameraControls}
          auto-rotate={autoRotate}
          exposure={exposure}
          shadow-intensity={shadowIntensity}
          environment-image="neutral"
          camera-orbit="0deg 75deg 2m"
          className="w-full h-full min-h-[400px] max-w-full"
          style={{ width: '100%', height: '100%' }}
        >
          <button slot="ar-button" className="absolute bottom-5 right-5 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12h-9"></path>
              <circle cx="8" cy="12" r="6"></circle>
            </svg>
            View in AR
          </button>
        </model-viewer>
      </div>
    </>
  );
}