"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

interface QRCodeProps {
  url: string;
  size?: number;
}

export default function QRCode({ url, size = 150 }: QRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only run this effect when the script is loaded and we have a URL
    if (qrRef.current && isScriptLoaded && url) {
      try {
        qrRef.current.innerHTML = "";
        // Make sure QRCode exists on window before using it
        if (typeof window !== 'undefined' && window.QRCode) {
          new window.QRCode(qrRef.current, {
            text: url,
            width: size,
            height: size,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: window.QRCode.CorrectLevel.H,
          });
        }
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code");
      }
    }
  }, [url, size, isScriptLoaded]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
        onError={() => setError("Failed to load QR code library")}
      />
      {error ? (
        <div className="flex items-center justify-center border border-gray-300 dark:border-gray-600 rounded-md h-full w-full p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          {error}
        </div>
      ) : (
        <div ref={qrRef} className="flex items-center justify-center min-h-[100px] min-w-[100px]">
          {!isScriptLoaded && (
            <div className="animate-pulse h-full w-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
          )}
        </div>
      )}
    </>
  );
}