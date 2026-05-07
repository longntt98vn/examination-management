#!/bin/bash
# Script to create Kubernetes secrets from environment variables

set -e

NAMESPACE="${1:-examination-system}"

echo "Creating secrets for namespace: $NAMESPACE"

# Check if namespace exists
if ! kubectl get namespace "$NAMESPACE" &> /dev/null; then
    echo "Namespace $NAMESPACE does not exist. Creating..."
    kubectl create namespace "$NAMESPACE"
fi

# MongoDB Secret
echo "Creating MongoDB secret..."
read -p "Enter MongoDB username [admin]: " MONGODB_USERNAME
MONGODB_USERNAME=${MONGODB_USERNAME:-admin}

read -sp "Enter MongoDB password: " MONGODB_PASSWORD
echo

kubectl create secret generic mongodb-secret \
    --from-literal=username="$MONGODB_USERNAME" \
    --from-literal=password="$MONGODB_PASSWORD" \
    --namespace="$NAMESPACE" \
    --dry-run=client -o yaml | kubectl apply -f -

# Redis Secret
echo "Creating Redis secret..."
read -sp "Enter Redis password: " REDIS_PASSWORD
echo

kubectl create secret generic redis-secret \
    --from-literal=password="$REDIS_PASSWORD" \
    --namespace="$NAMESPACE" \
    --dry-run=client -o yaml | kubectl apply -f -

# Backend Secret
echo "Creating Backend secret..."
read -sp "Enter JWT secret: " JWT_SECRET
echo

read -sp "Enter SECRET_KEY: " SECRET_KEY
echo

read -p "Enter ORG1_APIKEY: " ORG1_APIKEY
read -p "Enter ORG2_APIKEY: " ORG2_APIKEY

kubectl create secret generic backend-secret \
    --from-literal=JWT_SECRET="$JWT_SECRET" \
    --from-literal=SECRET_KEY="$SECRET_KEY" \
    --from-literal=ORG1_APIKEY="$ORG1_APIKEY" \
    --from-literal=ORG2_APIKEY="$ORG2_APIKEY" \
    --from-literal=HLF_CONNECTION_PROFILE_ORG1="" \
    --from-literal=HLF_CERTIFICATE_ORG1="" \
    --from-literal=HLF_PRIVATE_KEY_ORG1="" \
    --from-literal=HLF_CONNECTION_PROFILE_ORG2="" \
    --from-literal=HLF_CERTIFICATE_ORG2="" \
    --from-literal=HLF_PRIVATE_KEY_ORG2="" \
    --namespace="$NAMESPACE" \
    --dry-run=client -o yaml | kubectl apply -f -

echo "✅ Secrets created successfully in namespace: $NAMESPACE"
