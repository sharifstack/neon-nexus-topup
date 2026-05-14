"use client";

import { updateProfile, updatePassword, toggleTwoFactor } from "@/app/actions/account";
import { useState, useTransition } from "react";

export default function ProfileSettings({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleToggle2FA = () => {
    startTransition(async () => {
      setMessage({ type: "", text: "" });
      const result = await toggleTwoFactor();
      if (result.error) setMessage({ type: "error", text: result.error });
      else if (result.success) setMessage({ type: "success", text: result.success });
    });
  };

  const handleUpdateProfile = (formData: FormData) => {
    startTransition(async () => {
      setMessage({ type: "", text: "" });
      const result = await updateProfile(formData);
      if (result.error) setMessage({ type: "error", text: result.error });
      else if (result.success) setMessage({ type: "success", text: result.success });
    });
  };

  const handleUpdatePassword = (formData: FormData) => {
    startTransition(async () => {
      setMessage({ type: "", text: "" });
      const result = await updatePassword(formData);
      if (result.error) setMessage({ type: "error", text: result.error });
      else if (result.success) setMessage({ type: "success", text: result.success });
    });
  };

  return (
    <section className="bg-surface-container-low/40 backdrop-blur-xl border border-outline-variant/30 rounded-xl p-lg flex flex-col gap-lg flex-1">
      <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
        <span className="material-symbols-outlined text-primary">tune</span>
        Profile Settings
      </h2>
      
      <div className="flex border-b border-outline-variant/30 gap-md overflow-x-auto no-scrollbar">
        {["Profile", "Security"].map(tab => (
          <button 
            key={tab}
            onClick={() => { setActiveTab(tab); setMessage({ type: "", text: "" }); }}
            className={`font-label-md text-label-md pb-sm border-b-2 whitespace-nowrap px-sm transition-colors ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {message.text && (
        <div className={`p-sm rounded-md text-sm ${message.type === "error" ? "bg-error/20 text-error border border-error/30" : "bg-tertiary/20 text-tertiary border border-tertiary/30"}`}>
          {message.text}
        </div>
      )}

      {activeTab === "Profile" && (
        <form action={handleUpdateProfile} className="flex flex-col gap-md pt-sm">
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Codename</label>
            <input 
              name="name" 
              defaultValue={user.name} 
              required 
              className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-md px-md text-on-surface font-body-md" 
            />
          </div>
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Avatar URL</label>
            <input 
              name="avatar" 
              defaultValue={user.avatar || ""} 
              placeholder="https://..." 
              className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-md px-md text-on-surface font-body-md" 
            />
          </div>
          <button disabled={isPending} className="bg-primary-container text-on-primary-container py-sm rounded-lg hover:scale-[1.02] transition-transform font-bold disabled:opacity-50">
            {isPending ? "Updating..." : "Save Profile"}
          </button>
        </form>
      )}

      {activeTab === "Security" && (
        <div className="flex flex-col gap-md pt-sm">
          <div className="flex items-center justify-between p-md rounded-lg bg-surface/30 border border-outline-variant/10">
            <div className="flex flex-col gap-xs">
              <span className="font-label-md text-label-md text-on-surface">Two-Factor Authentication (2FA)</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Secure your account with an authenticator app.</span>
            </div>
            <button 
              onClick={handleToggle2FA}
              disabled={isPending}
              className={`w-12 h-6 rounded-full relative cursor-pointer border shadow-[0_0_10px_rgba(0,242,255,0.2)] transition-colors ${user.twoFactorEnabled ? 'bg-primary/20 border-primary/50' : 'bg-surface-variant border-outline-variant'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full transition-all ${user.twoFactorEnabled ? 'right-1 bg-primary shadow-[0_0_5px_rgba(0,242,255,0.8)]' : 'left-1 bg-outline-variant'}`}></div>
            </button>
          </div>

          <form action={handleUpdatePassword} className="flex flex-col gap-sm p-md rounded-lg bg-surface/30 border border-outline-variant/10">
            <span className="font-label-md text-label-md text-on-surface">Change Password</span>
            <input 
              name="currentPassword" 
              type="password" 
              placeholder="Current Password" 
              required 
              className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-sm px-md text-on-surface font-body-md mt-sm" 
            />
            <input 
              name="newPassword" 
              type="password" 
              placeholder="New Password" 
              required 
              className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-sm px-md text-on-surface font-body-md" 
            />
            <button disabled={isPending} className="px-md py-sm rounded-lg border border-outline-variant hover:border-primary text-on-surface hover:text-primary transition-all font-label-sm text-label-sm bg-surface w-fit mt-xs disabled:opacity-50">
              {isPending ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
