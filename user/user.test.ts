import { describe, expect, test } from "vitest";
import { signup } from "./user.controller";

describe("signup", () => {
  test("should create new user", async () => {
    const resp = await signup({
      email: "test-email@gmail.com",
      name: "tester",
    });

    expect(resp.code).toBe(200);
    expect(resp.message).toBe("Your account has been created!");
  });
});
