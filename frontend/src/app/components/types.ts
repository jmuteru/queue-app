export type Vendor = { id: string; name: string; queueLength: number };

export type JoinResponse = {
  ticketId: string;
  vendorId: string;
  vendorName: string;
  position: number;
  message: string;
};

export type StatusResponse = {
  ticketId: string;
  vendorId: string;
  vendorName: string;
  position: number;
  peopleAhead: number;
  totalInQueue: number;
  joinedAt: number;
};

export type TicketListItem = {
  id: string;
  vendorId: string;
  joinedAt: number;
  position: number;
  totalInQueue: number;
  vendorName?: string;
};

