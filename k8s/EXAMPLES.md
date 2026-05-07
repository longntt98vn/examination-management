# Kubernetes Examples and Tips

## 🎯 Common Use Cases

### 1. Scale Services Manually

```bash
# Scale backend to 5 replicas
kubectl scale deployment prod-backend --replicas=5 -n examination-system

# Scale multiple deployments
kubectl scale deployment prod-backend prod-frontend --replicas=3 -n examination-system

# Verify scaling
kubectl get pods -n examination-system -w
```

### 2. Update to New Version

```bash
# Update backend image
kubectl set image deployment/prod-backend \
  backend=your-registry.com/examination-backend:v2.0 \
  -n examination-system

# Monitor rollout
kubectl rollout status deployment/prod-backend -n examination-system

# Check rollout history
kubectl rollout history deployment/prod-backend -n examination-system

# Rollback if needed
kubectl rollout undo deployment/prod-backend -n examination-system
```

### 3. Debug Pod Issues

```bash
# Get pod details
kubectl describe pod <pod-name> -n examination-system

# View logs (live)
kubectl logs -f <pod-name> -n examination-system

# View logs from previous container (if crashed)
kubectl logs <pod-name> --previous -n examination-system

# Exec into pod
kubectl exec -it <pod-name> -n examination-system -- sh

# Copy files from pod
kubectl cp examination-system/<pod-name>:/app/logs ./logs

# Copy files to pod
kubectl cp ./config.json examination-system/<pod-name>:/app/config.json
```

### 4. Test Network Connectivity

```bash
# Run a debug pod
kubectl run -it --rm debug --image=busybox --restart=Never -n examination-system -- sh

# Inside the debug pod:
# Test service connectivity
wget -O- http://backend:3000/health
nslookup backend
nslookup mongodb

# Test external connectivity
wget -O- https://google.com
```

### 5. Backup and Restore Database

```bash
# Backup
./scripts/backup-mongodb.sh examination-system

# List backups
ls -lh backups/

# Restore from backup
./scripts/restore-mongodb.sh examination-system ./backups/mongodb-20260430-120000
```

### 6. Update Secrets Without Downtime

```bash
# Update secret
kubectl create secret generic backend-secret \
  --from-literal=JWT_SECRET="new-secret" \
  --dry-run=client -o yaml | kubectl apply -f - -n examination-system

# Restart pods to pick up new secret
kubectl rollout restart deployment/prod-backend -n examination-system
```

### 7. Port Forward Multiple Services

```bash
# Single terminal with multiple port forwards
kubectl port-forward svc/backend 3000:3000 -n examination-system &
kubectl port-forward svc/frontend 8080:80 -n examination-system &
kubectl port-forward svc/mongodb 27017:27017 -n examination-system &

# Kill all background port forwards
killall kubectl
```

### 8. Monitor Resource Usage

```bash
# Real-time resource usage
watch kubectl top pods -n examination-system

# Node resource usage
kubectl top nodes

# Check HPA status
watch kubectl get hpa -n examination-system

# Detailed HPA info
kubectl describe hpa backend-hpa -n examination-system
```

### 9. View and Filter Events

```bash
# Recent events
kubectl get events -n examination-system --sort-by='.lastTimestamp'

# Only warnings and errors
kubectl get events -n examination-system --field-selector type=Warning

# Events for specific pod
kubectl get events -n examination-system --field-selector involvedObject.name=<pod-name>
```

### 10. Cleanup Resources

```bash
# Delete specific deployment
kubectl delete deployment backend -n examination-system

# Delete all resources with label
kubectl delete all -l app=backend -n examination-system

# Delete completed pods
kubectl delete pod --field-selector=status.phase==Succeeded -n examination-system

# Delete failed pods
kubectl delete pod --field-selector=status.phase==Failed -n examination-system
```

## 💡 Pro Tips

### Tip 1: Use kubectl aliases
```bash
# Add to ~/.bashrc or ~/.zshrc
alias k='kubectl'
alias kgp='kubectl get pods'
alias kgs='kubectl get svc'
alias kgd='kubectl get deployments'
alias kl='kubectl logs -f'
alias kd='kubectl describe'
alias ke='kubectl exec -it'

# Usage
k get pods -n examination-system
kl deployment/prod-backend -n examination-system
```

### Tip 2: Set default namespace
```bash
# Set default namespace
kubectl config set-context --current --namespace=examination-system

# Now you can omit -n flag
kubectl get pods
kubectl logs -f deployment/prod-backend
```

### Tip 3: Use kubectl contexts
```bash
# Create context for dev
kubectl config set-context dev --cluster=my-cluster --namespace=examination-system-dev

# Create context for prod
kubectl config set-context prod --cluster=my-cluster --namespace=examination-system

# Switch contexts
kubectl config use-context dev
kubectl config use-context prod

# Current context
kubectl config current-context
```

### Tip 4: Watch resources in real-time
```bash
# Watch pods
kubectl get pods -n examination-system -w

# Watch with timestamps
kubectl get pods -n examination-system -w --output-watch-events

# Watch multiple resources
watch -n 2 'kubectl get pods,svc,deploy -n examination-system'
```

### Tip 5: Use JSON/YAML output for scripting
```bash
# Get pod names
kubectl get pods -n examination-system -o jsonpath='{.items[*].metadata.name}'

# Get backend pod name
BACKEND_POD=$(kubectl get pod -l app=backend -n examination-system -o jsonpath='{.items[0].metadata.name}')
kubectl logs $BACKEND_POD -n examination-system

# Get all container images
kubectl get pods -n examination-system -o jsonpath='{.items[*].spec.containers[*].image}' | tr -s '[[:space:]]' '\n'
```

### Tip 6: Dry-run before apply
```bash
# See what would be created
kubectl apply -k k8s/overlays/prod --dry-run=client

# Server-side dry run (validates with API server)
kubectl apply -k k8s/overlays/prod --dry-run=server

# Generate YAML without applying
kubectl kustomize k8s/overlays/prod > preview.yaml
```

### Tip 7: Use labels for organization
```bash
# Get pods with specific label
kubectl get pods -l app=backend -n examination-system

# Get all resources with label
kubectl get all -l environment=production -n examination-system

# Add label to existing resource
kubectl label pod <pod-name> version=v2 -n examination-system

# Remove label
kubectl label pod <pod-name> version- -n examination-system
```

### Tip 8: Quick pod restart
```bash
# Delete pod (will be recreated by deployment)
kubectl delete pod <pod-name> -n examination-system

# Or use rollout restart
kubectl rollout restart deployment/prod-backend -n examination-system

# Restart all deployments
kubectl rollout restart deployment -n examination-system
```

### Tip 9: Export resources for backup
```bash
# Export all resources
kubectl get all -n examination-system -o yaml > backup-all.yaml

# Export specific resources
kubectl get deployment,svc,configmap,secret -n examination-system -o yaml > backup.yaml

# Export single resource
kubectl get deployment prod-backend -n examination-system -o yaml > backend-deployment.yaml
```

### Tip 10: Use stern for multi-pod logs
```bash
# Install stern
brew install stern  # macOS
# or download from https://github.com/stern/stern

# View logs from all backend pods
stern backend -n examination-system

# View logs with specific pattern
stern "prod-.*" -n examination-system

# Follow logs from multiple containers
stern --all-namespaces -l app=backend
```

## 🔍 Debugging Scenarios

### Scenario 1: Pod is CrashLoopBackOff
```bash
# Check why pod is crashing
kubectl describe pod <pod-name> -n examination-system
kubectl logs <pod-name> --previous -n examination-system

# Common causes:
# - Missing environment variables
# - Wrong secrets
# - Application error on startup
# - Health check failing too early

# Fix: Check secrets, configmaps, increase initialDelaySeconds
```

### Scenario 2: Service cannot connect to database
```bash
# Verify MongoDB is running
kubectl get pods -l app=mongodb -n examination-system

# Check service
kubectl get svc mongodb -n examination-system

# Check endpoints
kubectl get endpoints mongodb -n examination-system

# Test connection from backend pod
kubectl exec -it <backend-pod> -n examination-system -- sh
nc -zv mongodb 27017

# Check environment variables
kubectl exec <backend-pod> -n examination-system -- env | grep MONGO
```

### Scenario 3: High memory usage
```bash
# Check current usage
kubectl top pods -n examination-system

# Identify memory-intensive pod
kubectl describe pod <pod-name> -n examination-system | grep -A 5 "Memory"

# Check if hitting limits
kubectl get pods -n examination-system -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.spec.containers[*].resources.limits.memory}{"\n"}{end}'

# Fix: Increase memory limits or optimize application
```

### Scenario 4: Ingress not routing traffic
```bash
# Check ingress
kubectl get ingress -n examination-system
kubectl describe ingress examination-ingress -n examination-system

# Check ingress controller
kubectl get pods -n ingress-nginx
kubectl logs -f <ingress-controller-pod> -n ingress-nginx

# Verify DNS
nslookup examination.local

# Test service directly
kubectl port-forward svc/backend 3000:3000 -n examination-system
curl http://localhost:3000/health
```

### Scenario 5: Persistent volume issues
```bash
# Check PVC status
kubectl get pvc -n examination-system

# Describe PVC
kubectl describe pvc mongodb-pvc -n examination-system

# Check PV
kubectl get pv

# If PVC is pending:
# - Check if StorageClass exists
# - Verify cluster has available storage
# - Check PVC and PV capacity match
```

## 📊 Performance Optimization

### 1. Optimize resource requests/limits
```yaml
resources:
  requests:
    memory: "512Mi"  # Actual memory needed
    cpu: "250m"      # Actual CPU needed
  limits:
    memory: "1Gi"    # Max memory (2x requests)
    cpu: "500m"      # Max CPU (2x requests)
```

### 2. Configure HPA properly
```yaml
minReplicas: 2      # Always have at least 2
maxReplicas: 10     # Scale up to 10
targetCPUUtilization: 70  # Scale at 70% CPU
```

### 3. Use readiness probes correctly
```yaml
readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 10  # Wait for app to start
  periodSeconds: 5         # Check every 5s
  failureThreshold: 3      # Mark unready after 3 failures
```

### 4. Optimize Docker images
- Use multi-stage builds
- Minimize layers
- Use .dockerignore
- Use alpine images when possible
- Don't run as root

### 5. Enable caching
- Use Redis for application cache
- Use CDN for static assets
- Configure browser caching in NGINX

---

**Happy Kubernetes-ing! 🚀**
