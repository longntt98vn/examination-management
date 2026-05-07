# Kubernetes Quick Start Guide

## 🚀 Cách nhanh nhất để deploy

### 1. Deploy Development Environment

```bash
# Sử dụng script
./scripts/deploy.sh dev

# Hoặc sử dụng Makefile
make deploy-dev
```

### 2. Deploy Production Environment

```bash
# Sử dụng script
./scripts/deploy.sh prod

# Hoặc sử dụng Makefile
make deploy-prod
```

## 📋 Checklist trước khi deploy

- [ ] Đã cài đặt kubectl
- [ ] Đã có Kubernetes cluster đang chạy
- [ ] Đã build và push Docker images
- [ ] Đã cập nhật secrets trong `k8s/base/secrets.yaml`
- [ ] Đã cấu hình Ingress Controller (NGINX)

## 🔧 Common Commands

```bash
# Xem status
make status-dev          # Development
make status-prod         # Production

# Xem logs
make logs-dev            # Development logs
make logs-prod           # Production logs

# Port forwarding (Development)
make port-forward-dev

# Restart deployments
make restart-dev
make restart-prod

# Clean up
make clean-dev
make clean-prod
```

## 📚 Chi tiết đầy đủ

Xem file [README.md](./README.md) để có hướng dẫn chi tiết đầy đủ.

## 🆘 Troubleshooting nhanh

```bash
# Kiểm tra pods
kubectl get pods -n examination-system

# Xem logs của pod lỗi
kubectl logs <pod-name> -n examination-system

# Describe pod để xem chi tiết lỗi
kubectl describe pod <pod-name> -n examination-system

# Restart deployment
kubectl rollout restart deployment/backend -n examination-system
```
