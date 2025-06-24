import { describe, expect, it } from "vitest";
import { cn } from "../src/utils";

describe("cn utility function", () => {
  it("should join multiple class names as a string", () => {
    // given
    const classNames = ["text-red-500", "bg-green-200"];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("text-red-500 bg-green-200");
  });

  it("should ignore falsy values like undefined, null, false", () => {
    // given
    const classNames = [
      "text-blue-500",
      undefined,
      null,
      false,
      "bg-yellow-100",
    ];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("text-blue-500 bg-yellow-100");
  });

  it("should ignore empty string values", () => {
    // given
    const classNames = ["text-sm", "", "font-bold"];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("text-sm font-bold");
  });

  it("should merge nested arrays of class names", () => {
    // given
    const classNames = ["text-xs", ["bg-gray-200", "rounded"], "font-medium"];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("text-xs bg-gray-200 rounded font-medium");
  });

  it("should merge class names from object with truthy values", () => {
    // given
    const classNames = [
      "text-base",
      { "bg-white": true, "text-black": false },
      "font-light",
    ];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("text-base bg-white font-light");
  });

  it("should remove duplicate class names", () => {
    // given
    const classNames = ["text-red-500", "text-red-500", "bg-blue-200"];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("text-red-500 bg-blue-200");
  });

  it("should keep the last conflicting class name", () => {
    // given
    const classNames = ["px-2", "py-4", "px-4"];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("py-4 px-4");
  });

  it("should handle numeric values by converting them to string", () => {
    // given
    const classNames = ["text-lg", 123, "font-semibold"];

    // when
    const className = cn(classNames);

    // then
    expect(className).toBe("text-lg 123 font-semibold");
  });
});
