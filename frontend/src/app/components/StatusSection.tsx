import { FormEvent } from "react";
import { StatusResponse } from "./types";

type Props = {
  statusTicketId: string;
  statusTicketPlaceholder: string;
  statusState: {
    loading: boolean;
    error: string | null;
    result: StatusResponse | null;
  };
  statusUpdatedAt: string | null;
  onStatusTicketChange: (val: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onCopy: (val: string) => void;
};

export function StatusSection({
  statusTicketId,
  statusTicketPlaceholder,
  statusState,
  statusUpdatedAt,
  onStatusTicketChange,
  onSubmit,
  onCopy,
}: Props) {
  return (
    <section className="section">
      <h3>Check your place</h3>
      <form className="stack" onSubmit={onSubmit}>
        <div>
          <label htmlFor="ticket">Ticket id</label>
          <input
            id="ticket"
            value={statusTicketId}
            placeholder={statusTicketPlaceholder}
            onChange={(e) => onStatusTicketChange(e.target.value)}
            disabled={statusState.loading}
          />
        </div>
        <button type="submit" disabled={statusState.loading}>
          {statusState.loading ? "Checking…" : "Check status"}
        </button>
        {statusState.error && <p className="error">{statusState.error}</p>}
      </form>
      <div className="section" style={{ marginTop: 10 }}>
        <h4 style={{ margin: "0 0 6px" }}>Last status</h4>
        {statusState.result ? (
          <div className="stack">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <strong>{statusState.result.vendorName}</strong>
              <span className="muted">Ticket {statusState.result.ticketId}</span>
              <button type="button" onClick={() => onCopy(statusState.result!.ticketId)}>
                Copy id
              </button>
            </div>
            <p style={{ margin: 0 }}>
              Position: {statusState.result.position} ({statusState.result.peopleAhead} ahead of you)
            </p>
            <p className="muted" style={{ margin: 0 }}>
              Total in queue: {statusState.result.totalInQueue}
            </p>
            {statusUpdatedAt && (
              <p className="muted" style={{ margin: 0 }}>
                Checked at {statusUpdatedAt}
              </p>
            )}
          </div>
        ) : (
          <p className="muted">No status checked yet.</p>
        )}
      </div>
    </section>
  );
}


