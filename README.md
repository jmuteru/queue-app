# Queue App

A minimal web tool for managing vendor queues at events (e.g. a night market). Visitors can join a queue and check their status using a ticket ID. Suitable for early pilots and rapid testing.

## Features
- Simple split-stack: Next.js frontend / Express (Node.js) backend (both in TypeScript)
- Join a queue for any vendor
- See your place in line (position/total) using a ticket ID
- Minimal frontend for mobile usability
- All data stored in backend memory (no persistence on restart)

## Quick Start

### Requirements
- Node.js (v18+ recommended)
- npm
- (For `make start`) `concurrently` (`npm install -g concurrently`)

### Installation
```sh
make install
```

### Start Both Servers
```sh
make start
```
This will launch both the frontend (Next.js) and backend (Express) for development.
- Frontend: http://localhost:3000
- Backend:  http://localhost:4000

### Start Individually
```sh
make backend   # start backend only
make frontend  # start frontend only
```

### Vendor configuration
To edit vendor stalls, change the list in `backend/src/config/vendors.ts`.

## Project Layout
- `backend/`    — Node.js/Express queue API
- `frontend/`   — Next.js UI (App Router, TypeScript, small components)
- `DESIGN.md`   — Architectural overview & future steps

## Limitations
- All queue/ticket/vendor data is in memory. Data is lost if backend restarts.
- No authentication, operator/admin controls, or real-time UI.
- Not ready for production use without persistence, abuse prevention, or live updates.

---

For more on future improvements, see `DESIGN.md`.

