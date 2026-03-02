"use client";

import { Subject } from "@/lib/subjects";

interface SubjectCardProps {
  subject: Subject;
  todayDone: boolean;
  lastScore: number | null;
  onClick: () => void;
}

export default function SubjectCard({ subject, todayDone, lastScore, onClick }: SubjectCardProps) {
  return (
    <button
      onClick={onClick}
      className="card-3d flex items-center gap-4 w-full text-left active:scale-[0.97]"
    >
      {/* 3D-style emoji container */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative"
        style={{
          backgroundColor: subject.bgColor,
          boxShadow: `0 6px 16px ${subject.color}25, inset 0 2px 0 rgba(255,255,255,0.5)`,
        }}
      >
        {subject.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-heading text-[15px] text-gray-800">{subject.name}</span>
          {todayDone && (
            <span className="pill bg-emerald-50 text-emerald-600" style={{ fontSize: 10 }}>
              ✅ 완료
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 font-medium">
          {lastScore !== null
            ? `최근 점수: ${lastScore}점`
            : "아직 기록이 없어요"}
        </p>
      </div>
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{
          backgroundColor: subject.bgColor,
          color: subject.color,
          boxShadow: `0 4px 12px ${subject.color}20`,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </button>
  );
}
