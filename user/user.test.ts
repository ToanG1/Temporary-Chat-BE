import { describe, expect, test } from "vitest";

describe("ignore", () => {
  test("should ignore this", async () => {
    expect(200).toBe(200);
  });
});
