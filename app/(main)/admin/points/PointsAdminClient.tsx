"use client";

import { useState } from 'react';
import useSWR from 'swr';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Save, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryUploader from '@/components/CloudinaryUploader';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function PointsAdminClient() {
  const { data: rewards, mutate, isLoading } = useSWR('/api/admin/points', fetcher);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    pointsCost: 1000,
    image: '',
    stock: 100,
    isActive: true,
    category: 'Vouchers'
  });

  const handleOpenModal = (reward: any = null) => {
    if (reward) {
      setEditingReward(reward);
      setFormData(reward);
    } else {
      setEditingReward(null);
      setFormData({
        title: '',
        description: '',
        pointsCost: 1000,
        image: '',
        stock: 100,
        isActive: true,
        category: 'Vouchers'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const tid = 'save-reward';

    try {
      toast.loading('Saving reward...', { id: tid });

      // formData.image is already a Cloudinary URL set by CloudinaryUploader
      const body = editingReward 
        ? { ...formData, id: editingReward._id } 
        : { ...formData };
      
      const method = editingReward ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/points', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || 'Failed to save reward');

      toast.success(editingReward ? 'Reward updated!' : 'Reward created!', { id: tid });
      mutate();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred', { id: tid });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reward?')) return;
    try {
      const res = await fetch(`/api/admin/points?id=${id}`, { method: 'DELETE' });
      if (res.ok) mutate();
    } catch (err) {
      toast.error('Failed to delete reward');
    }
  };

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">Points Rewards</h2>
          <p className="font-body-md text-on-surface-variant">Manage the Nexus Points store items.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-sm bg-primary text-on-primary px-lg py-3 rounded-xl hover:scale-105 active:scale-95 font-bold shadow-lg glow-primary transition-all"
        >
          <Plus className="w-5 h-5" /> Add Reward
        </button>
      </div>

      {isLoading ? (
        <div className="text-on-surface-variant animate-pulse">Loading rewards...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-md">
          {rewards?.map((reward: any) => (
            <div key={reward._id} className="bg-surface-variant/20 rounded-2xl border border-outline-variant/10 overflow-hidden relative group">
              <div className="h-40 relative">
                <img src={reward.image} alt={reward.title} className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
                <div className="absolute top-2 right-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-xs font-bold">
                  {reward.pointsCost} PTS
                </div>
              </div>
              <div className="p-4 relative z-10 -mt-10">
                <div className="flex justify-end gap-2 mb-2">
                  <button onClick={() => handleOpenModal(reward)} className="p-2 bg-surface/80 rounded-lg hover:text-primary transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(reward._id)} className="p-2 bg-surface/80 rounded-lg text-error hover:bg-error/10 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-bold text-lg">{reward.title}</h3>
                <p className="text-sm text-on-surface-variant line-clamp-2">{reward.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)} />
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-[#11111a] w-full max-w-2xl rounded-3xl relative z-10 border border-white/10 flex flex-col overflow-hidden max-h-[90vh]">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-xl font-bold">{editingReward ? 'Edit Reward' : 'New Reward'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-white/50 hover:text-white"><X /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white/50 mb-2">TITLE</label>
                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white/50 mb-2">POINTS COST</label>
                    <input type="number" required value={formData.pointsCost} onChange={e => setFormData({...formData, pointsCost: parseInt(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/50 mb-2">DESCRIPTION</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary resize-none" />
                </div>
                <CloudinaryUploader
                  folder="neon-nexus-points"
                  value={formData.image || ''}
                  onChange={(url) => setFormData({...formData, image: url})}
                  label="Reward Image"
                  aspectRatio="square"
                  maxSizeMB={5}
                />
              </form>
              <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-white/70">Cancel</button>
                <button onClick={handleSave} disabled={isSaving} className="px-6 py-3 bg-primary text-black font-bold rounded-xl flex items-center gap-2 disabled:opacity-50">
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
