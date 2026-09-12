import bcrypt from "bcryptjs";

export function validatePassword(password: string) {
  const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

  if (password.length < 8) {
    return { valid: false, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل." };
  }

  if (!strongPassword.test(password)) {
    return {
      valid: false,
      message: "يجب أن تحتوي كلمة المرور على حروف كبيرة، صغيرة، رقم ورمز خاص.",
    };
  }

  return { valid: true, message: "كلمة المرور قوية." };
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
