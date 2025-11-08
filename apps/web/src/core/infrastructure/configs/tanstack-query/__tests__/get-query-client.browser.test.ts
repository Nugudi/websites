import getQueryClient from "@core/infrastructure/configs/tanstack-query/get-query-client";
import { describe, expect, it } from "vitest";

describe("getQueryClient", () => {
  it("should return a same instance when called multiple times", () => {
    // given, when
    const first = getQueryClient();
    const second = getQueryClient();

    // then
    expect(first).toBe(second);
  });
});
