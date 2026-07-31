import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/admin';

export interface Product {
  id: string;
  name: string;
  name_en: string | null;
  price: string;
  price_en: string | null;
  category: string;
  category_en: string | null;
  image: string;
  images: string[];
  description: string | null;
  description_en: string | null;
  sizes: string[];
  colors: any[];
  status: string;
  sort_order: number;
}

export interface Collection {
  id: string;
  name: string;
  name_en: string | null;
  description: string;
  description_en: string | null;
  image: string;
  images: string[];
  product_ids: number[];
  status: string;
  sort_order: number;
}

interface SiteDataContextType {
  products: Product[];
  collections: Collection[];
  loading: boolean;
  refresh: () => void;
}

const SiteDataContext = createContext<SiteDataContextType>({
  products: [],
  collections: [],
  loading: true,
  refresh: () => {},
});

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [{ data: prodData }, { data: colData }] = await Promise.all([
        supabase.from('products').select('*').order('sort_order', { ascending: true }),
        supabase.from('collections').select('*').order('sort_order', { ascending: true }),
      ]);
      setProducts((prodData as Product[]) || []);
      setCollections((colData as Collection[]) || []);
      setLoading(false);
    })();
  }, [refreshKey]);

  return (
    <SiteDataContext.Provider value={{ products, collections, loading, refresh }}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  return useContext(SiteDataContext);
}
