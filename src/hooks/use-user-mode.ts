import { useEffect, useState } from "react";

export type UserMode = "easy" | "advanced";
const KEY = "admin.ai_control_center.mode";

export function useUserMode(): [UserMode, (m: UserMode) => void] {
  const [mode, setMode] = useState<UserMode>("easy");
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(KEY);
      if (v === "easy" || v === "advanced") setMode(v);
    } catch {}
  }, []);
  function change(m: UserMode) {
    setMode(m);
    try { window.localStorage.setItem(KEY, m); } catch {}
  }
  return [mode, change];
}