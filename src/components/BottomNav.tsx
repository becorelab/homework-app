"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Camera, BarChart3, User } from "lucide-react";

const navItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/upload", icon: Camera, label: "숙제 올리기" },
  { href: "/stats", icon: BarChart3, label: "학습 분석" },
  { href: "/profile", icon: User, label: "내 정보" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname.startsWith("/result")) return null;

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-2xl transition-all relative"
            >
              {isActive && (
                <div
                  className="absolute -top-1 w-8 h-1 rounded-full"
                  style={{ background: "linear-gradient(90deg, #7c5cfc, #a78bfa)" }}
                />
              )}
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? "bg-purple-50" : ""
                }`}
              >
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className={isActive ? "text-[#7c5cfc]" : "text-gray-400"}
                />
              </div>
              <span
                className={`text-[10px] ${
                  isActive
                    ? "font-extrabold text-[#7c5cfc]"
                    : "font-semibold text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
