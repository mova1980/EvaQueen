export const ASSETS_BASE = '/assets';
export const IMAGES_BASE = `${ASSETS_BASE}/images`;
export const VIDEOS_BASE = `${ASSETS_BASE}/videos`;
export const LOGOS_BASE = `${ASSETS_BASE}/logos`;
export const FONTS_BASE = `${ASSETS_BASE}/fonts`;

export type AssetType = 'image' | 'video' | 'logo' | 'font';

export function getAssetPath(type: AssetType, path: string): string {
  const base =
    type === 'image' ? IMAGES_BASE :
    type === 'video' ? VIDEOS_BASE :
    type === 'logo' ? LOGOS_BASE :
    FONTS_BASE;
  return `${base}/${path}`;
}
