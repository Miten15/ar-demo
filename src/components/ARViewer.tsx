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
  scale?: number;
  position?: { x: number; y: number; z: number };
}

// Define an interface for model-viewer element to fix TypeScript errors
interface ModelViewerElement extends HTMLElement {
  src: string;
  alt: string;
  poster?: string;
  setAttribute(name: string, value: string): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

export default function ARViewer({
  glbUrl,
  usdzUrl,
  alt,
  poster,
  exposure = 1,
  shadowIntensity = 0.8, // Reduced for better performance
  cameraControls = true,
  autoRotate = false,
  scale = 1,
  position = { x: 0, y: 0, z: 0 },
}: ARViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [inARMode, setInARMode] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  
  // Use refs to track component state without re-renders
  const modelViewerCreated = useRef(false);
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const isMounted = useRef(true);
  const containerRefValue = useRef<HTMLDivElement | null>(null);
  
  // Make URLs absolute
  const absoluteGlbUrl = glbUrl.startsWith("http")
    ? glbUrl
    : `${typeof window !== "undefined" ? window.location.origin : ""}${glbUrl}`;

  const absoluteUsdzUrl = usdzUrl.startsWith("http")
    ? usdzUrl
    : `${typeof window !== "undefined" ? window.location.origin : ""}${usdzUrl}`;

  // Check device type on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileDevice = /iphone|ipad|ipod|android|mobile|tablet/.test(userAgent);
      setIsMobileDevice(mobileDevice);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const iOS = /ipad|iphone|ipod/.test(userAgent) && !(window as any).MSStream;
      setIsIOSDevice(iOS);
    }
    
    // Cleanup on unmount
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Capture current containerRef value to avoid stale refs in cleanup
  useEffect(() => {
    containerRefValue.current = containerRef.current;
  });
  
  // This effect handles model-viewer initialization and cleanup
  useEffect(() => {
    // Don't run if script isn't loaded or we already created the model viewer
    if (!scriptLoaded || !containerRef.current || modelViewerCreated.current) return;
    
    // Mark this component as mounting the model viewer
    modelViewerCreated.current = true;

    // Create a logging function that respects mounting state
    const logMessage = (message: string) => {
      if (isMounted.current) {
        console.log(`AR Viewer: ${message}`);
      }
    };

    logMessage("Initializing AR viewer");
    
    // Create a container div for model-viewer that won't conflict with React's DOM operations
    const modelViewerContainer = document.createElement('div');
    modelViewerContainer.style.width = '100%';
    modelViewerContainer.style.height = '100%';
    modelViewerContainer.dataset.arViewerContainer = 'true';
    
    // Empty container first to avoid duplicates
    if (containerRef.current) {
      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(modelViewerContainer);
    }
    
    // Create the model-viewer element
    logMessage("Creating model-viewer element");
    const modelViewer = document.createElement('model-viewer') as ModelViewerElement;
    modelViewerRef.current = modelViewer;
    
    // Configure model-viewer attributes
    modelViewer.src = absoluteGlbUrl;
    modelViewer.alt = alt;
    if (poster) modelViewer.poster = poster;
    modelViewer.setAttribute('ar', '');
    modelViewer.setAttribute('ios-src', absoluteUsdzUrl);
    
    // Performance optimizations
    modelViewer.setAttribute('ar-modes', 'webxr scene-viewer quick-look');
    modelViewer.setAttribute('ar-scale', 'auto');
    modelViewer.setAttribute('skybox-image', 'none'); // Disable skybox for better performance
    modelViewer.setAttribute('environment-image', 'neutral'); // Use simpler environment
    modelViewer.setAttribute('shadow-intensity', shadowIntensity.toString());
    modelViewer.setAttribute('camera-target', '0 0 0'); // Center the camera target
    modelViewer.setAttribute('interaction-prompt', 'none'); // Disable interaction prompt
    modelViewer.setAttribute('ar-placement', 'floor'); // Default placement on floor
    modelViewer.setAttribute('touch-action', 'pan-y');
    modelViewer.setAttribute('reveal', 'auto');
    modelViewer.setAttribute('loading', 'eager'); // Load eagerly
    
    // Mobile optimizations
    if (isMobileDevice) {
      modelViewer.setAttribute('max-field-of-view', '60deg'); // Limit FOV on mobile
      modelViewer.setAttribute('interpolation-decay', '200'); // Smoother animations
    }
    
    if (cameraControls) modelViewer.setAttribute('camera-controls', '');
    if (autoRotate) modelViewer.setAttribute('auto-rotate', '');
    
    modelViewer.setAttribute('exposure', exposure.toString());
    modelViewer.setAttribute('camera-orbit', '0deg 75deg 2m');
    modelViewer.setAttribute('scale', `${scale} ${scale} ${scale}`);
    
    // Apply position transform
    if (position) {
      modelViewer.style.transform = `translate3d(${position.x * 10}px, ${position.y * 10}px, ${position.z * 10}px)`;
    }
    
    // Mobile-specific settings
    if (isMobileDevice) {
      // Check if we're in fullscreen AR mode (URL has ar=true)
      const urlParams = new URLSearchParams(window.location.search);
      const fullscreenAR = urlParams.get('ar') === 'true';
      
      if (fullscreenAR) {
        modelViewer.setAttribute('camera-controls', '');
        modelViewer.setAttribute('interaction-prompt', 'none');
        
        // iOS-specific optimizations
        if (isIOSDevice) {
          // These settings should help iOS Quick Look handle the model better
          modelViewer.setAttribute('quick-look-browsers', 'safari');
          modelViewer.setAttribute('ar-scale', 'auto');
          logMessage("Optimized for iOS device");
        } else {
          // Android-specific optimizations
          modelViewer.setAttribute('quick-look-browsers', 'safari chrome');
          modelViewer.setAttribute('ar-status', 'not-presenting');
          logMessage("Optimized for Android device");
        }
      }
    }
    
    // Style the model-viewer
    modelViewer.style.width = '100%';
    modelViewer.style.height = '100%';
    modelViewer.style.backgroundColor = 'transparent';
    
    // Create and add AR button
    const button = document.createElement('button');
    button.slot = 'ar-button';
    button.className = 'absolute bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg';
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12h-9"></path>
        <circle cx="8" cy="12" r="6"></circle>
      </svg>
      ${isMobileDevice ? "View in your space" : "View in AR"}
    `;
    modelViewer.appendChild(button);
    
    // Add progress event listener
    const progressHandler = (event: Event) => {
      if (!isMounted.current) return;
      // @ts-expect-error - progress event is not in the type definitions
      const progress = event.detail.totalProgress * 100;
      const progressValue = Math.round(progress);
      setLoadingProgress(progressValue);
      logMessage(`Loading progress: ${progressValue}%`);
    };
    
    modelViewer.addEventListener('progress', progressHandler);
    
    // Add error event listener
    const errorHandler = (event: ErrorEvent) => {
      if (!isMounted.current) return;
      console.error('Model viewer error:', event);
      setError('Failed to load 3D model. Please try again later.');
    };
    
    modelViewer.addEventListener('error', errorHandler as EventListener);
    
    // Add AR status event listener
    const arStatusHandler = (event: Event) => {
      if (!isMounted.current) return;
      try {
        // @ts-expect-error - custom event
        const status = event.detail.status;
        logMessage(`AR status changed: ${status}`);
        if (status === 'session-started') {
          setInARMode(true);
          modelViewer.setAttribute('ar-scale', 'fixed');
        } else if (status === 'session-ended' || status === 'not-presenting') {
          setInARMode(false);
        } else if (status === 'failed') {
          // AR failed to start
          setError('AR mode failed to start. Please try again or use a different device.');
        }
      } catch (e) {
        console.error('Error handling AR status:', e);
      }
    };
    
    modelViewer.addEventListener('ar-status', arStatusHandler);
    
    // Add load event listener
    const loadHandler = () => {
      if (!isMounted.current) return;
      setLoadingProgress(100);
      setModelLoaded(true);
      logMessage("Model loaded successfully");
    };
    
    modelViewer.addEventListener('load', loadHandler);

    // Add preload handler
    const preloadHandler = () => {
      if (!isMounted.current) return;
      logMessage("Model preloaded");
    };
    
    modelViewer.addEventListener('preload', preloadHandler);
    
    // Append to the container
    modelViewerContainer.appendChild(modelViewer);
    
    // Store event handlers for cleanup
    const eventHandlers = { 
      progressHandler, 
      errorHandler: errorHandler as EventListener, 
      arStatusHandler, 
      loadHandler, 
      preloadHandler 
    };
    
    // Cleanup function
    return () => {
      // Mark as unmounted
      logMessage("Cleaning up AR viewer");
      isMounted.current = false;
      modelViewerCreated.current = false;
      
      // Remove event listeners
      const mv = modelViewerRef.current;
      if (mv) {
        mv.removeEventListener('progress', eventHandlers.progressHandler);
        mv.removeEventListener('error', eventHandlers.errorHandler);
        mv.removeEventListener('ar-status', eventHandlers.arStatusHandler);
        mv.removeEventListener('load', eventHandlers.loadHandler);
        mv.removeEventListener('preload', eventHandlers.preloadHandler);
      }
      
      // Save references to elements we need to clean up
      const savedContainer = containerRefValue.current;
      
      // Use setTimeout to ensure our cleanup happens after React's reconciliation
      setTimeout(() => {
        try {
          if (savedContainer && document.body.contains(savedContainer)) {
            // Use a safe emptying technique
            while (savedContainer.firstChild) {
              savedContainer.removeChild(savedContainer.firstChild);
            }
          }
        } catch (e) {
          console.warn('Error during model viewer cleanup:', e);
        }
      }, 10);
    };
  }, [
    scriptLoaded, 
    absoluteGlbUrl, 
    absoluteUsdzUrl, 
    alt, 
    poster,
    cameraControls,
    autoRotate,
    exposure,
    shadowIntensity,
    scale,
    position,
    isMobileDevice,
    isIOSDevice
  ]);

  return (
    <>
      <Script
        type="module"
        src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.3.0/model-viewer.min.js"
        strategy="lazyOnload" // Changed to lazyOnload for better overall page load performance
        onLoad={() => {
          console.log("Model viewer script loaded");
          setScriptLoaded(true);
        }}
        onError={() => setError("Failed to load 3D viewer library")}
      />

      <div className="w-full h-full flex items-center justify-center">
        {error ? (
          <div className="flex flex-col items-center justify-center text-center p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Try refreshing the page or using another browser
            </p>
          </div>
        ) : (
          <div
            ref={containerRef}
            className="w-full h-full flex items-center justify-center relative"
          >
            {!scriptLoaded ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading 3D viewer...
                </p>
              </div>
            ) : loadingProgress < 100 && loadingProgress > 0 ? (
              <div className="flex flex-col items-center justify-center">
                <div className="w-48 h-2 bg-gray-200 rounded-full mb-4">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${loadingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading 3D model: {loadingProgress}%
                </p>
              </div>
            ) : null}
            
            {/* AR Experience message */}
            {inARMode && (
              <div className="absolute bottom-4 left-4 right-4 z-10 text-center pointer-events-none">
                <div className="inline-block bg-white/80 dark:bg-gray-800/80 rounded-lg py-2 px-4 shadow-lg">
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {isIOSDevice 
                      ? "Move your device to place the object" 
                      : "Tap on a surface to place the object"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}