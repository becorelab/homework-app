"use client";

import { useState, useEffect } from "react";
import { SUBJECTS } from "@/lib/subjects";
import { getRecords, HomeworkRecord } from "@/lib/storage";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import { TrendingUp, Award, AlertTriangle } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function StatsPage() {
  const [records, setRecords] = useState<HomeworkRecord[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setRecords(getRecords());
  }, []);

  if (!mounted) return null;

  const subjectStats = SUBJECTS.map((subject) => {
    const subjectRecords = records.filter((r) => r.subject === subject.key && r.score !== null);
    const avg = subjectRecords.length > 0
      ? Math.round(subjectRecords.reduce((sum, r) => sum + (r.score || 0), 0) / subjectRecords.length)
      : 0;
    const count = subjectRecords.length;
    return { ...subject, avg, count };
  });

  const recentRecords = records
    .filter((r) => r.score !== null)
    .slice(-14)
    .map((r) => ({
      date: r.date.slice(5),
      score: r.score,
      subject: SUBJECTS.find((s) => s.key === r.subject)?.name || r.subject,
    }));

  const weakest = subjectStats.filter((s) => s.count > 0).sort((a, b) => a.avg - b.avg)[0];
  const strongest = subjectStats.filter((s) => s.count > 0).sort((a, b) => b.avg - a.avg)[0];
  const totalSubmissions = records.length;
  const scoredRecords = records.filter((r) => r.score !== null);
  const overallAvg = scoredRecords.length > 0
    ? Math.round(scoredRecords.reduce((s, r) => s + (r.score || 0), 0) / scoredRecords.length)
    : 0;

  return (
    <div className="pb-24">
      <div className="header-gradient rounded-b-[36px] px-6 pt-14 pb-8 text-white relative z-10">
        <h1 className="text-display text-[24px] relative z-10">학습 분석</h1>
        <p className="text-white/60 text-sm font-medium mt-1 relative z-10">과목별 학습 성과를 확인해보세요</p>
      </div>

      <div className="px-5 -mt-4 space-y-4 relative z-20">
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: totalSubmissions, label: "총 제출", color: "#7c5cfc" },
            { value: overallAvg, label: "평균 점수", color: "#10b981" },
            { value: subjectStats.filter((s) => s.count > 0).length, label: "활성 과목", color: "#f59e0b" },
          ].map((item) => (
            <div key={item.label} className="card-3d text-center py-5">
              <p className="text-display text-[26px]" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[10px] text-gray-400 mt-1 font-bold">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="card-3d">
          <h3 className="text-heading text-[14px] text-gray-700 mb-4">과목별 평균 점수</h3>
          {subjectStats.some((s) => s.count > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectStats.filter((s) => s.count > 0)} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede9fe" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="avg" radius={[10, 10, 0, 0]} fill="#7c5cfc" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-400 text-sm font-medium">
              아직 데이터가 없어요. 숙제를 올려보세요! 📚
            </div>
          )}
        </div>

        {recentRecords.length > 1 && (
          <div className="card-3d">
            <h3 className="text-heading text-[14px] text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center" style={{ boxShadow: "0 4px 12px rgba(124,92,252,0.15)" }}>
                <TrendingUp size={14} className="text-[#7c5cfc]" />
              </div>
              최근 점수 추이
            </h3>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={recentRecords}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ede9fe" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#7c5cfc" strokeWidth={3} dot={{ r: 5, fill: "#7c5cfc", strokeWidth: 3, stroke: "#fff" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {strongest && (
          <div className="card-3d flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center" style={{ boxShadow: "0 6px 16px rgba(16,185,129,0.15)" }}>
              <Award size={22} className="text-emerald-500" />
            </div>
            <div>
              <h4 className="text-heading text-[14px] text-gray-800">가장 잘하는 과목</h4>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {strongest.emoji} {strongest.name} — 평균 <b className="text-emerald-500">{strongest.avg}점</b>
              </p>
            </div>
          </div>
        )}
        {weakest && weakest !== strongest && (
          <div className="card-3d flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center" style={{ boxShadow: "0 6px 16px rgba(245,158,11,0.15)" }}>
              <AlertTriangle size={22} className="text-amber-500" />
            </div>
            <div>
              <h4 className="text-heading text-[14px] text-gray-800">보완이 필요한 과목</h4>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">
                {weakest.emoji} {weakest.name} — 평균 <b className="text-amber-500">{weakest.avg}점</b>
                <br />조금만 더 연습하면 금방 늘 수 있어요! 💪
              </p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
