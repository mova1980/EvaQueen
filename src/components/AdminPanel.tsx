import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, ShoppingBag, Image, FileText, Users, Settings,
  LogOut, Menu, X, Search, Bell, ChevronLeft, ChevronRight,
  TrendingUp, Clock, CheckCircle, Package, Plus, Trash2, Edit3,
  Eye, Filter, Download, Upload, Star, AlertCircle, ArrowUp, ArrowDown,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { supabase, adminLogin, adminLogout, isAdminLoggedIn, logAdminAction } from '../lib/admin';

// ============ Types ============
type AdminPage = 'dashboard' | 'orders' | 'galleries' | 'posts' | 'users' | 'settings';
interface Order { id: string; order_number: string; customer_name: string; customer_email: string; customer_phone: string; status: string; total_amount: string; items_json: any[]; notes: string; admin_notes: string; priority: string; created_at: string; updated_at: string; }
interface Gallery { id: string; title: string; description: string; category: string; cover_image: string; created_at: string; }
interface GalleryImage { id: string; gallery_id: string; title: string; description: string; image_url: string; sort_order: number; }
interface Post { id: string; title: string; slug: string; content: string; excerpt: string; category: string; tags: string[]; status: string; featured_image: string; published_at: string; created_at: string; }
interface SiteUser { id: string; first_name: string; last_name: string; email: string; phone: string; is_active: boolean; order_count: number; created_at: string; }
interface Setting { id: string; key: string; value: string; category: string; }
interface AdminLog { id: string; action: string; entity: string; details: string; created_at: string; }

const COLORS_CHART = ['#BFA36A', '#6F6A64', '#C0C0C0', '#E17055', '#00B894', '#FDCB6E'];
const STATUS_COLORS: Record<string, string> = { new: '#3b82f6', processing: '#f59e0b', completed: '#10b981', cancelled: '#ef4444' };
const STATUS_LABELS: Record<string, string> = { new: 'جدید', processing: 'در حال بررسی', completed: 'تکمیل شده', cancelled: 'لغو شده' };

// ============ Main Admin Panel ============
export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const [loggedIn, setLoggedIn] = useState(isAdminLoggedIn());
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!loggedIn) {
    return <LoginScreen onSuccess={() => setLoggedIn(true)} onClose={onClose} />;
  }

  const navItems: { id: AdminPage; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'داشبورد', icon: LayoutDashboard },
    { id: 'orders', label: 'سفارشات', icon: ShoppingBag },
    { id: 'galleries', label: 'گالری‌ها', icon: Image },
    { id: 'posts', label: 'مطالب', icon: FileText },
    { id: 'users', label: 'کاربران', icon: Users },
    { id: 'settings', label: 'تنظیمات', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex" style={{ background: '#0f0f0f', color: '#e5e5e5' }} dir="rtl">
      {/* Sidebar */}
      <aside
        className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 flex flex-col border-l border-white/10 flex-shrink-0`}
        style={{ background: '#161616' }}
      >
        <div className="h-16 flex items-center justify-center border-b border-white/10 flex-shrink-0">
          {sidebarOpen ? (
            <span className="font-en text-lg font-bold tracking-widest" style={{ color: '#BFA36A' }}>EVAQUEEN</span>
          ) : (
            <span className="font-en text-sm font-bold" style={{ color: '#BFA36A' }}>EQ</span>
          )}
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-200 ${active ? 'border-r-2' : 'border-r-2 border-transparent'}`}
                style={{
                  background: active ? 'rgba(191,163,106,0.08)' : 'transparent',
                  borderRightColor: active ? '#BFA36A' : 'transparent',
                  color: active ? '#BFA36A' : '#9ca3af',
                }}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { adminLogout(); setLoggedIn(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded transition-colors"
          >
            <LogOut size={20} className="flex-shrink-0" />
            {sidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/10 flex-shrink-0" style={{ background: '#1a1a1a' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <h1 className="text-lg font-semibold">
              {navItems.find((n) => n.id === page)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">3</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <X size={18} />
              <span className="hidden sm:inline">بازگشت به سایت</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ background: '#0f0f0f' }}>
          {page === 'dashboard' && <Dashboard />}
          {page === 'orders' && <OrdersPage />}
          {page === 'galleries' && <GalleriesPage />}
          {page === 'posts' && <PostsPage />}
          {page === 'users' && <UsersPage />}
          {page === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}

// ============ Login Screen ============
function LoginScreen({ onSuccess, onClose }: { onSuccess: () => void; onClose: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const ok = await adminLogin(username, password);
    setLoading(false);
    if (ok) onSuccess();
    else setError('نام کاربری یا رمز عبور اشتباه است');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: '#0a0a0a' }} dir="rtl">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(191,163,106,0.06) 0%, transparent 60%)' }} />
      <button onClick={onClose} className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors">
        <X size={22} />
      </button>
      <div className="relative w-full max-w-sm mx-4" style={{ animation: 'scaleIn 0.4s ease forwards' }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 border-2 rounded-full flex items-center justify-center" style={{ borderColor: '#BFA36A' }}>
            <span className="font-en text-xl font-bold" style={{ color: '#BFA36A' }}>EQ</span>
          </div>
          <h1 className="font-en text-2xl font-bold tracking-widest mb-1" style={{ color: '#BFA36A' }}>EVAQUEEN</h1>
          <p className="text-sm text-gray-500">پنل مدیریت</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded border transition-colors"
              style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }}
              autoFocus
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block mb-1.5">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-sm rounded border transition-colors"
              style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }}
              required
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded text-sm font-medium tracking-wider transition-all duration-300"
            style={{ background: loading ? '#555' : '#BFA36A', color: '#0a0a0a' }}
          >
            {loading ? 'در حال ورود...' : 'ورود به پنل'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============ Dashboard ============
function Dashboard() {
  const [stats, setStats] = useState({ orders: 0, processing: 0, completed: 0, posts: 0, galleries: 0 });
  const [salesData, setSalesData] = useState<{ month: string; sales: number }[]>([]);
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: orders }, { data: posts }, { data: galleries }, { data: logsData }] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('posts').select('*'),
        supabase.from('galleries').select('*'),
        supabase.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      const orderList = orders || [];
      setStats({
        orders: orderList.length,
        processing: orderList.filter((o: Order) => o.status === 'processing').length,
        completed: orderList.filter((o: Order) => o.status === 'completed').length,
        posts: (posts || []).length,
        galleries: (galleries || []).length,
      });
      setStatusData([
        { name: 'جدید', value: orderList.filter((o: Order) => o.status === 'new').length },
        { name: 'در حال بررسی', value: orderList.filter((o: Order) => o.status === 'processing').length },
        { name: 'تکمیل شده', value: orderList.filter((o: Order) => o.status === 'completed').length },
        { name: 'لغو شده', value: orderList.filter((o: Order) => o.status === 'cancelled').length },
      ]);
      setSalesData([
        { month: 'فروردین', sales: 12 }, { month: 'اردیبهشت', sales: 19 },
        { month: 'خرداد', sales: 15 }, { month: 'تیر', sales: 25 },
        { month: 'مرداد', sales: 30 }, { month: 'شهریور', sales: 28 },
      ]);
      setLogs(logsData || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'کل سفارشات', value: stats.orders, icon: ShoppingBag, color: '#BFA36A' },
    { label: 'در حال پردازش', value: stats.processing, icon: Clock, color: '#f59e0b' },
    { label: 'تکمیل شده', value: stats.completed, icon: CheckCircle, color: '#10b981' },
    { label: 'مطالب منتشر شده', value: stats.posts, icon: FileText, color: '#3b82f6' },
    { label: 'گالری‌ها', value: stats.galleries, icon: Image, color: '#8b5cf6' },
  ];

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-lg p-5 border border-white/10" style={{ background: '#161616' }}>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${card.color}20` }}>
                  <Icon size={20} style={{ color: card.color }} />
                </div>
                <TrendingUp size={16} className="text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
              <div className="text-xs text-gray-500">{card.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg p-6 border border-white/10" style={{ background: '#161616' }}>
          <h3 className="text-sm font-semibold text-white mb-4">نمودار فروش ماهانه</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="month" tick={{ fill: '#666', fontSize: 11 }} />
              <YAxis tick={{ fill: '#666', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#e5e5e5' }} />
              <Bar dataKey="sales" fill="#BFA36A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg p-6 border border-white/10" style={{ background: '#161616' }}>
          <h3 className="text-sm font-semibold text-white mb-4">وضعیت سفارشات</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                {statusData.map((_, i) => <Cell key={i} fill={COLORS_CHART[i % COLORS_CHART.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#e5e5e5' }} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#888' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-lg p-6 border border-white/10" style={{ background: '#161616' }}>
        <h3 className="text-sm font-semibold text-white mb-4">آخرین فعالیت‌ها</h3>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">فعالیتی ثبت نشده است</p>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(191,163,106,0.1)' }}>
                  <Star size={14} style={{ color: '#BFA36A' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{log.details}</p>
                  <p className="text-xs text-gray-600">{new Date(log.created_at).toLocaleString('fa-IR')}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ============ Orders Page ============
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'date' | 'status' | 'priority'>('date');
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const PER_PAGE = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('orders').select('*');
    if (statusFilter !== 'all') q = q.eq('status', statusFilter);
    if (search) q = q.or(`customer_name.ilike.%${search}%,customer_email.ilike.%${search}%,order_number.ilike.%${search}%`);
    if (sortBy === 'date') q = q.order('created_at', { ascending: false });
    else if (sortBy === 'status') q = q.order('status');
    else q = q.order('priority');
    q = q.range(page * PER_PAGE, (page + 1) * PER_PAGE - 1);
    const { data } = await q;
    setOrders(data || []);
    setLoading(false);
  }, [statusFilter, search, sortBy, page]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrderStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    await logAdminAction('update_order', 'order', `تغییر وضعیت سفارش به ${STATUS_LABELS[status]}`);
    fetchOrders();
    setSelectedOrder(null);
  };

  const addAdminNote = async (id: string, note: string) => {
    await supabase.from('orders').update({ admin_notes: note, updated_at: new Date().toISOString() }).eq('id', id);
    fetchOrders();
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" />
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل، شماره سفارش..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full pr-10 pl-4 py-2.5 text-sm rounded border"
            style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="px-4 py-2.5 text-sm rounded border"
          style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }}
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="new">جدید</option>
          <option value="processing">در حال بررسی</option>
          <option value="completed">تکمیل شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2.5 text-sm rounded border"
          style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }}
        >
          <option value="date">مرتب‌سازی: تاریخ</option>
          <option value="status">مرتب‌سازی: وضعیت</option>
          <option value="priority">مرتب‌سازی: اولویت</option>
        </select>
        <button
          onClick={() => exportOrdersCSV(orders)}
          className="flex items-center gap-2 px-4 py-2.5 text-sm rounded border border-white/10 hover:border-white/30 transition-colors"
          style={{ background: '#161616', color: '#9ca3af' }}
        >
          <Download size={16} /> CSV
        </button>
      </div>

      {/* Table */}
      {loading ? <LoadingSpinner /> : (
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ background: '#161616' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10" style={{ background: '#1a1a1a' }}>
                  <th className="text-right px-4 py-3 font-medium text-gray-400">شماره سفارش</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-400">مشتری</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-400 hidden md:table-cell">تاریخ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-400">مبلغ</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-400">وضعیت</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-400">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-8 text-gray-500">سفارشی یافت نشد</td></tr>
                ) : orders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-en text-white">{order.order_number}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-200">{order.customer_name}</div>
                      <div className="text-xs text-gray-500">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{new Date(order.created_at).toLocaleDateString('fa-IR')}</td>
                    <td className="px-4 py-3 font-en" style={{ color: '#BFA36A' }}>{order.total_amount}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded text-xs font-medium" style={{ background: `${STATUS_COLORS[order.status]}20`, color: STATUS_COLORS[order.status] }}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)} className="text-gray-400 hover:text-white transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/10">
            <span className="text-xs text-gray-500">صفحه {page + 1}</span>
            <div className="flex gap-2">
              <button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0} className="px-3 py-1.5 text-xs rounded border border-white/10 disabled:opacity-30 hover:border-white/30 transition-colors">قبلی</button>
              <button onClick={() => setPage(page + 1)} disabled={orders.length < PER_PAGE} className="px-3 py-1.5 text-xs rounded border border-white/10 disabled:opacity-30 hover:border-white/30 transition-colors">بعدی</button>
            </div>
          </div>
        </div>
      )}

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={(status) => updateOrderStatus(selectedOrder.id, status)}
          onAddNote={(note) => addAdminNote(selectedOrder.id, note)}
        />
      )}
    </div>
  );
}

function OrderDetailModal({ order, onClose, onStatusChange, onAddNote }: {
  order: Order; onClose: () => void; onStatusChange: (s: string) => void; onAddNote: (n: string) => void;
}) {
  const [note, setNote] = useState(order.admin_notes || '');

  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-lg" style={{ background: '#161616', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">سفارش {order.order_number}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-5">
            {/* Customer info */}
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">نام مشتری</label><p className="text-sm text-white">{order.customer_name}</p></div>
              <div><label className="text-xs text-gray-500">ایمیل</label><p className="text-sm text-white">{order.customer_email}</p></div>
              <div><label className="text-xs text-gray-500">تلفن</label><p className="text-sm text-white">{order.customer_phone || '-'}</p></div>
              <div><label className="text-xs text-gray-500">اولویت</label><p className="text-sm text-white">{order.priority}</p></div>
            </div>
            {/* Items */}
            <div>
              <label className="text-xs text-gray-500 block mb-2">محصولات</label>
              <div className="space-y-2">
                {(order.items_json || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded border border-white/10" style={{ background: '#1a1a1a' }}>
                    <span className="text-sm text-gray-200">{item.name}</span>
                    <span className="text-sm font-en" style={{ color: '#BFA36A' }}>{item.price} × {item.qty || 1}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Total */}
            <div className="flex justify-between items-center pt-3 border-t border-white/10">
              <span className="text-sm text-gray-400">مبلغ کل</span>
              <span className="text-lg font-bold font-en" style={{ color: '#BFA36A' }}>{order.total_amount}</span>
            </div>
            {/* Status change */}
            <div>
              <label className="text-xs text-gray-500 block mb-2">تغییر وضعیت</label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => onStatusChange(val)}
                    className="px-3 py-2 text-xs rounded border transition-all"
                    style={{
                      background: order.status === val ? `${STATUS_COLORS[val]}20` : 'transparent',
                      borderColor: order.status === val ? STATUS_COLORS[val] : '#333',
                      color: order.status === val ? STATUS_COLORS[val] : '#9ca3af',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            {/* Admin note */}
            <div>
              <label className="text-xs text-gray-500 block mb-2">یادداشت داخلی</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onBlur={() => onAddNote(note)}
                rows={3}
                className="w-full px-4 py-2 text-sm rounded border resize-none"
                style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }}
                placeholder="یادداشت داخلی برای این سفارش..."
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function exportOrdersCSV(orders: Order[]) {
  const headers = ['شماره سفارش', 'مشتری', 'ایمیل', 'تلفن', 'وضعیت', 'مبلغ', 'تاریخ'];
  const rows = orders.map(o => [o.order_number, o.customer_name, o.customer_email, o.customer_phone, STATUS_LABELS[o.status], o.total_amount, new Date(o.created_at).toLocaleDateString('fa-IR')]);
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'orders.csv'; a.click();
  URL.revokeObjectURL(url);
}

// ============ Galleries Page ============
function GalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState('');

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('galleries').select('*').order('created_at', { ascending: false });
    if (search) q = q.ilike('title', `%${search}%`);
    const { data } = await q;
    setGalleries(data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchGalleries(); }, [fetchGalleries]);

  const deleteGallery = async (id: string) => {
    if (!confirm('آیا از حذف این گالری مطمئن هستید؟')) return;
    await supabase.from('galleries').delete().eq('id', id);
    await logAdminAction('delete_gallery', 'gallery', 'حذف گالری');
    fetchGalleries();
  };

  const createGallery = async (title: string, description: string, category: string) => {
    await supabase.from('galleries').insert({ title, description, category, cover_image: '/assets/images/collections/collection-1.jpg' });
    await logAdminAction('create_gallery', 'gallery', `ایجاد گالری ${title}`);
    setShowCreate(false);
    fetchGalleries();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" />
          <input type="text" placeholder="جستجو در گالری‌ها..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }} />
        </div>
        <div className="flex gap-1 rounded border border-white/10 p-1" style={{ background: '#161616' }}>
          <button onClick={() => setView('grid')} className={`p-2 rounded ${view === 'grid' ? 'bg-white/10' : ''}`}><Image size={16} /></button>
          <button onClick={() => setView('list')} className={`p-2 rounded ${view === 'list' ? 'bg-white/10' : ''}`}><Menu size={16} /></button>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm rounded font-medium" style={{ background: '#BFA36A', color: '#0a0a0a' }}>
          <Plus size={16} /> گالری جدید
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
          {galleries.length === 0 ? (
            <p className="text-center text-gray-500 py-8">گالری‌ای یافت نشد</p>
          ) : galleries.map((g) => (
            <div key={g.id} className={`rounded-lg border border-white/10 overflow-hidden ${view === 'grid' ? '' : 'flex items-center'}`} style={{ background: '#161616' }}>
              <div className={view === 'grid' ? 'aspect-video relative' : 'w-24 h-20 flex-shrink-0 relative'}>
                <img src={g.cover_image} alt={g.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className={view === 'grid' ? 'p-4' : 'flex-1 p-4'}>
                <h3 className="text-sm font-semibold text-white mb-1">{g.title}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-1">{g.description}</p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs rounded" style={{ background: 'rgba(191,163,106,0.15)', color: '#BFA36A' }}>{g.category || 'عمومی'}</span>
                  <button onClick={() => setSelectedGallery(g)} className="text-gray-400 hover:text-white ml-auto"><Eye size={15} /></button>
                  <button onClick={() => deleteGallery(g.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedGallery && <GalleryDetailModal gallery={selectedGallery} onClose={() => setSelectedGallery(null)} />}
      {showCreate && <CreateGalleryModal onClose={() => setShowCreate(false)} onCreate={createGallery} />}
    </div>
  );
}

function GalleryDetailModal({ gallery, onClose }: { gallery: Gallery; onClose: () => void }) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('gallery_images').select('*').eq('gallery_id', gallery.id).order('sort_order');
      setImages(data || []);
      setLoading(false);
    })();
  }, [gallery.id]);

  const addImage = async (url: string, title: string) => {
    await supabase.from('gallery_images').insert({ gallery_id: gallery.id, image_url: url, title, sort_order: images.length });
    const { data } = await supabase.from('gallery_images').select('*').eq('gallery_id', gallery.id).order('sort_order');
    setImages(data || []);
  };

  const deleteImage = async (id: string) => {
    await supabase.from('gallery_images').delete().eq('id', id);
    setImages(images.filter((img) => img.id !== id));
  };

  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-lg" style={{ background: '#161616', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{gallery.title}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-6">
            {/* Upload area */}
            <div className="mb-4 p-6 border-2 border-dashed border-white/10 rounded-lg text-center">
              <Upload size={24} className="mx-auto text-gray-500 mb-2" />
              <p className="text-sm text-gray-400 mb-2">تصاویر را اینجا بکشید یا کلیک کنید</p>
              <input type="text" placeholder="آدرس تصویر..." className="w-full max-w-sm px-3 py-2 text-sm rounded border mb-2" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} onKeyDown={(e) => { if (e.key === 'Enter') { const v = (e.target as HTMLInputElement).value; if (v) { addImage(v, 'تصویر جدید'); (e.target as HTMLInputElement).value = ''; } } }} />
            </div>
            {loading ? <LoadingSpinner /> : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((img) => (
                  <div key={img.id} className="group relative aspect-square rounded overflow-hidden border border-white/10">
                    <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button onClick={() => deleteImage(img.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CreateGalleryModal({ onClose, onCreate }: { onClose: () => void; onCreate: (t: string, d: string, c: string) => void }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [cat, setCat] = useState('');
  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-md rounded-lg p-6" style={{ background: '#161616', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <h2 className="text-lg font-semibold text-white mb-4">گالری جدید</h2>
          <div className="space-y-4">
            <input type="text" placeholder="عنوان گالری" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
            <textarea placeholder="توضیحات" value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="w-full px-4 py-2.5 text-sm rounded border resize-none" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
            <input type="text" placeholder="دسته‌بندی" value={cat} onChange={(e) => setCat(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
            <div className="flex gap-3">
              <button onClick={() => onCreate(title, desc, cat)} disabled={!title} className="flex-1 py-2.5 text-sm rounded font-medium disabled:opacity-30" style={{ background: '#BFA36A', color: '#0a0a0a' }}>ایجاد</button>
              <button onClick={onClose} className="px-4 py-2.5 text-sm rounded border border-white/10 text-gray-400 hover:text-white">انصراف</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ Posts Page (CMS) ============
function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') q = q.eq('status', statusFilter);
    if (search) q = q.ilike('title', `%${search}%`);
    const { data } = await q;
    setPosts(data || []);
    setLoading(false);
  }, [search, statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const deletePost = async (id: string) => {
    if (!confirm('حذف این مطلب؟')) return;
    await supabase.from('posts').delete().eq('id', id);
    fetchPosts();
  };

  const togglePublish = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    await supabase.from('posts').update({ status: newStatus, published_at: newStatus === 'published' ? new Date().toISOString() : null }).eq('id', post.id);
    await logAdminAction('publish_post', 'post', `${newStatus === 'published' ? 'انتشار' : 'پیش‌نویس'} ${post.title}`);
    fetchPosts();
  };

  const savePost = async (data: Partial<Post>) => {
    if (selectedPost) {
      await supabase.from('posts').update({ ...data, updated_at: new Date().toISOString() }).eq('id', selectedPost.id);
    } else {
      await supabase.from('posts').insert({ ...data, slug: data.slug || data.title?.replace(/\s+/g, '-') });
    }
    await logAdminAction('save_post', 'post', `ذخیره مطلب ${data.title}`);
    setShowEditor(false);
    setSelectedPost(null);
    fetchPosts();
  };

  const POST_STATUS: Record<string, { label: string; color: string }> = {
    draft: { label: 'پیش‌نویس', color: '#6b7280' },
    published: { label: 'منتشر شده', color: '#10b981' },
    scheduled: { label: 'برنامه‌ریزی شده', color: '#f59e0b' },
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" />
          <input type="text" placeholder="جستجو در مطالب..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }}>
          <option value="all">همه</option>
          <option value="draft">پیش‌نویس</option>
          <option value="published">منتشر شده</option>
          <option value="scheduled">برنامه‌ریزی شده</option>
        </select>
        <button onClick={() => { setSelectedPost(null); setShowEditor(true); }} className="flex items-center gap-2 px-4 py-2.5 text-sm rounded font-medium" style={{ background: '#BFA36A', color: '#0a0a0a' }}>
          <Plus size={16} /> مطلب جدید
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ background: '#161616' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10" style={{ background: '#1a1a1a' }}>
                <th className="text-right px-4 py-3 font-medium text-gray-400">عنوان</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400 hidden md:table-cell">دسته</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400">وضعیت</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400 hidden md:table-cell">تاریخ</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-gray-500">مطلبی یافت نشد</td></tr>
              ) : posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{post.title}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{post.category || '-'}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs" style={{ background: `${POST_STATUS[post.status]?.color}20`, color: POST_STATUS[post.status]?.color }}>
                      {POST_STATUS[post.status]?.label || post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{post.published_at ? new Date(post.published_at).toLocaleDateString('fa-IR') : '-'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setSelectedPost(post); setShowEditor(true); }} className="text-gray-400 hover:text-white"><Edit3 size={15} /></button>
                      <button onClick={() => togglePublish(post)} className="text-gray-400 hover:text-green-400"><CheckCircle size={15} /></button>
                      <button onClick={() => deletePost(post.id)} className="text-gray-400 hover:text-red-400"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditor && <PostEditor post={selectedPost} onClose={() => { setShowEditor(false); setSelectedPost(null); }} onSave={savePost} />}
    </div>
  );
}

function PostEditor({ post, onClose, onSave }: { post: Post | null; onClose: () => void; onSave: (d: Partial<Post>) => void }) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || '');
  const [tags, setTags] = useState((post?.tags || []).join(', '));
  const [status, setStatus] = useState(post?.status || 'draft');

  return (
    <>
      <div className="fixed inset-0 z-[110]" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" dir="rtl">
        <div className="w-full max-w-3xl max-h-[88vh] overflow-y-auto rounded-lg" style={{ background: '#161616', border: '1px solid #333' }} onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{post ? 'ویرایش مطلب' : 'مطلب جدید'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={20} /></button>
          </div>
          <div className="p-6 space-y-4">
            <input type="text" placeholder="عنوان مطلب" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Slug (URL)" value={slug} onChange={(e) => setSlug(e.target.value)} className="px-4 py-2.5 text-sm rounded border font-en" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
              <input type="text" placeholder="دسته‌بندی" value={category} onChange={(e) => setCategory(e.target.value)} className="px-4 py-2.5 text-sm rounded border" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
            </div>
            <textarea placeholder="خلاصه مطلب (SEO)" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full px-4 py-2.5 text-sm rounded border resize-none" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
            <textarea placeholder="محتوای مطلب..." value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="w-full px-4 py-2.5 text-sm rounded border resize-none" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
            <div className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="برچسب‌ها (با کاما جدا کنید)" value={tags} onChange={(e) => setTags(e.target.value)} className="px-4 py-2.5 text-sm rounded border" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-4 py-2.5 text-sm rounded border" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }}>
                <option value="draft">پیش‌نویس</option>
                <option value="published">منتشر شده</option>
                <option value="scheduled">برنامه‌ریزی شده</option>
              </select>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => onSave({ title, slug, content, excerpt, category, tags: tags.split(',').map(t => t.trim()).filter(Boolean), status })} disabled={!title} className="flex-1 py-2.5 text-sm rounded font-medium disabled:opacity-30" style={{ background: '#BFA36A', color: '#0a0a0a' }}>ذخیره</button>
              <button onClick={onClose} className="px-4 py-2.5 text-sm rounded border border-white/10 text-gray-400 hover:text-white">انصراف</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ============ Users Page ============
function UsersPage() {
  const [users, setUsers] = useState<SiteUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let q = supabase.from('site_users').select('*').order('created_at', { ascending: false });
    if (search) q = q.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    const { data } = await q;
    setUsers(data || []);
    setLoading(false);
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleActive = async (user: SiteUser) => {
    await supabase.from('site_users').update({ is_active: !user.is_active }).eq('id', user.id);
    fetchUsers();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500" />
          <input type="text" placeholder="جستجوی کاربر..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pr-10 pl-4 py-2.5 text-sm rounded border" style={{ background: '#161616', borderColor: '#333', color: '#e5e5e5' }} />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm rounded border border-white/10 hover:border-white/30 transition-colors" style={{ background: '#161616', color: '#9ca3af' }}>
          <Download size={16} /> خروجی CSV
        </button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="rounded-lg border border-white/10 overflow-hidden" style={{ background: '#161616' }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10" style={{ background: '#1a1a1a' }}>
                <th className="text-right px-4 py-3 font-medium text-gray-400">نام</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400">ایمیل</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400 hidden md:table-cell">تلفن</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400">سفارشات</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400">وضعیت</th>
                <th className="text-right px-4 py-3 font-medium text-gray-400">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-500">کاربری یافت نشد</td></tr>
              ) : users.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white">{user.first_name} {user.last_name}</td>
                  <td className="px-4 py-3 text-gray-400">{user.email}</td>
                  <td className="px-4 py-3 text-gray-400 hidden md:table-cell">{user.phone || '-'}</td>
                  <td className="px-4 py-3 font-en text-white">{user.order_count}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs" style={{ background: user.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: user.is_active ? '#10b981' : '#ef4444' }}>
                      {user.is_active ? 'فعال' : 'غیرفعال'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(user)} className="text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded transition-colors">
                      {user.is_active ? 'غیرفعال کردن' : 'فعال کردن'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ============ Settings Page ============
function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('site_settings').select('*');
      setSettings(data || []);
      setLoading(false);
    })();
  }, []);

  const getValue = (key: string) => settings.find((s) => s.key === key)?.value || '';
  const updateValue = (key: string, value: string) => {
    setSettings((prev) => {
      const exists = prev.find((s) => s.key === key);
      if (exists) return prev.map((s) => s.key === key ? { ...s, value } : s);
      return [...prev, { id: 'temp', key, value, category: activeTab }];
    });
  };

  const save = async () => {
    setSaving(true);
    for (const s of settings) {
      if (s.id === 'temp') {
        await supabase.from('site_settings').insert({ key: s.key, value: s.value, category: s.category });
      } else {
        await supabase.from('site_settings').update({ value: s.value, updated_at: new Date().toISOString() }).eq('id', s.id);
      }
    }
    await logAdminAction('update_settings', 'settings', 'بروزرسانی تنظیمات سایت');
    setSaving(false);
  };

  const tabs = [
    { id: 'general', label: 'عمومی' },
    { id: 'shop', label: 'فروشگاه' },
    { id: 'notifications', label: 'اعلان‌ها' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex gap-1 border-b border-white/10">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-3 text-sm border-b-2 transition-colors ${activeTab === tab.id ? 'border-current' : 'border-transparent text-gray-500 hover:text-gray-300'}`} style={{ color: activeTab === tab.id ? '#BFA36A' : undefined }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="rounded-lg p-6 border border-white/10 space-y-4" style={{ background: '#161616' }}>
        {activeTab === 'general' && (
          <>
            <SettingField label="عنوان سایت" value={getValue('site_title')} onChange={(v) => updateValue('site_title', v)} />
            <SettingField label="توضیحات متا" value={getValue('site_description')} onChange={(v) => updateValue('site_description', v)} />
            <div>
              <label className="text-xs text-gray-400 block mb-2">رنگ اصلی</label>
              <div className="flex items-center gap-3">
                <input type="color" value={getValue('primary_color') || '#BFA36A'} onChange={(e) => updateValue('primary_color', e.target.value)} className="w-12 h-10 rounded cursor-pointer" style={{ background: '#1a1a1a' }} />
                <span className="font-en text-sm text-gray-300">{getValue('primary_color') || '#BFA36A'}</span>
              </div>
            </div>
          </>
        )}
        {activeTab === 'shop' && (
          <>
            <SettingField label="واحد پول" value={getValue('currency')} onChange={(v) => updateValue('currency', v)} />
            <SettingField label="نرخ مالیات (٪)" value={getValue('tax_rate')} onChange={(v) => updateValue('tax_rate', v)} />
            <SettingField label="حداقل مبلغ سفارش" value={getValue('min_order')} onChange={(v) => updateValue('min_order', v)} />
            <SettingField label="روش ارسال" value={getValue('shipping_method')} onChange={(v) => updateValue('shipping_method', v)} />
          </>
        )}
        {activeTab === 'notifications' && (
          <>
            <SettingField label="SMTP Host" value={getValue('smtp_host')} onChange={(v) => updateValue('smtp_host', v)} />
            <SettingField label="SMTP Port" value={getValue('smtp_port')} onChange={(v) => updateValue('smtp_port', v)} />
          </>
        )}
        <button onClick={save} disabled={saving} className="flex items-center gap-2 px-6 py-2.5 text-sm rounded font-medium disabled:opacity-30" style={{ background: '#BFA36A', color: '#0a0a0a' }}>
          {saving ? 'در حال ذخیره...' : 'ذخیره تنظیمات'}
        </button>
      </div>
    </div>
  );
}

function SettingField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-400 block mb-1.5">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-4 py-2.5 text-sm rounded border" style={{ background: '#1a1a1a', borderColor: '#333', color: '#e5e5e5' }} />
    </div>
  );
}

// ============ Shared ============
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-2 border-white/10 rounded-full animate-spin" style={{ borderTopColor: '#BFA36A' }} />
    </div>
  );
}
