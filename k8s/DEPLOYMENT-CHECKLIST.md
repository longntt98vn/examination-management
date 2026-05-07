# Production Deployment Checklist

## Pre-Deployment

### Infrastructure
- [ ] Kubernetes cluster is provisioned and accessible
- [ ] kubectl is configured with correct context
- [ ] Cluster has sufficient resources (CPU, Memory, Storage)
- [ ] StorageClass is configured for PersistentVolumes
- [ ] Network policies are in place (if required)

### Images
- [ ] Backend Docker image is built and pushed to registry
- [ ] Frontend Docker image is built and pushed to registry
- [ ] Image tags are updated in deployment files
- [ ] Images are scanned for vulnerabilities

### Configuration
- [ ] All secrets are updated with production values
- [ ] MongoDB username and password are set
- [ ] Redis password is set
- [ ] JWT secret is set (strong, random)
- [ ] Hyperledger Fabric certificates are configured
- [ ] API keys (ORG1, ORG2) are set
- [ ] Environment variables in ConfigMaps are correct
- [ ] Domain names in Ingress are correct

### Security
- [ ] Secrets are not committed to git (use `.gitignore`)
- [ ] RBAC roles and bindings are configured
- [ ] Network policies are defined (if applicable)
- [ ] Pod Security Policies are in place
- [ ] TLS certificates are configured for Ingress

### Networking
- [ ] Ingress Controller (NGINX) is installed
- [ ] DNS records point to LoadBalancer IP
- [ ] Firewall rules allow traffic to cluster
- [ ] SSL/TLS certificates are valid

### Monitoring & Logging
- [ ] Monitoring solution is set up (Prometheus/Grafana)
- [ ] Logging solution is configured (ELK/Loki)
- [ ] Alerts are configured for critical events
- [ ] Health check endpoints are working

## Deployment Steps

1. **Review Changes**
   ```bash
   kubectl kustomize k8s/overlays/prod
   ```

2. **Create Secrets**
   ```bash
   ./scripts/create-secrets.sh examination-system
   ```

3. **Deploy Applications**
   ```bash
   ./scripts/deploy.sh prod
   # OR
   make deploy-prod
   ```

4. **Verify Deployment**
   ```bash
   kubectl get all -n examination-system
   kubectl get pods -n examination-system -w
   ```

5. **Check Logs**
   ```bash
   kubectl logs -f deployment/prod-backend -n examination-system
   kubectl logs -f deployment/prod-frontend -n examination-system
   ```

6. **Test Applications**
   - [ ] Frontend is accessible via domain
   - [ ] Backend API endpoints are working
   - [ ] Authentication is working
   - [ ] Database connections are successful
   - [ ] WebSocket/Socket.IO is working
   - [ ] File uploads are working

## Post-Deployment

### Verification
- [ ] All pods are running and healthy
- [ ] Services are accessible
- [ ] Ingress is routing traffic correctly
- [ ] SSL/TLS certificates are valid
- [ ] Database migrations (if any) are completed
- [ ] Application health checks pass

### Performance
- [ ] Resource usage is within expected limits
- [ ] HPA is configured and working
- [ ] Response times are acceptable
- [ ] No memory leaks or CPU spikes

### Monitoring
- [ ] Metrics are being collected
- [ ] Dashboards are showing data
- [ ] Alerts are configured and tested
- [ ] Logs are being aggregated

### Backup
- [ ] Initial database backup is created
- [ ] Backup schedule is configured
- [ ] Backup restoration is tested

### Documentation
- [ ] Deployment notes are documented
- [ ] Any issues encountered are noted
- [ ] Runbook is updated
- [ ] Team is notified of deployment

## Rollback Plan

If something goes wrong:

```bash
# Rollback to previous version
kubectl rollout undo deployment/prod-backend -n examination-system
kubectl rollout undo deployment/prod-frontend -n examination-system

# Check rollout history
kubectl rollout history deployment/prod-backend -n examination-system

# Rollback to specific revision
kubectl rollout undo deployment/prod-backend --to-revision=2 -n examination-system
```

## Common Issues

### Pods Not Starting
- Check image pull errors: `kubectl describe pod <pod-name> -n examination-system`
- Verify secrets exist: `kubectl get secrets -n examination-system`
- Check resource limits: `kubectl describe node`

### Service Not Accessible
- Verify service exists: `kubectl get svc -n examination-system`
- Check endpoints: `kubectl get endpoints -n examination-system`
- Test from within cluster: `kubectl run -it --rm debug --image=busybox --restart=Never -- sh`

### Database Connection Failed
- Check MongoDB pod: `kubectl logs <mongodb-pod> -n examination-system`
- Verify credentials in secrets
- Test connection from backend pod

### Ingress Not Working
- Check ingress controller: `kubectl get pods -n ingress-nginx`
- Verify ingress resource: `kubectl describe ingress examination-ingress -n examination-system`
- Check DNS resolution

## Maintenance

### Regular Tasks
- [ ] Monitor resource usage weekly
- [ ] Review and rotate secrets monthly
- [ ] Update Docker images regularly
- [ ] Check for Kubernetes cluster updates
- [ ] Backup database weekly (minimum)
- [ ] Review logs for errors
- [ ] Test disaster recovery procedures quarterly

### Scaling
```bash
# Manual scaling
kubectl scale deployment prod-backend --replicas=5 -n examination-system

# Check HPA status
kubectl get hpa -n examination-system
```

### Updates
```bash
# Update to new version
kubectl set image deployment/prod-backend backend=<registry>/examination-backend:v2.0 -n examination-system

# Monitor rollout
kubectl rollout status deployment/prod-backend -n examination-system
```

## Emergency Contacts

- DevOps Team: [contact-info]
- Backend Team: [contact-info]
- Frontend Team: [contact-info]
- Infrastructure Team: [contact-info]

## Useful Resources

- Kubernetes Dashboard: [url]
- Monitoring Dashboard: [url]
- Logging Dashboard: [url]
- Documentation: [url]
