export type SubjectKey = "korean" | "english" | "math" | "hanja" | "diary";

export interface Subject {
  key: SubjectKey;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const SUBJECTS: Subject[] = [
  { key: "korean", name: "국어", emoji: "📖", color: "#7c5cfc", bgColor: "#ede9fe" },
  { key: "english", name: "영어", emoji: "🔤", color: "#3b82f6", bgColor: "#dbeafe" },
  { key: "math", name: "수학", emoji: "🔢", color: "#10b981", bgColor: "#d1fae5" },
  { key: "hanja", name: "한자", emoji: "🈷️", color: "#f59e0b", bgColor: "#fef3c7" },
  { key: "diary", name: "일기", emoji: "📝", color: "#ec4899", bgColor: "#fce7f3" },
];

export const GRADES = [1, 2, 3, 4] as const;
export type Grade = (typeof GRADES)[number];

export function getSubject(key: SubjectKey): Subject {
  return SUBJECTS.find((s) => s.key === key)!;
}
