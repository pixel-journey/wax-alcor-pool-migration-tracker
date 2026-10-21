"use client";

import { movedShare } from "./moved";

export function Demo() {
  const share = movedShare(25n, 75n);
  return (
    <main className="wrap">
      <p className="kicker">Educational reference</p>
      <h1>75 of 100 has moved</h1>
      <p className="lede">That is 7500 basis points. The two amounts are written here. No Alcor pool was read.</p>
      {share.ok ? (
        <p>
          Total {share.total.toString()}. Moved {share.bps.toString()} bps.
        </p>
      ) : (
        <p>{share.reason}</p>
      )}
    </main>
  );
}
