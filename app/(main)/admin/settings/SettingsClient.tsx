"use client";

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { toast } from 'react-hot-toast';
import { 
  Settings2, 
  Store, 
  CreditCard, 
  Mail, 
  ShieldAlert, 
  Star, 
  Zap, 
  Search, 
  Image as ImageIcon, 
  Share2, 
  Save,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const TABS = [
  { id: 'general', label: 'General', icon: Settings2 },
  { id: 'marketplace', label: 'Marketplace', icon: Store },
  { id: 'payment', label: 'Payment Gateways', icon: CreditCard },
  { id: 'email', label: 'Email / SMTP', icon: Mail },
  { id: 'security', label: 'Security', icon: ShieldAlert },
  { id: 'points', label: 'Points System', icon: Star },
  { id: 'flashdeals', label: 'Flash Deals', icon: Zap },
  { id: 'seo', label: 'SEO Settings', icon: Search },
  { id: 'media', label: 'Media (Cloudinary)', icon: ImageIcon },
  { id: 'social', label: 'Social & Contact', icon: Share2 }
];

export default function SettingsClient() {
  const { data, error, isLoading, mutate } = useSWR('/api/admin/settings', fetcher);
  
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);

  useEffect(() => {
    if (data && !hasUnsaved) {
      setFormData(JSON.parse(JSON.stringify(data)));
    }
  }, [data, hasUnsaved]);

  const handleChange = (path: string, value: any) => {
    setHasUnsaved(true);
    setFormData((prev: any) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/settings/${activeTab}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        // Only send the relevant chunk for the active tab to optimize, 
        // but for simplicity we can send the whole form data, the backend picks what it needs
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Failed to save settings');
      toast.success('Settings saved successfully!');
      setHasUnsaved(false);
      mutate(formData, false);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="animate-pulse h-[600px] bg-surface-variant/20 rounded-xl" />;
  if (error) return <div className="text-error">Failed to load settings.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-lg items-start">
      {/* Sidebar Tabs */}
      <aside className="w-full lg:w-64 flex-shrink-0 glass-panel rounded-xl p-sm flex flex-col gap-1 border border-outline-variant/10 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (hasUnsaved) {
                  if (confirm("You have unsaved changes. Discard?")) {
                    setHasUnsaved(false);
                    setActiveTab(tab.id);
                  }
                } else {
                  setActiveTab(tab.id);
                }
              }}
              className={`flex items-center gap-sm px-md py-sm rounded-lg transition-all text-label-md font-label-md text-left
                ${isActive ? 'bg-primary-container/20 text-primary font-bold shadow-[0_0_10px_rgba(0,242,255,0.1)] border border-primary/20' : 'text-on-surface-variant hover:bg-surface-variant/30 hover:text-on-surface'}
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
              {tab.label}
            </button>
          );
        })}
      </aside>

      {/* Main Settings Area */}
      <div className="flex-1 w-full glass-panel rounded-xl p-md lg:p-xl border border-outline-variant/10 flex flex-col gap-xl relative shadow-[0_0_30px_rgba(0,0,0,0.3)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-md border-b border-outline-variant/10">
          <div>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
              {TABS.find(t => t.id === activeTab)?.label}
            </h3>
            <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-2">
              Last updated: {new Date(formData.updatedAt || Date.now()).toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-md">
            {hasUnsaved && (
              <span className="text-error text-label-sm flex items-center gap-1 animate-pulse">
                <AlertCircle className="w-4 h-4" /> Unsaved changes
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={isSaving || !hasUnsaved}
              className={`px-lg py-2 rounded-lg font-bold text-label-md flex items-center gap-2 transition-all
                ${isSaving ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 
                  !hasUnsaved ? 'bg-surface-variant/50 text-on-surface-variant cursor-not-allowed' : 
                  'bg-primary text-on-primary shadow-[0_0_15px_rgba(0,242,255,0.3)] hover:scale-105 active:scale-95'
                }`}
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-on-surface-variant border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-xl"
          >
            {activeTab === 'general' && <GeneralSettings data={formData} onChange={handleChange} />}
            {activeTab === 'marketplace' && <MarketplaceSettings data={formData} onChange={handleChange} />}
            {activeTab === 'payment' && <PaymentSettings data={formData} onChange={handleChange} />}
            {activeTab === 'email' && <EmailSettings data={formData} onChange={handleChange} />}
            {activeTab === 'security' && <SecuritySettings data={formData} onChange={handleChange} />}
            {activeTab === 'points' && <PointsSettings data={formData} onChange={handleChange} />}
            {activeTab === 'flashdeals' && <FlashDealSettings data={formData} onChange={handleChange} />}
            {activeTab === 'seo' && <SEOSettings data={formData} onChange={handleChange} />}
            {activeTab === 'media' && <MediaSettings data={formData} onChange={handleChange} />}
            {activeTab === 'social' && <SocialSettings data={formData} onChange={handleChange} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// --------------------------------------------------------
// Sub-components for each tab
// --------------------------------------------------------

const InputField = ({ label, type = "text", value, onChange, placeholder = "", desc = "" }: any) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="font-label-md text-label-md text-on-surface">{label}</label>
    {desc && <span className="text-[11px] text-on-surface-variant mb-1">{desc}</span>}
    <input 
      type={type} 
      value={value || ''} 
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={placeholder}
      className="bg-surface border border-outline-variant/30 text-on-surface text-body-md rounded-lg px-4 py-2 focus:outline-none focus:border-primary/50 transition-colors"
    />
  </div>
);

const ToggleField = ({ label, value, onChange, desc = "" }: any) => (
  <div className="flex items-center justify-between p-md bg-surface-container/30 rounded-xl border border-outline-variant/10">
    <div className="flex flex-col">
      <span className="font-label-md text-label-md text-on-surface font-bold">{label}</span>
      {desc && <span className="text-label-sm text-on-surface-variant">{desc}</span>}
    </div>
    <button
      onClick={() => onChange(!value)}
      className={`relative w-12 h-6 rounded-full transition-colors ${value ? 'bg-primary shadow-[0_0_10px_rgba(0,242,255,0.3)]' : 'bg-surface-variant'}`}
    >
      <div className={`absolute top-1 w-4 h-4 rounded-full bg-black transition-all ${value ? 'left-7' : 'left-1'}`} />
    </button>
  </div>
);

function GeneralSettings({ data, onChange }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <InputField label="Website Name" value={data.websiteName} onChange={(v:any) => onChange('websiteName', v)} />
      <InputField label="Website Description" value={data.websiteDescription} onChange={(v:any) => onChange('websiteDescription', v)} />
      <InputField label="Support Email" value={data.supportEmail} onChange={(v:any) => onChange('supportEmail', v)} />
      <InputField label="Support Phone/WhatsApp" value={data.supportPhone} onChange={(v:any) => onChange('supportPhone', v)} />
      <InputField label="Currency Symbol" value={data.currencySymbol} onChange={(v:any) => onChange('currencySymbol', v)} />
      <InputField label="Timezone" value={data.timezone} onChange={(v:any) => onChange('timezone', v)} />
      <div className="md:col-span-2">
        <InputField label="Footer Text" value={data.footerText} onChange={(v:any) => onChange('footerText', v)} />
      </div>
    </div>
  );
}

function MarketplaceSettings({ data, onChange }: any) {
  return (
    <div className="flex flex-col gap-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <ToggleField label="Enable Marketplace" desc="Turns on/off the main store features" value={data.enableMarketplace} onChange={(v:any) => onChange('enableMarketplace', v)} />
        <ToggleField label="Enable Mini Games" desc="Shows mini-games on homepage" value={data.enableMiniGames} onChange={(v:any) => onChange('enableMiniGames', v)} />
        <ToggleField label="Enable Flash Deals" desc="Activates the global flash deals system" value={data.enableFlashDeals} onChange={(v:any) => onChange('enableFlashDeals', v)} />
        <ToggleField label="Enable Points Store" desc="Allows users to spend points" value={data.enablePointsStore} onChange={(v:any) => onChange('enablePointsStore', v)} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-4">
        <InputField type="number" label="Featured Games Count" value={data.featuredGamesCount} onChange={(v:any) => onChange('featuredGamesCount', v)} />
        <InputField type="number" label="Banner Autoplay Speed (ms)" value={data.bannerAutoplaySpeed} onChange={(v:any) => onChange('bannerAutoplaySpeed', v)} />
      </div>
    </div>
  );
}

function PaymentSettings({ data, onChange }: any) {
  const gateways = ['bkash', 'nagad', 'rocket', 'binance', 'stripe', 'paypal'];
  
  return (
    <div className="flex flex-col gap-xl">
      {gateways.map(gw => {
        const gwData = data.paymentGateways?.[gw] || {};
        return (
          <div key={gw} className="bg-surface-container/20 p-md rounded-xl border border-outline-variant/20 flex flex-col gap-md">
            <ToggleField label={`${gw.toUpperCase()} Integration`} value={gwData.enabled} onChange={(v:any) => onChange(`paymentGateways.${gw}.enabled`, v)} />
            
            {gwData.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-md border-t border-outline-variant/10">
                {gw === 'stripe' || gw === 'paypal' ? (
                  <>
                    <InputField label="Public Key / Client ID" type="password" value={gwData.publicKey || gwData.clientId} onChange={(v:any) => onChange(`paymentGateways.${gw}.${gw === 'stripe' ? 'publicKey' : 'clientId'}`, v)} />
                    <InputField label="Secret Key" type="password" value={gwData.secretKey || gwData.clientSecret} onChange={(v:any) => onChange(`paymentGateways.${gw}.${gw === 'stripe' ? 'secretKey' : 'clientSecret'}`, v)} />
                  </>
                ) : gw === 'binance' ? (
                  <InputField label="Binance Pay ID" value={gwData.accountId} onChange={(v:any) => onChange(`paymentGateways.${gw}.accountId`, v)} />
                ) : (
                  <>
                    <InputField label="Account Number" value={gwData.accountNumber} onChange={(v:any) => onChange(`paymentGateways.${gw}.accountNumber`, v)} />
                    <InputField label="Instructions" value={gwData.instructions} onChange={(v:any) => onChange(`paymentGateways.${gw}.instructions`, v)} />
                  </>
                )}
                <InputField type="number" label="Fee Percentage (%)" value={gwData.feePercentage} onChange={(v:any) => onChange(`paymentGateways.${gw}.feePercentage`, v)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function EmailSettings({ data, onChange }: any) {
  return (
    <div className="flex flex-col gap-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <InputField label="SMTP Host" value={data.smtp?.host} onChange={(v:any) => onChange('smtp.host', v)} />
        <InputField type="number" label="SMTP Port" value={data.smtp?.port} onChange={(v:any) => onChange('smtp.port', v)} />
        <InputField label="SMTP User" value={data.smtp?.user} onChange={(v:any) => onChange('smtp.user', v)} />
        <InputField type="password" label="SMTP Password" value={data.smtp?.password} onChange={(v:any) => onChange('smtp.password', v)} />
        <InputField label="Sender Email" value={data.smtp?.senderEmail} onChange={(v:any) => onChange('smtp.senderEmail', v)} />
        <InputField label="Sender Name" value={data.smtp?.senderName} onChange={(v:any) => onChange('smtp.senderName', v)} />
      </div>
      <button className="mt-4 px-md py-2 bg-surface-variant text-on-surface rounded-lg font-bold w-max hover:bg-surface-variant/80 transition-colors">
        Send Test Email
      </button>
    </div>
  );
}

function SecuritySettings({ data, onChange }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <ToggleField label="Maintenance Mode" desc="Takes site offline for users" value={data.maintenanceMode} onChange={(v:any) => onChange('maintenanceMode', v)} />
      <ToggleField label="Admin Only Mode" desc="Only admins can login" value={data.adminOnlyMode} onChange={(v:any) => onChange('adminOnlyMode', v)} />
      <ToggleField label="Require 2FA for Admin" desc="Forces 2FA for staff" value={data.require2FAForAdmin} onChange={(v:any) => onChange('require2FAForAdmin', v)} />
      
      <InputField type="number" label="JWT Expiry (Hours)" value={data.jwtExpiryHours} onChange={(v:any) => onChange('jwtExpiryHours', v)} />
      <InputField type="number" label="Session Timeout (Hours)" value={data.sessionTimeoutHours} onChange={(v:any) => onChange('sessionTimeoutHours', v)} />
      <InputField type="number" label="Max Login Attempts" value={data.maxLoginAttempts} onChange={(v:any) => onChange('maxLoginAttempts', v)} />
    </div>
  );
}

function PointsSettings({ data, onChange }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <InputField type="number" label="Points Rate (per unit spent)" desc="E.g., 1 point per $1 spent" value={data.pointsRate} onChange={(v:any) => onChange('pointsRate', v)} />
      <InputField type="number" label="Cashback Percentage" value={data.pointsCashbackPercentage} onChange={(v:any) => onChange('pointsCashbackPercentage', v)} />
      <InputField type="number" label="Minimum Redeem Points" value={data.minimumRedeemPoints} onChange={(v:any) => onChange('minimumRedeemPoints', v)} />
      <InputField type="number" label="Redemption Limits Per Day" value={data.redemptionLimitsPerDay} onChange={(v:any) => onChange('redemptionLimitsPerDay', v)} />
    </div>
  );
}

function FlashDealSettings({ data, onChange }: any) {
  return (
    <div className="flex flex-col gap-md">
      <ToggleField label="Flash Deals Active" value={data.flashDealsActive} onChange={(v:any) => onChange('flashDealsActive', v)} />
      <ToggleField label="Live Drops Active" value={data.liveDropsActive} onChange={(v:any) => onChange('liveDropsActive', v)} />
      <ToggleField label="Stock System Active" desc="Deduct stock automatically when purchased" value={data.stockSystemActive} onChange={(v:any) => onChange('stockSystemActive', v)} />
    </div>
  );
}

function SEOSettings({ data, onChange }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <div className="md:col-span-2">
        <InputField label="Meta Title" value={data.seo?.metaTitle} onChange={(v:any) => onChange('seo.metaTitle', v)} />
      </div>
      <div className="md:col-span-2">
        <InputField label="Meta Description" value={data.seo?.metaDescription} onChange={(v:any) => onChange('seo.metaDescription', v)} />
      </div>
      <InputField label="Keywords (comma separated)" value={data.seo?.keywords} onChange={(v:any) => onChange('seo.keywords', v)} />
      <InputField label="Robots" value={data.seo?.robots} onChange={(v:any) => onChange('seo.robots', v)} />
    </div>
  );
}

function MediaSettings({ data, onChange }: any) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
      <InputField label="Cloudinary Cloud Name" value={data.cloudinary?.cloudName} onChange={(v:any) => onChange('cloudinary.cloudName', v)} />
      <InputField type="password" label="API Key" value={data.cloudinary?.apiKey} onChange={(v:any) => onChange('cloudinary.apiKey', v)} />
      <InputField type="password" label="API Secret" value={data.cloudinary?.apiSecret} onChange={(v:any) => onChange('cloudinary.apiSecret', v)} />
      <InputField type="number" label="Max Upload Size (MB)" value={data.cloudinary?.maxUploadSizeMB} onChange={(v:any) => onChange('cloudinary.maxUploadSizeMB', v)} />
    </div>
  );
}

function SocialSettings({ data, onChange }: any) {
  return (
    <div className="flex flex-col gap-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <InputField label="Facebook URL" value={data.social?.facebook} onChange={(v:any) => onChange('social.facebook', v)} />
        <InputField label="Discord URL" value={data.social?.discord} onChange={(v:any) => onChange('social.discord', v)} />
        <InputField label="Telegram URL" value={data.social?.telegram} onChange={(v:any) => onChange('social.telegram', v)} />
        <InputField label="Instagram URL" value={data.social?.instagram} onChange={(v:any) => onChange('social.instagram', v)} />
        <InputField label="WhatsApp Number" value={data.social?.whatsapp} onChange={(v:any) => onChange('social.whatsapp', v)} />
        <InputField label="YouTube URL" value={data.social?.youtube} onChange={(v:any) => onChange('social.youtube', v)} />
      </div>
      <div className="border-t border-outline-variant/10 pt-lg">
        <h4 className="text-headline-sm font-bold mb-md">Floating Contact Widget</h4>
        <div className="flex flex-col gap-md">
          <ToggleField label="Enable Contact Widget" value={data.contactWidget?.enabled} onChange={(v:any) => onChange('contactWidget.enabled', v)} />
          <InputField label="Support Text" value={data.contactWidget?.supportText} onChange={(v:any) => onChange('contactWidget.supportText', v)} />
        </div>
      </div>
    </div>
  );
}
