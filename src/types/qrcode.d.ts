declare global {
  interface Window {
    QRCode: {
      new (element: HTMLElement, options: {
        text: string;
        width?: number;
        height?: number;
        colorDark?: string;
        colorLight?: string;
        correctLevel?: number;
      }): unknown;
      CorrectLevel: {
        L: number;
        M: number;
        Q: number;
        H: number;
      };
    };
  }
}

export {};