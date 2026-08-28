import { describe, it, expect } from "vitest";
import { canTransition } from "@/lib/constants";
import { formatNaira, slugify } from "@/lib/utils";

describe("order status transitions", () => {
  it("allows valid transitions", () => {
    expect(canTransition("PENDING", "PAYMENT_PENDING")).toBe(true);
    expect(canTransition("PAYMENT_PENDING", "PAID")).toBe(true);
    expect(canTransition("PAID", "PROCESSING")).toBe(true);
    expect(canTransition("PROCESSING", "OUT_FOR_DELIVERY")).toBe(true);
  });

  it("rejects invalid transitions", () => {
    expect(canTransition("PENDING", "DELIVERED")).toBe(false);
    expect(canTransition("DELIVERED", "PAID")).toBe(false);
  });
});

describe("formatNaira", () => {
  it("formats naira with two decimals", () => {
    expect(formatNaira(1500)).toContain("1,500");
    expect(formatNaira("2500.5")).toContain("2,500.50");
  });
});

describe("slugify", () => {
  it("produces url-safe slugs", () => {
    expect(slugify("Fresh Bell Pepper!")).toBe("fresh-bell-pepper");
    expect(slugify("  Hello World  ")).toBe("hello-world");
  });
});
