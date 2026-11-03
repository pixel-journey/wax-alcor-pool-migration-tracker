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
  });
});
