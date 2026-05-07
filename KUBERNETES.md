# 🚀 Hệ thống Quản lý Kỳ thi - Kubernetes Deployment

## 📋 Tổng quan

Dự án này bao gồm cấu hình Kubernetes hoàn chỉnh để triển khai Hệ thống Quản lý Kỳ thi với các thành phần:
- **Backend**: Node.js/TypeScript + Express + Socket.IO
- **Frontend**: React + Redux + Tailwind CSS
- **Database**: MongoDB + Redis
- **Blockchain**: Hyperledger Fabric

## 📦 Cấu trúc Dự án

```
examination-management/
├── backend/                    # Backend API (Node.js)
│   ├── src/                   
│   ├── Dockerfile             # ✨ NEW: Backend Docker image
│   └── .dockerignore          # ✨ NEW: Docker ignore rules
│
├── frontend/                   # Frontend Application (React)
│   ├── src/
│   ├── Dockerfile             # ✨ NEW: Frontend Docker image
│   ├── nginx.conf             # ✨ NEW: NGINX configuration
│   └── .dockerignore          # ✨ NEW: Docker ignore rules
│
├── chaincode/                  # Hyperledger Fabric chaincode
│
├── k8s/                        # ✨ NEW: Kubernetes configurations
│   ├── base/                  # Base configurations
│   │   ├── *-deployment.yaml  # Deployment files
│   │   ├── *-configmap.yaml   # ConfigMaps
│   │   ├── secrets.yaml       # Secrets
│   │   ├── ingress.yaml       # Ingress rules
│   │   ├── hpa.yaml           # Auto-scaling
│   │   └── ...                # More configs
│   │
│   ├── overlays/              # Environment-specific
│   │   ├── dev/              # Development
│   │   └── prod/             # Production
│   │
│   ├── README.md              # Full documentation
│   ├── QUICKSTART.md          # Quick start guide
│   ├── STRUCTURE.md           # Structure explanation
│   └── DEPLOYMENT-CHECKLIST.md # Deployment checklist
│
├── scripts/                    # ✨ NEW: Automation scripts
│   ├── deploy.sh              # Quick deployment
│   ├── create-secrets.sh      # Secrets creation
│   ├── backup-mongodb.sh      # DB backup
│   ├── restore-mongodb.sh     # DB restore
│   ├── health-check.sh        # Health check
│   └── generate-manifests.sh  # Generate manifests
│
├── Makefile                    # ✨ NEW: Build automation
└── K8S-SUMMARY.md             # ✨ NEW: This summary

✨ = Newly created for Kubernetes deployment
```

## 🚀 Quick Start

### Prerequisites
- Docker
- Kubernetes cluster (Minikube/GKE/EKS/AKS)
- kubectl
- Make (optional)

### Deploy trong 3 bước:

```bash
# 1. Build Docker images
cd backend && docker build -t your-registry.com/examination-backend:latest .
cd ../frontend && docker build -t your-registry.com/examination-frontend:latest .

# 2. Push to registry
docker push your-registry.com/examination-backend:latest
docker push your-registry.com/examination-frontend:latest

# 3. Deploy
./scripts/deploy.sh prod
```

Hoặc dùng Makefile:

```bash
make build push deploy-prod
```

## 📚 Documentation

| File | Mô tả |
|------|-------|
| [K8S-SUMMARY.md](./K8S-SUMMARY.md) | Tổng quan về Kubernetes setup |
| [k8s/QUICKSTART.md](./k8s/QUICKSTART.md) | Hướng dẫn nhanh |
| [k8s/README.md](./k8s/README.md) | Hướng dẫn chi tiết (20+ trang) |
| [k8s/STRUCTURE.md](./k8s/STRUCTURE.md) | Cấu trúc thư mục |
| [k8s/DEPLOYMENT-CHECKLIST.md](./k8s/DEPLOYMENT-CHECKLIST.md) | Production checklist |

## 🔧 Common Commands

### Using Makefile
```bash
make help                 # Show all available commands
make deploy-dev          # Deploy to development
make deploy-prod         # Deploy to production
make status-dev          # Check dev status
make logs-prod           # View production logs
make port-forward-dev    # Port forward dev services
make clean-dev           # Clean dev environment
```

### Using Scripts
```bash
./scripts/deploy.sh dev              # Deploy to dev
./scripts/health-check.sh            # Check system health
./scripts/create-secrets.sh          # Create secrets
./scripts/backup-mongodb.sh          # Backup database
./scripts/generate-manifests.sh dev  # Generate manifests
```

### Using kubectl directly
```bash
# Deploy
kubectl apply -k k8s/overlays/prod

# Check status
kubectl get all -n examination-system

# View logs
kubectl logs -f deployment/prod-backend -n examination-system

# Port forward
kubectl port-forward svc/backend 3000:3000 -n examination-system
```

## 🏗️ Architecture

```
Internet
   │
   ▼
┌─────────────────┐
│ Ingress (NGINX) │
│  - SSL/TLS      │
│  - Routing      │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼────┐
│Frontend│Backend │
│ React │Node.js │
│ x3    │  x3    │
└──────┘└───┬────┘
            │
      ┌─────┼─────┐
      │     │     │
   ┌──▼─┐┌─▼──┐┌─▼──────┐
   │Redis││Mongo││Fabric  │
   │Cache││ DB  ││Blockchain│
   └─────┘└────┘└────────┘
```

## 🎯 Features

### ✅ High Availability
- Multiple replicas per service
- Pod Disruption Budgets
- Health checks (liveness/readiness)
- Rolling updates

### ✅ Auto-Scaling
- Horizontal Pod Autoscaler (HPA)
- CPU and memory-based scaling
- Custom metrics support

### ✅ Security
- Secrets management
- RBAC configuration
- SSL/TLS support
- Non-root containers
- Network isolation

### ✅ Monitoring & Logging
- Health check endpoints
- Resource monitoring
- Centralized logging support
- Event tracking

### ✅ DevOps
- Multi-environment support (dev/prod)
- Automated deployment scripts
- Backup and restore procedures
- Makefile for common tasks

## 🔐 Security Checklist

Trước khi deploy production:

- [ ] Thay đổi tất cả passwords trong `k8s/base/secrets.yaml`
- [ ] Update JWT secret key
- [ ] Configure SSL/TLS certificates
- [ ] Setup firewall rules
- [ ] Enable RBAC
- [ ] Scan Docker images cho vulnerabilities
- [ ] Setup secrets management (Sealed Secrets/Vault)

## 📊 Resource Requirements

### Development
- **Minimum**: 4 CPU, 8GB RAM
- **Recommended**: 6 CPU, 12GB RAM

### Production
- **Minimum**: 8 CPU, 16GB RAM, 100GB Storage
- **Recommended**: 16+ CPU, 32GB+ RAM, 500GB+ Storage

## 🌐 Environments

### Development
- Namespace: `examination-system-dev`
- Replicas: 1 per service
- Resources: Lower limits
- Logging: Debug mode

### Production
- Namespace: `examination-system`
- Replicas: 3+ per service
- Resources: Higher limits
- Logging: Info mode
- Auto-scaling: Enabled

## 📞 Support

### Common Issues

**Pods not starting?**
```bash
kubectl describe pod <pod-name> -n examination-system
kubectl logs <pod-name> -n examination-system
```

**Service not accessible?**
```bash
kubectl get svc -n examination-system
kubectl get endpoints -n examination-system
```

**Database connection failed?**
```bash
kubectl logs deployment/prod-backend -n examination-system
kubectl exec -it <mongodb-pod> -n examination-system -- mongo
```

### Resources
- 📖 Full documentation: `k8s/README.md`
- 🐛 Troubleshooting guide: `k8s/README.md#troubleshooting`
- ✅ Deployment checklist: `k8s/DEPLOYMENT-CHECKLIST.md`

## 🤝 Contributing

1. Review documentation in `k8s/`
2. Test changes in dev environment first
3. Follow Kubernetes best practices
4. Update documentation if needed

## 📄 License

Apache-2.0

---

**Ready to deploy? Start with `k8s/QUICKSTART.md` 🚀**
