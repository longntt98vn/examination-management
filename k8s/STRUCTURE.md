# Kubernetes Configuration Structure

```
k8s/
├── base/                           # Base configurations (shared)
│   ├── namespace.yaml              # Namespace definition
│   ├── mongodb-pvc.yaml            # MongoDB persistent volume claim
│   ├── mongodb-deployment.yaml     # MongoDB deployment & service
│   ├── redis-deployment.yaml       # Redis deployment & service
│   ├── backend-configmap.yaml      # Backend configuration
│   ├── backend-deployment.yaml     # Backend deployment & service
│   ├── frontend-configmap.yaml     # Frontend configuration
│   ├── frontend-deployment.yaml    # Frontend deployment & service
│   ├── secrets.yaml                # Secrets (passwords, keys)
│   ├── ingress.yaml                # Ingress rules
│   ├── hpa.yaml                    # Horizontal Pod Autoscaler
│   ├── pdb.yaml                    # Pod Disruption Budget
│   ├── resource-quota.yaml         # Resource quotas & limits
│   ├── rbac.yaml                   # RBAC roles & bindings
│   ├── logging-config.yaml         # Logging configuration
│   └── kustomization.yaml          # Kustomize base config
│
├── overlays/                       # Environment-specific configs
│   ├── dev/                        # Development environment
│   │   ├── deployment-patches.yaml # Dev-specific patches
│   │   └── kustomization.yaml      # Dev kustomization
│   │
│   └── prod/                       # Production environment
│       ├── deployment-patches.yaml # Prod-specific patches
│       └── kustomization.yaml      # Prod kustomization
│
├── README.md                       # Full documentation
├── QUICKSTART.md                   # Quick start guide
└── STRUCTURE.md                    # This file

## Components Explained

### Core Services
- **Backend**: Node.js/TypeScript API server with Express
- **Frontend**: React application served by NGINX
- **MongoDB**: Database for storing application data
- **Redis**: Cache and message broker for Socket.IO

### Supporting Resources
- **Ingress**: Routes external traffic to services
- **HPA**: Auto-scales pods based on CPU/memory usage
- **PDB**: Ensures minimum number of pods during maintenance
- **Resource Quota**: Limits resource usage per namespace
- **RBAC**: Role-based access control for security

## Environment Differences

### Development (dev)
- 1 replica per service
- Lower resource limits
- Debug logging enabled
- Local/minikube deployment

### Production (prod)
- 3+ replicas per service
- Higher resource limits
- Info-level logging
- Production-grade configuration
- SSL/TLS enabled
```
