# Makefile for Queue App (frontend + backend)

.PHONY: frontend backend install start clean

# Start frontend and backend in parallel
start:
	cd backend && npm install
	cd frontend && npm install
	concurrently "npm --prefix backend run dev" "npm --prefix frontend run dev"

# Start backend onlyackend:
	cd backend && npm install && npm run dev

# Start frontend only
frontend:
	cd frontend && npm install && npm run dev

# Install dependencies for both
install:
	cd backend && npm install
	cd frontend && npm install

# Clean node_modules
clean:
	rm -rf backend/node_modules frontend/node_modules
	rm -rf frontend/.next

# Aliases
up: start

# Print help
help:
	@echo "Target list:"
	@echo "  start     - Run frontend and backend together (needs 'concurrently')"
	@echo "  frontend  - Run frontend only"
	@echo "  backend   - Run backend only"
	@echo "  install   - Install both frontend and backend dependencies"
	@echo "  clean     - Remove all node_modules and frontend build artifacts"
	@echo "  up        - Alias for start"
	@echo "  help      - Show this help"

