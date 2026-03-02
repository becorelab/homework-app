import { SubjectKey } from "./subjects";

export interface HomeworkRecord {
  id: string;
  date: string;
  subject: SubjectKey;
  grade: number;
  imageData: string;
  score: number | null;
  totalQuestions: number | null;
  correctAnswers: number | null;
  feedback: string | null;
  coaching: string | null;
  createdAt: string;
}

const STORAGE_KEY = "homework_records";
const PROFILE_KEY = "user_profile";

export interface UserProfile {
  name: string;
  grade: number;
}

export function getProfile(): UserProfile {
  if (typeof window === "undefined") return { name: "", grade: 1 };
  const data = localStorage.getItem(PROFILE_KEY);
  if (!data) return { name: "", grade: 1 };
  return JSON.parse(data);
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function getRecords(): HomeworkRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function saveRecord(record: HomeworkRecord) {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function updateRecord(id: string, updates: Partial<HomeworkRecord>) {
  const records = getRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx !== -1) {
    records[idx] = { ...records[idx], ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

export function getRecordsByDate(date: string): HomeworkRecord[] {
  return getRecords().filter((r) => r.date === date);
}

export function getRecordsBySubject(subject: SubjectKey): HomeworkRecord[] {
  return getRecords().filter((r) => r.subject === subject);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
