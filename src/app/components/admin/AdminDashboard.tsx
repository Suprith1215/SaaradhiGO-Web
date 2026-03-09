import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  LayoutDashboard, Car, CreditCard, LifeBuoy, Bell, Settings,
  Search, ChevronDown, TrendingUp, TrendingDown, Users, MapPin,
  Star, AlertTriangle, CheckCircle, Clock, Filter, Download,
  MoreVertical, ArrowUpRight, ArrowDownLeft, Shield, Zap, Eye,
  RefreshCw, X
} from 'lucide-react';
import logoImage from 'figma:asset/25a5bd8011d7696bf02e1d5cc818a54ef634abf4.png';

const G = '#D4AF37';
const DARK = '#050D1A';
const NAVY = '#0F1C2E';
const CARD = 'rgba(255,255,255,0.04)';
const BORDER = 'rgba(255,255,255,0.08)';
const GOLD_BORDER = 'rgba(212,175,55,0.2)';

type AdminSection = 'dashboard' | 'rides' | 'payments' | 'support';

/* ──── Reusable Admin Card ──── */
function ACard({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`rounded-2xl ${className}`}
      style={{ background: CARD, backdropFilter: 'blur(8px)', border: `1px solid ${BORDER}`, ...style }}>
      {children}
    </div>
  );
}

function MetricCard({ title, value, change, changeType, icon, color }: {
  title: string; value: string; change: string; changeType: 'up' | 'down'; icon: string; color: string;
}) {
  return (
    <ACard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm mb-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
          {icon}
        </div>
      </div>
      <div className="flex items-center gap-1">
        {changeType === 'up' ? <TrendingUp size={14} color="#00C864" /> : <TrendingDown size={14} color="#FF4444" />}
        <span className="text-sm font-medium" style={{ color: changeType === 'up' ? '#00C864' : '#FF4444' }}>{change}</span>
        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>vs last month</span>
      </div>
    </ACard>
  );
}

const revenueData = [
  { month: 'Oct', revenue: 420000, rides: 8200 },
  { month: 'Nov', revenue: 510000, rides: 9800 },
  { month: 'Dec', revenue: 580000, rides: 11200 },
  { month: 'Jan', revenue: 490000, rides: 9400 },
  { month: 'Feb', revenue: 640000, rides: 12800 },
];

const dailyData = [
  { day: 'Mon', revenue: 48000, rides: 920 },
  { day: 'Tue', revenue: 52000, rides: 1040 },
  { day: 'Wed', revenue: 45000, rides: 870 },
  { day: 'Thu', revenue: 61000, rides: 1180 },
  { day: 'Fri', revenue: 72000, rides: 1390 },
  { day: 'Sat', revenue: 86000, rides: 1650 },
  { day: 'Sun', revenue: 58000, rides: 1120 },
];

const rideTypeData = [
  { name: 'Mini', value: 42, color: G },
  { name: 'Auto', value: 28, color: '#4A9EFF' },
  { name: 'Prime', value: 18, color: '#A855F7' },
  { name: 'Bike', value: 12, color: '#00C864' },
];

const rides = [
  { id: 'SG-84721', customer: 'Arjun Kumar', driver: 'Ramesh K.', from: 'Koramangala', to: 'Indiranagar', fare: '₹186', type: 'Mini', status: 'Completed', time: '2:32 PM' },
  { id: 'SG-84720', customer: 'Priya Sharma', driver: 'Suresh M.', from: 'MG Road', to: 'Airport', fare: '₹680', type: 'Prime', status: 'Completed', time: '8:15 AM' },
  { id: 'SG-84719', customer: 'Mohan Rao', driver: 'Ravi Kumar', from: 'HSR Layout', to: 'Whitefield', fare: '₹245', type: 'Mini', status: 'Cancelled', time: '6:45 PM' },
  { id: 'SG-84718', customer: 'Ananya Reddy', driver: 'Kiran Nair', from: 'Banashankari', to: 'Cubbon Park', fare: '₹130', type: 'Auto', status: 'In Progress', time: '1:20 PM' },
  { id: 'SG-84717', customer: 'Vikram Singh', driver: 'Arun Prasad', from: 'Jayanagar', to: 'Marathahalli', fare: '₹310', type: 'Mini', status: 'Completed', time: '11:55 AM' },
  { id: 'SG-84716', customer: 'Deepa Nair', driver: 'Ganesh B.', from: 'Rajajinagar', to: 'Electronic City', fare: '₹580', type: 'Prime', status: 'Completed', time: '9:30 AM' },
];

const tickets = [
  { id: 'TK-1245', user: 'Arjun Kumar', type: 'Customer', issue: 'Payment not refunded', status: 'Open', priority: 'High', time: '1h ago' },
  { id: 'TK-1244', user: 'Ramesh Kumar', type: 'Driver', issue: 'App navigation crash', status: 'In Progress', priority: 'Medium', time: '3h ago' },
  { id: 'TK-1243', user: 'Priya Sharma', type: 'Customer', issue: 'Driver was rude', status: 'Resolved', priority: 'High', time: '5h ago' },
  { id: 'TK-1242', user: 'Suresh M.', type: 'Driver', issue: 'Incentive not credited', status: 'Open', priority: 'Low', time: '8h ago' },
  { id: 'TK-1241', user: 'Mohan Rao', type: 'Customer', issue: 'Cancellation charge dispute', status: 'In Progress', priority: 'Medium', time: '12h ago' },
];

/* ──── DASHBOARD OVERVIEW ──── */
function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-5">
        <MetricCard title="Total Revenue" value="₹6.4L" change="+18.4%" changeType="up" icon="💰" color={G} />
        <MetricCard title="Total Rides" value="12,840" change="+12.8%" changeType="up" icon="🚗" color="#4A9EFF" />
        <MetricCard title="Active Drivers" value="2,148" change="+5.2%" changeType="up" icon="👤" color="#00C864" />
        <MetricCard title="Avg. Rating" value="4.82" change="-0.02" changeType="down" icon="⭐" color="#FFAA00" />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Revenue chart */}
        <ACard className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Revenue Overview</h3>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Monthly performance</p>
            </div>
            <select className="text-xs px-3 py-1.5 rounded-lg outline-none text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${BORDER}` }}>
              <option>Last 5 Months</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={G} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={G} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: '#0F1C2E', border: `1px solid ${GOLD_BORDER}`, borderRadius: 12, color: 'white' }}
                formatter={(v: number) => [`₹${(v / 1000).toFixed(1)}K`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke={G} strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </ACard>

        {/* Ride types */}
        <ACard className="p-6">
          <h3 className="text-base font-semibold text-white mb-1">Ride Distribution</h3>
          <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>By category</p>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={rideTypeData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {rideTypeData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {rideTypeData.map(r => (
              <div key={r.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: r.color }} />
                <span className="text-xs flex-1" style={{ color: 'rgba(255,255,255,0.7)' }}>{r.name}</span>
                <span className="text-xs font-medium text-white">{r.value}%</span>
              </div>
            ))}
          </div>
        </ACard>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Daily chart */}
        <ACard className="col-span-2 p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold text-white">Daily Rides This Week</h3>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Trips & earnings breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={dailyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#0F1C2E', border: `1px solid ${GOLD_BORDER}`, borderRadius: 12, color: 'white' }} />
              <Bar dataKey="rides" fill={G} radius={[4, 4, 0, 0]} opacity={0.9} />
            </BarChart>
          </ResponsiveContainer>
        </ACard>

        {/* Live stats */}
        <ACard className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C864' }} />
            <h3 className="text-base font-semibold text-white">Live Now</h3>
          </div>
          {[
            { label: 'Active Rides', value: '248', icon: '🚗', color: G },
            { label: 'Drivers Online', value: '1,842', icon: '👤', color: '#4A9EFF' },
            { label: 'Pending Requests', value: '37', icon: '⏳', color: '#FFAA00' },
            { label: 'Surge Zones', value: '5', icon: '⚡', color: '#FF4444' },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: `${s.color}08`, border: `1px solid ${s.color}20` }}>
              <span className="text-xl">{s.icon}</span>
              <div className="flex-1">
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{s.label}</p>
                <p className="text-lg font-bold text-white">{s.value}</p>
              </div>
              <ArrowUpRight size={14} color={s.color} />
            </div>
          ))}
        </ACard>
      </div>

      {/* Live map widget */}
      <ACard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Live Ride Map</h3>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Bengaluru coverage area</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C864' }} />
            <span className="text-xs" style={{ color: '#00C864' }}>248 active rides</span>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden h-64 relative">
          <svg viewBox="0 0 900 256" className="w-full h-full" style={{ background: '#0D1B2A' }}>
            {/* Wide city map */}
            <rect width="900" height="256" fill="#0D1B2A" />
            {[40, 90, 140, 180, 220].map(y => <rect key={y} x="0" y={y} width="900" height="8" fill="#132130" />)}
            {[80, 180, 300, 450, 600, 750, 840].map(x => <rect key={x} x={x} y="0" width="8" height="256" fill="#132130" />)}
            {[[150, 60], [320, 100], [490, 40], [650, 80], [800, 120], [200, 200], [500, 160], [700, 200]].map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx}, ${cy})`}>
                <circle r="10" fill="#1E3A5F" stroke={G} strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fontSize="10">🚗</text>
              </g>
            ))}
            {/* Pickup/drop pins */}
            {[[380, 130], [560, 90]].map(([cx, cy], i) => (
              <g key={i} transform={`translate(${cx}, ${cy})`}>
                <circle r="8" fill={G} opacity="0.9" />
                <circle r="16" fill={G} opacity="0.2" />
              </g>
            ))}
            {/* Route */}
            <path d="M380 130 L450 100 L560 90" stroke={G} strokeWidth="3" fill="none" strokeDasharray="10,7" opacity="0.7" />
          </svg>
          <div className="absolute top-4 right-4 flex gap-2">
            {[{ label: '🚗 Active', color: G }, { label: '📍 Pickup', color: '#4A9EFF' }, { label: '🔴 Surge', color: '#FF4444' }].map(l => (
              <div key={l.label} className="px-3 py-1.5 rounded-lg text-xs"
                style={{ background: 'rgba(8,15,26,0.9)', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.8)' }}>
                {l.label}
              </div>
            ))}
          </div>
        </div>
      </ACard>
    </div>
  );
}

/* ──── RIDE MANAGEMENT ──── */
function RideManagement() {
  const [filter, setFilter] = useState('all');
  const filters = ['all', 'completed', 'in-progress', 'cancelled'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Ride Management</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage and monitor all rides in real-time</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <Search size={15} color="rgba(255,255,255,0.4)" />
            <input className="bg-transparent text-sm text-white outline-none w-48 placeholder:text-white/30"
              placeholder="Search rides..." />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
            style={{ background: CARD, border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.7)' }}>
            <Filter size={15} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
            style={{ background: `linear-gradient(135deg, ${G}, #A8882A)`, color: DARK }}>
            <Download size={15} /> Export
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all"
            style={{
              background: filter === f ? 'rgba(212,175,55,0.15)' : CARD,
              border: `1px solid ${filter === f ? 'rgba(212,175,55,0.4)' : BORDER}`,
              color: filter === f ? G : 'rgba(255,255,255,0.6)',
            }}>
            {f === 'all' ? 'All Rides' : f.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <ACard>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Ride ID', 'Customer', 'Driver', 'Route', 'Fare', 'Type', 'Status', 'Time', 'Action'].map(h => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rides.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < rides.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <span className="text-sm font-mono" style={{ color: G }}>{r.id}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'rgba(212,175,55,0.1)' }}>
                      {r.customer[0]}
                    </div>
                    <span className="text-sm text-white">{r.customer}</span>
                  </div>
                </td>
                <td className="px-5 py-4"><span className="text-sm text-white">{r.driver}</span></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    <span>{r.from}</span>
                    <span>→</span>
                    <span>{r.to}</span>
                  </div>
                </td>
                <td className="px-5 py-4"><span className="text-sm font-semibold" style={{ color: G }}>{r.fare}</span></td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)' }}>
                    {r.type}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: r.status === 'Completed' ? 'rgba(0,200,100,0.1)' : r.status === 'In Progress' ? 'rgba(212,175,55,0.1)' : 'rgba(220,40,40,0.1)',
                      color: r.status === 'Completed' ? '#00C864' : r.status === 'In Progress' ? G : '#FF4444',
                    }}>
                    {r.status}
                  </span>
                </td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{r.time}</span></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.1)', border: `1px solid rgba(212,175,55,0.2)` }}>
                      <Eye size={13} color={G} />
                    </button>
                    <button className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                      <MoreVertical size={13} color="rgba(255,255,255,0.5)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ACard>
    </div>
  );
}

/* ──── PAYMENTS & REPORTS ──── */
function PaymentsReports() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Payments & Reports</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Financial overview and analytics</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2.5 rounded-xl text-sm outline-none text-white"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <option>February 2026</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm"
            style={{ background: `linear-gradient(135deg, ${G}, #A8882A)`, color: DARK }}>
            <Download size={15} /> Download Report
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Gross Revenue', value: '₹6,40,000', change: '+18%', up: true },
          { label: 'Platform Commission', value: '₹64,000', change: '+18%', up: true },
          { label: 'Driver Payouts', value: '₹5,76,000', change: '+17%', up: true },
          { label: 'Refunds Issued', value: '₹8,240', change: '-5%', up: false },
        ].map(c => (
          <ACard key={c.label} className="p-5">
            <p className="text-xs mb-2" style={{ color: 'rgba(255,255,255,0.45)' }}>{c.label}</p>
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {c.up ? <TrendingUp size={12} color="#00C864" /> : <TrendingDown size={12} color="#FF4444" />}
              <span className="text-xs" style={{ color: c.up ? '#00C864' : '#FF4444' }}>{c.change}</span>
            </div>
          </ACard>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Revenue trend */}
        <ACard className="p-6">
          <h4 className="text-base font-semibold text-white mb-4">Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ background: '#0F1C2E', border: `1px solid ${GOLD_BORDER}`, borderRadius: 12, color: 'white' }}
                formatter={(v: number) => [`₹${(v / 1000).toFixed(1)}K`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke={G} strokeWidth={2.5} dot={{ fill: G, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ACard>

        {/* Payment methods */}
        <ACard className="p-6">
          <h4 className="text-base font-semibold text-white mb-4">Payment Methods</h4>
          <div className="space-y-4">
            {[
              { method: '💰 Wallet', pct: 42, amount: '₹2,68,800', color: G },
              { method: '📲 UPI', pct: 35, amount: '₹2,24,000', color: '#4A9EFF' },
              { method: '💳 Card', pct: 15, amount: '₹96,000', color: '#A855F7' },
              { method: '💵 Cash', pct: 8, amount: '₹51,200', color: '#00C864' },
            ].map(p => (
              <div key={p.method}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>{p.method}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{p.amount}</span>
                    <span style={{ color: p.color }}>{p.pct}%</span>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${p.pct}%`, background: p.color, opacity: 0.8 }} />
                </div>
              </div>
            ))}
          </div>
        </ACard>
      </div>

      {/* Recent transactions */}
      <ACard>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <h4 className="text-base font-semibold text-white">Recent Transactions</h4>
          <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(212,175,55,0.1)', color: G }}>View All</button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Transaction ID', 'Ride ID', 'Customer', 'Amount', 'Method', 'Status', 'Date'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { txn: 'TXN-281045', ride: 'SG-84721', customer: 'Arjun Kumar', amount: '₹186', method: 'Wallet', status: 'Success', date: 'Today 2:32 PM' },
              { txn: 'TXN-281044', ride: 'SG-84720', customer: 'Priya Sharma', amount: '₹680', method: 'UPI', status: 'Success', date: 'Today 8:37 AM' },
              { txn: 'TXN-281043', ride: 'SG-84719', customer: 'Mohan Rao', amount: '₹50', method: 'Wallet', status: 'Refunded', date: 'Yesterday 6:45 PM' },
              { txn: 'TXN-281042', ride: 'SG-84718', customer: 'Ananya Reddy', amount: '₹130', method: 'Card', status: 'Pending', date: 'Today 1:20 PM' },
            ].map((t, i, arr) => (
              <tr key={t.txn} style={{ borderBottom: i < arr.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                <td className="px-5 py-4"><span className="text-sm font-mono" style={{ color: G }}>{t.txn}</span></td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.ride}</span></td>
                <td className="px-5 py-4"><span className="text-sm text-white">{t.customer}</span></td>
                <td className="px-5 py-4"><span className="text-sm font-semibold text-white">{t.amount}</span></td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{t.method}</span></td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: t.status === 'Success' ? 'rgba(0,200,100,0.1)' : t.status === 'Pending' ? 'rgba(255,170,0,0.1)' : 'rgba(74,158,255,0.1)',
                      color: t.status === 'Success' ? '#00C864' : t.status === 'Pending' ? '#FFAA00' : '#4A9EFF',
                    }}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.date}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </ACard>
    </div>
  );
}

/* ──── SUPPORT TICKETS ──── */
function SupportTickets() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">Support Tickets</h3>
          <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>Manage customer & driver issues</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <Search size={15} color="rgba(255,255,255,0.4)" />
            <input className="bg-transparent text-sm text-white outline-none w-40 placeholder:text-white/30"
              placeholder="Search tickets..." />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Open Tickets', value: '24', color: '#FF4444', icon: '🔴' },
          { label: 'In Progress', value: '18', color: '#FFAA00', icon: '🟡' },
          { label: 'Resolved Today', value: '52', color: '#00C864', icon: '🟢' },
          { label: 'Avg. Response', value: '2.4h', color: G, icon: '⏱️' },
        ].map(s => (
          <ACard key={s.label} className="p-5 flex items-center gap-4">
            <span className="text-3xl">{s.icon}</span>
            <div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          </ACard>
        ))}
      </div>

      {/* Tickets table */}
      <ACard>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
              {['Ticket ID', 'User', 'Type', 'Issue', 'Priority', 'Status', 'Time', 'Actions'].map(h => (
                <th key={h} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'rgba(255,255,255,0.4)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tickets.map((t, i) => (
              <tr key={t.id} style={{ borderBottom: i < tickets.length - 1 ? `1px solid ${BORDER}` : 'none' }}
                className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4"><span className="text-sm font-mono" style={{ color: G }}>{t.id}</span></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                      style={{ background: 'rgba(212,175,55,0.1)' }}>{t.user[0]}</div>
                    <span className="text-sm text-white">{t.user}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: t.type === 'Customer' ? 'rgba(74,158,255,0.1)' : 'rgba(0,200,100,0.1)', color: t.type === 'Customer' ? '#4A9EFF' : '#00C864' }}>
                    {t.type}
                  </span>
                </td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{t.issue}</span></td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: t.priority === 'High' ? 'rgba(220,40,40,0.12)' : t.priority === 'Medium' ? 'rgba(255,170,0,0.1)' : 'rgba(255,255,255,0.06)', color: t.priority === 'High' ? '#FF4444' : t.priority === 'Medium' ? '#FFAA00' : 'rgba(255,255,255,0.6)' }}>
                    {t.priority}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: t.status === 'Open' ? 'rgba(220,40,40,0.1)' : t.status === 'In Progress' ? 'rgba(255,170,0,0.1)' : 'rgba(0,200,100,0.1)', color: t.status === 'Open' ? '#FF4444' : t.status === 'In Progress' ? '#FFAA00' : '#00C864' }}>
                    {t.status}
                  </span>
                </td>
                <td className="px-5 py-4"><span className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>{t.time}</span></td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: 'rgba(212,175,55,0.1)', color: G }}>View</button>
                    <button className="px-3 py-1.5 rounded-lg text-xs"
                      style={{ background: CARD, border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.6)' }}>Assign</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ACard>
    </div>
  );
}

/* ──── MAIN ADMIN DASHBOARD ──── */
export function AdminDashboard() {
  const [section, setSection] = useState<AdminSection>('dashboard');

  const navItems = [
    { id: 'dashboard' as AdminSection, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'rides' as AdminSection, icon: Car, label: 'Ride Management' },
    { id: 'payments' as AdminSection, icon: CreditCard, label: 'Payments & Reports' },
    { id: 'support' as AdminSection, icon: LifeBuoy, label: 'Support Tickets' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: DARK }}>
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 flex flex-col"
        style={{ background: `linear-gradient(180deg, #06101B 0%, #0A1628 100%)`, borderRight: `1px solid ${BORDER}` }}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <img src={logoImage} alt="SaaradhiGO" className="h-10 w-10 object-contain" />
          <div>
            <p className="text-sm font-bold" style={{ color: G }}>SaaradhiGO</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Admin Console</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => {
            const active = section === item.id;
            return (
              <button key={item.id} onClick={() => setSection(item.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={{
                  background: active ? 'rgba(212,175,55,0.1)' : 'transparent',
                  border: active ? `1px solid rgba(212,175,55,0.25)` : '1px solid transparent',
                }}>
                <item.icon size={18} color={active ? G : 'rgba(255,255,255,0.4)'} />
                <span className="text-sm font-medium" style={{ color: active ? G : 'rgba(255,255,255,0.5)' }}>{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: G }} />}
              </button>
            );
          })}
        </nav>

        {/* Quick stats */}
        <div className="px-3 pb-4 space-y-2">
          <div className="px-4 py-3 rounded-xl" style={{ background: 'rgba(0,200,100,0.06)', border: '1px solid rgba(0,200,100,0.15)' }}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00C864' }} />
              <span className="text-xs font-medium" style={{ color: '#00C864' }}>System Healthy</span>
            </div>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>99.9% uptime this month</p>
          </div>
        </div>

        {/* Profile */}
        <div className="px-4 py-4 flex items-center gap-3" style={{ borderTop: `1px solid ${BORDER}` }}>
          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: `1px solid rgba(212,175,55,0.3)` }}>
            <span className="text-sm font-bold" style={{ color: G }}>A</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-white">Admin User</p>
            <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Super Admin</p>
          </div>
          <Settings size={15} color="rgba(255,255,255,0.35)" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-8 py-5 flex-shrink-0"
          style={{ borderBottom: `1px solid ${BORDER}`, background: 'rgba(8,15,26,0.5)' }}>
          <div>
            <h2 className="text-lg font-bold text-white">
              {navItems.find(n => n.id === section)?.label}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Wednesday, February 25, 2026 · Bengaluru Operations
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <Search size={15} color="rgba(255,255,255,0.4)" />
              <input className="bg-transparent text-sm text-white outline-none w-48 placeholder:text-white/30"
                placeholder="Search anything..." />
            </div>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center relative"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <Bell size={18} color="rgba(255,255,255,0.7)" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#FF4444' }} />
            </button>
            <button className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <RefreshCw size={17} color="rgba(255,255,255,0.5)" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.25)` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.2)' }}>
                <span className="text-xs font-bold" style={{ color: G }}>A</span>
              </div>
              <span className="text-sm font-medium" style={{ color: G }}>Admin</span>
              <ChevronDown size={14} color={G} />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {section === 'dashboard' && <DashboardOverview />}
          {section === 'rides' && <RideManagement />}
          {section === 'payments' && <PaymentsReports />}
          {section === 'support' && <SupportTickets />}
        </div>
      </div>
    </div>
  );
}
