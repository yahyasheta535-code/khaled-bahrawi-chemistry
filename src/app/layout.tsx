import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khaled Saafan | افهم الأحياء صح",
  description: "منصة خالد سعفان لشرح الأحياء بطريقة واضحة وبصرية، مع محاضرات مرتبة وواجبات ومتابعة للتقدم.",
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
