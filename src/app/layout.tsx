import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khaled Al-Bahrawi | Chemistry Academy",
  description: "منصة تعليمية احترافية في الكيمياء، تدعم المحاضرات والواجبات ومتابعة الطلاب تحت اسم خالد البحراوي.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
