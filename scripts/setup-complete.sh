#!/bin/bash
# Complete setup script - From zero to deployed

set -e

echo "=========================================="
echo "Examination Management System"
echo "Complete Kubernetes Setup"
echo "=========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
info() { echo -e "${GREEN}✓${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
error() { echo -e "${RED}✗${NC} $1"; }

# Check prerequisites
echo "Step 1: Checking prerequisites..."
echo ""

# Check kubectl
if command -v kubectl &> /dev/null; then
    info "kubectl is installed ($(kubectl version --client --short 2>/dev/null))"
else
    error "kubectl is not installed"
    echo "  Install: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Check docker
if command -v docker &> /dev/null; then
    info "Docker is installed ($(docker --version))"
else
    error "Docker is not installed"
    echo "  Install: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check cluster connection
if kubectl cluster-info &> /dev/null; then
    info "Kubernetes cluster is accessible"
    CONTEXT=$(kubectl config current-context)
    echo "  Context: $CONTEXT"
else
    error "Cannot connect to Kubernetes cluster"
    echo "  Make sure your cluster is running (minikube start / kubectl config use-context ...)"
    exit 1
fi

echo ""
read -p "Continue with setup? (yes/no): " CONTINUE
if [ "$CONTINUE" != "yes" ]; then
    echo "Setup cancelled."
    exit 0
fi

# Ask for environment
echo ""
echo "Step 2: Select environment"
echo ""
echo "1) Development (dev)"
echo "2) Production (prod)"
read -p "Select environment (1 or 2): " ENV_CHOICE

case $ENV_CHOICE in
    1)
        ENVIRONMENT="dev"
        NAMESPACE="examination-system-dev"
        ;;
    2)
        ENVIRONMENT="prod"
        NAMESPACE="examination-system"
        warn "Production deployment requires additional configuration!"
        read -p "Have you reviewed the DEPLOYMENT-CHECKLIST.md? (yes/no): " CHECKLIST
        if [ "$CHECKLIST" != "yes" ]; then
            warn "Please review k8s/DEPLOYMENT-CHECKLIST.md before production deployment"
            exit 1
        fi
        ;;
    *)
        error "Invalid choice"
        exit 1
        ;;
esac

info "Selected: $ENVIRONMENT environment"
echo ""

# Docker registry
echo "Step 3: Docker registry configuration"
echo ""
read -p "Enter your Docker registry (e.g., docker.io/username): " DOCKER_REGISTRY

if [ -z "$DOCKER_REGISTRY" ]; then
    error "Docker registry is required"
    exit 1
fi

info "Docker registry: $DOCKER_REGISTRY"
echo ""

# Ask if images need to be built
read -p "Do you want to build and push Docker images? (yes/no): " BUILD_IMAGES

if [ "$BUILD_IMAGES" = "yes" ]; then
    echo ""
    echo "Step 4: Building Docker images..."
    echo ""
    
    info "Building backend image..."
    docker build -t $DOCKER_REGISTRY/examination-backend:latest ./backend
    
    info "Building frontend image..."
    docker build -t $DOCKER_REGISTRY/examination-frontend:latest ./frontend
    
    echo ""
    read -p "Push images to registry? (yes/no): " PUSH_IMAGES
    
    if [ "$PUSH_IMAGES" = "yes" ]; then
        info "Pushing backend image..."
        docker push $DOCKER_REGISTRY/examination-backend:latest
        
        info "Pushing frontend image..."
        docker push $DOCKER_REGISTRY/examination-frontend:latest
    fi
    
    echo ""
    info "Images are ready"
else
    warn "Skipping image build. Make sure images are available in the registry!"
fi

# Update image references
echo ""
echo "Step 5: Updating image references..."
echo ""

# This is a simple replacement - in production, use proper templating
sed -i.bak "s|examination-backend:latest|$DOCKER_REGISTRY/examination-backend:latest|g" k8s/base/backend-deployment.yaml
sed -i.bak "s|examination-frontend:latest|$DOCKER_REGISTRY/examination-frontend:latest|g" k8s/base/frontend-deployment.yaml

info "Image references updated"
echo ""

# Secrets configuration
echo "Step 6: Secrets configuration"
echo ""
warn "Secrets contain sensitive information like passwords and keys"
echo ""

read -p "Do you want to create/update secrets interactively? (yes/no): " CREATE_SECRETS

if [ "$CREATE_SECRETS" = "yes" ]; then
    ./scripts/create-secrets.sh $NAMESPACE
else
    warn "Skipping secrets creation. Make sure secrets are configured!"
    warn "You can create them later with: ./scripts/create-secrets.sh $NAMESPACE"
fi

echo ""

# Deploy
echo "Step 7: Deploying to Kubernetes..."
echo ""

info "Deploying to $ENVIRONMENT environment (namespace: $NAMESPACE)..."
kubectl apply -k k8s/overlays/$ENVIRONMENT

echo ""
info "Waiting for deployments to be ready..."
echo ""

# Wait for pods
kubectl wait --for=condition=ready pod -l app=mongodb -n $NAMESPACE --timeout=300s || warn "MongoDB not ready yet"
kubectl wait --for=condition=ready pod -l app=redis -n $NAMESPACE --timeout=300s || warn "Redis not ready yet"
kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=300s || warn "Backend not ready yet"
kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=300s || warn "Frontend not ready yet"

echo ""
info "Deployment completed!"
echo ""

# Show status
echo "=========================================="
echo "Deployment Status"
echo "=========================================="
echo ""
kubectl get all -n $NAMESPACE

echo ""
echo "=========================================="
echo "Next Steps"
echo "=========================================="
echo ""

if [ "$ENVIRONMENT" = "dev" ]; then
    info "Development environment is ready!"
    echo ""
    echo "Access your services:"
    echo "  Backend:  kubectl port-forward svc/dev-backend 3000:3000 -n $NAMESPACE"
    echo "  Frontend: kubectl port-forward svc/dev-frontend 8080:80 -n $NAMESPACE"
    echo "  MongoDB:  kubectl port-forward svc/dev-mongodb 27017:27017 -n $NAMESPACE"
    echo ""
    echo "View logs:"
    echo "  kubectl logs -f deployment/dev-backend -n $NAMESPACE"
    echo ""
else
    info "Production environment is deployed!"
    echo ""
    echo "Configure DNS:"
    echo "  Get LoadBalancer IP: kubectl get svc -n ingress-nginx"
    echo "  Point your domain to this IP"
    echo ""
    echo "Setup SSL/TLS:"
    echo "  See: k8s/README.md → SSL/TLS Configuration"
    echo ""
    echo "Monitor:"
    echo "  kubectl get pods -n $NAMESPACE -w"
    echo "  kubectl top pods -n $NAMESPACE"
    echo ""
fi

echo "Useful commands:"
echo "  make status-$ENVIRONMENT    # Check status"
echo "  make logs-$ENVIRONMENT      # View logs"
echo "  ./scripts/health-check.sh $NAMESPACE  # Health check"
echo ""
echo "Documentation:"
echo "  k8s/GUIDE-INDEX.md    # All documentation"
echo "  k8s/QUICKSTART.md     # Quick reference"
echo "  k8s/EXAMPLES.md       # Tips and tricks"
echo ""

info "Setup complete! 🚀"
