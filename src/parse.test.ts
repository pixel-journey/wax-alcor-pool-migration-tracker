import { describe, expect, it } from "vitest";
import { parseLegs } from "./parse";

describe("parseLegs", () => {
  it("parses mixed separators", () => {
    const r = parseLegs("50, 25 10");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.legs).toEqual([50n, 25n, 10n]);
  });

  it("rejects empty", () => {
    expect(parseLegs("").ok).toBe(false);
    expect(parseLegs("   ").ok).toBe(false);
  });

  it("accepts a single zero leg", () => {
    const r = parseLegs("0");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.legs).toEqual([0n]);
  });

  it("rejects negative legs", () => {
    const r = parseLegs("10, -1");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/non-negative/);
  });

  it("rejects non-numeric tokens", () => {
    const r = parseLegs("10, abc");
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/invalid leg/);
  });

  it("rejects more than 32 legs", () => {
    const many = Array.from({ length: 33 }, () => "1").join(",");
    expect(parseLegs(many).ok).toBe(false);
  });
});
