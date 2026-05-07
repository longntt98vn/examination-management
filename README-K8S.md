# 🎓 Examination Management System - Kubernetes Edition

[![Kubernetes](https://img.shields.io/badge/kubernetes-v1.20+-blue.svg)](https://kubernetes.io/)
[![License](https://img.shields.io/badge/license-Apache--2.0-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://docker.com/)

**Production-ready Kubernetes configuration cho hệ thống Quản lý Kỳ thi**

---

## 📋 Tổng quan

Dự án này cung cấp **cấu hình Kubernetes hoàn chỉnh** để triển khai Hệ thống Quản lý Kỳ thi với đầy đủ tính năng production-ready:

- ✅ High Availability (HA)
- ✅ Auto-scaling (HPA)
- ✅ Multi-environment (dev/prod)
- ✅ Security best practices
- ✅ Monitoring & Logging
- ✅ Backup & Restore
- ✅ Complete documentation

---

## 🏗️ Architecture

```
                    Internet
                       │
                       ▼
            ┌──────────────────────┐
            │  Ingress Controller  │
            │    (NGINX + SSL)     │
            └──────────┬───────────┘
                       │
         ┌─────────────┼─────────────┐
         │                           │
    ┌────▼─────┐               ┌────▼─────┐
    │ Frontend │               │ Backend  │
    │  React   │               │ Node.js  │
    │  x3      │               │  x3      │
    └──────────┘               └────┬─────┘
                                    │
                         ┌──────────┼──────────┐
                         │          │          │
                    ┌────▼───┐ ┌───▼────┐ ┌──▼────────┐
                    │ MongoDB│ │ Redis  │ │Hyperledger│
                    │   DB   │ │ Cache  │ │  Fabric   │
                    └────────┘ └────────┘ └───────────┘
```

---

## 🚀 Quick Start

### Cách nhanh nhất (Interactive Wizard):

```bash
./scripts/setup-complete.sh
```

### Hoặc sử dụng Makefile:

```bash
# Xem tất cả commands
make help

# Deploy development
make deploy-dev

# Deploy production
make deploy-prod

# Check status
make status-dev
```

### Hoặc manual steps:

```bash
# 1. Build và push images
docker build -t registry.io/examination-backend:latest ./backend
docker build -t registry.io/examination-frontend:latest ./frontend
docker push registry.io/examination-backend:latest
docker push registry.io/examination-frontend:latest

# 2. Create secrets
./scripts/create-secrets.sh examination-system

# 3. Deploy
kubectl apply -k k8s/overlays/prod
```

---

## 📦 Những gì có sẵn

### Kubernetes Configurations (20 YAML files, 2,271 lines)

**Core Services:**
- MongoDB deployment với persistent storage (10GB)
- Redis deployment cho caching
- Backend API deployment (Node.js/Express)
- Frontend deployment (React/NGINX)

**Advanced Features:**
- Horizontal Pod Autoscaler (HPA) - Auto-scaling
- Pod Disruption Budget (PDB) - High availability
- Ingress với SSL/TLS support
- ConfigMaps cho environment variables
- Secrets management
- RBAC configuration
- Resource quotas & limits
- Logging configuration

### Documentation (8 files, 46KB total)

| File | Size | Description |
|------|------|-------------|
| **START-HERE.md** | 4.8KB | 👈 BẮT ĐẦU TẠI ĐÂY |
| **GUIDE-INDEX.md** | 7.1KB | Master index & navigation |
| **QUICKSTART.md** | 1.5KB | Quick deploy guide |
| **README.md** | 12KB | Complete documentation |
| **EXAMPLES.md** | 10KB | Tips, tricks & debugging |
| **DEPLOYMENT-CHECKLIST.md** | 5.5KB | Production checklist |
| **INDEX.md** | 2.4KB | Overview & architecture |
| **STRUCTURE.md** | 2.7KB | Directory structure |

### Automation Scripts (7 scripts, 21KB total)

| Script | Size | Purpose |
|--------|------|---------|
| **setup-complete.sh** | 6.7KB | Complete setup wizard |
| **deploy.sh** | 3.0KB | Quick deployment |
| **health-check.sh** | 3.3KB | System health check |
| **create-secrets.sh** | 1.9KB | Secrets creation |
| **backup-mongodb.sh** | 1.2KB | DB backup |
| **restore-mongodb.sh** | 1.4KB | DB restore |
| **generate-manifests.sh** | 1.4KB | Generate K8s manifests |

### Build Automation

**Makefile** với 26 commands:
- Setup & configuration
- Build & deployment
- Status & monitoring
- Operations & maintenance
- Cleanup

---

## 📚 Documentation Guide

### 🆕 Người mới bắt đầu

1. **[k8s/START-HERE.md](k8s/START-HERE.md)** ← BẮT ĐẦU TẠI ĐÂY
2. **[k8s/GUIDE-INDEX.md](k8s/GUIDE-INDEX.md)** - Navigation guide
3. **[k8s/QUICKSTART.md](k8s/QUICKSTART.md)** - Quick deploy
4. **[k8s/README.md](k8s/README.md)** - Complete guide

### 🎯 Đã có kinh nghiệm

1. **[k8s/QUICKSTART.md](k8s/QUICKSTART.md)** - Commands
2. **[k8s/DEPLOYMENT-CHECKLIST.md](k8s/DEPLOYMENT-CHECKLIST.md)** - Production checklist
3. **[k8s/EXAMPLES.md](k8s/EXAMPLES.md)** - Advanced usage

### 🐛 Troubleshooting

1. **[k8s/README.md](k8s/README.md)** → Troubleshooting section
2. **[k8s/EXAMPLES.md](k8s/EXAMPLES.md)** → Debugging scenarios

---

## 🎯 Features

### ✅ High Availability
- Multiple replicas per service (3+ in production)
- Pod Disruption Budgets
- Health checks (liveness + readiness)
- Rolling updates with zero downtime

### ✅ Auto-Scaling
- Horizontal Pod Autoscaler
- CPU and memory-based scaling
- Configurable min/max replicas
- Scale-down stabilization

### ✅ Security
- Secrets management
- RBAC configuration
- Non-root containers
- SSL/TLS support
- Resource quotas & limits
- Network isolation

### ✅ DevOps
- Multi-environment (dev/prod)
- Infrastructure as Code
- Automated deployment
- Backup & restore procedures
- Health monitoring
- Complete automation

### ✅ Monitoring & Logging
- Health check endpoints
- Resource monitoring
- Centralized logging support
- Event tracking
- Comprehensive health checks

---

## 💻 Requirements

### Software
- **Kubernetes** v1.20+ (Minikube, GKE, EKS, AKS)
- **kubectl** v1.20+
- **Docker** v20.10+
- **Make** (optional, for automation)

### Resources
- **Development**: 4 CPU, 8GB RAM
- **Production**: 8+ CPU, 16GB+ RAM, 100GB+ Storage

---

## 🔧 Environment Support

### Development
- **Namespace**: `examination-system-dev`
- **Replicas**: 1 per service
- **Resources**: Lower limits
- **Logging**: Debug mode
- **Purpose**: Local testing

### Production
- **Namespace**: `examination-system`
- **Replicas**: 3+ per service
- **Resources**: Higher limits
- **Logging**: Info mode
- **Purpose**: Production deployment
- **Auto-scaling**: Enabled
- **SSL/TLS**: Configured

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| **Total Files Created** | 40+ |
| **YAML Configurations** | 20 files, 2,271 lines |
| **Documentation** | 8 files, 46KB |
| **Automation Scripts** | 7 scripts, 21KB |
| **Makefile Commands** | 26 commands |
| **Total Documentation** | ~2,500 lines |
| **Time Saved** | Hours of manual work |

---

## 🛠️ Common Commands

```bash
# Setup
./scripts/setup-complete.sh        # Interactive wizard
make setup                         # Same as above

# Deploy
make deploy-dev                    # Development
make deploy-prod                   # Production

# Monitor
make status-dev                    # Check dev status
make status-prod                   # Check prod status
make logs-dev                      # View dev logs
make logs-prod                     # View prod logs
make health-check-dev              # Health check

# Operations
make port-forward-dev              # Access services locally
make restart-dev                   # Restart deployments
make db-backup                     # Backup database
make db-restore                    # Restore database

# Cleanup
make clean-dev                     # Clean dev environment
make clean-prod                    # Clean prod environment

# Help
make help                          # Show all commands
```

---

## ⚠️ Important Notes

### Before Production Deployment:

1. **Update Secrets** (CRITICAL!)
   ```bash
   # Edit k8s/base/secrets.yaml
   # Change ALL passwords, JWT secret, API keys
   ```

2. **Update Image References**
   ```bash
   # Edit k8s/base/backend-deployment.yaml
   # Edit k8s/base/frontend-deployment.yaml
   # Replace with your registry URL
   ```

3. **Update Domain Names**
   ```bash
   # Edit k8s/base/ingress.yaml
   # Replace examination.local with your domain
   ```

4. **Review Checklist**
   - Read `k8s/DEPLOYMENT-CHECKLIST.md`
   - Complete all pre-deployment tasks

---

## 🎓 Learning Path

### Beginner (2-3 hours)
1. Read START-HERE.md
2. Read GUIDE-INDEX.md
3. Deploy to dev
4. Explore resources

### Intermediate (4-6 hours)
1. Complete beginner
2. Study YAML configs
3. Read EXAMPLES.md
4. Practice scenarios

### Advanced (1-2 days)
1. Complete intermediate
2. Read full README.md
3. Plan production
4. Deploy production
5. Setup monitoring

---

## 🆘 Support

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

**Database issues?**
```bash
kubectl logs deployment/mongodb -n examination-system
./scripts/health-check.sh examination-system
```

### Resources
- Complete troubleshooting: `k8s/README.md`
- Debug scenarios: `k8s/EXAMPLES.md`
- Production checklist: `k8s/DEPLOYMENT-CHECKLIST.md`

---

## 🤝 Contributing

1. Review documentation in `k8s/`
2. Test changes in dev environment
3. Follow Kubernetes best practices
4. Update documentation

---

## 📄 License

Apache-2.0

---

## 🎉 Ready to Deploy?

### Fastest Path:
```bash
./scripts/setup-complete.sh
```

### Learn First:
Start with **[k8s/START-HERE.md](k8s/START-HERE.md)**

### Production:
Review **[k8s/DEPLOYMENT-CHECKLIST.md](k8s/DEPLOYMENT-CHECKLIST.md)**

---

**Chúc bạn triển khai thành công! 🚀**

*Powered by Kubernetes ☸️*
