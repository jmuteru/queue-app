import { TicketListItem } from "./types";

type Props = {
  tickets: TicketListItem[];
  total: number;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onSelect: (id: string) => void;
};

export function TicketList({ tickets, total, loading, error, onRefresh, onSelect }: Props) {
  return (
    <section className="section">
      <h3>Tickets in this queue</h3>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p className="muted">Loading…</p>
      ) : tickets.length === 0 ? (
        <p className="muted">No tickets yet.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #ddd" }}>Ticket</th>
                <th style={{ textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #ddd" }}>Vendor</th>
                <th style={{ textAlign: "left", padding: "6px 4px", borderBottom: "1px solid #ddd" }}>Position</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td style={{ padding: "6px 4px", borderBottom: "1px solid #eee" }}>
                    {ticket.id}
                  </td>
                  <td style={{ padding: "6px 4px", borderBottom: "1px solid #eee" }}>
                    {ticket.vendorName ?? ticket.vendorId}
                  </td>
                  <td style={{ padding: "6px 4px", borderBottom: "1px solid #eee" }}>
                    {ticket.position} / {ticket.totalInQueue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="muted" style={{ marginTop: 6 }}>
            Total in queue: {total}
          </p>
        </div>
      )}
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button type="button" onClick={onRefresh} disabled={loading}>
          Refresh list
        </button>
        <button
          type="button"
          onClick={() => {
            if (tickets[0]) onSelect(tickets[0].id);
          }}
          disabled={loading || tickets.length === 0}
        >
          Use first ticket
        </button>
      </div>
    </section>
  );
}


