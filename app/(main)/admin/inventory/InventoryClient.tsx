"use client";

import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Image as ImageIcon,
  Layers,
  Tag as TagIcon,
  X,
  Save,
  Gamepad2,
  Zap,
  LayoutGrid,
  Tv,
  Check,
  AlertCircle,
  MoreHorizontal,
  ChevronDown,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InventoryClient() {
  const { data: games, mutate, isLoading } = useSWR('/api/admin/inventory', fetcher);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState<any>({
    name: '',
    category: 'Mobile Games',
    type: 'game',
    currency: 'USD',
    description: '',
    coverImage: '',
    bannerImage: '',
    requiresZoneId: false,
    isActive: true,
    isFeatured: false,
    stock: 100,
    packages: []
  });

  const filteredGames = useMemo(() => {
    return games?.filter((game: any) => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          game.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || game.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [games, searchTerm, filterType]);

  const handleOpenModal = (game: any = null) => {
    if (game) {
      setEditingGame(game);
      setFormData({ ...game });
    } else {
      setEditingGame(null);
      setFormData({
        name: '',
        category: 'Mobile Games',
        type: 'game',
        currency: 'USD',
        description: '',
        coverImage: '',
        bannerImage: '',
        requiresZoneId: false,
        isActive: true,
        isFeatured: false,
        stock: 100,
        packages: []
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const method = editingGame ? 'PUT' : 'POST';
      const body = editingGame ? { ...formData, id: editingGame._id } : formData;
      
      const res = await fetch('/api/admin/inventory', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (res.ok) {
        mutate();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/admin/inventory?id=${id}`, { method: 'DELETE' });
      if (res.ok) mutate();
    } catch (err) {
      console.error('Failed to delete product');
    }
  };

  const addPackage = () => {
    const newPkg = { id: `pkg-${Date.now()}`, name: '', price: 0, bonus: '', popular: false };
    setFormData({ ...formData, packages: [...formData.packages, newPkg] });
  };

  const removePackage = (id: string) => {
    setFormData({ ...formData, packages: formData.packages.filter((p: any) => p.id !== id) });
  };

  const updatePackage = (id: string, field: string, value: any) => {
    setFormData({
      ...formData,
      packages: formData.packages.map((p: any) => p.id === id ? { ...p, [field]: value } : p)
    });
  };

  return (
    <div className="flex flex-col gap-xl">
      {/* Dynamic Action Bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-md">
        <div className="flex flex-col sm:flex-row gap-md w-full lg:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="bg-surface-variant/20 border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 text-label-md w-full focus:outline-none focus:border-primary/50 transition-all shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-surface-variant/20 p-1 rounded-xl border border-outline-variant/10 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All', icon: LayoutGrid },
              { id: 'game', label: 'Games', icon: Gamepad2 },
              { id: 'minigame', label: 'Mini Games', icon: Zap },
              { id: 'flashdeal', label: 'Flash Deals', icon: Zap },
              { id: 'entertainment', label: 'Media', icon: Tv }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setFilterType(type.id)}
                className={`flex items-center gap-xs px-4 py-2 rounded-lg text-label-sm font-label-sm transition-all whitespace-nowrap ${
                  filterType === type.id 
                    ? 'bg-primary text-on-primary shadow-lg glow-primary' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <type.icon className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={() => handleOpenModal()}
          className="w-full lg:w-auto flex items-center justify-center gap-sm bg-primary text-on-primary font-label-md text-label-md px-lg py-3 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg glow-primary"
        >
          <Plus className="w-5 h-5" />
          Create New Entry
        </button>
      </div>

      {/* Main Grid View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-72 bg-surface-variant/20 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-md lg:gap-lg">
          <AnimatePresence mode='popLayout'>
            {filteredGames?.map((game: any) => (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={game._id} 
                className="glass-panel rounded-2xl overflow-hidden group hover:border-primary/40 transition-all duration-500 flex flex-col relative border border-white/5"
              >
                {/* Header Media */}
                <div className="h-36 w-full relative overflow-hidden">
                  <img src={game.bannerImage || game.coverImage} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/60 to-transparent"></div>
                  
                  {/* Status Overlay */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    {game.isFeatured && (
                      <span className="p-1.5 bg-tertiary/20 text-tertiary backdrop-blur-md rounded-lg border border-tertiary/30">
                        <Zap className="w-4 h-4" />
                      </span>
                    )}
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest backdrop-blur-md ${
                      game.isActive ? 'bg-primary/10 text-primary border-primary/20' : 'bg-error/10 text-error border-error/20'
                    }`}>
                      {game.isActive ? 'Active' : 'Offline'}
                    </span>
                  </div>

                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-2 py-1 bg-surface/80 backdrop-blur-md rounded-md text-[10px] font-bold text-on-surface-variant border border-outline-variant/30 uppercase">
                      {game.type}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="px-lg pb-lg flex-1 flex flex-col -mt-10 relative z-10">
                  <div className="flex justify-between items-end mb-md">
                    <div className="w-20 h-20 rounded-2xl bg-surface border-2 border-outline-variant/30 overflow-hidden shadow-2xl group-hover:border-primary/50 transition-all duration-300 transform group-hover:rotate-3">
                      <img src={game.coverImage} className="w-full h-full object-cover" alt={game.name} />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleOpenModal(game)}
                        className="p-2.5 bg-surface-variant/50 text-on-surface-variant hover:text-primary hover:bg-primary/10 rounded-xl border border-outline-variant/20 transition-all hover:scale-110"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(game._id)}
                        className="p-2.5 bg-error/5 text-error hover:bg-error/10 rounded-xl border border-error/20 transition-all hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface mb-xs group-hover:text-primary transition-colors">{game.name}</h3>
                  <p className="text-on-surface-variant text-body-sm line-clamp-1 mb-md opacity-70 italic">{game.description}</p>
                  
                  <div className="grid grid-cols-2 gap-sm mb-lg">
                    <div className="flex items-center gap-2 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                      <Layers className="w-4 h-4 text-primary" />
                      <span>{game.packages?.length || 0} Options</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
                      <TagIcon className="w-4 h-4 text-primary" />
                      <span>{game.currency}</span>
                    </div>
                  </div>

                  {/* Stock Progress */}
                  <div className="mt-auto">
                    <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase mb-1.5 opacity-80">
                      <span>Reserve Status</span>
                      <span className={game.stock > 20 ? 'text-tertiary' : 'text-error'}>
                        {game.stock}% Available
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-variant/30 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${game.stock}%` }}
                        className={`h-full ${game.stock > 20 ? 'bg-tertiary glow-tertiary' : 'bg-error glow-error'}`}
                      ></motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* COMPREHENSIVE CRUD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-md overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/90 backdrop-blur-xl" 
              onClick={() => !isSaving && setIsModalOpen(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-panel rounded-3xl w-full max-w-4xl relative z-10 shadow-2xl border border-primary/20 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="px-xl py-lg border-b border-white/10 flex justify-between items-center bg-surface/50 rounded-t-3xl">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30">
                    {editingGame ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </div>
                  <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface tracking-tight">
                    {editingGame ? `Edit Product: ${editingGame.name}` : 'Create New Nexus Entry'}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-surface-variant/50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-on-surface-variant" />
                </button>
              </div>

              {/* Modal Content - Scrollable Form */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-xl custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-xl">
                  {/* Left Column: Basic Info */}
                  <div className="space-y-lg">
                    <SectionTitle icon={LayoutGrid} title="Basic Configuration" />
                    
                    <div className="space-y-md">
                      <InputGroup label="Product Name" placeholder="e.g. PUBG MOBILE">
                        <input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="input-premium py-2.5 text-sm"
                        />
                      </InputGroup>

                      <div className="grid grid-cols-2 gap-md">
                        <InputGroup label="Category">
                          <select 
                            value={formData.category}
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="input-premium py-2.5 text-sm appearance-none"
                          >
                            <option>Mobile Games</option>
                            <option>PC Games</option>
                            <option>Vouchers</option>
                            <option>Entertainment</option>
                          </select>
                        </InputGroup>
                        <InputGroup label="Type">
                          <select 
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                            className="input-premium py-2.5 text-sm"
                          >
                            <option value="game">Game</option>
                            <option value="minigame">Mini Game</option>
                            <option value="flashdeal">Flash Deal</option>
                            <option value="entertainment">Media</option>
                          </select>
                        </InputGroup>
                      </div>

                      <InputGroup label="Description">
                        <textarea 
                          rows={3}
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="input-premium py-2.5 text-sm resize-none"
                          placeholder="Cyberpunk top-up solutions..."
                        />
                      </InputGroup>

                      <div className="grid grid-cols-2 gap-md p-md bg-surface-variant/10 rounded-xl border border-outline-variant/10">
                        <Toggle 
                          label="Active" 
                          active={formData.isActive} 
                          onClick={() => setFormData({...formData, isActive: !formData.isActive})} 
                        />
                        <Toggle 
                          label="Featured" 
                          active={formData.isFeatured} 
                          onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})} 
                        />
                        <Toggle 
                          label="Flash Deal" 
                          active={formData.isFlashDeal} 
                          onClick={() => setFormData({...formData, isFlashDeal: !formData.isFlashDeal})} 
                        />
                        <Toggle 
                          label="Mini Game" 
                          active={formData.isMiniGame} 
                          onClick={() => setFormData({...formData, isMiniGame: !formData.isMiniGame})} 
                        />
                      </div>
                    </div>

                    <SectionTitle icon={ImageIcon} title="Media Assets" />
                    <div className="space-y-md">
                      <InputGroup label="Thumbnail URL" placeholder="https://...">
                        <input 
                          value={formData.coverImage}
                          onChange={(e) => setFormData({...formData, coverImage: e.target.value})}
                          className="input-premium py-2.5 text-sm"
                        />
                      </InputGroup>
                      <InputGroup label="Banner / GIF Background" placeholder="https://...">
                        <input 
                          value={formData.bannerImage}
                          onChange={(e) => setFormData({...formData, bannerImage: e.target.value})}
                          className="input-premium py-2.5 text-sm"
                        />
                      </InputGroup>
                    </div>
                  </div>

                  {/* Right Column: Packages & Pricing */}
                  <div className="space-y-lg">
                    <div className="flex justify-between items-center">
                      <SectionTitle icon={TagIcon} title="Pricing Packages" />
                      <button 
                        type="button"
                        onClick={addPackage}
                        className="text-primary text-xs font-bold uppercase flex items-center gap-1 hover:underline"
                      >
                        <Plus className="w-3 h-3" /> Add Tier
                      </button>
                    </div>

                    <div className="space-y-md">
                      {formData.packages.length === 0 && (
                        <div className="p-xl border-2 border-dashed border-outline-variant/20 rounded-2xl text-center">
                          <p className="text-on-surface-variant text-sm italic">No pricing tiers defined. Click "Add Tier" to begin.</p>
                        </div>
                      )}
                      <div className="space-y-sm max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {formData.packages.map((pkg: any) => (
                          <div key={pkg.id} className="p-md bg-surface-variant/10 rounded-xl border border-outline-variant/10 flex flex-col gap-md relative group">
                            <button 
                              type="button"
                              onClick={() => removePackage(pkg.id)}
                              className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <div className="grid grid-cols-2 gap-md">
                              <input 
                                placeholder="Package Name (e.g. 60 UC)"
                                className="bg-transparent border-b border-outline-variant/30 text-sm py-1 focus:border-primary outline-none"
                                value={pkg.name}
                                onChange={(e) => updatePackage(pkg.id, 'name', e.target.value)}
                              />
                              <input 
                                type="number"
                                step="0.01"
                                placeholder="Price"
                                className="bg-transparent border-b border-outline-variant/30 text-sm py-1 focus:border-primary outline-none"
                                value={pkg.price}
                                onChange={(e) => updatePackage(pkg.id, 'price', parseFloat(e.target.value))}
                              />
                            </div>
                            <div className="flex gap-md items-center">
                              <input 
                                placeholder="Bonus Text (optional)"
                                className="bg-transparent border-b border-outline-variant/30 text-[11px] py-1 focus:border-primary outline-none flex-1"
                                value={pkg.bonus}
                                onChange={(e) => updatePackage(pkg.id, 'bonus', e.target.value)}
                              />
                              <div className="flex items-center gap-2">
                                <label className="text-[10px] uppercase font-bold text-on-surface-variant">Popular</label>
                                <input 
                                  type="checkbox"
                                  checked={pkg.popular}
                                  onChange={(e) => updatePackage(pkg.id, 'popular', e.target.checked)}
                                  className="accent-primary"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <SectionTitle icon={ArrowUpRight} title="Advanced Specs" />
                    <div className="grid grid-cols-2 gap-md">
                      <InputGroup label="Currency Symbol">
                        <input 
                          value={formData.currency}
                          onChange={(e) => setFormData({...formData, currency: e.target.value})}
                          className="input-premium py-2.5 text-sm"
                          placeholder="e.g. UC, Gems"
                        />
                      </InputGroup>
                      <InputGroup label="Stock %">
                        <input 
                          type="number"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                          className="input-premium py-2.5 text-sm"
                        />
                      </InputGroup>
                    </div>
                  </div>
                </div>
              </form>

              {/* Modal Footer */}
              <div className="px-xl py-lg border-t border-white/10 bg-surface/80 rounded-b-3xl flex justify-between items-center">
                <div className="flex items-center gap-sm text-on-surface-variant text-xs">
                  <AlertCircle className="w-4 h-4 text-primary" />
                  All changes are synced instantly with live marketplaces.
                </div>
                <div className="flex gap-md">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-lg py-3 rounded-xl text-on-surface-variant hover:bg-surface-variant/30 transition-all font-label-md"
                  >
                    Discard Changes
                  </button>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-sm px-xl py-3 bg-primary text-on-primary rounded-xl font-headline-md glow-primary hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    {editingGame ? 'Update Product' : 'Authorize Deployment'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components for cleaner code
function SectionTitle({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-sm text-on-surface-variant/60 uppercase tracking-widest text-[11px] font-bold border-b border-outline-variant/10 pb-2 mb-md">
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
  );
}

function InputGroup({ label, children, placeholder }: { label: string, children: React.ReactNode, placeholder?: string }) {
  return (
    <div className="flex flex-col gap-xs">
      <label className="font-label-sm text-label-sm text-on-surface-variant/80 ml-1">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className="flex items-center gap-sm group"
    >
      <div className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? 'bg-primary' : 'bg-surface-variant/50'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`}></div>
      </div>
      <span className="text-xs font-bold text-on-surface-variant group-hover:text-on-surface transition-colors">{label}</span>
    </button>
  );
}
