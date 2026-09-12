import test from "node:test";
import assert from "node:assert/strict";
import { getSessionPayload } from "./session";

test("session payload helper returns the user id and role", () => {
  const payload = getSessionPayload({ userId: "student_123", role: "STUDENT" });
  assert.equal(payload.userId, "student_123");
  assert.equal(payload.role, "STUDENT");
});
