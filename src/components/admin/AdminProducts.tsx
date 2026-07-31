import { useState, useEffect } from 'react';
import {
  Plus, Trash2, Edit3, Search, X, Check, AlertCircle,
  Eye as EyeIcon, Send,
} from 'lucide-react';
import { supabase, logAdminAction } from '../../lib/admin';
import { useSiteData, Product, Collection } from '../../contexts/SiteDataContext';

// ============ Products Page ============
export function ProductsPage() {
  const { products, refresh } = useSiteData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (products.length >= 0) setLoading(false);
  }, [products]);

  const filtered = products.filter((p) => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.category.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deleteProduct = async (id: string) => {
    if (!confirm('حذف این محصول؟')) return;
    await supabase.from('products').delete().eq('id', id);
    await logAdminAction('delete_product', 'product', 'حذف محصول');
    refresh();
  };

  const togglePublish = async (p: Product) => {
    const newStatus = p.status === 'published' ? 'draft' : 'published';
    await supabase.from('products').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', p.id);
    await logAdminAction('publish_product', 'product', `${newStatus === 'published' ? 'انتشار' : 'پیش‌نویس'} ${p.name}`);
    refresh();
  };

  const saveProduct = async (data: Partial<Product>) => {
    if (editingProduct) {
      await supabase.from('products').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editingProduct.id);
    } else {
      const maxSort = products.reduce((max, p) => Math.max(max, p.sort_order), -1);
      await supabase.from('products').insert({ ...data, sort_order: maxSort + 1 });
    }
    await logAdminAction('save_product', 'product', `ذخیره محصول ${data.name}`);
    setShowEditor(false);
    setEditingProduct(null);
    refresh();
  };

  const PRODUCT_STATUS: Record<string, { label: string; color: string }> = {
    draft: { label: 'پیش‌نویس', color: '#6b7280' },
    published: { label: 'منتشر شده', color: '#10b981' },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" />
          <input type="text" placeholder="جستجوی محصول..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }}>
          <option value="all">همه</option>
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشر شده</option>
        </select>
        <button onClick={() => { setEditingProduct(null); setShowEditor(true); }} className="flex items-center gap-2 px-4 py-2.5 text-sm rounded font-medium" style={{ background: '#BFA36A', color: '#0a0a0a' }}>
          <Plus size={16} /> محصول جدید
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/10 rounded-full animate-spin" style={{ borderTopColor: '#BFA36A' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8 col-span-full">محصولی یافت نشد</p>
          ) : filtered.map((p) => (
            <div key={p.id} className="rounded-lg border border-white/10 overflow-hidden" style={{ background: '#161616' }}>
              <div className="aspect-video relative overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover object-top" loading="lazy" />
                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs rounded" style={{ background: `${PRODUCT_STATUS[p.status]?.color}30`, color: PRODUCT_STATUS[p.status]?.color }}>
                  {PRODUCT_STATUS[p.status]?.label || p.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-1">{p.name}</h3>
                <p className="text-xs text-gray-500 mb-1">{p.category}</p>
                <p className="font-en text-sm mb-3" style={{ color: '#BFA36A' }}>{p.price}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewProduct(p)} className="text-gray-400 hover:text-white" title="پیش‌نمایش"><EyeIcon size={15} /></button>
                  <button onClick={() => { setEditingProduct(p); setShowEditor(true); }} className="text-gray-400 hover:text-white" title="ویرایش"><Edit3 size={15} /></button>
                  <button onClick={() => togglePublish(p)} className="text-gray-400 hover:text-green-400" title="انتشار/پیش‌نویس"><Check size={15} /></button>
                  <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-400 mr-auto" title="حذف"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && <ProductEditor product={editingProduct} onClose={() => { setShowEditor(false); setEditingProduct(null); }} onSave={saveProduct} />}
      {previewProduct && <ProductPreviewModal product={previewProduct} onClose={() => setPreviewProduct(null)} onPublish={() => { togglePublish(previewProduct); setPreviewProduct(null); }} />}
    </div>
  );
}

function ProductEditor({ product, onClose, onSave }: { product: Product | null; onClose: () => void; onSave: (d: Partial<Product>) => void }) {
  const [name, setName] = useState(product?.name || '');
  const [nameEn, setNameEn] = useState(product?.name_en || '');
  const [price, setPrice] = useState(product?.price || '');
  const [priceEn, setPriceEn] = useState(product?.price_en || '');
  const [category, setCategory] = useState(product?.category || '');
  const [categoryEn, setCategoryEn] = useState(product?.category_en || '');
  const [image, setImage] = useState(product?.image || '');
  const [imagesStr, setImagesStr] = useState((product?.images || []).join('\n'));
  const [description, setDescription] = useState(product?.description || '');
  const [descriptionEn, setDescriptionEn] = useState(product?.description_en || '');
  const [sizesStr, setSizesStr] = useState((product?.sizes || ['XS','S','M','L','XL','XXL']).join(', '));
  const [status, setStatus] = useState(product?.status || 'draft');

  const inputStyle = { background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' };

  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-lg" style={{ background: '#161616', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 z-10" style={{ background: '#161616' }}>
            <h2 className="text-lg font-semibold text-white">{product ? 'ویرایش محصول' : 'محصول جدید'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 block mb-1.5">نام (فارسی)</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle} /></div>
              <div><label className="text-xs text-gray-400 block mb-1.5">نام (انگلیسی)</label><input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 block mb-1.5">قیمت (فارسی)</label><input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="۴،۸۰۰،۰۰۰ تومان" className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle} /></div>
              <div><label className="text-xs text-gray-400 block mb-1.5">قیمت (انگلیسی)</label><input type="text" value={priceEn} onChange={(e) => setPriceEn(e.target.value)} placeholder="$96" className="w-full px-4 py-2.5 text-sm rounded border font-en" style={inputStyle} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 block mb-1.5">دسته (فارسی)</label><input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle} /></div>
              <div><label className="text-xs text-gray-400 block mb-1.5">دسته (انگلیسی)</label><input type="text" value={categoryEn} onChange={(e) => setCategoryEn(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle} /></div>
            </div>
            <div><label className="text-xs text-gray-400 block mb-1.5">تصویر اصلی</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/assets/images/products/product-1.jpg" className="w-full px-4 py-2.5 text-sm rounded border font-en" style={inputStyle} /></div>
            {image && <img src={image} alt="preview" className="w-32 h-40 object-cover object-top rounded border border-white/10" />}
            <div><label className="text-xs text-gray-400 block mb-1.5">تصاویر گالری (هر خط یک آدرس)</label><textarea value={imagesStr} onChange={(e) => setImagesStr(e.target.value)} rows={3} className="w-full px-4 py-2.5 text-sm rounded border resize-none font-en" style={inputStyle} placeholder="/assets/images/products/product-1.jpg" /></div>
            <div><label className="text-xs text-gray-400 block mb-1.5">توضیحات (فارسی)</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2.5 text-sm rounded border resize-none" style={inputStyle} /></div>
            <div><label className="text-xs text-gray-400 block mb-1.5">توضیحات (انگلیسی)</label><textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={3} className="w-full px-4 py-2.5 text-sm rounded border resize-none" style={inputStyle} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 block mb-1.5">سایزها (با کاما)</label><input type="text" value={sizesStr} onChange={(e) => setSizesStr(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border font-en" style={inputStyle} /></div>
              <div><label className="text-xs text-gray-400 block mb-1.5">وضعیت</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle}>
                  <option value="draft">پیش‌نویس</option>
                  <option value="published">منتشر شده</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2 sticky bottom-0" style={{ background: '#161616' }}>
              <button onClick={() => onSave({ name, name_en: nameEn, price, price_en: priceEn, category, category_en: categoryEn, image, images: imagesStr.split('\n').map(s => s.trim()).filter(Boolean), description, description_en: descriptionEn, sizes: sizesStr.split(',').map(s => s.trim()).filter(Boolean), status })} disabled={!name || !price} className="flex-1 py-2.5 text-sm rounded font-medium disabled:opacity-30" style={{ background: '#BFA36A', color: '#0a0a0a' }}>ذخیره</button>
              <button onClick={onClose} className="px-4 py-2.5 text-sm rounded border border-white/10 text-gray-400 hover:text-white">انصراف</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductPreviewModal({ product, onClose, onPublish }: { product: Product; onClose: () => void; onPublish: () => void }) {
  const images = product.images?.length ? product.images : [product.image];
  const [activeImg, setActiveImg] = useState(0);
  const isPublished = product.status === 'published';

  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg" style={{ background: '#0f0f0f', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white">پیش‌نمایش محصول</h2>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 text-xs rounded" style={{ background: isPublished ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)', color: isPublished ? '#10b981' : '#6b7280' }}>
                {isPublished ? 'منتشر شده' : 'پیش‌نویس'}
              </span>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative" style={{ minHeight: '300px' }}>
              <div className="relative w-full" style={{ aspectRatio: '3/4' }}>
                <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover object-top" />
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-2 overflow-x-auto">
                  {images.map((src, i) => (
                    <button key={i} onClick={() => setActiveImg(i)} className="flex-shrink-0 w-12 h-16 overflow-hidden" style={{ outline: i === activeImg ? '2px solid #BFA36A' : '1px solid transparent' }}>
                      <img src={src} alt="" className="w-full h-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="md:w-1/2 p-6 flex flex-col gap-4">
              <div>
                <span className="text-xs text-gold tracking-wider">{product.category}</span>
                <h3 className="text-xl font-semibold text-white mt-1">{product.name}</h3>
                <p className="font-en text-lg mt-2" style={{ color: '#BFA36A' }}>{product.price}</p>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed">{product.description || 'بدون توضیحات'}</p>
              <div>
                <span className="text-xs text-gray-500 block mb-2">سایزها</span>
                <div className="flex flex-wrap gap-2">
                  {(product.sizes || []).map((s) => (
                    <span key={s} className="font-en text-xs px-3 py-1.5 border border-white/10 rounded text-gray-300">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mt-auto pt-4 border-t border-white/10">
                <button
                  onClick={onPublish}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded transition-all"
                  style={{ background: isPublished ? 'rgba(107,114,128,0.2)' : '#BFA36A', color: isPublished ? '#9ca3af' : '#0a0a0a' }}
                >
                  {isPublished ? (
                    <><AlertCircle size={16} /> لغو انتشار</>
                  ) : (
                    <><Send size={16} /> منتشر کن</>
                  )}
                </button>
                <p className="text-xs text-gray-500 text-center mt-2">
                  {isPublished ? 'این محصول در سایت نمایش داده می‌شود' : 'با کلیک روی منتشر کن، محصول روی سایت اصلی نمایش داده می‌شود'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ Collections Page (Admin) ============
export function CollectionsAdminPage() {
  const { collections, products, refresh } = useSiteData();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [previewCollection, setPreviewCollection] = useState<Collection | null>(null);

  useEffect(() => {
    if (collections.length >= 0) setLoading(false);
  }, [collections]);

  const filtered = collections.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const deleteCollection = async (id: string) => {
    if (!confirm('حذف این مجموعه؟')) return;
    await supabase.from('collections').delete().eq('id', id);
    await logAdminAction('delete_collection', 'collection', 'حذف مجموعه');
    refresh();
  };

  const togglePublish = async (c: Collection) => {
    const newStatus = c.status === 'published' ? 'draft' : 'published';
    await supabase.from('collections').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', c.id);
    await logAdminAction('publish_collection', 'collection', `${newStatus === 'published' ? 'انتشار' : 'پیش‌نویس'} ${c.name}`);
    refresh();
  };

  const saveCollection = async (data: Partial<Collection>) => {
    if (editingCollection) {
      await supabase.from('collections').update({ ...data, updated_at: new Date().toISOString() }).eq('id', editingCollection.id);
    } else {
      const maxSort = collections.reduce((max, c) => Math.max(max, c.sort_order), -1);
      await supabase.from('collections').insert({ ...data, sort_order: maxSort + 1 });
    }
    await logAdminAction('save_collection', 'collection', `ذخیره مجموعه ${data.name}`);
    setShowEditor(false);
    setEditingCollection(null);
    refresh();
  };

  const COL_STATUS: Record<string, { label: string; color: string }> = {
    draft: { label: 'پیش‌نویس', color: '#6b7280' },
    published: { label: 'منتشر شده', color: '#10b981' },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" />
          <input type="text" placeholder="جستجوی مجموعه..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }}>
          <option value="all">همه</option>
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشر شده</option>
        </select>
        <button onClick={() => { setEditingCollection(null); setShowEditor(true); }} className="flex items-center gap-2 px-4 py-2.5 text-sm rounded font-medium" style={{ background: '#BFA36A', color: '#0a0a0a' }}>
          <Plus size={16} /> مجموعه جدید
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/10 rounded-full animate-spin" style={{ borderTopColor: '#BFA36A' }} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 py-8 col-span-full">مجموعه‌ای یافت نشد</p>
          ) : filtered.map((c) => (
            <div key={c.id} className="rounded-lg border border-white/10 overflow-hidden" style={{ background: '#161616' }}>
              <div className="aspect-video relative overflow-hidden">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover object-top" loading="lazy" />
                <span className="absolute top-2 right-2 px-2 py-0.5 text-xs rounded" style={{ background: `${COL_STATUS[c.status]?.color}30`, color: COL_STATUS[c.status]?.color }}>
                  {COL_STATUS[c.status]?.label || c.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-1">{c.name}</h3>
                <p className="text-xs text-gray-500 mb-1 line-clamp-1">{c.description}</p>
                <p className="text-xs text-gray-600 mb-3">{(c.product_ids || []).length} محصول</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPreviewCollection(c)} className="text-gray-400 hover:text-white" title="پیش‌نمایش"><EyeIcon size={15} /></button>
                  <button onClick={() => { setEditingCollection(c); setShowEditor(true); }} className="text-gray-400 hover:text-white" title="ویرایش"><Edit3 size={15} /></button>
                  <button onClick={() => togglePublish(c)} className="text-gray-400 hover:text-green-400" title="انتشار/پیش‌نویس"><Check size={15} /></button>
                  <button onClick={() => deleteCollection(c.id)} className="text-gray-400 hover:text-red-400 mr-auto" title="حذف"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showEditor && <CollectionEditor collection={editingCollection} products={products} onClose={() => { setShowEditor(false); setEditingCollection(null); }} onSave={saveCollection} />}
      {previewCollection && <CollectionPreviewModal collection={previewCollection} products={products} onClose={() => setPreviewCollection(null)} onPublish={() => { togglePublish(previewCollection); setPreviewCollection(null); }} />}
    </div>
  );
}

function CollectionEditor({ collection, products, onClose, onSave }: { collection: Collection | null; products: Product[]; onClose: () => void; onSave: (d: Partial<Collection>) => void }) {
  const [name, setName] = useState(collection?.name || '');
  const [nameEn, setNameEn] = useState(collection?.name_en || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [descriptionEn, setDescriptionEn] = useState(collection?.description_en || '');
  const [image, setImage] = useState(collection?.image || '');
  const [imagesStr, setImagesStr] = useState((collection?.images || []).join('\n'));
  const [selectedProductSorts, setSelectedProductSorts] = useState<number[]>(collection?.product_ids || []);
  const [status, setStatus] = useState(collection?.status || 'draft');

  const inputStyle = { background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' };
  const publishedProducts = products.filter((p) => p.status === 'published');

  const toggleProduct = (sortOrder: number) => {
    setSelectedProductSorts((prev) => prev.includes(sortOrder) ? prev.filter((s) => s !== sortOrder) : [...prev, sortOrder]);
  };

  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-lg" style={{ background: '#161616', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 z-10" style={{ background: '#161616' }}>
            <h2 className="text-lg font-semibold text-white">{collection ? 'ویرایش مجموعه' : 'مجموعه جدید'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-400 block mb-1.5">نام (فارسی)</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle} /></div>
              <div><label className="text-xs text-gray-400 block mb-1.5">نام (انگلیسی)</label><input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle} /></div>
            </div>
            <div><label className="text-xs text-gray-400 block mb-1.5">توضیحات (فارسی)</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-4 py-2.5 text-sm rounded border resize-none" style={inputStyle} /></div>
            <div><label className="text-xs text-gray-400 block mb-1.5">توضیحات (انگلیسی)</label><textarea value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} rows={2} className="w-full px-4 py-2.5 text-sm rounded border resize-none" style={inputStyle} /></div>
            <div><label className="text-xs text-gray-400 block mb-1.5">تصویر اصلی</label><input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/assets/images/collections/collection-1.jpg" className="w-full px-4 py-2.5 text-sm rounded border font-en" style={inputStyle} /></div>
            {image && <img src={image} alt="preview" className="w-32 h-20 object-cover object-top rounded border border-white/10" />}
            <div><label className="text-xs text-gray-400 block mb-1.5">تصاویر گالری (هر خط یک آدرس)</label><textarea value={imagesStr} onChange={(e) => setImagesStr(e.target.value)} rows={3} className="w-full px-4 py-2.5 text-sm rounded border resize-none font-en" style={inputStyle} /></div>
            <div>
              <label className="text-xs text-gray-400 block mb-2">محصولات این مجموعه</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-white/10 rounded" style={{ background: '#1a1a1a' }}>
                {publishedProducts.map((p) => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-white/5">
                    <input type="checkbox" checked={selectedProductSorts.includes(p.sort_order)} onChange={() => toggleProduct(p.sort_order)} className="accent-amber-500" />
                    <img src={p.image} alt="" className="w-8 h-10 object-cover object-top rounded" />
                    <span className="text-xs text-gray-300 truncate">{p.name}</span>
                  </label>
                ))}
              </div>
            </div>
            <div><label className="text-xs text-gray-400 block mb-1.5">وضعیت</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={inputStyle}>
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => onSave({ name, name_en: nameEn, description, description_en: descriptionEn, image, images: imagesStr.split('\n').map(s => s.trim()).filter(Boolean), product_ids: selectedProductSorts, status })} disabled={!name || !description} className="flex-1 py-2.5 text-sm rounded font-medium disabled:opacity-30" style={{ background: '#BFA36A', color: '#0a0a0a' }}>ذخیره</button>
              <button onClick={onClose} className="px-4 py-2.5 text-sm rounded border border-white/10 text-gray-400 hover:text-white">انصراف</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function CollectionPreviewModal({ collection, products, onClose, onPublish }: { collection: Collection; products: Product[]; onClose: () => void; onPublish: () => void }) {
  const isPublished = collection.status === 'published';
  const collectionProducts = (collection.product_ids || [])
    .map((idx) => products.find((p) => p.sort_order === idx))
    .filter((p): p is Product => p !== undefined);

  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.8)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg" style={{ background: '#0f0f0f', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h2 className="text-sm font-semibold text-white">پیش‌نمایش مجموعه</h2>
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 text-xs rounded" style={{ background: isPublished ? 'rgba(16,185,129,0.2)' : 'rgba(107,114,128,0.2)', color: isPublished ? '#10b981' : '#6b7280' }}>
                {isPublished ? 'منتشر شده' : 'پیش‌نویس'}
              </span>
              <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>
          </div>
          <div className="relative h-48 overflow-hidden">
            <img src={collection.image} alt={collection.name} className="w-full h-full object-cover object-top" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,15,15,1) 0%, transparent 100%)' }} />
            <div className="absolute bottom-4 right-6">
              <h3 className="text-xl font-light text-white">{collection.name}</h3>
              <p className="text-sm text-white/60">{collection.description}</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-xs text-gray-500 mb-3">{collectionProducts.length} محصول در این مجموعه</p>
            <div className="grid grid-cols-3 gap-3">
              {collectionProducts.map((p) => (
                <div key={p.id} className="text-center">
                  <img src={p.image} alt={p.name} className="w-full aspect-[3/4] object-cover object-top rounded mb-2" />
                  <p className="text-xs text-gray-300 truncate">{p.name}</p>
                  <p className="font-en text-xs" style={{ color: '#BFA36A' }}>{p.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 pt-0">
            <button
              onClick={onPublish}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium rounded transition-all"
              style={{ background: isPublished ? 'rgba(107,114,128,0.2)' : '#BFA36A', color: isPublished ? '#9ca3af' : '#0a0a0a' }}
            >
              {isPublished ? (
                <><AlertCircle size={16} /> لغو انتشار</>
              ) : (
                <><Send size={16} /> منتشر کن</>
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              {isPublished ? 'این مجموعه در سایت نمایش داده می‌شود' : 'با کلیک روی منتشر کن، مجموعه روی سایت اصلی نمایش داده می‌شود'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
