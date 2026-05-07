#!/bin/bash
# Quick deployment script for Kubernetes

set -e

ENVIRONMENT="${1:-dev}"

echo "================================================"
echo "Examination Management System - K8s Deployment"
echo "================================================"
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "❌ kubectl is not installed. Please install kubectl first."
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo "❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig."
    exit 1
fi

echo "✅ kubectl is installed and cluster is accessible"
echo ""

# Deploy based on environment
case $ENVIRONMENT in
    dev|development)
        echo "Deploying to DEVELOPMENT environment..."
        NAMESPACE="examination-system-dev"
        OVERLAY="dev"
        ;;
    prod|production)
        echo "Deploying to PRODUCTION environment..."
        NAMESPACE="examination-system"
        OVERLAY="prod"
        read -p "⚠️  Are you sure you want to deploy to PRODUCTION? (yes/no): " confirm
        if [ "$confirm" != "yes" ]; then
            echo "Deployment cancelled."
            exit 0
        fi
        ;;
    *)
        echo "❌ Invalid environment: $ENVIRONMENT"
        echo "Usage: $0 [dev|prod]"
        exit 1
        ;;
esac

echo ""
echo "📦 Deploying to $ENVIRONMENT environment..."
echo "Namespace: $NAMESPACE"
echo ""

# Apply kustomization
kubectl apply -k "k8s/overlays/$OVERLAY"

echo ""
echo "⏳ Waiting for pods to be ready..."
echo ""

# Wait for deployments to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n "$NAMESPACE" --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=redis -n "$NAMESPACE" --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=backend -n "$NAMESPACE" --timeout=300s || true
kubectl wait --for=condition=ready pod -l app=frontend -n "$NAMESPACE" --timeout=300s || true

echo ""
echo "✅ Deployment completed!"
echo ""
echo "================================================"
echo "Status:"
echo "================================================"
kubectl get all -n "$NAMESPACE"

echo ""
echo "================================================"
echo "Access Information:"
echo "================================================"

if [ "$OVERLAY" = "dev" ]; then
    echo "Frontend: http://localhost:3000"
    echo "Backend API: http://localhost:3000"
    echo ""
    echo "To access services locally, run:"
    echo "  kubectl port-forward svc/dev-frontend 8080:80 -n $NAMESPACE"
    echo "  kubectl port-forward svc/dev-backend 3000:3000 -n $NAMESPACE"
else
    echo "Frontend: https://examination.yourdomain.com"
    echo "Backend API: https://api.examination.yourdomain.com"
    echo ""
    echo "Make sure your DNS is configured to point to the ingress controller IP"
fi

echo ""
echo "To view logs:"
echo "  kubectl logs -f deployment/${OVERLAY}-backend -n $NAMESPACE"
echo ""
echo "To check status:"
echo "  kubectl get pods -n $NAMESPACE"
echo ""
