# Queue App — Design Note (Review & Improved)

## Assumptions (Reviewed)
- Vendors are known and hard-coded (good for pilot; reduces scope, but limits flexibility for future).
- In-memory persistence (great for MVP/dev; but all queues/tickets lost on backend restart).
- Ticket IDs are anonymous (no user accounts/auth for simplicity); CORS wide open for dev/local net.
- Running as a single backend instance (fine for demo, not for real-world scaling or redundancy).

**Note**: For public use or expansion, identity, rate-limiting, and scaling strategies will need significant enhancement.

## Key Trade-offs (Review)
- **In-memory store:** Blazing fast and no setup, but not durable, not shareable across servers, loses all data on restart or crash.
- **Backend/frontend separation:** More modular, matches industry practice; allows deploying on different infrastructure, easier to migrate separately.
- **Minimal validation/rules:** Very quick to build, but would enable spam, data errors, and accidental or deliberate attacks in a non-demo context.

**Why these choices?**
- Aimed for maximum speed and clarity for an early pilot/PoC in a local, trusted environment. Design encourages incremental addition of pieces (storage, auth) as requirements are clarified.
- Separated stacks avoids lock-in: can swap out backend for serverless or different API easily in future.

## What to improve next (+2 hours, with rationale)
- **Upgrade to durable storage:** Use SQLite or managed Postgres for queue/ticket records, so server restarts or failures don’t lose critical data.
- **Vendor management UI/API:** Vendors should not be hardcoded; enable dynamic creation, disabling, and renaming from an admin interface.
- **Authentication & Abuse Controls:** Even simple rate-limiting or CAPTCHAs significantly reduce accidental or malicious noise in a public setting.
- **Operator/Admin Dashboard:** Require tools for queue resets, live stats, troubleshooting, and handling edge cases at the event.
- **Live notifications & real-time status:** Let users receive SMS/web push or browser notifications, and show their queue status live via polling or websockets/SSE.
- **Improve accessibility and mobile UX:** Most users will be on mobile, and some will need assistive tech; optimize controls for touch and screen readers.
- **Containerization & Tests:** Provide a clean Docker dev/ops path; cover core back-end logic and UI with tests to avoid regressions as app grows.

## Additional Recommendations
- **Observability/monitoring:** Add logging, metrics, and minimal health endpoints so errors and usage spikes are easier to handle.
- **Configurable CORS, ports, and logging:** Make it easier for operators/devs to deploy in different environments with minimal code changes.
- **Resilience for connectivity loss:** Save last ticket id and status locally in browser; retry background requests automatically to improve field experience at busy markets.
- **Clear error handling in UI:** Show user-friendly, actionable messages for all backend failures (network, unknown ticket, etc).

---

This approach keeps the solution lightweight but gives a clear path to production-grade reliability, management, and UX as time allows.
