import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khaled Al-Bahrawi | افهم الكيمياء صح",
  description: "منصة خالد البحراوي لشرح الكيمياء بطريقة واضحة، مع محاضرات مرتبة وواجبات ومتابعة للتقدم.",
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
