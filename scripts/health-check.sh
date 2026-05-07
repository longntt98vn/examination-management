#!/bin/bash
# Health check script for Kubernetes deployment

set -e

NAMESPACE="${1:-examination-system}"
ENVIRONMENT="${2:-prod}"

echo "======================================"
echo "Health Check - $ENVIRONMENT Environment"
echo "Namespace: $NAMESPACE"
echo "======================================"
echo ""

# Check if namespace exists
if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
    echo "❌ Namespace $NAMESPACE does not exist"
    exit 1
fi

echo "✅ Namespace exists"
echo ""

# Check pods
echo "📦 Checking Pods..."
PODS=$(kubectl get pods -n "$NAMESPACE" --no-headers)
TOTAL_PODS=$(echo "$PODS" | wc -l | tr -d ' ')
RUNNING_PODS=$(echo "$PODS" | grep -c "Running" || echo "0")

echo "   Total Pods: $TOTAL_PODS"
echo "   Running: $RUNNING_PODS"

if [ "$TOTAL_PODS" -eq "$RUNNING_PODS" ]; then
    echo "   ✅ All pods are running"
else
    echo "   ⚠️  Some pods are not running"
    kubectl get pods -n "$NAMESPACE"
fi
echo ""

# Check deployments
echo "🚀 Checking Deployments..."
DEPLOYMENTS=$(kubectl get deployments -n "$NAMESPACE" -o json | jq -r '.items[] | "\(.metadata.name) \(.status.readyReplicas)/"(.spec.replicas)"')

while IFS= read -r line; do
    NAME=$(echo "$line" | awk '{print $1}')
    REPLICAS=$(echo "$line" | awk '{print $2}')
    
    if [[ "$REPLICAS" == *"/"* ]]; then
        READY=$(echo "$REPLICAS" | cut -d'/' -f1)
        DESIRED=$(echo "$REPLICAS" | cut -d'/' -f2)
        
        if [ "$READY" = "$DESIRED" ]; then
            echo "   ✅ $NAME: $REPLICAS"
        else
            echo "   ⚠️  $NAME: $REPLICAS (not ready)"
        fi
    fi
done <<< "$DEPLOYMENTS"
echo ""

# Check services
echo "🌐 Checking Services..."
SERVICES=$(kubectl get svc -n "$NAMESPACE" --no-headers | wc -l | tr -d ' ')
echo "   Services: $SERVICES"
kubectl get svc -n "$NAMESPACE" -o wide | grep -v "NAME"
echo ""

# Check ingress
echo "🔀 Checking Ingress..."
if kubectl get ingress -n "$NAMESPACE" &> /dev/null; then
    INGRESS_COUNT=$(kubectl get ingress -n "$NAMESPACE" --no-headers | wc -l | tr -d ' ')
    echo "   Ingress rules: $INGRESS_COUNT"
    kubectl get ingress -n "$NAMESPACE"
else
    echo "   ⚠️  No ingress found"
fi
echo ""

# Check HPA
echo "📊 Checking HPA..."
if kubectl get hpa -n "$NAMESPACE" &> /dev/null; then
    kubectl get hpa -n "$NAMESPACE"
else
    echo "   ℹ️  No HPA configured"
fi
echo ""

# Check PVC
echo "💾 Checking Persistent Volumes..."
PVC_COUNT=$(kubectl get pvc -n "$NAMESPACE" --no-headers | wc -l | tr -d ' ')
if [ "$PVC_COUNT" -gt 0 ]; then
    kubectl get pvc -n "$NAMESPACE"
else
    echo "   ℹ️  No PVC found"
fi
echo ""

# Resource usage
echo "📈 Resource Usage..."
kubectl top pods -n "$NAMESPACE" 2>/dev/null || echo "   ℹ️  Metrics server not available"
echo ""

# Recent events
echo "📝 Recent Events (last 10)..."
kubectl get events -n "$NAMESPACE" --sort-by='.lastTimestamp' | tail -10
echo ""

# Overall health status
echo "======================================"
echo "Overall Health Status"
echo "======================================"

FAILED_PODS=$(echo "$PODS" | grep -v "Running" | grep -v "Completed" | wc -l | tr -d ' ')

if [ "$FAILED_PODS" -eq 0 ] && [ "$RUNNING_PODS" -eq "$TOTAL_PODS" ]; then
    echo "✅ System is HEALTHY"
    exit 0
else
    echo "⚠️  System has issues - $FAILED_PODS pod(s) not running properly"
    exit 1
fi
