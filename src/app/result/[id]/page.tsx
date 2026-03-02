"use client";

import { useState, useEffect, use, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, Home } from "lucide-react";
import { getRecords, updateRecord } from "@/lib/storage";
import { getSubject } from "@/lib/subjects";

function ResultContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [record, setRecord] = useState<any>(null);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    const records = getRecords();
    const found = records.find((r) => r.id === id);
    setRecord(found);

    const aiParam = searchParams.get("aiResult");
    if (aiParam) {
      try {
        const parsed = JSON.parse(aiParam);
        setAiResult(parsed);
        if (found) {
          updateRecord(id, {
            score: parsed.score,
            totalQuestions: parsed.totalQuestions,
            correctAnswers: parsed.correctAnswers,
            feedback: parsed.feedback,
            coaching: parsed.coaching,
          });
        }
      } catch {}
    }
  }, [id, searchParams]);

  if (!record) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">기록을 찾을 수 없어요</p>
      </div>
    );
  }

  const subject = getSubject(record.subject);
  const result = aiResult || {
    score: record.score,
    feedback: record.feedback,
    coaching: record.coaching,
    wrongAnswers: [],
  };

  const scoreColor =
    result.score >= 90 ? "#10b981" : result.score >= 70 ? "#f59e0b" : "#ef4444";

  return (
    <div className="pb-8">
      {/* Header */}
      <div
        className="px-6 pt-12 pb-8 text-white rounded-b-[32px]"
        style={{ background: `linear-gradient(135deg, ${subject.color}, ${subject.color}dd)` }}
      >
        <button onClick={() => router.push("/")} className="mb-4 flex items-center gap-1 text-white/80">
          <ArrowLeft size={18} />
          <span className="text-sm">홈으로</span>
        </button>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{subject.emoji}</span>
          <div>
            <h1 className="text-xl font-bold">{subject.name} 채점 결과</h1>
            <p className="text-white/70 text-sm">{record.date}</p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-4 space-y-4">
        {/* Score Card */}
        <div className="card text-center">
          <div className="relative w-28 h-28 mx-auto mb-3">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" fill="none" stroke="#f3f0ff" strokeWidth="8" />
              <circle
                cx="56" cy="56" r="48" fill="none" stroke={scoreColor} strokeWidth="8"
                strokeDasharray={`${(result.score / 100) * 301.6} 301.6`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black" style={{ color: scoreColor }}>
                {result.score}
              </span>
              <span className="text-xs text-gray-400">점</span>
            </div>
          </div>
          {result.totalQuestions && (
            <p className="text-sm text-gray-500">
              총 <b>{result.totalQuestions}</b>문제 중 <b className="text-[#10b981]">{result.correctAnswers}</b>문제 정답
            </p>
          )}
          <p className="text-base mt-3 text-gray-700 leading-relaxed">{result.feedback}</p>
        </div>

        {/* Wrong Answers */}
        {result.wrongAnswers && result.wrongAnswers.length > 0 && (
          <div className="card">
            <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
              <XCircle size={16} className="text-red-400" />
              틀린 문제 분석
            </h3>
            <div className="space-y-3">
              {result.wrongAnswers.map((wa: any, i: number) => (
                <div key={i} className="bg-red-50 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-gray-700">{wa.question}</p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-red-500">내 답: {wa.studentAnswer}</span>
                    <span className="text-green-600">정답: {wa.correctAnswer}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 bg-white rounded-xl p-3">
                    💡 {wa.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coaching */}
        {result.coaching && (
          <div className="card">
            <h3 className="font-bold text-sm text-gray-700 mb-3 flex items-center gap-2">
              <Lightbulb size={16} className="text-amber-400" />
              선생님의 코칭
            </h3>
            <div
              className="text-sm text-gray-600 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(result.coaching) }}
            />
          </div>
        )}

        {/* Uploaded Image */}
        {record.imageData && (
          <div className="card">
            <h3 className="font-bold text-sm text-gray-700 mb-3">제출한 숙제</h3>
            <img src={record.imageData} alt="숙제" className="w-full rounded-2xl" />
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="w-full py-4 rounded-2xl bg-[#7c5cfc] text-white font-bold flex items-center justify-center gap-2"
        >
          <Home size={18} />
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/### (.*)/g, '<h3 class="font-bold text-gray-700 mt-3 mb-1">$1</h3>')
    .replace(/## (.*)/g, '<h2 class="font-bold text-gray-700 mt-3 mb-1">$1</h2>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/~~(.*?)~~/g, "<del>$1</del>")
    .replace(/`(.*?)`/g, '<code class="bg-purple-50 px-1 rounded">$1</code>')
    .replace(/^- (.*)/gm, '<li class="ml-4">$1</li>')
    .replace(/^> (.*)/gm, '<blockquote class="border-l-4 border-purple-200 pl-3 my-2 text-gray-500">$1</blockquote>')
    .replace(/\n/g, "<br />");
}

export default function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <Suspense>
      <ResultContent id={id} />
    </Suspense>
  );
}
