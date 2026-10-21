import { describe, expect, it } from "vitest";
import { movedShare } from "./moved";

describe("moved share", () => {
  it("is 7500 bps when 75 of 100 has moved", () => {
    expect(movedShare(25n, 75n)).toEqual({ ok: true, total: 100n, bps: 7500n });
    expect(movedShare(0n, 0n).ok).toBe(false);
  });
});
