"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getStudents, getActiveStudent, updateStudent, removeStudent,
  setActiveStudent, getRecords, UserProfile, MAX_STUDENTS, addStudent,
} from "@/lib/storage";
import { GRADES } from "@/lib/subjects";
import { Save, BookOpen, Trophy, Calendar, Trash2, UserPlus } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const router = useRouter();
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [active, setActive] = useState<UserProfile | null>(null);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newGrade, setNewGrade] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const reload = () => {
    setStudents(getStudents());
    const a = getActiveStudent();
    setActive(a);
    if (a) { setName(a.name); setGrade(a.grade); }
  };

  useEffect(() => {
    setMounted(true);
    reload();
  }, []);

  if (!mounted || !active) return null;

  const records = getRecords();
  const totalDays = new Set(records.map((r) => r.date)).size;

  const handleSave = () => {
    if (!name.trim()) return;
    updateStudent(active.id, { name: name.trim(), grade });
    setSaved(true);
    setTimeout(() => { setSaved(false); reload(); }, 1000);
  };

  const handleAddStudent = () => {
    if (!newName.trim()) return;
    addStudent(newName.trim(), newGrade);
    setNewName(""); setNewGrade(1); setShowAdd(false);
    reload();
  };

  const handleDelete = (id: string) => {
    removeStudent(id);
    setConfirmDelete(null);
    reload();
    if (getStudents().length === 0) router.push("/");
  };

  return (
    <div className="pb-24">
      <div className="header-gradient rounded-b-[36px] px-6 pt-14 pb-10 text-white text-center relative z-10">
        <div className="w-24 h-24 bg-white/15 rounded-3xl mx-auto flex items-center justify-center text-5xl backdrop-blur-sm border border-white/20 relative z-10" style={{ boxShadow: "0 12px 32px rgba(0,0,0,0.1)" }}>
          {active.emoji}
        </div>
        <h1 className="text-display text-[22px] mt-4 relative z-10">{active.name}</h1>
        <div className="pill bg-white/20 text-white mt-2 mx-auto relative z-10">🎓 {active.grade}학년</div>
      </div>

      <div className="px-5 -mt-5 space-y-4 relative z-20">
        {/* Stats */}
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

        {/* Student List */}
        <div className="card-3d">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-heading text-[15px] text-gray-700">등록된 학생 ({students.length}/{MAX_STUDENTS})</h3>
            {students.length < MAX_STUDENTS && (
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-1 text-[12px] font-bold text-[#7c5cfc]"
              >
                <UserPlus size={14} />추가
              </button>
            )}
          </div>
          <div className="space-y-2">
            {students.map((s) => (
              <div
                key={s.id}
                className={`flex items-center gap-3 p-3 rounded-2xl transition-all ${
                  s.id === active.id ? "bg-purple-50 border-2 border-purple-200" : "bg-gray-50 border-2 border-transparent"
                }`}
              >
                <button
                  onClick={() => { setActiveStudent(s.id); reload(); }}
                  className="flex items-center gap-3 flex-1 text-left"
                >
                  <span className="text-xl">{s.emoji}</span>
                  <div>
                    <p className={`text-[13px] font-bold ${s.id === active.id ? "text-[#7c5cfc]" : "text-gray-700"}`}>{s.name}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">{s.grade}학년</p>
                  </div>
                </button>
                {s.id === active.id && (
                  <span className="text-[10px] font-bold text-[#7c5cfc] bg-white px-2 py-0.5 rounded-full">현재</span>
                )}
                {students.length > 1 && (
                  <button
                    onClick={() => setConfirmDelete(s.id)}
                    className="p-2 text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Edit Current Student */}
        <div className="card-3d">
          <h3 className="text-heading text-[15px] text-gray-700 mb-4">현재 학생 정보 수정</h3>
          <div className="space-y-4">
            <div>
              <label className="text-label text-gray-500 mb-2 block">이름</label>
              <input
                type="text" value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-[#f0ecff] border-2 border-transparent outline-none text-[14px] font-bold focus:border-[#7c5cfc] focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="text-label text-gray-500 mb-2 block">학년</label>
              <div className="flex gap-2">
                {GRADES.map((g) => (
                  <button
                    key={g} onClick={() => setGrade(g)}
                    className={`flex-1 py-3.5 rounded-2xl text-[14px] font-extrabold transition-all ${
                      grade === g ? "text-white" : "bg-[#f0ecff] text-gray-500 hover:bg-purple-100"
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
          className={`w-full py-4 rounded-2xl text-white text-[15px] font-extrabold flex items-center justify-center gap-2 transition-all ${saved ? "" : "active:scale-[0.97]"}`}
          style={saved
            ? { backgroundColor: "#10b981", boxShadow: "0 8px 24px rgba(16,185,129,0.3)" }
            : { background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 8px 24px rgba(124,92,252,0.35)" }
          }
        >
          {saved ? <>✅ 저장 완료!</> : <><Save size={18} />저장하기</>}
        </button>
      </div>

      {/* Add Student Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-[480px] bg-white rounded-t-3xl p-6 space-y-4">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-2" />
            <h3 className="text-heading text-[17px] text-gray-800">학생 추가</h3>
            <input
              type="text" value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="이름을 입력해주세요" autoFocus
              className="w-full px-4 py-4 rounded-2xl bg-[#f0ecff] border-2 border-transparent outline-none text-[15px] font-bold focus:border-[#7c5cfc] focus:bg-white transition-all"
            />
            <div className="flex gap-2">
              {GRADES.map((g) => (
                <button key={g} onClick={() => setNewGrade(g)}
                  className={`flex-1 py-3 rounded-2xl text-[13px] font-extrabold transition-all ${
                    newGrade === g ? "text-white" : "bg-[#f0ecff] text-gray-500"
                  }`}
                  style={newGrade === g ? { background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 6px 20px rgba(124,92,252,0.3)" } : {}}
                >{g}학년</button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-500 text-[14px] font-bold">취소</button>
              <button onClick={handleAddStudent} disabled={!newName.trim()}
                className="flex-1 py-4 rounded-2xl text-white text-[14px] font-bold disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 8px 24px rgba(124,92,252,0.35)" }}
              >추가하기</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center px-6">
          <div className="w-full max-w-[360px] bg-white rounded-3xl p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-red-50 rounded-2xl mx-auto flex items-center justify-center">
              <Trash2 size={24} className="text-red-400" />
            </div>
            <h3 className="text-heading text-[16px] text-gray-800">학생을 삭제할까요?</h3>
            <p className="text-xs text-gray-400">해당 학생의 모든 학습 데이터가 삭제돼요</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-3.5 rounded-2xl bg-gray-100 text-gray-500 text-[14px] font-bold">취소</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 py-3.5 rounded-2xl bg-red-500 text-white text-[14px] font-bold">삭제</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
