
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  sku: string;
  name: string;
  category: string | null;
  unit: string;
  cost_price: string | null;
  selling_price: string | null;
  is_active: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL;
const BUSINESS_ID = process.env.NEXT_PUBLIC_STOCKSENSE_BUSINESS_ID;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showInactive, setShowInactive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    sku: "",
    name: "",
    category: "",
    unit: "piece",
    cost_price: "",
    selling_price: "",
  });

  const request = useCallback(async (path: string, options: RequestInit = {}) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) throw new Error("Session expired. Please log in again.");
    if (!API || !BUSINESS_ID) throw new Error("API or business ID is missing from frontend environment.");

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${data.session.access_token}`,
        "X-Business-ID": BUSINESS_ID,
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.detail || result.message || `Request failed: ${response.status}`);
    return result;
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search,
        skip: "0",
        limit: "100",
        include_inactive: String(showInactive),
      });
      const result = await request(`/products/?${params.toString()}`);
      setProducts(result);
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load products.");
    } finally {
      setLoading(false);
    }
  }, [request, search, showInactive]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadProducts(), 250);
    return () => window.clearTimeout(timer);
  }, [loadProducts]);

  async function addProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      await request(editingId ? `/products/${editingId}` : "/products/", {
        method: editingId ? "PATCH" : "POST",
        body: JSON.stringify({
          ...form,
          cost_price: form.cost_price ? Number(form.cost_price) : null,
          selling_price: form.selling_price ? Number(form.selling_price) : null,
        }),
      });
      setForm({
        sku: "",
        name: "",
        category: "",
        unit: "piece",
        cost_price: "",
        selling_price: "",
      });
      setMessage(editingId ? "Product updated successfully." : "Product added successfully.");
      setEditingId(null);
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not add product.");
    } finally {
      setSaving(false);
    }
  }

  function editProduct(product: Product) {
    setEditingId(product.id);
    setForm({
      sku: product.sku,
      name: product.name,
      category: product.category || "",
      unit: product.unit,
      cost_price: product.cost_price || "",
      selling_price: product.selling_price || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deactivateProduct(id: string) {
    if (!window.confirm("Deactivate this product?")) return;
    try {
      await request(`/products/${id}`, { method: "DELETE" });
      setMessage("Product deactivated successfully.");
      await loadProducts();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not deactivate product.");
    }
  }

  const inputClass =
    "w-full rounded-xl border border-[#343a33] bg-[#1b1f1c] px-3 py-2.5 text-sm text-[#edf0e9] outline-none placeholder:text-[#777e75] focus:border-[#78866e]";

  return (
    <main className="min-h-screen bg-[#101210] p-4 text-[#e8eae4] sm:p-7">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/dashboard" className="text-xs text-[#a9b89a] hover:text-white">
              ← Back to dashboard
            </Link>
            <p className="mt-4 text-[10px] font-semibold tracking-[.16em] text-[#a9b89a]">
              STOCKSENSE / CATALOGUE
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Product Management</h1>
            <p className="mt-2 text-sm text-[#858d80]">
              Manage your business products and catalogue.
            </p>
          </div>
          <div className="rounded-xl border border-[#3b4238] px-4 py-2 text-xs text-[#b6c3a9]">
            LIVE BACKEND
          </div>
        </header>

        {message && (
          <div className="rounded-xl border border-[#485044] bg-[#20271e] px-4 py-3 text-sm text-[#d3dccb]">
            {message}
          </div>
        )}

        <section className="rounded-2xl border border-[#2b302b] bg-[#171a18] p-5">
          <h2 className="mb-4 text-lg font-semibold !tracking-normal leading-tight">{editingId ? "Edit product" : "Add a product"}</h2>
          <form onSubmit={addProduct} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input className={inputClass} placeholder="SKU (e.g. SKU-001)" required maxLength={80}
              value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
            <input className={inputClass} placeholder="Product name" required maxLength={180}
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={inputClass} placeholder="Category"
              value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <input className={inputClass} placeholder="Unit (piece, kg, litre)" required
              value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
            <input className={inputClass} type="number" min="0" step="0.01" placeholder="Cost price"
              value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: e.target.value })} />
            <input className={inputClass} type="number" min="0" step="0.01" placeholder="Selling price"
              value={form.selling_price} onChange={(e) => setForm({ ...form, selling_price: e.target.value })} />
            <button disabled={saving} className="rounded-xl bg-[#b5c2a8] px-5 py-3 text-sm font-semibold text-[#182017] hover:bg-[#c2cdb7] disabled:opacity-50 sm:col-span-2 lg:col-span-3">
              {saving ? "Saving..." : editingId ? "Update product" : "+ Add product"}
            </button>
            {editingId && (
              <button type="button" onClick={() => {
                setEditingId(null);
                setForm({ sku: "", name: "", category: "", unit: "piece", cost_price: "", selling_price: "" });
              }} className="rounded-xl border border-[#485044] px-5 py-3 text-sm text-[#c3cdb8]">
                Cancel edit
              </button>
            )}
          </form>
        </section>

        <section className="rounded-2xl border border-[#2b302b] bg-[#171a18] p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold !tracking-normal leading-tight">Your products</h2>
              <p className="mt-1 text-xs text-[#858d80]">{products.length} products found</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input className={`${inputClass} min-w-48`} placeholder="Search name or SKU"
                value={search} onChange={(e) => setSearch(e.target.value)} />
              <label className="flex items-center gap-2 text-xs text-[#aeb4a9]">
                <input type="checkbox" checked={showInactive}
                  onChange={(e) => setShowInactive(e.target.checked)} />
                Show inactive
              </label>
            </div>
          </div>

          {loading ? (
            <p className="py-10 text-center text-sm text-[#858d80]">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#858d80]">No products found. Add your first product above.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-left text-sm">
                <thead>
                  <tr className="border-b border-[#343a33] text-[10px] tracking-wider text-[#858d80]">
                    <th className="pb-3 pr-4">PRODUCT</th>
                    <th className="pb-3 pr-4">SKU</th>
                    <th className="pb-3 pr-4">CATEGORY</th>
                    <th className="pb-3 pr-4">COST</th>
                    <th className="pb-3 pr-4">SELLING PRICE</th>
                    <th className="pb-3 pr-4">STATUS</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-[#2d322d] last:border-0">
                      <td className="py-4 pr-4 font-medium">{product.name}</td>
                      <td className="py-4 pr-4 font-mono text-[#aeb4a9]">{product.sku}</td>
                      <td className="py-4 pr-4 text-[#aeb4a9]">{product.category || "—"}</td>
                      <td className="py-4 pr-4">₹{product.cost_price ?? "—"}</td>
                      <td className="py-4 pr-4">₹{product.selling_price ?? "—"}</td>
                      <td className="py-4 pr-4">
                        <span className={product.is_active ? "text-[#a9b89a]" : "text-[#c49a78]"}>
                          {product.is_active ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => editProduct(product)}
                            className="rounded-lg border border-[#485044] px-3 py-2 text-xs text-[#c3cdb8] hover:bg-[#343d31]">
                            Edit
                          </button>
                          {product.is_active && (
                            <button onClick={() => void deactivateProduct(product.id)}
                              className="rounded-lg border border-[#485044] px-3 py-2 text-xs text-[#c3cdb8] hover:bg-[#343d31]">
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
