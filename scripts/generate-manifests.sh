#!/bin/bash
# Script to generate Kubernetes manifests from kustomize

set -e

OVERLAY="${1:-dev}"

if [ "$OVERLAY" != "dev" ] && [ "$OVERLAY" != "prod" ]; then
    echo "Usage: $0 [dev|prod]"
    exit 1
fi

OUTPUT_DIR="./generated-manifests/$OVERLAY"
mkdir -p "$OUTPUT_DIR"

echo "Generating Kubernetes manifests for $OVERLAY environment..."
echo "Output directory: $OUTPUT_DIR"
echo ""

# Generate manifests
kubectl kustomize "k8s/overlays/$OVERLAY" > "$OUTPUT_DIR/all-resources.yaml"

# Split into separate files
cd "$OUTPUT_DIR"

# Use csplit to split the file by document separator (---)
csplit -s -f resource- all-resources.yaml '/^---$/' '{*}' 2>/dev/null || true

# Rename files based on their content
for file in resource-*; do
    if [ -f "$file" ] && [ -s "$file" ]; then
        # Get kind and name from the file
        KIND=$(grep "^kind:" "$file" | head -1 | awk '{print $2}' | tr '[:upper:]' '[:lower:]')
        NAME=$(grep "^  name:" "$file" | head -1 | awk '{print $2}')
        
        if [ -n "$KIND" ] && [ -n "$NAME" ]; then
            NEW_NAME="${KIND}-${NAME}.yaml"
            mv "$file" "$NEW_NAME"
            echo "Generated: $NEW_NAME"
        else
            rm "$file"
        fi
    else
        rm -f "$file"
    fi
done

cd - > /dev/null

echo ""
echo "✅ Manifests generated successfully!"
echo "Location: $OUTPUT_DIR"
echo ""
echo "To apply these manifests:"
echo "  kubectl apply -f $OUTPUT_DIR/"
