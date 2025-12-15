import { FormEvent } from "react";
import { JoinResponse, Vendor } from "./types";

type Props = {
  vendors: Vendor[];
  selectedVendor: string;
  loadingVendors: boolean;
  vendorError: string | null;
  joinState: {
    loading: boolean;
    error: string | null;
    result: JoinResponse | null;
  };
  onSelectVendor: (vendorId: string) => void;
  onJoin: (e: FormEvent<HTMLFormElement>) => void;
};

export function JoinSection({
  vendors,
  selectedVendor,
  loadingVendors,
  vendorError,
  joinState,
  onSelectVendor,
  onJoin,
}: Props) {
  return (
    <section className="section">
      <h3>Join a vendor</h3>
      {vendorError ? (
        <p className="error">Unable to load vendors: {vendorError}</p>
      ) : loadingVendors ? (
        <p className="muted">Loading vendors…</p>
      ) : (
        <form className="stack" onSubmit={onJoin}>
          <div>
            <label htmlFor="vendor">Vendor</label>
            <select
              id="vendor"
              value={selectedVendor}
              onChange={(e) => onSelectVendor(e.target.value)}
              disabled={joinState.loading}
            >
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.name} ({vendor.queueLength} waiting)
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={!selectedVendor || joinState.loading}>
            {joinState.loading ? "Joining…" : "Join queue"}
          </button>
          {joinState.error && <p className="error">{joinState.error}</p>}
          {joinState.result && (
            <div>
              <p>Ticket: {joinState.result.ticketId}</p>
              <p>Position: {joinState.result.position}</p>
              <p className="muted">Save the ticket id to check later.</p>
            </div>
          )}
        </form>
      )}
    </section>
  );
}


