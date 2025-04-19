"use client";

import { useState, useEffect, useRef } from "react";
import ARViewer from "@/components/ARViewer";

interface ClientSideARWrapperProps {
  glbUrl: string;
  usdzUrl: string; 
  alt: string;
  poster?: string;
  autoRotate?: boolean;
  viewMode: string;
}

export default function ClientSideARWrapper({
  glbUrl,
  usdzUrl,
  alt,
  poster,
  autoRotate = false,
  viewMode
}: ClientSideARWrapperProps) {
  // Track client-side rendering
  const [isClient, setIsClient] = useState(false);
  // Track if we should show in details mode (only on desktop)
  const [showInDetails, setShowInDetails] = useState(false);
  // For fullscreen AR mode
  const isFullScreenAR = useRef(false);
  
  // Use a ref to avoid re-creating the ARViewer unnecessarily
  const shouldRender = viewMode === "3d" || viewMode === "ar" || (viewMode === "details" && showInDetails);
  
  // Generate a unique key for each render to avoid stale component issues
  const instanceKey = useRef(`arviewer-${Math.random().toString(36).substring(2, 9)}`);
  
  useEffect(() => {
    // Mark that we're client-side rendered
    setIsClient(true);
    
    // Check if this is fullscreen AR mode by checking URL parameter
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      isFullScreenAR.current = urlParams.get('ar') === 'true';
    }
    
    // Check if we should show in details mode
    const checkResponsive = () => {
      if (viewMode === "details") {
        setShowInDetails(window.innerWidth >= 768);
      }
    };
    
    // Initial check
    checkResponsive();
    
    // Debounced resize handler to avoid excessive re-renders
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(checkResponsive, 100);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimer) {
        clearTimeout(resizeTimer);
      }
    };
  }, [viewMode]);
  
  // Don't render anything on server or if shouldn't display based on view mode
  if (!isClient || !shouldRender) {
    return null;
  }
  
  // Determine exposure based on mode
  const exposure = isFullScreenAR.current ? 1.2 : 1;
  
  return (
    <div className="w-full h-full" key={`${instanceKey.current}-${viewMode}`}>
      <ARViewer
        glbUrl={glbUrl}
        usdzUrl={usdzUrl}
        alt={alt}
        poster={poster}
        autoRotate={autoRotate}
        cameraControls={true}
        scale={1}
        shadowIntensity={1.5}
        exposure={exposure}
      />
    </div>
  );
}
