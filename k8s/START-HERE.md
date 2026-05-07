# 🚀 BẮT ĐẦU TẠI ĐÂY

## Xin chào! 👋

Chào mừng bạn đến với hệ thống triển khai Kubernetes cho dự án Quản lý Kỳ thi.

Nếu bạn đang thấy file này, có nghĩa là bạn cần deploy ứng dụng lên Kubernetes. Đừng lo lắng, mọi thứ đã được chuẩn bị sẵn!

---

## 🎯 Bạn muốn gì?

### 1️⃣ Deploy nhanh nhất có thể (5 phút)

```bash
# Chạy lệnh này và làm theo hướng dẫn:
./scripts/setup-complete.sh
```

**Xong!** Script sẽ hướng dẫn bạn từng bước.

---

### 2️⃣ Tôi muốn hiểu trước khi deploy

Đọc theo thứ tự:

1. **[GUIDE-INDEX.md](./GUIDE-INDEX.md)** ← BẮT ĐẦU TẠI ĐÂY
   - Tổng quan về tất cả documentation
   - Navigation guide
   - Learning path

2. **[INDEX.md](./INDEX.md)**
   - Architecture overview
   - Component breakdown

3. **[QUICKSTART.md](./QUICKSTART.md)**  
   - Quick commands
   - Common operations

---

### 3️⃣ Tôi cần deploy lên Production

**QUAN TRỌNG:** Đọc checklist trước!

1. ✅ **[DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)**
2. ✅ Update secrets trong `k8s/base/secrets.yaml`
3. ✅ Update domain trong `k8s/base/ingress.yaml`
4. ✅ Build và push Docker images
5. ✅ Deploy: `make deploy-prod`

---

### 4️⃣ Có vấn đề cần debug

**Troubleshooting guides:**

- **[README.md](./README.md)** → Phần "Troubleshooting"
- **[EXAMPLES.md](./EXAMPLES.md)** → "Debugging Scenarios"

**Quick debug:**
```bash
# Check status
kubectl get pods -n examination-system

# View logs
kubectl logs <pod-name> -n examination-system

# Describe pod
kubectl describe pod <pod-name> -n examination-system
```

---

### 5️⃣ Tôi muốn học Kubernetes

**Learning path:**

1. **Beginner** (2-3 hours)
   - Read [INDEX.md](./INDEX.md)
   - Read [STRUCTURE.md](./STRUCTURE.md)
   - Deploy to dev: `make deploy-dev`
   - Explore: `kubectl get all -n examination-system-dev`

2. **Intermediate** (4-6 hours)
   - Complete beginner path
   - Study YAML files in `base/`
   - Read [EXAMPLES.md](./EXAMPLES.md)
   - Practice common scenarios

3. **Advanced** (1-2 days)
   - Read full [README.md](./README.md)
   - Study [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)
   - Deploy to production
   - Setup monitoring

---

## 📚 Tất cả Documentation

```
k8s/
├── START-HERE.md              ← BẠN ĐANG Ở ĐÂY
├── GUIDE-INDEX.md             ← Master index
├── INDEX.md                   → Overview
├── QUICKSTART.md              → Quick commands
├── README.md                  → Complete guide (600+ lines)
├── STRUCTURE.md               → Directory structure
├── DEPLOYMENT-CHECKLIST.md    → Production checklist
├── EXAMPLES.md                → Tips & tricks (500+ lines)
│
├── base/                      → K8s configurations (2,271 lines)
│   ├── *.yaml                → Deployments, services, etc.
│   └── kustomization.yaml    → Kustomize config
│
└── overlays/                  → Environment configs
    ├── dev/                  → Development
    └── prod/                 → Production
```

---

## 🔧 Quick Commands

```bash
# Setup wizard (RECOMMENDED)
./scripts/setup-complete.sh

# Deploy
make deploy-dev        # Development
make deploy-prod       # Production

# Check status
make status-dev
make status-prod

# View logs
make logs-dev
make logs-prod

# Health check
./scripts/health-check.sh examination-system

# Help
make help
```

---

## ⚡ Super Quick Start

Nếu bạn THỰC SỰ vội:

```bash
# 1. Build images (if needed)
make build push

# 2. Deploy
make deploy-dev

# 3. Check
make status-dev

# 4. Access (port-forward)
make port-forward-dev
```

**Xong!** App chạy ở `http://localhost:3000` và `http://localhost:8080`

---

## 🆘 Cần giúp đỡ?

1. **Có lỗi?** → Check [README.md](./README.md) phần Troubleshooting
2. **Cần ví dụ?** → Xem [EXAMPLES.md](./EXAMPLES.md)
3. **Production?** → Đọc [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)
4. **Không biết bắt đầu?** → Chạy `./scripts/setup-complete.sh`

---

## ✅ Checklist Nhanh

Trước khi deploy:

- [ ] kubectl installed và cluster accessible
- [ ] Docker installed (nếu cần build images)
- [ ] Đã update secrets (production)
- [ ] Đã update image registry URLs
- [ ] Đã đọc documentation phù hợp với level của bạn

---

## 🎉 Vậy là xong!

**Bạn đã sẵn sàng!**

Chọn một trong các options ở trên và bắt đầu thôi! 🚀

---

**Pro tip:** Nếu bạn muốn hiểu hệ thống một cách có tổ chức, bắt đầu với [GUIDE-INDEX.md](./GUIDE-INDEX.md)

**Fastest path:** Chạy `./scripts/setup-complete.sh` ngay bây giờ!

---

*Good luck! 🍀*
