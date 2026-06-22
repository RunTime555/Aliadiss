"use client";
import { useState, useEffect } from "react";

type Store = {
  id: string;
  name: string;
  description: string;
  legalName: string;
  city: string;
  credentialsNote: string;
  status: string;
  products: Product[];
};

type Product = {
  id: string;
  title: string;
  priceBirr: number;
  category: string;
  status: string;
  warrantyType: string;
  warrantyMonths: number;
  imageEmoji: string;
};

const EMOJI_BY_CAT: Record<string, string> = {
  Phone: "📱", Laptop: "💻", Accessory: "🎧", Other: "📦",
};

export default function CustomerStorePage() {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [tab, setTab] = useState<"store" | "product">("store");

  const [form, setForm] = useState({
    name: "", description: "", legalName: "", city: "Addis Ababa", credentialsNote: "",
  });

  const [product, setProduct] = useState({
    title: "", description: "", category: "Phone", condition: "New",
    priceBirr: "", warrantyType: "OFFICIAL", warrantyMonths: "12",
    imageEmoji: "📱", ramGb: "", batteryMah: "", cameraMp: "",
    processorType: "", screenSizeIn: "", screenResolution: "",
  });

  useEffect(() => {
    fetch("/api/stores")
      .then((r) => r.json())
      .then((s) => {
        setStore(s);
        if (s) setForm({ name: s.name, description: s.description || "", legalName: s.legalName, city: s.city, credentialsNote: s.credentialsNote });
        setLoading(false);
      });
  }, []);

  async function saveStore(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/stores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setStore(data);
      setMsg({ text: store ? "Store updated. Pending re-verification." : "Store created! Awaiting admin approval.", type: "success" });
    } else {
      setMsg({ text: data.error, type: "error" });
    }
  }

  async function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/stores/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...product, imageEmoji: EMOJI_BY_CAT[product.category] || "📦" }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setMsg({ text: "Product submitted! Awaiting admin verification.", type: "success" });
      setProduct({ title: "", description: "", category: "Phone", condition: "New", priceBirr: "", warrantyType: "OFFICIAL", warrantyMonths: "12", imageEmoji: "📱", ramGb: "", batteryMah: "", cameraMp: "", processorType: "", screenSizeIn: "", screenResolution: "" });
      const fresh = await fetch("/api/stores").then((r) => r.json());
      setStore(fresh);
    } else {
      setMsg({ text: data.error, type: "error" });
    }
  }

  if (loading) return <div style={{ color: "#9B9B9B", padding: 40 }}>Loading...</div>;

  const storeStatusColors: Record<string, { bg: string; color: string }> = {
    APPROVED: { bg: "#DCFCE7", color: "#15803D" },
    PENDING: { bg: "#FEF3C7", color: "#B45309" },
    REJECTED: { bg: "#FEE2E2", color: "#DC2626" },
  };

  const input = (key: keyof typeof form, label: string, placeholder?: string, required = true) => (
    <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{label}</label>
      <input
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        required={required}
        placeholder={placeholder}
        style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8E8E8", fontSize: 14, color: "#1A1A1A", background: "#FAFAFA", outline: "none" }}
        onFocus={(e) => (e.target.style.borderColor = "#F57C00")}
        onBlur={(e) => (e.target.style.borderColor = "#E8E8E8")}
      />
    </div>
  );

  return (
    <div style={{ maxWidth: 960 }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1A1A1A", fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif", marginBottom: 4 }}>
        My Store
      </h1>
      <p style={{ color: "#9B9B9B", fontSize: 14, marginBottom: 24 }}>
        Manage your store profile and product listings.
      </p>

      {msg && (
        <div style={{ background: msg.type === "success" ? "#DCFCE7" : "#FEE2E2", border: `1px solid ${msg.type === "success" ? "#86EFAC" : "#FCA5A5"}`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: msg.type === "success" ? "#15803D" : "#DC2626", marginBottom: 20, display: "flex", justifyContent: "space-between" }}>
          {msg.text}
          <button onClick={() => setMsg(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 700 }}>✕</button>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: 2, background: "#F3F3F3", borderRadius: 10, padding: 4, marginBottom: 24, width: "fit-content" }}>
        {[{ id: "store", label: "Store Profile" }, { id: "product", label: "Add Product" }].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id as "store" | "product")}
            style={{ padding: "8px 18px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: tab === t.id ? "#fff" : "transparent", color: tab === t.id ? "#1A1A1A" : "#9B9B9B", boxShadow: tab === t.id ? "0 1px 3px rgba(0,0,0,0.1)" : "none", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: store?.products?.length ? "1fr 300px" : "1fr", gap: 20, alignItems: "start" }}>
        {/* Main form */}
        <div style={{ background: "#fff", border: "1px solid #E8E8E8", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          {tab === "store" ? (
            <>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #E8E8E8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>Store information</div>
                  <div style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>Updates re-enter the approval queue</div>
                </div>
                {store?.status && storeStatusColors[store.status] && (
                  <span style={{ background: storeStatusColors[store.status].bg, color: storeStatusColors[store.status].color, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 99 }}>
                    {store.status}
                  </span>
                )}
              </div>
              <form onSubmit={saveStore} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
                {input("name", "Store name", "e.g. TechHub Addis")}
                {input("description", "Description", "What do you sell?", false)}
                {input("legalName", "Legal business name", "Registered business name")}
                {input("city", "City")}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>Legal credentials</label>
                  <textarea value={form.credentialsNote} onChange={(e) => setForm((f) => ({ ...f, credentialsNote: e.target.value }))} required rows={3} placeholder="Business license, TIN, supporting notes..." style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8E8E8", fontSize: 14, resize: "none", outline: "none", background: "#FAFAFA" }} onFocus={(e) => (e.target.style.borderColor = "#F57C00")} onBlur={(e) => (e.target.style.borderColor = "#E8E8E8")} />
                  <p style={{ fontSize: 11, color: "#9B9B9B" }}>Admin reviews these for verification.</p>
                </div>
                <button type="submit" disabled={saving} style={{ background: saving ? "#D1D5DB" : "#F57C00", color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px", borderRadius: 10, border: "none", cursor: saving ? "not-allowed" : "pointer" }}>
                  {saving ? "Saving..." : store ? "Update store" : "Submit for verification"}
                </button>
              </form>
            </>
          ) : (
            <>
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #E8E8E8" }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Add new product</div>
                <div style={{ fontSize: 12, color: "#9B9B9B", marginTop: 2 }}>Store must be approved before products go live</div>
              </div>
              {store?.status !== "APPROVED" ? (
                <div style={{ padding: 24, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Store not approved yet</div>
                  <div style={{ fontSize: 13, color: "#9B9B9B" }}>Your store needs admin approval before you can add products.</div>
                </div>
              ) : (
                <form onSubmit={saveProduct} style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { key: "title", label: "Product title", placeholder: "e.g. Samsung Galaxy S24" },
                    { key: "description", label: "Description", placeholder: "Brief description" },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      <label style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
                      <input value={product[key as keyof typeof product]} onChange={(e) => setProduct((p) => ({ ...p, [key]: e.target.value }))} required placeholder={placeholder} style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8E8E8", fontSize: 14, background: "#FAFAFA", outline: "none" }} onFocus={(e) => (e.target.style.borderColor = "#F57C00")} onBlur={(e) => (e.target.style.borderColor = "#E8E8E8")} />
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { key: "category", label: "Category", opts: ["Phone","Laptop","Accessory","Other"] },
                      { key: "condition", label: "Condition", opts: ["New","Used"] },
                      { key: "warrantyType", label: "Warranty", opts: ["OFFICIAL","SELLER","NONE"] },
                    ].map(({ key, label, opts }) => (
                      <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
                        <select value={product[key as keyof typeof product]} onChange={(e) => setProduct((p) => ({ ...p, [key]: e.target.value }))} style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8E8E8", fontSize: 14, background: "#FAFAFA", outline: "none" }}>
                          {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                      </div>
                    ))}
                    {[
                      { key: "priceBirr", label: "Price (ETB)", type: "number" },
                      { key: "warrantyMonths", label: "Warranty months", type: "number" },
                      { key: "ramGb", label: "RAM (GB)" },
                      { key: "batteryMah", label: "Battery (mAh)" },
                      { key: "cameraMp", label: "Camera (MP)" },
                      { key: "processorType", label: "Processor" },
                    ].map(({ key, label, type }) => (
                      <div key={key} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        <label style={{ fontSize: 13, fontWeight: 600 }}>{label}</label>
                        <input type={type || "text"} value={product[key as keyof typeof product]} onChange={(e) => setProduct((p) => ({ ...p, [key]: e.target.value }))} style={{ padding: "10px 12px", borderRadius: 10, border: "1.5px solid #E8E8E8", fontSize: 14, background: "#FAFAFA", outline: "none" }} onFocus={(e) => (e.target.style.borderColor = "#F57C00")} onBlur={(e) => (e.target.style.borderColor = "#E8E8E8")} />
                      </div>
                    ))}
                  </div>
                  <button type="submit" disabled={saving} style={{ background: saving ? "#D1D5DB" : "#F57C00", color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px", borderRadius: 10, border: "none", cursor: saving ? "not-allowed" : "pointer", marginTop: 4 }}>
                    {saving ? "Submitting..." : "Submit listing"}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        {/* Products sidebar */}
        {store?.products && store.products.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid #E8E8E8", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid #E8E8E8" }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Your listings</div>
              <div style={{ fontSize: 12, color: "#9B9B9B", marginTop: 1 }}>{store.products.length} products</div>
            </div>
            <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, maxHeight: 500, overflowY: "auto" }}>
              {store.products.map((p) => {
                const sc = { VERIFIED: { bg: "#DCFCE7", color: "#15803D" }, PENDING: { bg: "#FEF3C7", color: "#B45309" }, REJECTED: { bg: "#FEE2E2", color: "#DC2626" } }[p.status] || { bg: "#F3F3F3", color: "#6B6B6B" };
                return (
                  <div key={p.id} style={{ background: "#F9F9F9", borderRadius: 10, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.35 }}>{p.imageEmoji} {p.title}</div>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, flexShrink: 0 }}>{p.status}</span>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#F57C00" }}>{p.priceBirr.toLocaleString()} ETB</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
