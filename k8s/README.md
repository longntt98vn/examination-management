# Kubernetes Deployment Guide
# Hướng dẫn triển khai Kubernetes cho Hệ thống Quản lý Kỳ thi

## Mục lục
1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị môi trường](#chuẩn-bị-môi-trường)
3. [Build Docker Images](#build-docker-images)
4. [Triển khai trên Kubernetes](#triển-khai-trên-kubernetes)
5. [Cấu hình và Quản lý](#cấu-hình-và-quản-lý)
6. [Monitoring và Logging](#monitoring-và-logging)
7. [Troubleshooting](#troubleshooting)

---

## Yêu cầu hệ thống

### Phần mềm cần thiết:
- **Kubernetes cluster** (v1.20+)
  - Minikube (cho môi trường local)
  - GKE, EKS, AKS (cho production)
  - hoặc self-managed cluster
- **kubectl** (v1.20+)
- **Docker** (v20.10+)
- **Kustomize** (v4.0+) - tích hợp sẵn trong kubectl
- **Helm** (v3.0+) - optional, cho ingress-nginx

### Resources tối thiểu:
- **Development**: 4 CPU, 8GB RAM
- **Production**: 8+ CPU, 16GB+ RAM, storage tùy theo nhu cầu

---

## Chuẩn bị môi trường

### 1. Cài đặt kubectl
```bash
# macOS
brew install kubectl

# Linux
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
```

### 2. Cài đặt Minikube (cho môi trường local)
```bash
# macOS
brew install minikube

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Khởi động Minikube
minikube start --cpus=4 --memory=8192 --driver=docker
```

### 3. Cài đặt Ingress Controller (NGINX)
```bash
# Sử dụng Helm
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer

# Hoặc dùng kubectl
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
```

### 4. Cài đặt Cert-Manager (cho SSL/TLS)
```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

---

## Build Docker Images

### 1. Build Backend Image
```bash
cd backend
docker build -t examination-backend:latest .
docker tag examination-backend:latest your-registry.com/examination-backend:latest
docker push your-registry.com/examination-backend:latest
```

### 2. Build Frontend Image
```bash
cd frontend
docker build -t examination-frontend:latest .
docker tag examination-frontend:latest your-registry.com/examination-frontend:latest
docker push your-registry.com/examination-frontend:latest
```

### 3. Cập nhật image trong deployment files
Sửa file `k8s/base/backend-deployment.yaml` và `k8s/base/frontend-deployment.yaml`:
```yaml
image: your-registry.com/examination-backend:latest
# hoặc
image: your-registry.com/examination-frontend:latest
```

---

## Triển khai trên Kubernetes

### 1. Cấu hình Secrets (QUAN TRỌNG!)
Trước khi deploy, cập nhật secrets trong `k8s/base/secrets.yaml`:

```bash
# Tạo base64 encoded strings cho sensitive data
echo -n "your-mongodb-password" | base64
echo -n "your-redis-password" | base64
echo -n "your-jwt-secret" | base64
```

Sửa file `k8s/base/secrets.yaml` với các giá trị thực tế.

### 2. Deploy Development Environment
```bash
# Xem trước các resources sẽ được tạo
kubectl kustomize k8s/overlays/dev

# Deploy
kubectl apply -k k8s/overlays/dev

# Kiểm tra status
kubectl get all -n examination-system-dev
kubectl get pods -n examination-system-dev -w
```

### 3. Deploy Production Environment
```bash
# Xem trước
kubectl kustomize k8s/overlays/prod

# Deploy
kubectl apply -k k8s/overlays/prod

# Kiểm tra status
kubectl get all -n examination-system
kubectl get pods -n examination-system -w
```

### 4. Deploy Base (không có overlay)
```bash
kubectl apply -k k8s/base
```

---

## Cấu hình và Quản lý

### 1. Cấu hình Domain/DNS
Thêm vào `/etc/hosts` (cho môi trường local):
```bash
# Lấy IP của Minikube
minikube ip

# Thêm vào /etc/hosts
<MINIKUBE_IP> examination.local
<MINIKUBE_IP> api.examination.local
```

Hoặc cho production, cấu hình DNS records trỏ về LoadBalancer IP:
```bash
# Lấy External IP của Ingress
kubectl get svc -n ingress-nginx
```

### 2. Cấu hình SSL/TLS với Let's Encrypt
Tạo ClusterIssuer:
```bash
cat <<EOF | kubectl apply -f -
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 3. Scaling Applications
```bash
# Manual scaling
kubectl scale deployment backend -n examination-system --replicas=5
kubectl scale deployment frontend -n examination-system --replicas=3

# Kiểm tra HPA status
kubectl get hpa -n examination-system
kubectl describe hpa backend-hpa -n examination-system
```

### 4. Update Deployments
```bash
# Update image version
kubectl set image deployment/backend backend=examination-backend:v2.0 -n examination-system

# Rollout status
kubectl rollout status deployment/backend -n examination-system

# Rollback nếu có lỗi
kubectl rollout undo deployment/backend -n examination-system
```

### 5. Quản lý Secrets và ConfigMaps
```bash
# View ConfigMaps
kubectl get configmap -n examination-system
kubectl describe configmap backend-config -n examination-system

# Update ConfigMap
kubectl edit configmap backend-config -n examination-system

# Restart pods để áp dụng thay đổi
kubectl rollout restart deployment/backend -n examination-system

# View Secrets (decoded)
kubectl get secret backend-secret -n examination-system -o jsonpath='{.data.JWT_SECRET}' | base64 -d
```

---

## Monitoring và Logging

### 1. Xem Logs
```bash
# Logs của một pod
kubectl logs -f <pod-name> -n examination-system

# Logs của deployment
kubectl logs -f deployment/backend -n examination-system

# Logs từ tất cả containers
kubectl logs -f deployment/backend --all-containers=true -n examination-system

# Logs trước khi pod bị restart
kubectl logs <pod-name> -n examination-system --previous
```

### 2. Monitoring với kubectl
```bash
# Resource usage
kubectl top nodes
kubectl top pods -n examination-system

# Pod details
kubectl describe pod <pod-name> -n examination-system

# Events
kubectl get events -n examination-system --sort-by='.lastTimestamp'
```

### 3. Port Forwarding (cho debug)
```bash
# Forward backend port
kubectl port-forward svc/backend 3000:3000 -n examination-system

# Forward frontend port
kubectl port-forward svc/frontend 8080:80 -n examination-system

# Forward MongoDB port
kubectl port-forward svc/mongodb 27017:27017 -n examination-system
```

### 4. Exec vào container
```bash
# Vào backend container
kubectl exec -it <backend-pod-name> -n examination-system -- /bin/sh

# Vào MongoDB container
kubectl exec -it <mongodb-pod-name> -n examination-system -- mongo -u admin -p
```

---

## Troubleshooting

### 1. Pod không khởi động
```bash
# Kiểm tra pod status
kubectl get pods -n examination-system

# Xem chi tiết lỗi
kubectl describe pod <pod-name> -n examination-system

# Xem logs
kubectl logs <pod-name> -n examination-system

# Các lỗi thường gặp:
# - ImagePullBackOff: Kiểm tra image name và registry credentials
# - CrashLoopBackOff: Kiểm tra logs và environment variables
# - Pending: Kiểm tra resources và PVC
```

### 2. Service không accessible
```bash
# Kiểm tra service
kubectl get svc -n examination-system
kubectl describe svc backend -n examination-system

# Kiểm tra endpoints
kubectl get endpoints -n examination-system

# Test connectivity từ trong cluster
kubectl run -it --rm debug --image=busybox --restart=Never -n examination-system -- sh
wget -O- http://backend:3000/health
```

### 3. Ingress không hoạt động
```bash
# Kiểm tra ingress
kubectl get ingress -n examination-system
kubectl describe ingress examination-ingress -n examination-system

# Kiểm tra ingress controller
kubectl get pods -n ingress-nginx
kubectl logs -f <ingress-controller-pod> -n ingress-nginx

# Test DNS resolution
nslookup examination.local
```

### 4. Database connection issues
```bash
# Kiểm tra MongoDB pod
kubectl get pod -l app=mongodb -n examination-system
kubectl logs -f <mongodb-pod> -n examination-system

# Test connection từ backend pod
kubectl exec -it <backend-pod> -n examination-system -- sh
nc -zv mongodb 27017

# Kiểm tra secrets
kubectl get secret mongodb-secret -n examination-system -o yaml
```

### 5. Performance issues
```bash
# Kiểm tra resource usage
kubectl top pods -n examination-system
kubectl top nodes

# Kiểm tra HPA
kubectl get hpa -n examination-system
kubectl describe hpa backend-hpa -n examination-system

# Tăng resources nếu cần
kubectl edit deployment backend -n examination-system
# Sửa resources.requests và resources.limits
```

---

## Backup và Recovery

### 1. Backup MongoDB Data
```bash
# Exec vào MongoDB pod
kubectl exec -it <mongodb-pod> -n examination-system -- sh

# Backup database
mongodump --username=admin --password=<password> --authenticationDatabase=admin --out=/tmp/backup

# Copy backup ra local
kubectl cp examination-system/<mongodb-pod>:/tmp/backup ./mongodb-backup
```

### 2. Restore MongoDB Data
```bash
# Copy backup vào pod
kubectl cp ./mongodb-backup examination-system/<mongodb-pod>:/tmp/backup

# Exec vào pod và restore
kubectl exec -it <mongodb-pod> -n examination-system -- sh
mongorestore --username=admin --password=<password> --authenticationDatabase=admin /tmp/backup
```

### 3. Backup Kubernetes Configurations
```bash
# Export tất cả resources
kubectl get all -n examination-system -o yaml > backup-all.yaml

# Export specific resources
kubectl get deployment,service,configmap,secret -n examination-system -o yaml > backup-configs.yaml
```

---

## Maintenance

### 1. Update Kubernetes Resources
```bash
# Apply changes từ file
kubectl apply -k k8s/overlays/prod

# Hoặc edit trực tiếp
kubectl edit deployment backend -n examination-system
```

### 2. Drain Node (cho maintenance)
```bash
# Drain node
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# Uncordon sau khi xong
kubectl uncordon <node-name>
```

### 3. Clean Up
```bash
# Xóa namespace và tất cả resources
kubectl delete namespace examination-system

# Hoặc xóa theo kustomization
kubectl delete -k k8s/overlays/prod

# Xóa PVC (nếu cần)
kubectl delete pvc --all -n examination-system
```

---

## Production Best Practices

1. **Security**:
   - Sử dụng Secrets cho sensitive data
   - Enable RBAC
   - Sử dụng Network Policies
   - Scan images cho vulnerabilities

2. **High Availability**:
   - Deploy ít nhất 3 replicas cho critical services
   - Sử dụng PodDisruptionBudgets
   - Configure liveness và readiness probes

3. **Resource Management**:
   - Set resource requests và limits
   - Sử dụng HPA cho auto-scaling
   - Monitor resource usage

4. **Monitoring & Logging**:
   - Setup Prometheus + Grafana
   - Centralized logging với ELK stack
   - Alert cho critical events

5. **Backup**:
   - Regular backup của database
   - Backup Kubernetes configurations
   - Test restore procedures

---

## Useful Commands Cheat Sheet

```bash
# Quick status check
kubectl get all -n examination-system

# Watch pod status
kubectl get pods -n examination-system -w

# Logs
kubectl logs -f deployment/backend -n examination-system

# Exec into pod
kubectl exec -it <pod-name> -n examination-system -- sh

# Port forward
kubectl port-forward svc/backend 3000:3000 -n examination-system

# Scale
kubectl scale deployment backend --replicas=5 -n examination-system

# Restart deployment
kubectl rollout restart deployment/backend -n examination-system

# View HPA
kubectl get hpa -n examination-system

# Top resources
kubectl top pods -n examination-system
kubectl top nodes

# Events
kubectl get events -n examination-system --sort-by='.lastTimestamp'
```

---

## Support và Documentation

- Kubernetes Docs: https://kubernetes.io/docs/
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- Ingress NGINX Docs: https://kubernetes.github.io/ingress-nginx/

Chúc bạn triển khai thành công!
