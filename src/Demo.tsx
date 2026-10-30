"use client";

import { useMemo, useState } from "react";
import { movedShare } from "./moved";
import { MOVED_MYTHS } from "./myths";

export function Demo() {
  const [left, setLeft] = useState("25");
  const [moved, setMoved] = useState("75");
  const share = useMemo(() => {
    try {
      return movedShare(BigInt(left.trim() || "0"), BigInt(moved.trim() || "0"));
    } catch {
      return { ok: false as const, reason: "Enter non-negative integers" };
    }
  }, [left, moved]);

  return (
    <main className="wrap">
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>Share of a balance that has moved</h1>
      <p className="lede">
        Basis points of moved / (left + moved). Both amounts are arguments. No Alcor
        pool was read.
      </p>

      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #a855f744",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Myths vs reality</h2>
        {MOVED_MYTHS.map((m) => (
          <div key={m.myth} style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
            <p style={{ margin: 0 }}>
              <strong>Myth:</strong> {m.myth}
            </p>
            <p style={{ margin: "0.25rem 0 0" }}>
              <strong>Reality:</strong> {m.reality}
            </p>
          </div>
        ))}
      </section>

      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        Left behind
        <input
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
        Moved
        <input
          value={moved}
          onChange={(e) => setMoved(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>

      {share.ok ? (
        <p>
          Total <strong>{share.total.toString()}</strong> · moved{" "}
          <strong>{share.bps.toString()}</strong> bps
        </p>
      ) : (
        <p>{share.reason}</p>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See POLICY.md
      </p>
    </main>
  );
}
