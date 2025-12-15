import { vendorCatalog } from "../config/vendors";
import { TicketRecord, Vendor } from "../types/queue";

const queues = new Map<string, TicketRecord[]>();
const tickets = new Map<string, TicketRecord>();

const ensureVendorQueue = (vendorId: string) => {
  if (!queues.has(vendorId)) {
    queues.set(vendorId, []);
  }
};

const findVendor = (vendorId: string): Vendor | undefined =>
  vendorCatalog.find((v) => v.id === vendorId);

export const store = {
  vendors: vendorCatalog,
  getVendorWithLength: () =>
    vendorCatalog.map((vendor) => ({
      ...vendor,
      queueLength: queues.get(vendor.id)?.length ?? 0,
    })),
  joinQueue: (vendorId: string, ticket: TicketRecord) => {
    ensureVendorQueue(vendorId);
    queues.get(vendorId)!.push(ticket);
    tickets.set(ticket.id, ticket);
    return { queueLength: queues.get(vendorId)!.length, vendor: findVendor(vendorId) };
  },
  getStatus: (ticketId: string) => {
    const ticket = tickets.get(ticketId);
    if (!ticket) return null;
    const queue = queues.get(ticket.vendorId) ?? [];
    const index = queue.findIndex((entry) => entry.id === ticketId);
    if (index === -1) return { ticket, vendor: findVendor(ticket.vendorId), index: -1, queueLength: queue.length };
    return {
      ticket,
      vendor: findVendor(ticket.vendorId),
      index,
      queueLength: queue.length,
    };
  },
  listTickets: (vendorId: string, limit = 50) => {
    ensureVendorQueue(vendorId);
    const queue = queues.get(vendorId)!;
    const vendor = findVendor(vendorId);
    const total = queue.length;
    const ticketsWithPosition = queue
      .slice(0, limit)
      .map((ticket, idx) => ({
        ...ticket,
        position: idx + 1,
        totalInQueue: total,
        vendorName: vendor?.name,
      }));
    return { tickets: ticketsWithPosition, total };
  },
};

