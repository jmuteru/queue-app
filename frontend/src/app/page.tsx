"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { JoinSection } from "./components/JoinSection";
import { StatusSection } from "./components/StatusSection";
import { TicketList } from "./components/TicketList";
import { useApiBase, parseJson } from "./components/useApi";
import { JoinResponse, StatusResponse, TicketListItem, Vendor } from "./components/types";

export default function Home() {
  const apiBase = useApiBase();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingVendors, setLoadingVendors] = useState(true);
  const [vendorError, setVendorError] = useState<string | null>(null);

  const [selectedVendor, setSelectedVendor] = useState<string>("");
  const [joinState, setJoinState] = useState<{
    loading: boolean;
    error: string | null;
    result: JoinResponse | null;
  }>({ loading: false, error: null, result: null });

  const [statusTicketId, setStatusTicketId] = useState<string>("");
  const [statusState, setStatusState] = useState<{
    loading: boolean;
    error: string | null;
    result: StatusResponse | null;
  }>({ loading: false, error: null, result: null });
  const [ticketList, setTicketList] = useState<TicketListItem[]>([]);
  const [ticketListError, setTicketListError] = useState<string | null>(null);
  const [ticketListLoading, setTicketListLoading] = useState(false);
  const [ticketListTotal, setTicketListTotal] = useState<number>(0);
  const [statusUpdatedAt, setStatusUpdatedAt] = useState<string | null>(null);

  const statusTicketPlaceholder = useMemo(
    () => joinState.result?.ticketId ?? "e.g. paste your ticket id",
    [joinState.result?.ticketId],
  );

  useEffect(() => {
    const fetchVendors = async () => {
      setLoadingVendors(true);
      setVendorError(null);
      try {
        const res = await fetch(`${apiBase}/vendors`);
        const data = (await parseJson(res, `${apiBase}/vendors`)) as Vendor[];
        if (!res.ok) throw new Error("Could not load vendors");
        setVendors(data);
        setSelectedVendor((prev) => prev || data[0]?.id || "");
      } catch (err) {
        setVendorError(
          err instanceof Error ? err.message : "Failed to load vendors",
        );
      } finally {
        setLoadingVendors(false);
      }
    };

    fetchVendors();
  }, []);

  useEffect(() => {
    const loadTickets = async () => {
      if (!selectedVendor) {
        setTicketList([]);
        setTicketListTotal(0);
        return;
      }
      setTicketListLoading(true);
      setTicketListError(null);
      try {
        const res = await fetch(`${apiBase}/vendors/${selectedVendor}/tickets`);
        const body = await parseJson(
          res,
          `${apiBase}/vendors/${selectedVendor}/tickets`,
        );
        if (!res.ok) throw new Error(body.error ?? "Could not load tickets");
        setTicketList(body.tickets ?? []);
        setTicketListTotal(body.total ?? 0);
      } catch (err) {
        setTicketListError(
          err instanceof Error ? err.message : "Failed to load tickets",
        );
        setTicketList([]);
        setTicketListTotal(0);
      } finally {
        setTicketListLoading(false);
      }
    };
    loadTickets();
  }, [selectedVendor]);

  const joinQueue = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedVendor) return;
    setJoinState({ loading: true, error: null, result: null });
    try {
      const res = await fetch(`${apiBase}/vendors/${selectedVendor}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const body = await parseJson(
        res,
        `${apiBase}/vendors/${selectedVendor}/join`,
      );
      if (!res.ok) {
        throw new Error(body.error ?? "Could not join queue");
      }
      setJoinState({ loading: false, error: null, result: body });
      setStatusTicketId(body.ticketId);
      setStatusState((prev) => ({ ...prev, result: null, error: null }));
    } catch (err) {
      setJoinState({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to join queue",
        result: null,
      });
    }
  };

  const fetchStatus = async (ticketId: string) => {
    if (!ticketId) {
      setStatusState({
        loading: false,
        error: "Enter a ticket id to check",
        result: null,
      });
      return;
    }

    setStatusState({ loading: true, error: null, result: null });
    try {
      const res = await fetch(`${apiBase}/status/${ticketId}`);
      const body = await parseJson(res, `${apiBase}/status/${ticketId}`);
      if (!res.ok) {
        throw new Error(body.error ?? "Could not fetch status");
      }
      setStatusState({ loading: false, error: null, result: body });
      setStatusUpdatedAt(new Date().toLocaleTimeString());
    } catch (err) {
      setStatusState({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch status",
        result: null,
      });
      setStatusUpdatedAt(null);
    }
  };

  const checkStatus = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchStatus(statusTicketId);
  };

  const copyToClipboard = (value: string) => {
    if (!navigator?.clipboard) return;
    void navigator.clipboard.writeText(value).catch(() => undefined);
  };

  return (
    <main className="container">
      <h1>Queue App</h1>
      <p className="muted">Join a vendor line and check your place.</p>

      <JoinSection
        vendors={vendors}
        selectedVendor={selectedVendor}
        loadingVendors={loadingVendors}
        vendorError={vendorError}
        joinState={joinState}
        onSelectVendor={setSelectedVendor}
        onJoin={joinQueue}
      />

      <StatusSection
        statusTicketId={statusTicketId}
        statusTicketPlaceholder={statusTicketPlaceholder}
        statusState={statusState}
        statusUpdatedAt={statusUpdatedAt}
        onStatusTicketChange={setStatusTicketId}
        onSubmit={checkStatus}
        onCopy={copyToClipboard}
      />

      <TicketList
        tickets={ticketList}
        total={ticketListTotal}
        loading={ticketListLoading}
        error={ticketListError}
        onRefresh={() => {
          setTicketListLoading(true);
          setTicketListError(null);
          fetch(`${apiBase}/vendors/${selectedVendor}/tickets`)
            .then((res) =>
              parseJson(res, `${apiBase}/vendors/${selectedVendor}/tickets`),
            )
            .then((body) => {
              setTicketList(body.tickets ?? []);
              setTicketListTotal(body.total ?? 0);
            })
            .catch((err) => {
              setTicketListError(
                err instanceof Error ? err.message : "Failed to load tickets",
              );
              setTicketList([]);
              setTicketListTotal(0);
            })
            .finally(() => setTicketListLoading(false));
        }}
        onSelect={(id) => {
          setStatusTicketId(id);
          void fetchStatus(id);
        }}
      />

      
    </main>
  );
}

