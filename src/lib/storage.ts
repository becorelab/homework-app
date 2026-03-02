import { SubjectKey } from "./subjects";

export const MAX_STUDENTS = 3;

export interface HomeworkRecord {
  id: string;
  studentId: string;
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

export interface UserProfile {
  id: string;
  name: string;
  grade: number;
  emoji: string;
}

const STUDENTS_KEY = "students";
const ACTIVE_STUDENT_KEY = "active_student";
const RECORDS_KEY = "homework_records";

const STUDENT_EMOJIS = ["🧒", "👧", "👦"];

// --- Student Management ---

export function getStudents(): UserProfile[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function addStudent(name: string, grade: number): UserProfile {
  const students = getStudents();
  const newStudent: UserProfile = {
    id: generateId(),
    name,
    grade,
    emoji: STUDENT_EMOJIS[students.length] || "🎒",
  };
  students.push(newStudent);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  setActiveStudent(newStudent.id);
  return newStudent;
}

export function updateStudent(id: string, updates: Partial<Pick<UserProfile, "name" | "grade">>) {
  const students = getStudents();
  const idx = students.findIndex((s) => s.id === id);
  if (idx !== -1) {
    students[idx] = { ...students[idx], ...updates };
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  }
}

export function removeStudent(id: string) {
  let students = getStudents();
  students = students.filter((s) => s.id !== id);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  // Remove records
  let records = getAllRecords();
  records = records.filter((r) => r.studentId !== id);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
  // Switch active
  if (getActiveStudentId() === id) {
    setActiveStudent(students[0]?.id || "");
  }
}

// --- Active Student ---

export function getActiveStudentId(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ACTIVE_STUDENT_KEY) || "";
}

export function setActiveStudent(id: string) {
  localStorage.setItem(ACTIVE_STUDENT_KEY, id);
}

export function getActiveStudent(): UserProfile | null {
  const students = getStudents();
  const activeId = getActiveStudentId();
  return students.find((s) => s.id === activeId) || students[0] || null;
}

// --- Backward compatibility ---

export function getProfile(): UserProfile {
  const student = getActiveStudent();
  if (!student) return { id: "", name: "", grade: 1, emoji: "🧒" };
  return student;
}

export function saveProfile(profile: { name: string; grade: number }) {
  const students = getStudents();
  if (students.length === 0) {
    addStudent(profile.name, profile.grade);
  } else {
    const active = getActiveStudent();
    if (active) updateStudent(active.id, profile);
  }
}

// --- Homework Records ---

function getAllRecords(): HomeworkRecord[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(RECORDS_KEY);
  if (!data) return [];
  return JSON.parse(data);
}

export function getRecords(): HomeworkRecord[] {
  const activeId = getActiveStudentId();
  return getAllRecords().filter((r) => r.studentId === activeId);
}

export function saveRecord(record: HomeworkRecord) {
  const records = getAllRecords();
  records.push(record);
  localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
}

export function updateRecord(id: string, updates: Partial<HomeworkRecord>) {
  const records = getAllRecords();
  const idx = records.findIndex((r) => r.id === id);
  if (idx !== -1) {
    records[idx] = { ...records[idx], ...updates };
    localStorage.setItem(RECORDS_KEY, JSON.stringify(records));
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
