#!/bin/bash
# Script to restore MongoDB data

set -e

NAMESPACE="${1:-examination-system}"
BACKUP_DIR="${2}"

if [ -z "$BACKUP_DIR" ]; then
    echo "Usage: $0 <namespace> <backup-directory>"
    echo "Example: $0 examination-system ./backups/mongodb-20240430-120000"
    exit 1
fi

if [ ! -d "$BACKUP_DIR" ]; then
    echo "❌ Backup directory not found: $BACKUP_DIR"
    exit 1
fi

echo "Restoring MongoDB to namespace: $NAMESPACE"
echo "From backup: $BACKUP_DIR"

# Get MongoDB pod name
POD_NAME=$(kubectl get pod -l app=mongodb -n "$NAMESPACE" -o jsonpath='{.items[0].metadata.name}')

if [ -z "$POD_NAME" ]; then
    echo "❌ MongoDB pod not found in namespace $NAMESPACE"
    exit 1
fi

echo "Found MongoDB pod: $POD_NAME"

# Get MongoDB credentials
MONGODB_USERNAME=$(kubectl get secret mongodb-secret -n "$NAMESPACE" -o jsonpath='{.data.username}' | base64 -d)
MONGODB_PASSWORD=$(kubectl get secret mongodb-secret -n "$NAMESPACE" -o jsonpath='{.data.password}' | base64 -d)

echo "Copying backup to pod..."
kubectl cp "$BACKUP_DIR" "$NAMESPACE/$POD_NAME:/tmp/restore"

echo "Restoring database..."
kubectl exec -n "$NAMESPACE" "$POD_NAME" -- mongorestore \
    --username="$MONGODB_USERNAME" \
    --password="$MONGODB_PASSWORD" \
    --authenticationDatabase=admin \
    --drop \
    /tmp/restore

echo "Cleaning up..."
kubectl exec -n "$NAMESPACE" "$POD_NAME" -- rm -rf /tmp/restore

echo "✅ Restore completed successfully"
