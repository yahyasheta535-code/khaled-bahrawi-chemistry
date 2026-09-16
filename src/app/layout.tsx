import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { PLATFORM_BRAND } from "@/lib/branding";

export const metadata: Metadata = {
  title: `${PLATFORM_BRAND.englishName} | افهم ${PLATFORM_BRAND.subjectArabic} صح`,
  description: `منصة ${PLATFORM_BRAND.englishName} لشرح ${PLATFORM_BRAND.subjectArabic} بطريقة واضحة وبصرية، مع محاضرات مرتبة وواجبات ومتابعة للتقدم.`,
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
