"use client";

import { useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Camera, ImagePlus, X, Send, Loader2 } from "lucide-react";
import { SUBJECTS, getSubject, SubjectKey } from "@/lib/subjects";
import { saveRecord, generateId, getProfile, getActiveStudentId } from "@/lib/storage";
import { format } from "date-fns";
import BottomNav from "@/components/BottomNav";

function UploadContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [selectedSubject, setSelectedSubject] = useState<SubjectKey>(
    (searchParams.get("subject") as SubjectKey) || "korean"
  );
  const [imageData, setImageData] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageData(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!imageData) return;
    setIsSubmitting(true);
    const profile = getProfile();
    const id = generateId();
    const today = format(new Date(), "yyyy-MM-dd");

    saveRecord({
      id, studentId: getActiveStudentId(), date: today, subject: selectedSubject,
      grade: profile.grade, imageData, score: null, totalQuestions: null,
      correctAnswers: null, feedback: null, coaching: null,
      createdAt: new Date().toISOString(),
    });

    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData, subject: selectedSubject, grade: profile.grade }),
      });
      const data = await res.json();
      router.push(`/result/${id}?aiResult=${encodeURIComponent(JSON.stringify(data))}`);
    } catch {
      router.push(`/result/${id}`);
    }
  };

  const subject = getSubject(selectedSubject);

  return (
    <div className="pb-24">
      <div className="header-gradient rounded-b-[36px] px-6 pt-14 pb-8 text-white relative z-10">
        <h1 className="text-display text-[24px] relative z-10">숙제 올리기</h1>
        <p className="text-white/60 text-sm font-medium mt-1 relative z-10">사진을 찍어 올리면 AI가 채점해줘요!</p>
      </div>

      <div className="px-5 -mt-4 space-y-5 relative z-20">
        {/* Subject Selection */}
        <div className="card-3d">
          <h3 className="text-heading text-[14px] text-gray-700 mb-3">과목 선택</h3>
          <div className="flex gap-2 flex-wrap">
            {SUBJECTS.map((s) => (
              <button
                key={s.key}
                onClick={() => setSelectedSubject(s.key)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[13px] font-bold transition-all ${
                  selectedSubject === s.key
                    ? "text-white subject-chip-active scale-105"
                    : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                }`}
                style={selectedSubject === s.key ? { backgroundColor: s.color } : {}}
              >
                <span>{s.emoji}</span>
                <span>{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div className="card-3d">
          <h3 className="text-heading text-[14px] text-gray-700 mb-3">숙제 사진</h3>
          {imageData ? (
            <div className="relative">
              <img src={imageData} alt="숙제 사진" className="w-full rounded-2xl object-cover max-h-80" />
              <button onClick={() => setImageData(null)} className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center backdrop-blur-sm">
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <button onClick={() => cameraInputRef.current?.click()} className="flex-1 flex flex-col items-center gap-3 py-10 rounded-2xl border-2 border-dashed border-purple-200 hover:border-[#7c5cfc] hover:bg-purple-50/50 transition-all group">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ boxShadow: "0 6px 16px rgba(124,92,252,0.15)" }}>
                  <Camera size={24} className="text-[#7c5cfc]" />
                </div>
                <span className="text-[13px] font-bold text-gray-600">카메라 촬영</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex flex-col items-center gap-3 py-10 rounded-2xl border-2 border-dashed border-purple-200 hover:border-[#7c5cfc] hover:bg-purple-50/50 transition-all group">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ boxShadow: "0 6px 16px rgba(124,92,252,0.15)" }}>
                  <ImagePlus size={24} className="text-[#7c5cfc]" />
                </div>
                <span className="text-[13px] font-bold text-gray-600">갤러리 선택</span>
              </button>
            </div>
          )}
          <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleImageSelect} className="hidden" />
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
        </div>

        {/* Submit Button */}
        {imageData && (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-4 rounded-2xl text-white text-[15px] font-extrabold flex items-center justify-center gap-2 transition-all active:scale-[0.97] disabled:opacity-60"
            style={{ backgroundColor: subject.color, boxShadow: `0 8px 24px ${subject.color}40` }}
          >
            {isSubmitting ? (
              <><Loader2 size={20} className="animate-spin" />AI가 채점하고 있어요...</>
            ) : (
              <><Send size={18} />채점 요청하기</>
            )}
          </button>
        )}
      </div>
      <BottomNav />
    </div>
  );
}

export default function UploadPage() {
  return <Suspense><UploadContent /></Suspense>;
}
