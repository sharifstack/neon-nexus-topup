"use client";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function ToastOnMount({ message, type = 'error' }: { message: string, type?: 'error' | 'success' }) {
  useEffect(() => {
    if (type === 'error') {
      toast.error(message, { id: message });
    } else {
      toast.success(message, { id: message });
    }
  }, [message, type]);

  return null;
}
