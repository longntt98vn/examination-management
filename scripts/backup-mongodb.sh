#!/bin/bash
# Script to backup MongoDB data

set -e

NAMESPACE="${1:-examination-system}"
BACKUP_DIR="./backups/mongodb-$(date +%Y%m%d-%H%M%S)"

echo "Backing up MongoDB from namespace: $NAMESPACE"

# Get MongoDB pod name
POD_NAME=$(kubectl get pod -l app=mongodb -n "$NAMESPACE" -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ MongoDB pod not found in namespace $NAMESPACE"
    exit 1
fi

echo "Found MongoDB pod: $POD_NAME"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Get MongoDB credentials
MONGODB_USERNAME=$(kubectl get secret mongodb-secret -n "$NAMESPACE" -o jsonpath='{.data.username}' | base64 -d)
MONGODB_PASSWORD=$(kubectl get secret mongodb-secret -n "$NAMESPACE" -o jsonpath='{.data.password}' | base64 -d)

echo "Creating backup in pod..."
kubectl exec -n "$NAMESPACE" "$POD_NAME" -- mongodump \
    --username="$MONGODB_USERNAME" \
    --password="$MONGODB_PASSWORD" \
    --authenticationDatabase=admin \
    --out=/tmp/backup

echo "Copying backup to local..."
kubectl cp "$NAMESPACE/$POD_NAME:/tmp/backup" "$BACKUP_DIR"

echo "Cleaning up backup in pod..."
kubectl exec -n "$NAMESPACE" "$POD_NAME" -- rm -rf /tmp/backup

echo "✅ Backup completed: $BACKUP_DIR"
