"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

interface QRCodeProps {
  url: string;
  size?: number;
}

export default function QRCode({ url, size = 150 }: QRCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (qrRef.current && typeof window !== 'undefined' && window.QRCode) {
      qrRef.current.innerHTML = "";
      new window.QRCode(qrRef.current, {
        text: url,
        width: size,
        height: size,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: window.QRCode.CorrectLevel.H,
      });
    }
  }, [url, size]);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (qrRef.current && typeof window !== 'undefined' && window.QRCode) {
            qrRef.current.innerHTML = "";
            new window.QRCode(qrRef.current, {
              text: url,
              width: size,
              height: size,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: window.QRCode.CorrectLevel.H,
            });
          }
        }}
      />
      <div ref={qrRef} className="flex items-center justify-center"></div>
    </>
  );
}