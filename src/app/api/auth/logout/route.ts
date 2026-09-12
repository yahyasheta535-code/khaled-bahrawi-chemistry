import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";

export async function POST() {
  try {
    const response = NextResponse.json({ success: true, message: "تم تسجيل الخروج بنجاح." });
    response.cookies.set("auth_session", "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, message: "حدث خطأ أثناء تسجيل الخروج." }, { status: 500 });
  }
}
