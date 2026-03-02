"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfile, saveProfile, getRecords } from "@/lib/storage";
import { GRADES } from "@/lib/subjects";
import { Save, BookOpen, Trophy, Calendar } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    const profile = getProfile();
    setName(profile.name);
    setGrade(profile.grade);
  }, []);

  if (!mounted) return null;

  const records = getRecords();
  const totalDays = new Set(records.map((r) => r.date)).size;

  const handleSave = () => {
    if (!name.trim()) return;
    saveProfile({ name: name.trim(), grade });
    setSaved(true);
    setTimeout(() => { setSaved(false); router.push("/"); }, 1000);
  };

  return (
    <div className="pb-24">
      <div className="header-gradient rounded-b-[36px] px-6 pt-14 pb-10 text-white text-center relative z-10">
        <div className="w-24 h-24 bg-white/15 rounded-3xl mx-auto flex items-center justify-center text-5xl backdrop-blur-sm border border-white/20 relative z-10" style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}>
          🎒
        </div>
        <h1 className="text-display text-[22px] mt-4 relative z-10">{name || "이름을 입력해주세요"}</h1>
        <div className="pill bg-white/20 text-white mt-2 mx-auto relative z-10">🎓 {grade}학년</div>
      </div>

      <div className="px-5 -mt-5 space-y-4 relative z-20">
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: BookOpen, value: records.length, label: "총 제출", color: "#7c5cfc" },
            { icon: Trophy, value: records.filter((r) => r.score && r.score >= 90).length, label: "90점 이상", color: "#f59e0b" },
            { icon: Calendar, value: totalDays, label: "학습 일수", color: "#10b981" },
          ].map((item) => (
            <div key={item.label} className="card-3d text-center py-5">
              <div className="w-9 h-9 mx-auto rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: `${item.color}15`, boxShadow: `0 4px 12px ${item.color}20` }}>
                <item.icon size={18} style={{ color: item.color }} />
              </div>
              <p className="text-display text-[20px] text-gray-800">{item.value}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 font-bold">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="card-3d">
          <h3 className="text-heading text-[15px] text-gray-700 mb-4">내 정보 설정</h3>
          <div className="space-y-4">
            <div>
              <label className="text-label text-gray-500 mb-2 block">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력해주세요"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#f0ecff] border-2 border-transparent outline-none text-[14px] font-bold focus:border-[#7c5cfc] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-label text-gray-500 mb-2 block">학년</label>
              <div className="flex gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGrade(g)}
                    className={`flex-1 py-3.5 rounded-2xl text-[14px] font-extrabold transition-all ${
                      grade === g
                        ? "text-white"
                        : "bg-[#f0ecff] text-gray-500 hover:bg-purple-100"
                    }`}
                    style={grade === g ? {
                      background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                      boxShadow: "0 6px 20px rgba(124,92,252,0.3)",
                    } : {}}
                  >
                    {g}학년
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className={`w-full py-4 rounded-2xl text-white text-[15px] font-extrabold flex items-center justify-center gap-2 transition-all ${
            saved ? "" : "active:scale-[0.97]"
          }`}
          style={saved
            ? { backgroundColor: "#10b981", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }
            : { background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 8px 24px rgba(124,92,252,0.35)" }
          }
        >
          {saved ? <>✅ 저장 완료!</> : <><Save size={18} />저장하기</>}
        </button>
      </div>
      <BottomNav />
    </div>
  );
}
