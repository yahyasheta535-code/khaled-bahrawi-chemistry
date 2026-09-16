import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

async function read(relativePath) {
  return readFile(resolve(root, relativePath), "utf8");
}

test("public branding is Khaled Saafan Biology Academy", async () => {
  const [home, layout, login, register, branding] = await Promise.all([
    read("src/app/page.tsx"),
    read("src/app/layout.tsx"),
    read("src/app/login/page.tsx"),
    read("src/app/register/page.tsx"),
    read("src/lib/branding.ts"),
  ]);

  const publicSource = [home, layout, login, register, branding].join("\n");
  assert.match(publicSource, /Khaled Saafan/);
  assert.match(publicSource, /Biology Academy/);
  assert.match(publicSource, /الأحياء/);
  assert.doesNotMatch(publicSource, /Khaled Al-Bahrawi|Chemistry Academy|الكيمياء|البحراوي/);
});
