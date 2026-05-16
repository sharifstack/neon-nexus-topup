"use client";

import { useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save, X, Loader2, Zap, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryUploader from '@/components/CloudinaryUploader';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// ─── Default Forms ────────────────────────────────────────────
const FLASH_DEFAULTS = {
  gameId: '',
  title: '',
  offerTitle: '',
  bonusText: '',
  originalPrice: '',
  discountedPrice: '',
  stockStatus: 100,
  limitedQuantity: '',
  backgroundMedia: '',
  endsAt: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  isActive: true,
};

const DROP_DEFAULTS = {
  gameId: '',
  name: '',
  description: '',
  image: '',
  badge: 'Limited',
  isActive: true,
};

export default function DealsAdminClient() {
  const [activeTab, setActiveTab] = useState<'flash' | 'drops'>('flash');
  const { data: flashDeals, mutate: mutateFlash } = useSWR('/api/admin/deals/flash', fetcher);
  const { data: liveDrops, mutate: mutateDrops } = useSWR('/api/admin/deals/drops', fetcher);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  const isFlash = activeTab === 'flash';

  const handleOpenModal = (item: any = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : isFlash ? { ...FLASH_DEFAULTS } : { ...DROP_DEFAULTS });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const tid = 'save-deal';

    try {
      toast.loading(`Saving ${isFlash ? 'flash deal' : 'live drop'}...`, { id: tid });

      // CloudinaryUploader sets formData.backgroundMedia / formData.image via onChange
      const payload = { ...formData };
      if (editingItem) payload.id = editingItem._id;

      const url = `/api/admin/deals/${isFlash ? 'flash' : 'drops'}`;
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed');

      toast.success('Saved successfully!', { id: tid });
      isFlash ? mutateFlash() : mutateDrops();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message, { id: tid });
    } finally {
      setIsSaving(false);
    }
  };
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return;
    const res = await fetch(`/api/admin/deals/${isFlash ? 'flash' : 'drops'}?id=${id}`, { method: 'DELETE' });
    if (res.ok) isFlash ? mutateFlash() : mutateDrops();
    else toast.error('Failed to delete');
  };

  const field = (key: string) => ({
    value: formData[key] ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFormData({ ...formData, [key]: e.target.value }),
    className: 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary/50 text-white text-sm',
  });

  const currentImageUrl = isFlash ? formData.backgroundMedia : formData.image;

  return (
    <div className="flex flex-col gap-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-lg font-bold text-on-surface">Flash Deals & Live Drops</h2>
          <p className="font-body-md text-on-surface-variant">Manage promotional content on the Deals page.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-sm bg-primary text-on-primary px-lg py-3 rounded-xl hover:scale-105 font-bold shadow-lg glow-primary transition-all"
        >
          <Plus className="w-5 h-5" /> Add {isFlash ? 'Flash Deal' : 'Live Drop'}
        </button>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-3 border-b border-outline-variant/10 pb-4">
        {(['flash', 'drops'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeTab === tab ? 'bg-primary text-on-primary' : 'bg-surface-variant/20 text-on-surface-variant hover:text-white'}`}
          >
            {tab === 'flash' ? <><Zap className="w-4 h-4 inline mr-1.5" />Flash Deals</> : <><Package className="w-4 h-4 inline mr-1.5" />Live Drops</>}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md">
        {(isFlash ? flashDeals : liveDrops)?.map((item: any) => {
          const img = isFlash ? item.backgroundMedia : item.image;
          const name = isFlash ? item.title : item.name;
          const sub = isFlash ? item.offerTitle : item.description;
          return (
            <div key={item._id} className="bg-surface-variant/20 border border-outline-variant/10 rounded-2xl overflow-hidden">
              <div className="h-44 relative">
                {img ? (
                  <img src={img} alt={name} className="w-full h-full object-cover opacity-70" />
                ) : (
                  <div className="w-full h-full bg-surface-variant/20 flex items-center justify-center text-on-surface-variant/30">
                    <Zap className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${item.isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {item.isActive ? 'Active' : 'Off'}
                </span>
              </div>
              <div className="p-4 border-t border-outline-variant/10 bg-surface/50">
                <h3 className="font-bold text-white mb-1 line-clamp-1">{name}</h3>
                <p className="text-xs text-on-surface-variant line-clamp-1 mb-3">{sub}</p>
                <div className="flex justify-end gap-2">
                  <button onClick={() => handleOpenModal(item)} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(item._id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="bg-[#11111a] w-full max-w-2xl rounded-3xl relative z-10 border border-white/10 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">
                  {editingItem ? 'Edit' : 'New'} {isFlash ? 'Flash Deal' : 'Live Drop'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white transition-colors"><X /></button>
              </div>

              {/* Body */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 custom-scrollbar">
                {/* Media Upload */}
                <CloudinaryUploader
                  folder={isFlash ? 'neon-nexus-deals/flash' : 'neon-nexus-deals/drops'}
                  value={isFlash ? formData.backgroundMedia : formData.image}
                  onChange={(url) => setFormData({...formData, [isFlash ? 'backgroundMedia' : 'image']: url})}
                  label={isFlash ? "Background Media" : "Drop Image"}
                  aspectRatio="wide"
                  maxSizeMB={10}
                />

                {isFlash ? (
                  /* Flash Deal Fields — match FlashDeal schema exactly */
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold mb-2 text-white/50">GAME ID (MongoDB)</label><input required {...field('gameId')} placeholder="e.g. 6643..." /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">TITLE</label><input required {...field('title')} placeholder="PUBG Flash Deal" /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">OFFER TITLE</label><input required {...field('offerTitle')} placeholder="600 UC + 60 Bonus" /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">BONUS TEXT</label><input required {...field('bonusText')} placeholder="+10% extra today" /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">ORIGINAL PRICE (৳)</label><input type="number" required {...field('originalPrice')} placeholder="800" /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">DISCOUNTED PRICE (৳)</label><input type="number" required {...field('discountedPrice')} placeholder="620" /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">STOCK STATUS (0–100)</label><input type="number" min="0" max="100" {...field('stockStatus')} /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">LIMITED QUANTITY</label><input {...field('limitedQuantity')} placeholder="Only 50 left!" /></div>
                    <div className="col-span-2"><label className="block text-xs font-bold mb-2 text-white/50">ENDS AT</label><input type="datetime-local" {...field('endsAt')} /></div>
                    <div className="col-span-2 flex items-center gap-3">
                      <input type="checkbox" id="fd-active" checked={!!formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="accent-primary w-4 h-4" />
                      <label htmlFor="fd-active" className="text-sm text-white/70 font-bold">Active (visible to users)</label>
                    </div>
                  </div>
                ) : (
                  /* Live Drop Fields — match LiveDrop schema */
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-xs font-bold mb-2 text-white/50">GAME ID (MongoDB)</label><input required {...field('gameId')} placeholder="e.g. 6643..." /></div>
                    <div><label className="block text-xs font-bold mb-2 text-white/50">NAME</label><input required {...field('name')} placeholder="PUBG Season Bundle" /></div>
                    <div className="col-span-2"><label className="block text-xs font-bold mb-2 text-white/50">DESCRIPTION</label><textarea required rows={2} {...field('description')} placeholder="Exclusive season bundle with rare items..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white resize-none outline-none focus:border-primary/50" /></div>
                    <div>
                      <label className="block text-xs font-bold mb-2 text-white/50">BADGE</label>
                      <select {...field('badge')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none">
                        <option>Limited</option>
                        <option>Almost Gone</option>
                        <option>Restocked</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <input type="checkbox" id="ld-active" checked={!!formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="accent-primary w-4 h-4" />
                      <label htmlFor="ld-active" className="text-sm text-white/70 font-bold">Active</label>
                    </div>
                  </div>
                )}
              </form>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 bg-white/[0.02] flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-white/60 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2 disabled:opacity-50 hover:scale-[1.02] transition-all shadow-lg">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
