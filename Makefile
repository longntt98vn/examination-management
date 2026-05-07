# Makefile for Kubernetes Deployment
# Examination Management System

.PHONY: help setup build push deploy-dev deploy-prod clean logs status health-check

# Variables
DOCKER_REGISTRY ?= your-registry.com
BACKEND_IMAGE = $(DOCKER_REGISTRY)/examination-backend
FRONTEND_IMAGE = $(DOCKER_REGISTRY)/examination-frontend
VERSION ?= latest

help:
	@echo "Available commands:"
	@echo ""
	@echo "Setup:"
	@echo "  make setup              - Complete setup wizard (RECOMMENDED for first time)"
	@echo "  make secrets            - Create secrets interactively"
	@echo ""
	@echo "Build & Deploy:"
	@echo "  make build              - Build all Docker images"
	@echo "  make push               - Push images to registry"
	@echo "  make deploy-dev         - Deploy to development environment"
	@echo "  make deploy-prod        - Deploy to production environment"
	@echo ""
	@echo "Management:"
	@echo "  make status-dev         - Check development status"
	@echo "  make status-prod        - Check production status"
	@echo "  make logs-dev           - Show development logs"
	@echo "  make logs-prod          - Show production logs"
	@echo "  make health-check-dev   - Run health check (dev)"
	@echo "  make health-check-prod  - Run health check (prod)"
	@echo ""
	@echo "Operations:"
	@echo "  make port-forward-dev   - Port forward development services"
	@echo "  make restart-dev        - Restart development deployments"
	@echo "  make restart-prod       - Restart production deployments"
	@echo "  make db-backup          - Backup MongoDB"
	@echo "  make db-restore         - Restore MongoDB"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean-dev          - Clean development environment"
	@echo "  make clean-prod         - Clean production environment"

# Build Docker images
build:
	@echo "Building Docker images..."
	docker build -t $(BACKEND_IMAGE):$(VERSION) ./backend
	docker build -t $(FRONTEND_IMAGE):$(VERSION) ./frontend
	@echo "Build completed!"

# Push images to registry
push: build
	@echo "Pushing images to registry..."
	docker push $(BACKEND_IMAGE):$(VERSION)
	docker push $(FRONTEND_IMAGE):$(VERSION)
	@echo "Push completed!"

# Deploy to development
deploy-dev:
	@echo "Deploying to development environment..."
	kubectl apply -k k8s/overlays/dev
	@echo "Waiting for pods to be ready..."
	kubectl wait --for=condition=ready pod -l app=backend -n examination-system-dev --timeout=300s
	kubectl wait --for=condition=ready pod -l app=frontend -n examination-system-dev --timeout=300s
	@echo "Development deployment completed!"
	@make status-dev

# Deploy to production
deploy-prod:
	@echo "Deploying to production environment..."
	kubectl apply -k k8s/overlays/prod
	@echo "Waiting for pods to be ready..."
	kubectl wait --for=condition=ready pod -l app=backend -n examination-system --timeout=300s
	kubectl wait --for=condition=ready pod -l app=frontend -n examination-system --timeout=300s
	@echo "Production deployment completed!"
	@make status-prod

# Clean development environment
clean-dev:
	@echo "Cleaning development environment..."
	kubectl delete -k k8s/overlays/dev
	@echo "Development environment cleaned!"

# Clean production environment
clean-prod:
	@echo "WARNING: This will delete the production environment!"
	@read -p "Are you sure? (yes/no): " confirm && [ "$$confirm" = "yes" ]
	kubectl delete -k k8s/overlays/prod
	@echo "Production environment cleaned!"

# Show development logs
logs-dev:
	@echo "Showing development logs..."
	kubectl logs -f deployment/dev-backend -n examination-system-dev --tail=100

# Show production logs
logs-prod:
	@echo "Showing production logs..."
	kubectl logs -f deployment/prod-backend -n examination-system --tail=100

# Check development status
status-dev:
	@echo "=== Development Environment Status ==="
	kubectl get all -n examination-system-dev
	@echo "\n=== Pod Details ==="
	kubectl get pods -n examination-system-dev -o wide
	@echo "\n=== HPA Status ==="
	kubectl get hpa -n examination-system-dev 2>/dev/null || echo "HPA not configured"

# Check production status
status-prod:
	@echo "=== Production Environment Status ==="
	kubectl get all -n examination-system
	@echo "\n=== Pod Details ==="
	kubectl get pods -n examination-system -o wide
	@echo "\n=== HPA Status ==="
	kubectl get hpa -n examination-system

# Port forward development services
port-forward-dev:
	@echo "Port forwarding development services..."
	@echo "Backend: http://localhost:3000"
	@echo "Frontend: http://localhost:8080"
	@echo "MongoDB: localhost:27017"
	@echo "Press Ctrl+C to stop"
	kubectl port-forward svc/dev-backend 3000:3000 -n examination-system-dev & \
	kubectl port-forward svc/dev-frontend 8080:80 -n examination-system-dev & \
	kubectl port-forward svc/dev-mongodb 27017:27017 -n examination-system-dev & \
	wait

# Complete setup wizard
setup:
	@./scripts/setup-complete.sh

# Create secrets from .env file
secrets:
	@echo "Creating secrets..."
	@./scripts/create-secrets.sh

# Health checks
health-check-dev:
	@./scripts/health-check.sh examination-system-dev dev

health-check-prod:
	@./scripts/health-check.sh examination-system prod

# Restart deployments
restart-dev:
	@echo "Restarting development deployments..."
	kubectl rollout restart deployment/dev-backend -n examination-system-dev
	kubectl rollout restart deployment/dev-frontend -n examination-system-dev

restart-prod:
	@echo "Restarting production deployments..."
	kubectl rollout restart deployment/prod-backend -n examination-system
	kubectl rollout restart deployment/prod-frontend -n examination-system

# Update images
update-backend-dev:
	kubectl set image deployment/dev-backend backend=$(BACKEND_IMAGE):$(VERSION) -n examination-system-dev
	kubectl rollout status deployment/dev-backend -n examination-system-dev

update-frontend-dev:
	kubectl set image deployment/dev-frontend frontend=$(FRONTEND_IMAGE):$(VERSION) -n examination-system-dev
	kubectl rollout status deployment/dev-frontend -n examination-system-dev

update-backend-prod:
	kubectl set image deployment/prod-backend backend=$(BACKEND_IMAGE):$(VERSION) -n examination-system
	kubectl rollout status deployment/prod-backend -n examination-system

update-frontend-prod:
	kubectl set image deployment/prod-frontend frontend=$(FRONTEND_IMAGE):$(VERSION) -n examination-system
	kubectl rollout status deployment/prod-frontend -n examination-system

# Database operations
db-backup:
	@echo "Backing up MongoDB..."
	@./scripts/backup-mongodb.sh

db-restore:
	@echo "Restoring MongoDB..."
	@./scripts/restore-mongodb.sh

# Monitoring
top-dev:
	kubectl top pods -n examination-system-dev

top-prod:
	kubectl top pods -n examination-system
