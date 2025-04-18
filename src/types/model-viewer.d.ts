// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
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
        slot?: string;
      },
      HTMLElement
    >;
  }
}

export {};