# Examination Management System - Kubernetes

## 📚 Tài liệu

Dự án này bao gồm cấu hình Kubernetes đầy đủ để triển khai hệ thống quản lý kỳ thi.

### Các file tài liệu:

1. **[QUICKSTART.md](./QUICKSTART.md)** - Hướng dẫn nhanh để deploy
2. **[README.md](./README.md)** - Hướng dẫn chi tiết đầy đủ
3. **[STRUCTURE.md](./STRUCTURE.md)** - Cấu trúc thư mục và giải thích
4. **[DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)** - Checklist production deployment

## 🏗️ Kiến trúc

```
┌─────────────┐
│   Users     │
└──────┬──────┘
       │
┌──────▼──────────────┐
│  Ingress (NGINX)    │
└──────┬──────────────┘
       │
   ┌───┴───┐
   │       │
┌──▼──┐ ┌──▼──────┐
│Frontend│Backend  │
│(React) │(Node.js)│
└────────┘└──┬──────┘
             │
        ┌────┼────┐
        │    │    │
     ┌──▼┐ ┌─▼──┐│
     │MongoDB│Redis││
     └────┘ └────┘│
                   │
            ┌──────▼──────┐
            │  Hyperledger│
            │   Fabric    │
            └─────────────┘
```

## 🚀 Quick Start

```bash
# 1. Build và push images
docker build -t your-registry.com/examination-backend:latest ./backend
docker build -t your-registry.com/examination-frontend:latest ./frontend
docker push your-registry.com/examination-backend:latest
docker push your-registry.com/examination-frontend:latest

# 2. Cập nhật secrets
./scripts/create-secrets.sh examination-system

# 3. Deploy
./scripts/deploy.sh prod

# 4. Kiểm tra status
kubectl get all -n examination-system
```

## 📦 Components

- **Backend**: Node.js + Express + TypeScript
- **Frontend**: React + Redux + Tailwind CSS
- **Database**: MongoDB 4.4
- **Cache**: Redis 7
- **Blockchain**: Hyperledger Fabric
- **Ingress**: NGINX Ingress Controller

## 🔧 Environment

- **Development**: Lower resources, 1 replica, debug mode
- **Production**: High availability, 3+ replicas, optimized

## 📄 License

[Apache-2.0](../LICENSE)
