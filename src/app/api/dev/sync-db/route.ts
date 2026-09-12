import { execSync } from "child_process";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const result = execSync("npx prisma db push", {
      cwd: process.cwd(),
      env: process.env,
      stdio: "pipe",
    }).toString();

    return NextResponse.json({
      success: true,
      message: "تم مزامنة قاعدة البيانات مع Prisma بنجاح.",
      output: result,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "حدث خطأ أثناء مزامنة قاعدة البيانات.";
    return NextResponse.json({
      success: false,
      message,
    }, { status: 500 });
  }
}
