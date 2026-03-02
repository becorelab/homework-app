"use client";

import { useState, useEffect } from "react";
import { isAuthEnabled, isAuthenticated, authenticate } from "@/lib/auth";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [needsAuth, setNeedsAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthEnabled()) {
      setAuthed(true);
    } else if (isAuthenticated()) {
      setAuthed(true);
    } else {
      setNeedsAuth(true);
    }
  }, []);

  if (!mounted) return null;
  if (authed) return <>{children}</>;
  if (!needsAuth) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authenticate(password)) {
      setAuthed(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(160deg, #ede9fe 0%, #f0ecff 30%, #fdf2f8 70%, #fef9e7 100%)" }}
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 12px 32px rgba(124,92,252,0.3)" }}
      >
        <Lock size={32} className="text-white" />
      </div>
      <h1 className="text-display text-[24px] text-gray-800 text-center">숙제친구</h1>
      <p className="text-gray-400 text-sm font-medium mt-2 text-center">비밀번호를 입력해주세요</p>

      <form onSubmit={handleSubmit} className="w-full mt-8 space-y-4">
        <div className="card-3d space-y-4">
          <div className="relative">
            <input
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="비밀번호"
              autoFocus
              className={`w-full px-4 py-4 rounded-2xl border-2 outline-none text-[16px] font-bold text-center transition-all ${
                error
                  ? "bg-red-50 border-red-300 focus:border-red-400"
                  : "bg-[#f0ecff] border-transparent focus:border-[#7c5cfc] focus:bg-white"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-400 font-semibold text-center">비밀번호가 틀렸어요!</p>
          )}
          <button
            type="submit"
            disabled={!password}
            className="w-full py-4 rounded-2xl text-white text-[15px] font-extrabold disabled:opacity-40 transition-all active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 8px 24px rgba(124,92,252,0.35)" }}
          >
            입장하기
          </button>
        </div>
      </form>
    </div>
  );
}
