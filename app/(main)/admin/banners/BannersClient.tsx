"use client";

import { useState } from "react";
import useSWR from "swr";
import toast from "react-hot-toast";
import CloudinaryUploader from "@/components/CloudinaryUploader";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function BannersClient() {
  const { data: banners, error, mutate } = useSWR("/api/admin/banners", fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  
  // Form State
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [badge, setBadge] = useState("");
  const [href, setHref] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setTitle("");
    setSubtitle("");
    setBadge("");
    setHref("");
    setImageUrl("");
    setEditingBanner(null);
    setIsModalOpen(false);
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setTitle(banner.title || "");
    setSubtitle(banner.subtitle || "");
    setBadge(banner.badge || "");
    setHref(banner.href || "");
    setImageUrl(banner.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");
      toast.success("Banner deleted");
      mutate();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    let currentToastId: string | undefined;
    
    try {
      if (!imageUrl) {
        throw new Error("A banner image is required — please upload one first");
      }

      currentToastId = "save-toast";
      toast.loading("Saving banner details...", { id: currentToastId });

      const payload = { title, subtitle, badge, href, imageUrl };

      const url = editingBanner ? `/api/admin/banners/${editingBanner._id}` : "/api/admin/banners";
      const method = editingBanner ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();

      if (!res.ok) {
        throw new Error(resData.error || "Failed to save banner");
      }

      toast.success(editingBanner ? "Banner updated!" : "Banner created!", { id: currentToastId });
      resetForm();
      mutate();
    } catch (err: any) {
      console.error("[BANNER_SAVE_ERROR]", err);
      if (currentToastId) {
        toast.error(err.message || "An error occurred", { id: currentToastId });
      } else {
        toast.error(err.message || "An error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (error) return <div className="p-6 text-red-500">Failed to load banners</div>;
  if (!banners) return <div className="p-6 text-white/50">Loading banners...</div>;

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-widest">Manage Banners</h1>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="px-6 py-3 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,242,255,0.3)]"
        >
          + Add New Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((banner: any) => (
          <div key={banner._id} className="bg-surface/50 border border-white/10 rounded-2xl overflow-hidden shadow-lg group">
            <div className="aspect-[16/9] w-full relative">
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                {banner.badge && <span className="px-2 py-0.5 bg-black/50 backdrop-blur text-white/80 text-[10px] rounded uppercase font-bold">{banner.badge}</span>}
                <h3 className="text-white font-black uppercase text-sm mt-1 truncate">{banner.title}</h3>
                {banner.subtitle && <p className="text-white/60 text-[11px] truncate">{banner.subtitle}</p>}
              </div>
            </div>
            <div className="p-4 flex gap-2 justify-end bg-black/20">
              <button
                onClick={() => handleEdit(banner)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg text-xs font-bold transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#11111a] border border-white/10 rounded-2xl w-full max-w-[600px] min-w-[320px] md:min-w-[500px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-black text-white uppercase">{editingBanner ? "Edit Banner" : "New Banner"}</h2>
              <button onClick={resetForm} className="text-white/50 hover:text-white"><span className="material-symbols-outlined">close</span></button>
            </div>

            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="bannerForm" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase mb-2">Title</label>
                  <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Season Pass Direct Purchase!" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 uppercase mb-2">Subtitle</label>
                  <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="Top up for up to 35% bonus!" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase mb-2">Badge</label>
                    <input type="text" value={badge} onChange={e => setBadge(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="PUBG MOBILE" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 uppercase mb-2">Target URL / Href</label>
                    <input required type="text" value={href} onChange={e => setHref(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary outline-none" placeholder="/marketplace/pubg-mobile" />
                  </div>
                </div>

                <CloudinaryUploader
                    folder="neon-nexus-banners"
                    value={imageUrl}
                    onChange={(url) => setImageUrl(url)}
                    label="Banner Image"
                    aspectRatio="wide"
                    maxSizeMB={10}
                  />
              </form>
            </div>

            <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl font-bold text-white/70 hover:text-white hover:bg-white/5 transition-all text-sm">Cancel</button>
              <button form="bannerForm" type="submit" disabled={isSubmitting} className="px-6 py-3 bg-primary text-black font-black uppercase tracking-widest text-sm rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(0,242,255,0.2)] disabled:opacity-50 disabled:cursor-not-allowed">
                {isSubmitting ? "Saving..." : "Save Banner"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
