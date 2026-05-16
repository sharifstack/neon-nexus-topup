"use client";

import { updateProfile, updatePassword, toggleTwoFactor } from "@/app/actions/account";
import { useState, useTransition, useRef } from "react";
import toast from "react-hot-toast";
import { Camera, Loader2, Upload } from "lucide-react";

export default function ProfileSettings({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [avatarPreview, setAvatarPreview] = useState<string>(user.avatar || "");
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Use JPEG, PNG, WebP, or GIF.");
      return;
    }
    // Validate size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large. Max size is 5MB.");
      return;
    }

    // Show optimistic preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    // Upload to Cloudinary via our API
    setIsUploadingAvatar(true);
    const toastId = "avatar-upload";
    toast.loading("Uploading avatar...", { id: toastId });

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/user/avatar", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setAvatarPreview(data.url);
      toast.success("Avatar updated successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed", { id: toastId });
      // Revert preview on failure
      setAvatarPreview(user.avatar || "");
    } finally {
      setIsUploadingAvatar(false);
    }
  };

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
          {/* Avatar Upload Section */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Profile Picture</label>
            <div className="flex items-center gap-lg">
              {/* Avatar Preview */}
              <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/30 bg-surface-variant/30 flex-shrink-0">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl">person</span>
                  </div>
                )}
                {isUploadingAvatar && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                )}
              </div>

              {/* Upload Controls */}
              <div className="flex flex-col gap-sm">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                  id="avatar-file-input"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  className="flex items-center gap-sm px-md py-sm bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                >
                  {isUploadingAvatar ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Camera className="w-4 h-4" /> Change Avatar</>
                  )}
                </button>
                <p className="text-xs text-on-surface-variant opacity-60">JPEG, PNG, WebP or GIF · Max 5MB</p>
                {/* Hidden input to carry Cloudinary URL in form submission */}
                <input type="hidden" name="avatar" value={avatarPreview} readOnly />
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Codename</label>
            <input 
              name="name" 
              defaultValue={user.name} 
              required 
              className="input-focus bg-[#050506] border border-outline-variant/30 w-full rounded-lg py-md px-md text-on-surface font-body-md" 
            />
          </div>

          <button disabled={isPending || isUploadingAvatar} className="bg-primary-container text-on-primary-container py-sm rounded-lg hover:scale-[1.02] transition-transform font-bold disabled:opacity-50">
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
