export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  glbUrl: string;
  usdzUrl: string;
  image: string;
  category: 'bulb' | 'lamp' | 'tubelight' | 'fixture' | 'lighting';
  featured?: boolean;
}