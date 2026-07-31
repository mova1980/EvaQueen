import { getAssetPath } from '../config/assets.config';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export const productImages = [
  getAssetPath('image', 'products/product-1.jpg'),
  getAssetPath('image', 'products/product-2.jpg'),
  getAssetPath('image', 'products/product-3.jpg'),
  getAssetPath('image', 'products/product-4.jpg'),
  getAssetPath('image', 'products/product-5.jpg'),
];

export const collectionImages = [
  getAssetPath('image', 'collections/collection-1.jpg'),
  getAssetPath('image', 'collections/collection-2.jpg'),
  getAssetPath('image', 'collections/collection-3.jpg'),
];

export const philosophyImage =
  getAssetPath('image', 'philosophy/philosophy.jpg');

export const heroImage =
  getAssetPath('image', 'homepage/hero-1.jpg');

// Parse price string to numeric value in Toman
export function parsePrice(price: string): number {
  const num = parseInt(price.replace(/[^0-9]/g, ''), 10);
  return isNaN(num) ? 0 : num;
}

// Format number as Toman price string
export function formatToman(amount: number): string {
  return amount.toLocaleString('fa-IR') + ' تومان';
}
