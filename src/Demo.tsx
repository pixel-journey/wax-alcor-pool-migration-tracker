"use client";

import { useMemo, useState } from "react";
import { downloadText, exportMovedMarkdown } from "./exportReport";
import { SAMPLE_TIERS, SCENARIOS } from "./fixtures";
import {
  allocationBps,
  fromLegs,
  movedBar,
  movedShare,
} from "./moved";
import { GLOSSARY, MOVED_MYTHS } from "./myths";

export function Demo() {
  const [left, setLeft] = useState("25");
  const [moved, setMoved] = useState("75");
  const [useLegs, setUseLegs] = useState(false);
  const [legsText, setLegsText] = useState("50, 25");
  const [showTiers, setShowTiers] = useState(false);

  const share = useMemo(() => {
    try {
      if (useLegs) {
        const legs = legsText
          .split(/[,\s]+/)
          .filter(Boolean)
          .map((x) => BigInt(x));
        return fromLegs(BigInt(left.trim() || "0"), legs);
      }
      return movedShare(BigInt(left.trim() || "0"), BigInt(moved.trim() || "0"));
    } catch {
      return { ok: false as const, reason: "Enter non-negative integers" };
    }
  }, [left, moved, useLegs, legsText]);

  const bar = useMemo(() => {
    try {
      if (useLegs) {
        const legs = legsText
          .split(/[,\s]+/)
          .filter(Boolean)
          .map((x) => BigInt(x));
        const sum = legs.reduce((a, b) => a + b, 0n);
        return movedBar(BigInt(left.trim() || "0"), sum);
      }
      return movedBar(BigInt(left.trim() || "0"), BigInt(moved.trim() || "0"));
    } catch {
      return "";
    }
  }, [left, moved, useLegs, legsText]);

  const tiers = useMemo(() => {
    if (!showTiers) return null;
    try {
      return allocationBps(
        SAMPLE_TIERS.map((t) => ({
          label: t.label,
          amount: BigInt(t.amount),
        }))
      );
    } catch {
      return null;
    }
  }, [showTiers]);

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => {
              setUseLegs(false);
              setLeft(s.left);
              setMoved(s.moved);
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
        <input
          type="checkbox"
          checked={useLegs}
          onChange={(e) => setUseLegs(e.target.checked)}
        />
        Sum moved legs first
      </label>

      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        Left behind
        <input
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      {useLegs ? (
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Moved legs (comma/space)
          <input
            value={legsText}
            onChange={(e) => setLegsText(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
      ) : (
        <label style={{ display: "block", marginBottom: "1rem" }}>
          Moved
          <input
            value={moved}
            onChange={(e) => setMoved(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
      )}

      {share.ok ? (
        <>
          <p>
            Total <strong>{share.total.toString()}</strong> · moved{" "}
            <strong>{share.bps.toString()}</strong> bps · left{" "}
            <strong>{share.leftBps.toString()}</strong> bps
            {share.fullyMoved ? " · fully moved" : ""}
            {share.noneMoved ? " · none moved" : ""}
          </p>
          <p style={{ fontFamily: "ui-monospace, monospace" }}>{bar}</p>
          <button
            type="button"
            onClick={() =>
              downloadText(
                "moved-share.md",
                exportMovedMarkdown(left, useLegs ? legsText : moved, share)
              )
            }
          >
            Download MD
          </button>
        </>
      ) : (
        <p>{share.reason}</p>
      )}

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1.5rem" }}>
        <input
          type="checkbox"
          checked={showTiers}
          onChange={(e) => setShowTiers(e.target.checked)}
        />
        Sample fee-tier allocation (static numbers)
      </label>
      {tiers && tiers.ok && (
        <table>
          <thead>
            <tr>
              <th>Bucket</th>
              <th>Amount</th>
              <th>bps</th>
            </tr>
          </thead>
          <tbody>
            {tiers.rows.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td>{r.amount.toString()}</td>
                <td>{r.bps.toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Glossary</h2>
        <dl>
          {GLOSSARY.map((g) => (
            <div key={g.term} style={{ marginBottom: "0.5rem" }}>
              <dt>
                <strong>{g.term}</strong>
              </dt>
              <dd style={{ margin: 0 }}>{g.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See EDUCATION.md · POLICY.md · SECURITY.md
      </p>
    </main>
  );
}
