"use client";

import { useEffect, useMemo, useState } from "react";
import { Cases } from "./Cases";
import {
  downloadText,
  exportMovedCsv,
  exportMovedMarkdown,
} from "./exportReport";
import { SAMPLE_TIERS, SCENARIOS } from "./fixtures";
import {
  allocationBps,
  compareShares,
  fromLegs,
  movedBar,
  movedShare,
  movedToReachBps,
  reachedThreshold,
} from "./moved";
import { GLOSSARY, MOVED_MYTHS } from "./myths";
import { parseLegs } from "./parse";
import { decodeShareState, encodeShareState } from "./shareState";
import { WORKED_EXAMPLES } from "./workedExamples";

const LS_KEY = "pxj-moved-share-v1";

export function Demo() {
  const [left, setLeft] = useState("25");
  const [moved, setMoved] = useState("75");
  const [useLegs, setUseLegs] = useState(false);
  const [legsText, setLegsText] = useState("50, 25");
  const [showTiers, setShowTiers] = useState(false);
  const [minBps, setMinBps] = useState("7000");
  const [targetBps, setTargetBps] = useState("9000");
  const [compare, setCompare] = useState(false);
  const [leftB, setLeftB] = useState("50");
  const [movedB, setMovedB] = useState("50");
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = decodeShareState(window.location.search);
    if (fromUrl.left || fromUrl.moved) {
      if (fromUrl.left) setLeft(fromUrl.left);
      if (fromUrl.moved) setMoved(fromUrl.moved);
      if (fromUrl.useLegs) {
        setUseLegs(true);
        setLegsText(fromUrl.legsText ?? "");
      }
      if (fromUrl.showTiers) setShowTiers(true);
      return;
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as { left?: string; moved?: string };
      if (p.left) setLeft(p.left);
      if (p.moved) setMoved(p.moved);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ left, moved }));
    } catch {
      /* ignore */
    }
  }, [left, moved]);

  const effectiveMoved = useMemo(() => {
    try {
      if (useLegs) {
        const parsed = parseLegs(legsText);
        if (!parsed.ok) return null;
        return parsed.legs.reduce((a, b) => a + b, 0n);
      }
      return BigInt(moved.trim() || "0");
    } catch {
      return null;
    }
  }, [useLegs, legsText, moved]);

  const share = useMemo(() => {
    try {
      const L = BigInt(left.trim() || "0");
      if (useLegs) {
        const parsed = parseLegs(legsText);
        if (!parsed.ok) return parsed;
        return fromLegs(L, parsed.legs);
      }
      return movedShare(L, BigInt(moved.trim() || "0"));
    } catch {
      return { ok: false as const, reason: "Enter non-negative integers" };
    }
  }, [left, moved, useLegs, legsText]);

  const bar = useMemo(() => {
    if (effectiveMoved === null) return "";
    try {
      return movedBar(BigInt(left.trim() || "0"), effectiveMoved);
    } catch {
      return "";
    }
  }, [left, effectiveMoved]);

  const threshold = useMemo(() => {
    if (effectiveMoved === null) return null;
    try {
      return reachedThreshold(
        BigInt(left.trim() || "0"),
        effectiveMoved,
        BigInt(minBps.trim() || "0")
      );
    } catch {
      return null;
    }
  }, [left, effectiveMoved, minBps]);

  const reach = useMemo(() => {
    if (effectiveMoved === null) return null;
    try {
      return movedToReachBps(
        BigInt(left.trim() || "0"),
        effectiveMoved,
        BigInt(targetBps.trim() || "0")
      );
    } catch {
      return null;
    }
  }, [left, effectiveMoved, targetBps]);

  const cmp = useMemo(() => {
    if (!compare || effectiveMoved === null) return null;
    try {
      return compareShares(
        { left: BigInt(left.trim() || "0"), moved: effectiveMoved },
        {
          left: BigInt(leftB.trim() || "0"),
          moved: BigInt(movedB.trim() || "0"),
        }
      );
    } catch {
      return null;
    }
  }, [compare, left, effectiveMoved, leftB, movedB]);

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

  const applyAddMoved = () => {
    if (!reach || !reach.ok || useLegs) return;
    const next = (effectiveMoved ?? 0n) + reach.addMoved;
    setMoved(next.toString());
  };

  const copyShare = async () => {
    const qs = encodeShareState({
      left,
      moved,
      useLegs,
      legsText,
      showTiers,
    });
    const path =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?${qs}`
        : `?${qs}`;
    try {
      await navigator.clipboard.writeText(path);
      setShareMsg("Share URL copied");
    } catch {
      setShareMsg(path);
    }
  };

  return (
    <main className="wrap">
      <style>{`@media print { button, .no-print { display: none !important; } }`}</style>
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>Share of a balance that has moved</h1>
      <p className="lede">
        Basis points of moved / (left + moved). Both amounts are arguments. No Alcor
        pool was read.
      </p>

      <section
        className="no-print"
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

      <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
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

      <label className="no-print" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.75rem" }}>
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
          <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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
            <button
              type="button"
              onClick={() =>
                downloadText(
                  "moved-share.csv",
                  exportMovedCsv({
                    left,
                    moved: effectiveMoved?.toString() ?? moved,
                    total: share.total.toString(),
                    bps: share.bps.toString(),
                    leftBps: share.leftBps.toString(),
                  }),
                  "text/csv;charset=utf-8"
                )
              }
            >
              Download CSV
            </button>
            <button type="button" onClick={() => void copyShare()}>
              Copy share URL
            </button>
            <button type="button" onClick={() => window.print()}>
              Print
            </button>
          </div>
          {shareMsg && (
            <p className="no-print" style={{ fontSize: "0.85rem", opacity: 0.8 }}>
              {shareMsg}
            </p>
          )}
        </>
      ) : (
        <p>{share.reason}</p>
      )}

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Threshold</h2>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Min moved bps
          <input
            value={minBps}
            onChange={(e) => setMinBps(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        {threshold && threshold.ok && (
          <p>
            {threshold.met ? "Met" : "Not met"} at {threshold.bps.toString()} bps
          </p>
        )}
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Moved still needed for target bps</h2>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Target bps
          <input
            value={targetBps}
            onChange={(e) => setTargetBps(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        {reach && reach.ok && (
          <>
            <p>
              Add moved ≥ <strong>{reach.addMoved.toString()}</strong> (left fixed)
            </p>
            {!useLegs && reach.addMoved > 0n && (
              <button className="no-print" type="button" onClick={applyAddMoved}>
                Apply add to moved field
              </button>
            )}
          </>
        )}
        {reach && !reach.ok && <p>{reach.reason}</p>}
      </section>

      <label className="no-print" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1rem" }}>
        <input
          type="checkbox"
          checked={compare}
          onChange={(e) => setCompare(e.target.checked)}
        />
        Compare against a second pair
      </label>
      {compare && (
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            B left
            <input
              value={leftB}
              onChange={(e) => setLeftB(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
          <label style={{ display: "block" }}>
            B moved
            <input
              value={movedB}
              onChange={(e) => setMovedB(e.target.value)}
              style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
            />
          </label>
        </div>
      )}
      {cmp && cmp.ok && (
        <p style={{ fontSize: "0.9rem" }}>
          A {cmp.a.bps.toString()} bps · B {cmp.b.bps.toString()} bps · Δ{" "}
          {cmp.bpsDelta.toString()}
        </p>
      )}

      <label className="no-print" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1rem" }}>
        <input
          type="checkbox"
          checked={showTiers}
          onChange={(e) => setShowTiers(e.target.checked)}
        />
        Sample fee-tier allocation (static numbers)
      </label>
      {tiers && tiers.ok && (
        <>
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
          <p style={{ fontSize: "0.85rem" }}>
            bpsSum {tiers.bpsSum.toString()} (may be &lt; 10000 after floors)
          </p>
        </>
      )}

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Worked examples</h2>
        <table>
          <thead>
            <tr>
              <th>left</th>
              <th>moved</th>
              <th>bps</th>
              <th>leftBps</th>
            </tr>
          </thead>
          <tbody>
            {WORKED_EXAMPLES.map((row) => (
              <tr key={`${row.left}-${row.moved}`}>
                <td>{row.left}</td>
                <td>{row.moved}</td>
                <td>{row.bps}</td>
                <td>{row.leftBps}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="no-print">
        <Cases />
      </div>

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Runbook</h2>
        <ol style={{ fontSize: "0.9rem" }}>
          <li>Enter left-behind and moved (or sum legs via parseLegs).</li>
          <li>Read bps / leftBps / meter.</li>
          <li>Optional: threshold, apply target planner, compare, tiers, export, print, share.</li>
          <li>Do not treat this as live Alcor TVL or a completed on-chain migration.</li>
        </ol>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
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

      <p className="no-print" style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        URL overrides localStorage when present. See EDUCATION.md · POLICY.md · SECURITY.md
      </p>
    </main>
  );
}
