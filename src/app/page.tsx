"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { SUBJECTS, GRADES } from "@/lib/subjects";
import { getProfile, saveProfile, getRecords, getRecordsByDate } from "@/lib/storage";
import BottomNav from "@/components/BottomNav";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import SubjectCard from "@/components/SubjectCard";
import { Sparkles } from "lucide-react";

function OnboardingView() {
  const [name, setName] = useState("");
  const [grade, setGrade] = useState(1);
  const [step, setStep] = useState(0);

  const handleComplete = () => {
    if (!name.trim()) return;
    saveProfile({ name: name.trim(), grade });
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12"
      style={{ background: "linear-gradient(160deg, #ede9fe 0%, #f0ecff 30%, #fdf2f8 70%, #fef9e7 100%)" }}
    >
      <div
        className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mb-6"
        style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 16px 40px rgba(124,92,252,0.3)" }}
      >
        🎒
      </div>
      <h1 className="text-display text-[32px] text-gray-800 text-center">숙제친구</h1>
      <p className="text-gray-400 text-sm font-medium mt-2 text-center">AI가 숙제를 채점하고 코칭해줘요!</p>

      <div className="w-full mt-10 space-y-5">
        {step === 0 ? (
          <div className="card-3d space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-[#7c5cfc]" />
              <h3 className="text-heading text-[15px] text-gray-800">이름이 뭐예요?</h3>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요"
              autoFocus
              className="w-full px-4 py-4 rounded-2xl bg-[#f0ecff] border-2 border-transparent outline-none text-[16px] font-bold focus:border-[#7c5cfc] focus:bg-white transition-all text-center"
            />
            <button
              onClick={() => name.trim() && setStep(1)}
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl text-white text-[15px] font-extrabold disabled:opacity-40 transition-all active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 8px 24px rgba(124,92,252,0.35)" }}
            >
              다음으로
            </button>
          </div>
        ) : (
          <div className="card-3d space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} className="text-[#7c5cfc]" />
              <h3 className="text-heading text-[15px] text-gray-800">{name} 학생, 몇 학년이에요?</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-5 rounded-2xl text-[16px] font-extrabold transition-all ${
                    grade === g ? "text-white scale-105" : "bg-[#f0ecff] text-gray-500"
                  }`}
                  style={grade === g ? {
                    background: "linear-gradient(135deg, #7c5cfc, #a78bfa)",
                    boxShadow: "0 8px 24px rgba(124,92,252,0.3)",
                  } : {}}
                >
                  {g}학년
                </button>
              ))}
            </div>
            <button
              onClick={handleComplete}
              className="w-full py-4 rounded-2xl text-white text-[15px] font-extrabold transition-all active:scale-[0.97]"
              style={{ background: "linear-gradient(135deg, #7c5cfc, #a78bfa)", boxShadow: "0 8px 24px rgba(124,92,252,0.35)" }}
            >
              시작하기 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [profile, setProfile] = useState({ name: "", grade: 1 });
  const [mounted, setMounted] = useState(false);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    setMounted(true);
    const p = getProfile();
    if (!p.name) {
      setNeedsOnboarding(true);
      return;
    }
    setProfile(p);
  }, []);

  if (!mounted) return null;
  if (needsOnboarding) return <OnboardingView />;

  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const todayRecords = getRecordsByDate(dateStr);
  const allRecords = getRecords();
  const completedDates = [...new Set(allRecords.map((r) => r.date))];
  const todayDoneSubjects = todayRecords.map((r) => r.subject);
  const todayCompletedCount = new Set(todayDoneSubjects).size;
  const pct = Math.round((todayCompletedCount / SUBJECTS.length) * 100);

  return (
    <div className="pb-24">
      {/* Hero Header */}
      <div className="header-gradient rounded-b-[36px] px-6 pt-14 pb-10 text-white relative z-10">
        <div className="flex items-start justify-between mb-8 relative z-10">
          <div>
            <p className="text-white/70 text-sm font-medium">안녕하세요 👋</p>
            <h1 className="text-display text-[28px] mt-1">{profile.name}</h1>
            <div className="pill bg-white/20 text-white mt-2">
              🎓 {profile.grade}학년
            </div>
          </div>
          <div className="w-[72px] h-[72px] bg-white/15 rounded-[22px] flex items-center justify-center text-4xl shadow-lg backdrop-blur-sm border border-white/20">
            🎒
          </div>
        </div>

        {/* Today Status - Glass Card */}
        <div className="glass p-5 flex items-center gap-5 relative z-10">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="5" />
              <circle
                cx="32" cy="32" r="27" fill="none" stroke="white" strokeWidth="5"
                strokeDasharray={`${(pct / 100) * 169.6} 169.6`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-base font-extrabold">
              {pct}%
            </span>
          </div>
          <div>
            <p className="text-white/60 text-xs font-semibold">오늘의 숙제 현황</p>
            <p className="text-display text-[22px] mt-0.5">
              {todayCompletedCount}<span className="text-white/50 text-base font-bold"> / {SUBJECTS.length}</span>
            </p>
            <p className="text-white/50 text-[11px] mt-0.5 font-medium">
              {todayCompletedCount === SUBJECTS.length ? "완벽해요! 🎉" : "조금만 더 힘내요! 💪"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-5 space-y-5 relative z-20">
        <WeeklyCalendar
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          completedDates={completedDates}
        />

        <div>
          <h2 className="text-heading text-[17px] text-gray-800 mb-3 px-1">과목별 숙제</h2>
          <div className="space-y-3">
            {SUBJECTS.map((subject) => {
              const subjectRecords = allRecords.filter((r) => r.subject === subject.key);
              const lastRecord = subjectRecords[subjectRecords.length - 1];
              const todayDone = todayDoneSubjects.includes(subject.key);

              return (
                <SubjectCard
                  key={subject.key}
                  subject={subject}
                  todayDone={todayDone}
                  lastScore={lastRecord?.score ?? null}
                  onClick={() => router.push(`/upload?subject=${subject.key}`)}
                />
              );
            })}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
