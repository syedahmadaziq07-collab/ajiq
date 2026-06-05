import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const ADMIN_TOKEN_KEY = "blanc_admin_token";
const API = import.meta.env.VITE_API_URL ?? "";
console.log("Admin API URL:", API || "(empty - using relative)");

function UploadButton({ onUpload }: { onUpload: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const ext = file.name.split(".").pop() || "png";
      const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const supabaseUrl = "https://dwovtevztmolttpohvym.supabase.co";
      const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR3b3Z0ZXZ6dG1vbHR0cG9odnltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MTg1NzgsImV4cCI6MjA5NTk5NDU3OH0.NCQBn9eMEP37tX8jSLObchJ85HT28tZaZ8HvRPI9ZKk";
      const res = await fetch(`${supabaseUrl}/storage/v1/object/wallpapers/${uniqueName}`, {
        method: "POST",
        headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}`, "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) { const t = await res.text(); alert("Upload failed: " + t); return; }
      const url = `${supabaseUrl}/storage/v1/object/public/wallpapers/${uniqueName}`;
      onUpload(url);
    } catch (e: unknown) { alert("Upload error: " + (e instanceof Error ? e.message : "Unknown")); }
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };
  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <button type="button" onClick={() => inputRef.current?.click()} disabled={loading} className="text-[11px] text-[#747474] underline underline-offset-2 hover:text-[#000] disabled:opacity-50">
        {loading ? "Uploading..." : "Upload"}
      </button>
    </>
  );
}

function authHeaders() {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : { "Content-Type": "application/json" };
}

// ---- Generic fetch helpers ----
async function apiGet(path: string) {
  const res = await fetch(`${API}/api/admin${path}`, { headers: authHeaders() });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

async function apiPost(path: string, body: unknown) {
  const res = await fetch(`${API}/api/admin${path}`, { method: "POST", headers: authHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

async function apiPut(path: string, body: unknown) {
  const res = await fetch(`${API}/api/admin${path}`, { method: "PUT", headers: authHeaders(), body: JSON.stringify(body) });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}

async function apiDelete(path: string) {
  const res = await fetch(`${API}/api/admin${path}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error("Failed");
}

// ---- Types ----
type Tab = "dashboard" | "homepage" | "posts" | "wallpapers" | "templates" | "guides" | "contacts" | "newsletter";

interface PostForm {
  title: string; slug: string; excerpt: string; content: string; imageUrl: string; author: string; publishedAt: string;
}

interface MediaForm {
  title: string; slug: string; category: string; imageUrl: string; downloadUrl: string;
}

interface GuideForm {
  title: string; slug: string; description: string; imageUrl: string; content: string;
}

const emptyPost = (): PostForm => ({ title: "", slug: "", excerpt: "", content: "", imageUrl: "", author: "Wallp.", publishedAt: new Date().toISOString().split("T")[0] });
const emptyMedia = (): MediaForm => ({ title: "", slug: "", category: "", imageUrl: "", downloadUrl: "" });
const emptyGuide = (): GuideForm => ({ title: "", slug: "", description: "", imageUrl: "", content: "" });

// ---- Components ----
function SlugInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value.replace(/\s+/g, "-").toLowerCase())} placeholder="auto-slug" className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" />
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[12px] text-[#747474] font-[500] uppercase tracking-wider">{label}</label>
      {children}
    </div>
  );
}

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-start justify-center pt-12 pb-8 overflow-auto" onClick={onClose}>
      <div className="bg-white rounded-[12px] w-full max-w-[640px] mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-[600] text-[#000]">{title}</h2>
          <button onClick={onClose} className="text-[#747474] text-[20px] hover:text-[#000]">&times;</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Table<T>({ columns, data, onEdit, onDelete }: {
  columns: { key: string; label: string; render?: (row: T) => React.ReactNode }[];
  data: T[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
}) {
  return (
    <div className="overflow-auto border border-[#eee] rounded-[8px]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="bg-[#fafafa] border-b border-[#eee]">
            {columns.map((col) => <th key={col.key} className="px-3 py-2.5 text-[12px] font-[500] text-[#747474] uppercase tracking-wider">{col.label}</th>)}
            <th className="px-3 py-2.5 text-[12px] font-[500] text-[#747474] uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-[#eee] hover:bg-[#fafafa]">
              {columns.map((col) => <td key={col.key} className="px-3 py-2.5 text-[#000] max-w-[200px] truncate">{col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? "")}</td>)}
              <td className="px-3 py-2.5 flex gap-2">
                <button onClick={() => onEdit(row)} className="text-[#000] text-[12px] underline underline-offset-2 hover:text-[#000]">Edit</button>
                <button onClick={() => onDelete(row)} className="text-[#e00] text-[12px] underline underline-offset-2">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Main Admin Page ----
export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<Tab>("posts");
  const [loginError, setLoginError] = useState("");
  const [editPost, setEditPost] = useState<PostForm | null>(null);
  const [editMedia, setEditMedia] = useState<MediaForm | null>(null);
  const [editGuide, setEditGuide] = useState<GuideForm | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const queryClient = useQueryClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      if (!res.ok) {
        const text = await res.text().catch(() => "unknown");
        throw new Error(`${res.status} ${text} [${API}/api/admin/login]`);
      }
      const data = await res.json();
      localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
      setToken(data.token);
      setLoginError("");
    } catch (e) { setLoginError(e instanceof Error ? e.message : "Wrong password"); }
  };

  const logout = () => { localStorage.removeItem(ADMIN_TOKEN_KEY); setToken(null); };

  if (!token) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-[320px] mx-4">
          <h1 className="text-[24px] font-[600] text-[#000] text-center">Admin</h1>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border border-[#ddd] rounded-[8px] h-[44px] px-4 text-[13px] outline-none focus:border-[#000] text-[#000]" autoFocus />
          {loginError && <p className="text-[#e00] text-[12px]">{loginError}</p>}
          <button type="submit" className="bg-[#000] text-white rounded-[8px] h-[44px] text-[13px] font-[500]">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[#eee]">
        <div className="flex items-center gap-1">
          <span className="text-[16px] font-[600] text-[#000]">Wallp.</span>
          <span className="text-[#747474] text-[12px] ml-2">Admin</span>
        </div>
        <button onClick={logout} className="text-[#747474] text-[12px] underline underline-offset-2 hover:text-[#000]">Logout</button>
      </div>

      <div className="flex">
        <Sidebar tab={tab} onTab={setTab} />
        <div className="flex-1 p-6">
          {tab === "dashboard" && <Dashboard />}
          {tab === "homepage" && <HomepageSettings />}
          {tab === "posts" && <PostsTable onEdit={(p) => { setEditPost(p); setEditing(true); }} onClose={() => setEditing(false)} />}
          {tab === "wallpapers" && <MediaTable prefix="wallpapers" onEdit={(m) => { setEditMedia(m); setEditing(true); }} onClose={() => setEditing(false)} />}
          {tab === "templates" && <MediaTable prefix="templates" onEdit={(m) => { setEditMedia(m); setEditing(true); }} onClose={() => setEditing(false)} />}
          {tab === "guides" && <GuidesTable />}
          {tab === "contacts" && <ContactsTable />}
          {tab === "newsletter" && <NewsletterTable />}
        </div>
      </div>
    </div>
  );
}

function Sidebar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "homepage", label: "Homepage" },
    { key: "posts", label: "Blog Posts" },
    { key: "wallpapers", label: "Wallpapers" },
    { key: "templates", label: "Templates" },
    { key: "guides", label: "Guides" },
    { key: "contacts", label: "Contacts" },
    { key: "newsletter", label: "Newsletter" },
  ];
  return (
    <div className="w-[180px] shrink-0 border-r border-[#eee] min-h-[calc(100vh-52px)] p-4 flex flex-col gap-1">
      {tabs.map((t) => (
        <button key={t.key} onClick={() => onTab(t.key)} className={`text-left px-3 py-2 rounded-[6px] text-[13px] transition-colors ${tab === t.key ? "bg-[#f0f0f0] text-[#000] font-[500]" : "text-[#747474] hover:text-[#000] hover:bg-[#fafafa]"}`}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ---- Homepage Settings ----
type SettingsField = { key: string; label: string; description: string; type?: "text" | "textarea" | "image" };
const SETTINGS_FIELDS: SettingsField[] = [
  { key: "hero_heading", label: "Hero Heading", description: "Large heading text at the top of the homepage" },
  { key: "hero_subtext", label: "Hero Subtext", description: "Subtitle paragraph below the hero heading", type: "textarea" },
  { key: "featured_heading", label: "Featured Heading", description: "Heading for the featured wallpapers grid section" },
  { key: "featured_description", label: "Featured Description", description: "Paragraph below the featured heading", type: "textarea" },
  { key: "blog_heading", label: "Blog Section Heading", description: "Heading for the blog section" },
  { key: "blog_description", label: "Blog Section Description", description: "Paragraph next to the blog heading", type: "textarea" },
  { key: "newsletter_text", label: "Newsletter Text", description: "Text shown above the email subscribe form", type: "textarea" },
  { key: "wallpapers_image", label: "Wallpapers Category Image", description: "Image shown in the Wallpapers category card", type: "image" },
  { key: "guides_image", label: "Guides Category Image", description: "Image shown in the Guides category card", type: "image" },
  { key: "templates_image", label: "Templates Category Image", description: "Image shown in the Templates category card", type: "image" },
  { key: "featured_image_1", label: "Featured Image 1", description: "Large image (spans 2 cols, 2 rows)", type: "image" },
  { key: "featured_image_2", label: "Featured Image 2", description: "Featured grid image", type: "image" },
  { key: "featured_image_3", label: "Featured Image 3", description: "Featured grid image", type: "image" },
  { key: "featured_image_4", label: "Featured Image 4", description: "Featured grid image", type: "image" },
  { key: "featured_image_5", label: "Featured Image 5", description: "Featured grid image", type: "image" },
  { key: "featured_image_6", label: "Featured Image 6", description: "Featured grid image", type: "image" },
  { key: "featured_image_7", label: "Featured Image 7", description: "Featured grid image", type: "image" },
  { key: "featured_image_8", label: "Featured Image 8", description: "Spans 2 columns", type: "image" },
];

function HomepageSettings() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => apiGet("/settings"),
  });
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const publish = async () => {
    setSaving(true);
    try {
      await apiPut("/settings", form);
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    } catch (e) {
      alert("Failed to publish");
    }
    setSaving(false);
  };

  const reset = () => {
    if (data) setForm({ ...data });
  };

  if (isLoading) return <div className="text-[#747474] text-[13px]">Loading...</div>;

  const resize = (url: string, w: number) =>
    url.includes("?") ? url.replace(/(width=)\d+/, `$1${w}`) : `${url}?width=${w}`;
  const defaultFeatured = [
    "https://framerusercontent.com/images/76MGm4VfTnCkUrk3ct1yk3Rpw.jpg?width=400",
    "https://framerusercontent.com/images/dH9sQMFjHqSouYrD2G1zd5Gl5c.jpg?width=400",
    "https://framerusercontent.com/images/r9EnSsRgp8Z5QUmBOV9sui25trU.png?width=400",
    "https://framerusercontent.com/images/iIFMUvpWvCpMv2Saql4IU2p2K0g.png?width=400",
    "https://framerusercontent.com/images/gBGzj4YUttKCw6dDXphjpyvtSDM.png?width=400",
    "https://framerusercontent.com/images/rwOwbd7jG8w83cROgI7MvdeihA.png?width=400",
    "https://framerusercontent.com/images/6MFK0ePJsGglxyIwBOsKeAVWU.jpg?width=400",
    "https://framerusercontent.com/images/DXWQczEsbDwS0U9pVPEzF4rvM.jpg?width=400",
  ];

  const dataRef = data as Record<string, string> | undefined;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-[600] text-[#000]">Homepage Settings</h2>
        <div className="flex items-center gap-2">
          <button onClick={reset} className="border border-[#ddd] rounded-[8px] h-[36px] px-4 text-[12px] font-[500] text-[#747474] hover:text-[#000] hover:border-[#000] transition-colors">Reset</button>
          <button onClick={() => setShowPreview(!showPreview)} className="border border-[#ddd] rounded-[8px] h-[36px] px-4 text-[12px] font-[500] text-[#747474] hover:text-[#000] hover:border-[#000] transition-colors">{showPreview ? "Hide Preview" : "Show Preview"}</button>
          <button onClick={publish} disabled={saving} className="bg-[#000] text-white rounded-[8px] h-[36px] px-5 text-[12px] font-[500] disabled:opacity-50">{saving ? "Publishing..." : "Publish"}</button>
        </div>
      </div>

      <div className="flex gap-6 flex-1 min-h-0">
        <div className="flex flex-col gap-3 w-[420px] shrink-0 overflow-y-auto pr-2">
          {SETTINGS_FIELDS.map((field) => (
            <div key={field.key} className="flex flex-col gap-0.5">
              <label className="text-[11px] text-[#747474] font-[500] uppercase tracking-wider">{field.label}</label>
              {field.type === "textarea" ? (
                <textarea
                  value={form[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  rows={2}
                  className="w-full border border-[#ddd] rounded px-2.5 py-1.5 text-[12px] outline-none focus:border-[#000] text-[#000] resize-none"
                />
              ) : field.type === "image" ? (
                <div className="flex gap-1.5 items-center">
                  <input
                    value={form[field.key] || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="flex-1 border border-[#ddd] rounded px-2.5 py-1.5 text-[12px] outline-none focus:border-[#000] text-[#000]"
                  />
                  <UploadButton onUpload={(url) => setForm({ ...form, [field.key]: url })} />
                </div>
              ) : (
                <input
                  value={form[field.key] || ""}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  className="w-full border border-[#ddd] rounded px-2.5 py-1.5 text-[12px] outline-none focus:border-[#000] text-[#000]"
                />
              )}
              <p className="text-[#999] text-[10px]">{field.description}</p>
            </div>
          ))}
        </div>

        {showPreview && (
          <div className="flex-1 border border-[#eee] rounded-[12px] overflow-y-auto bg-white p-4">
            <div className="max-w-[600px] mx-auto">
              <p className="text-[10px] text-[#999] uppercase tracking-wider mb-3 font-[500]">Live Preview</p>

              <div className="mb-6">
                <p className="text-[48px] font-[600] tracking-[-0.06em] leading-[0.9] text-[#000]">{form.hero_heading || "Wallp."}</p>
                <p className="text-[#747474] text-[13px] font-[500] leading-[1.2] max-w-[400px] mt-2">{form.hero_subtext || "At Wallp., we craft simple essentials..."}</p>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { label: "Wallpapers", img: resize(form.wallpapers_image || defaultFeatured[0], 200) },
                  { label: "Guides", img: resize(form.guides_image || defaultFeatured[1], 200) },
                  { label: "Templates", img: resize(form.templates_image || defaultFeatured[2], 200) },
                ].map((cat, i) => (
                  <div key={i} className="rounded-[10px] overflow-hidden bg-[#fafafa] p-3">
                    <img src={cat.img} alt="" className="w-full h-[80px] object-contain mb-2 bg-[#f5f5f5]" />
                    <p className="text-[11px] font-[600] text-[#000]">{cat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <p className="text-[20px] font-[500] tracking-[-1.5px] text-[#000] mb-1">{form.featured_heading || "Refining digital life."}</p>
                <p className="text-[#747474] text-[11px] leading-[1.5] max-w-[360px]">{form.featured_description || "Our designs refine workspaces and devices..."}</p>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[1,2,3,4,5,6,7,8].map((i) => {
                  const key = `featured_image_${i}` as const;
                  const src = resize(form[key] || defaultFeatured[i-1], 150);
                  const span = i === 1 ? "col-span-2 row-span-2" : i === 8 ? "col-span-2" : "";
                  return (
                    <div key={i} className={`rounded-[8px] overflow-hidden bg-[#f5f5f5] ${span}`}>
                      <img src={src} alt="" className="w-full h-full object-cover" style={{ aspectRatio: i === 1 ? "1" : "1" }} />
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#eee] pt-4">
                <p className="text-[18px] font-[600] tracking-[-0.03em] text-[#000] mb-1">{form.blog_heading || "Insights from our blog."}</p>
                <p className="text-[#747474] text-[11px] font-[600] max-w-[360px]">{form.blog_desc || "Insights and practical tips..."}</p>
                <div className="mt-3 text-[#747474] text-[11px]">{form.newsletter_text || "Join for thoughtful insights..."}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Dashboard ----
function StatsCard({ label, value, unit }: { label: string; value: number | string; unit?: string }) {
  return (
    <div className="border border-[#eee] rounded-[8px] p-4 flex flex-col gap-1">
      <span className="text-[12px] text-[#747474] font-[500] uppercase tracking-wider">{label}</span>
      <span className="text-[28px] font-[600] text-[#000]">{typeof value === "number" ? value.toLocaleString() : value}{unit && <span className="text-[14px] text-[#747474] ml-1">{unit}</span>}</span>
    </div>
  );
}

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const res = await fetch(`${API}/api/admin/stats`, { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
  });

  if (isLoading) return <div className="text-[#747474] text-[13px]">Loading...</div>;

  return (
    <div>
      <h2 className="text-[18px] font-[600] text-[#000] mb-4">Dashboard</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
        <StatsCard label="Total Revenue" value={data?.totalRevenue ?? 0} unit="JPY" />
        <StatsCard label="Total Orders" value={data?.totalOrders ?? 0} />
        <StatsCard label="Newsletter" value={data?.totalNewsletter ?? 0} />
        <StatsCard label="Contacts" value={data?.totalContacts ?? 0} />
        <StatsCard label="Blog Posts" value={data?.totalPosts ?? 0} />
        <StatsCard label="Wallpapers" value={data?.totalWallpapers ?? 0} />
        <StatsCard label="Templates" value={data?.totalTemplates ?? 0} />
        <StatsCard label="Guides" value={data?.totalGuides ?? 0} />
      </div>

      {data?.monthlyRevenue && data.monthlyRevenue.length > 0 && (
        <div className="mb-6">
          <h3 className="text-[14px] font-[600] text-[#000] mb-3">Monthly Revenue (12 months)</h3>
          <div className="flex items-end gap-2 h-[120px] border-b border-[#eee] pb-1">
            {data.monthlyRevenue.map((m: { month: string; revenue: number }, i: number) => {
              const max = Math.max(...data.monthlyRevenue.map((x: { revenue: number }) => x.revenue));
              const h = max > 0 ? (m.revenue / max) * 100 : 0;
              const label = new Date(m.month).toLocaleDateString("en-US", { month: "short" });
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-[#747474]">{m.revenue > 0 ? `${(m.revenue / 100).toFixed(0)}` : ""}</span>
                  <div className="w-full bg-[#f0f0f0] rounded-t-[4px]" style={{ height: `${Math.max(h, 2)}%` }}>
                    <div className="bg-[#000] w-full rounded-t-[4px]" style={{ height: `${h}%` }} />
                  </div>
                  <span className="text-[10px] text-[#747474]">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data?.topDownloads && data.topDownloads.length > 0 && (
        <div>
          <h3 className="text-[14px] font-[600] text-[#000] mb-3">Top Downloads</h3>
          <div className="overflow-auto border border-[#eee] rounded-[8px]">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-[#fafafa] border-b border-[#eee]">
                  <th className="px-3 py-2.5 text-[12px] font-[500] text-[#747474] uppercase tracking-wider">Item</th>
                  <th className="px-3 py-2.5 text-[12px] font-[500] text-[#747474] uppercase tracking-wider">Type</th>
                  <th className="px-3 py-2.5 text-[12px] font-[500] text-[#747474] uppercase tracking-wider">Downloads</th>
                </tr>
              </thead>
              <tbody>
                {data.topDownloads.map((d: Record<string, unknown>, i: number) => (
                  <tr key={i} className="border-b border-[#eee]">
                    <td className="px-3 py-2.5 text-[#000]">{d.item_type as string} #{String(d.item_id)}</td>
                    <td className="px-3 py-2.5 text-[#000]">{d.item_type as string}</td>
                    <td className="px-3 py-2.5 text-[#000]">{d.count as number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Posts Table ----
function PostsTable({ onEdit, onClose: _onClose }: { onEdit: (p: PostForm) => void; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: posts = [] } = useQuery({ queryKey: ["admin", "posts"], queryFn: () => apiGet("/blog-posts") });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<PostForm>(emptyPost());
  const [editId, setEditId] = useState<number | null>(null);

  const saveMut = useMutation({
    mutationFn: () => editId ? apiPut(`/blog-posts/${editId}`, form) : apiPost("/blog-posts", form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "posts"] }); setModal(false); setForm(emptyPost()); setEditId(null); },
  });

  const delMut = useMutation({
    mutationFn: (id: number) => apiDelete(`/blog-posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "posts"] }),
  });

  const openNew = () => { setForm(emptyPost()); setEditId(null); setModal(true); };

  const openEdit = (p: Record<string, unknown>) => {
    setForm({ title: p.title as string, slug: p.slug as string, excerpt: p.excerpt as string, content: p.content as string, imageUrl: p.imageUrl as string, author: p.author as string, publishedAt: (p.publishedAt as string).split("T")[0] });
    setEditId(p.id as number);
    setModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-[600] text-[#000]">Blog Posts</h2>
        <button onClick={openNew} className="bg-[#000] text-white rounded-[8px] h-[36px] px-4 text-[12px] font-[500]">+ New Post</button>
      </div>
      <Table columns={[{ key: "title", label: "Title" }, { key: "slug", label: "Slug" }, { key: "publishedAt", label: "Date" }]} data={posts as Record<string, unknown>[]} onEdit={openEdit} onDelete={(p) => delMut.mutate(p.id as number)} />
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit Post" : "New Post"}>
        <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }} className="flex flex-col gap-3">
          <FormField label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required /></FormField>
          <FormField label="Slug"><SlugInput value={form.slug} onChange={(s) => setForm({ ...form, slug: s })} /></FormField>
          <FormField label="Excerpt"><textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000] resize-none" required /></FormField>
          <FormField label="Content (Markdown)"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000] resize-none font-mono" required /></FormField>
          <FormField label="Image URL">
            <div className="flex gap-2 items-center">
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required />
              <UploadButton onUpload={(url) => setForm({ ...form, imageUrl: url })} />
            </div>
          </FormField>
          <div className="flex gap-3">
            <FormField label="Author"><input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required /></FormField>
            <FormField label="Published Date"><input type="date" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required /></FormField>
          </div>
          <button type="submit" disabled={saveMut.isPending} className="bg-[#000] text-white rounded-[8px] h-[40px] text-[13px] font-[500] mt-2 disabled:opacity-50">{saveMut.isPending ? "Saving..." : "Save"}</button>
        </form>
      </Modal>
    </div>
  );
}

// ---- Media Table (wallpapers/templates) ----
function MediaTable({ prefix, onEdit: _onEdit, onClose: _onClose }: { prefix: string; onEdit: (m: MediaForm) => void; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["admin", prefix], queryFn: () => apiGet(`/${prefix}`) });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<MediaForm>(emptyMedia());
  const [editId, setEditId] = useState<number | null>(null);

  const saveMut = useMutation({
    mutationFn: () => editId ? apiPut(`/${prefix}/${editId}`, form) : apiPost(`/${prefix}`, form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", prefix] }); setModal(false); setForm(emptyMedia()); setEditId(null); },
  });

  const delMut = useMutation({
    mutationFn: (id: number) => apiDelete(`/${prefix}/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", prefix] }),
  });

  const openNew = () => { setForm(emptyMedia()); setEditId(null); setModal(true); };

  const openEdit = (item: Record<string, unknown>) => {
    setForm({ title: item.title as string, slug: item.slug as string, category: item.category as string, imageUrl: item.imageUrl as string, downloadUrl: item.downloadUrl as string });
    setEditId(item.id as number);
    setModal(true);
  };

  const label = prefix === "wallpapers" ? "Wallpapers" : "Templates";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-[600] text-[#000]">{label}</h2>
        <button onClick={openNew} className="bg-[#000] text-white rounded-[8px] h-[36px] px-4 text-[12px] font-[500]">+ New {label.slice(0, -1)}</button>
      </div>
      <Table columns={[{ key: "title", label: "Title" }, { key: "category", label: "Category" }]} data={items as Record<string, unknown>[]} onEdit={openEdit} onDelete={(item) => delMut.mutate(item.id as number)} />
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? `Edit ${label.slice(0, -1)}` : `New ${label.slice(0, -1)}`}>
        <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }} className="flex flex-col gap-3">
          <FormField label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required /></FormField>
          <FormField label="Slug"><SlugInput value={form.slug} onChange={(s) => setForm({ ...form, slug: s })} /></FormField>
          <FormField label="Category"><input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required /></FormField>
          <FormField label="Image URL">
            <div className="flex gap-2 items-center">
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required />
              <UploadButton onUpload={(url) => setForm({ ...form, imageUrl: url })} />
            </div>
          </FormField>
          <FormField label="Download URL"><input value={form.downloadUrl} onChange={(e) => setForm({ ...form, downloadUrl: e.target.value })} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required /></FormField>
          <button type="submit" disabled={saveMut.isPending} className="bg-[#000] text-white rounded-[8px] h-[40px] text-[13px] font-[500] mt-2 disabled:opacity-50">{saveMut.isPending ? "Saving..." : "Save"}</button>
        </form>
      </Modal>
    </div>
  );
}

// ---- Guides Table ----
function GuidesTable() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["admin", "guides"], queryFn: () => apiGet("/guides") });
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<GuideForm>(emptyGuide());
  const [editId, setEditId] = useState<number | null>(null);

  const saveMut = useMutation({
    mutationFn: () => editId ? apiPut(`/guides/${editId}`, form) : apiPost("/guides", form),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin", "guides"] }); setModal(false); setForm(emptyGuide()); setEditId(null); },
  });

  const delMut = useMutation({
    mutationFn: (id: number) => apiDelete(`/guides/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "guides"] }),
  });

  const openNew = () => { setForm(emptyGuide()); setEditId(null); setModal(true); };

  const openEdit = (item: Record<string, unknown>) => {
    setForm({ title: item.title as string, slug: item.slug as string, description: item.description as string, imageUrl: item.imageUrl as string, content: item.content as string });
    setEditId(item.id as number);
    setModal(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[18px] font-[600] text-[#000]">Guides</h2>
        <button onClick={openNew} className="bg-[#000] text-white rounded-[8px] h-[36px] px-4 text-[12px] font-[500]">+ New Guide</button>
      </div>
      <Table columns={[{ key: "title", label: "Title" }]} data={items as Record<string, unknown>[]} onEdit={openEdit} onDelete={(item) => delMut.mutate(item.id as number)} />
      <Modal open={modal} onClose={() => setModal(false)} title={editId ? "Edit Guide" : "New Guide"}>
        <form onSubmit={(e) => { e.preventDefault(); saveMut.mutate(); }} className="flex flex-col gap-3">
          <FormField label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required /></FormField>
          <FormField label="Slug"><SlugInput value={form.slug} onChange={(s) => setForm({ ...form, slug: s })} /></FormField>
          <FormField label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000] resize-none" required /></FormField>
          <FormField label="Image URL">
            <div className="flex gap-2 items-center">
              <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="flex-1 border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000]" required />
              <UploadButton onUpload={(url) => setForm({ ...form, imageUrl: url })} />
            </div>
          </FormField>
          <FormField label="Content"><textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} className="w-full border border-[#ddd] rounded px-3 py-2 text-[13px] outline-none focus:border-[#000] text-[#000] resize-none font-mono" required /></FormField>
          <button type="submit" disabled={saveMut.isPending} className="bg-[#000] text-white rounded-[8px] h-[40px] text-[13px] font-[500] mt-2 disabled:opacity-50">{saveMut.isPending ? "Saving..." : "Save"}</button>
        </form>
      </Modal>
    </div>
  );
}

// ---- Contacts Table (read-only) ----
function ContactsTable() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["admin", "contacts"], queryFn: () => apiGet("/contacts") });

  const delMut = useMutation({
    mutationFn: (id: number) => apiDelete(`/contacts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "contacts"] }),
  });

  return (
    <div>
      <h2 className="text-[18px] font-[600] text-[#000] mb-4">Contacts</h2>
      <Table columns={[{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "subject", label: "Subject" }, { key: "message", label: "Message" }]} data={items as Record<string, unknown>[]} onEdit={() => {}} onDelete={(item) => delMut.mutate(item.id as number)} />
    </div>
  );
}

// ---- Newsletter Table (read-only) ----
function NewsletterTable() {
  const queryClient = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["admin", "newsletter"], queryFn: () => apiGet("/newsletter") });

  const delMut = useMutation({
    mutationFn: (id: number) => apiDelete(`/newsletter/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "newsletter"] }),
  });

  return (
    <div>
      <h2 className="text-[18px] font-[600] text-[#000] mb-4">Newsletter Subscribers</h2>
      <Table columns={[{ key: "email", label: "Email" }, { key: "subscribedAt", label: "Subscribed At" }]} data={items as Record<string, unknown>[]} onEdit={() => {}} onDelete={(item) => delMut.mutate(item.id as number)} />
    </div>
  );
}
