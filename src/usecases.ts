import { HISTORY_ORIGIN, historyActions } from "./api";
import { movedShare } from "./moved";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

const share = movedShare(25n, 75n);
if (!share.ok) throw new Error(share.reason);
const moved = share;

export const USE_CASES: UseCase[] = [
  {
    title: "The market list is not a migration",
    detail: `75 of 100 is ${moved.bps.toString()} bps. GET /api/markets does not split a pool into left-behind and moved. The request is not sent.`,
    request: { method: "GET", url: "https://wax.alcor.exchange/api/markets", executed: false },
    transaction: null,
  },
  {
    title: "Swap transfers are not the two balances",
    detail: "No liquidity is removed or added from this share.",
    request: historyActions(HISTORY_ORIGIN, "swap.alcor", "eosio.token:transfer", 20),
    transaction: null,
  },
];

export function assertUseCases(): void {
  if (moved.bps !== 7500n) throw new Error(moved.bps.toString());
}
