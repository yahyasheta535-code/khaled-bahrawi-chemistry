import { cookies } from "next/headers";

export type SessionRole = "ADMIN" | "TEACHER" | "STUDENT";

export type SessionPayload = {
  userId: string;
  role: SessionRole;
  username?: string;
};

export function getSessionPayload(
  payload: Partial<SessionPayload> = {}
): SessionPayload {
  return {
    userId: payload.userId ?? "",
    role: payload.role ?? "STUDENT",
    username: payload.username,
  };
}

export async function createSession(payload: SessionPayload) {
  const store = await cookies();

  store.set("auth_session", JSON.stringify(payload), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const sessionCookie = store.get("auth_session");

  if (!sessionCookie) {
    return null;
  }

  try {
    const parsed = JSON.parse(sessionCookie.value) as Partial<SessionPayload>;

    if (!parsed.userId || !parsed.role) {
      return null;
    }

    return getSessionPayload(parsed);
  } catch {
    return null;
  }
}

export async function clearSession() {
  const store = await cookies();
  store.delete("auth_session");
}
