import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import { store } from "../data/memoryStore";
import { TicketRecord } from "../types/queue";

const router = Router();

router.get("/vendors", async (_req, res) => {
  try {
    const vendors = store.getVendorWithLength();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

router.post("/vendors/:vendorId/join", async (req, res) => {
  const vendorId = req.params.vendorId;
  const vendor = store.vendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return res.status(404).json({ error: "Vendor not found" });
  }

  try {
    const ticket: TicketRecord = {
      id: uuidv4(),
      vendorId,
      joinedAt: Date.now(),
    };

    const { queueLength } = store.joinQueue(vendorId, ticket);

    res.status(201).json({
      ticketId: ticket.id,
      vendorId,
      vendorName: vendor.name,
      position: queueLength,
      message: "You joined the queue",
    });
  } catch (err) {
    res.status(500).json({ error: "Could not join queue" });
  }
});

router.get("/status/:ticketId", async (req, res) => {
  const ticketId = req.params.ticketId;
  try {
    const status = store.getStatus(ticketId);

    if (!status) {
      return res.status(404).json({ error: "Ticket not found" });
    }

    const position = status.index + 1;
    res.json({
      ticketId,
      vendorId: status.ticket.vendorId,
      vendorName: status.vendor?.name ?? status.ticket.vendorId,
      position,
      peopleAhead: Math.max(0, position - 1),
      totalInQueue: status.queueLength,
      joinedAt: status.ticket.joinedAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Could not fetch status" });
  }
});

router.get("/vendors/:vendorId/tickets", (req, res) => {
  const vendorId = req.params.vendorId;
  const vendor = store.vendors.find((v) => v.id === vendorId);
  if (!vendor) {
    return res.status(404).json({ error: "Vendor not found" });
  }
  try {
    const { tickets, total } = store.listTickets(vendorId, 50);
    res.json({ tickets, total });
  } catch (err) {
    res.status(500).json({ error: "Could not list tickets" });
  }
});

export default router;

