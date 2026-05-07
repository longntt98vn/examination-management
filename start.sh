#!/usr/bin/env bash
#
# start.sh — One-shot bootstrapper for the examination-management stack.
#
# Tải và khởi chạy toàn bộ project chỉ bằng một lệnh:
#   - Hyperledger Fabric network (network/) + channel
#   - Chaincode "candidate" (chaincode/)
#   - MongoDB (docker)
#   - Redis     (docker)
#   - Backend REST API (backend/)
#   - Frontend React app (frontend/)
#
# Cách dùng:
#   ./start.sh                 # khởi chạy toàn bộ (giữ lại trạng thái cũ)
#   ./start.sh --reset         # xoá network/.env cũ và bootstrap lại từ đầu
#   ./start.sh --no-frontend   # bỏ qua bước chạy frontend
#   ./start.sh --down          # dừng và dọn dẹp toàn bộ
#   ./start.sh -h | --help     # xem trợ giúp
#
set -Eeuo pipefail

# -------------------- Đường dẫn & biến cấu hình --------------------
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"
NETWORK_DIR="$ROOT_DIR/network"
CHAINCODE_DIR="$ROOT_DIR/chaincode"
RUN_DIR="$ROOT_DIR/.run"
LOG_DIR="$RUN_DIR/logs"

CHANNEL_NAME="${CHANNEL_NAME:-mychannel}"
CC_NAME="${CC_NAME:-candidate}"
CC_VERSION="${CC_VERSION:-1.0}"
CC_SEQUENCE="${CC_SEQUENCE:-1}"

MONGO_CONTAINER="${MONGO_CONTAINER:-examination-mongo}"
MONGO_PORT="${MONGO_PORT:-27017}"
REDIS_CONTAINER="${REDIS_CONTAINER:-examination-redis}"
REDIS_PORT="${REDIS_PORT:-6379}"

BACKEND_PORT="${BACKEND_PORT:-3000}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"

# -------------------- Helpers --------------------
C_RESET='\033[0m'; C_GREEN='\033[0;32m'; C_RED='\033[0;31m'
C_YEL='\033[1;33m'; C_BLU='\033[0;34m'; C_BOLD='\033[1m'

log()  { printf "${C_BLU}==>${C_RESET} ${C_BOLD}%s${C_RESET}\n" "$*"; }
ok()   { printf "${C_GREEN}✓${C_RESET} %s\n" "$*"; }
warn() { printf "${C_YEL}!${C_RESET} %s\n" "$*"; }
err()  { printf "${C_RED}✗${C_RESET} %s\n" "$*" >&2; }
die()  { err "$*"; exit 1; }

require_cmd() {
    command -v "$1" >/dev/null 2>&1 || die "Thiếu lệnh '$1'. Vui lòng cài đặt trước khi chạy."
}

container_running() {
    [[ -n "$(docker ps -q -f name="^/${1}$" 2>/dev/null)" ]]
}

container_exists() {
    [[ -n "$(docker ps -aq -f name="^/${1}$" 2>/dev/null)" ]]
}

wait_tcp() {
    local host="$1" port="$2" name="$3" retries="${4:-60}"
    log "Chờ $name sẵn sàng tại ${host}:${port}…"
    for ((i=1; i<=retries; i++)); do
        if (echo > "/dev/tcp/${host}/${port}") >/dev/null 2>&1; then
            ok "$name đã sẵn sàng."
            return 0
        fi
        sleep 1
    done
    die "$name không phản hồi tại ${host}:${port} sau ${retries}s."
}

# -------------------- Prerequisites --------------------
check_prereqs() {
    log "Kiểm tra prerequisites…"
    require_cmd docker
    require_cmd node
    require_cmd jq
    require_cmd uuidgen
    require_cmd curl

    if command -v yarn >/dev/null 2>&1; then
        PKG_MGR="yarn"
    elif command -v npm >/dev/null 2>&1; then
        PKG_MGR="npm"
    else
        die "Không tìm thấy yarn hoặc npm."
    fi

    docker info >/dev/null 2>&1 || die "Docker daemon chưa chạy. Hãy mở Docker Desktop trước."

    if docker compose version >/dev/null 2>&1; then
        DOCKER_COMPOSE="docker compose"
    elif command -v docker-compose >/dev/null 2>&1; then
        DOCKER_COMPOSE="docker-compose"
    else
        DOCKER_COMPOSE=""
    fi

    ok "Đầy đủ prerequisites (package manager: $PKG_MGR)."
}

# -------------------- MongoDB --------------------
start_mongo() {
    log "Khởi động MongoDB ($MONGO_CONTAINER → :$MONGO_PORT)…"
    if container_running "$MONGO_CONTAINER"; then
        ok "MongoDB đang chạy."
    elif container_exists "$MONGO_CONTAINER"; then
        docker start "$MONGO_CONTAINER" >/dev/null
        ok "MongoDB đã được khởi động lại."
    else
        docker run -d \
            --name "$MONGO_CONTAINER" \
            -p "${MONGO_PORT}:27017" \
            -v "${MONGO_CONTAINER}-data:/data/db" \
            mongo:6 >/dev/null
        ok "MongoDB container vừa được tạo."
    fi
    wait_tcp localhost "$MONGO_PORT" MongoDB 60
}

# -------------------- Redis --------------------
start_redis() {
    log "Khởi động Redis ($REDIS_CONTAINER → :$REDIS_PORT)…"
    if container_running "$REDIS_CONTAINER"; then
        ok "Redis đang chạy."
    elif container_exists "$REDIS_CONTAINER"; then
        docker start "$REDIS_CONTAINER" >/dev/null
        ok "Redis đã được khởi động lại."
    else
        docker run -d \
            --name "$REDIS_CONTAINER" \
            -p "${REDIS_PORT}:6379" \
            redis \
            --maxmemory-policy noeviction \
            --requirepass "$REDIS_PASSWORD" >/dev/null
        ok "Redis container vừa được tạo."
    fi
    wait_tcp localhost "$REDIS_PORT" Redis 30
}

# -------------------- Hyperledger Fabric Network --------------------
start_fabric_network() {
    log "Khởi động Hyperledger Fabric network…"
    pushd "$NETWORK_DIR" >/dev/null

    export PATH="$ROOT_DIR/bin:$PATH"
    export FABRIC_CFG_PATH="$ROOT_DIR/config"

    if docker ps --format '{{.Names}}' | grep -q '^peer0\.org1\.example\.com$'; then
        ok "Fabric network đã hoạt động."
    else
        ./network.sh up createChannel -c "$CHANNEL_NAME" -ca
        ok "Fabric network đã sẵn sàng (channel: $CHANNEL_NAME)."
    fi

    popd >/dev/null
}

deploy_chaincode() {
    log "Triển khai chaincode '$CC_NAME' (v$CC_VERSION, seq $CC_SEQUENCE)…"
    pushd "$NETWORK_DIR" >/dev/null

    if docker ps --format '{{.Names}}' | grep -qE "dev-peer.*${CC_NAME}"; then
        ok "Chaincode '$CC_NAME' đã được cài đặt."
    else
        ./network.sh deployCC \
            -c "$CHANNEL_NAME" \
            -ccn "$CC_NAME" \
            -ccl typescript \
            -ccv "$CC_VERSION" \
            -ccs "$CC_SEQUENCE" \
            -ccp "$CHAINCODE_DIR"
        ok "Chaincode '$CC_NAME' đã được triển khai."
    fi

    popd >/dev/null
}

# -------------------- Backend --------------------
prepare_backend_env() {
    if [[ -f "$BACKEND_DIR/.env" && "$DO_RESET" -eq 0 ]]; then
        ok "Backend .env đã tồn tại — bỏ qua generateEnv."
        return
    fi

    log "Sinh file .env cho backend (generateEnv.sh)…"
    pushd "$BACKEND_DIR" >/dev/null
    AS_LOCAL_HOST=true \
    TEST_NETWORK_HOME="$NETWORK_DIR" \
    bash ./scripts/generateEnv.sh
    ok "Đã sinh backend/.env"
    popd >/dev/null
}

install_backend() {
    log "Cài đặt dependencies cho backend…"
    pushd "$BACKEND_DIR" >/dev/null
    if [[ ! -d node_modules ]]; then
        if [[ "$PKG_MGR" == "yarn" ]]; then yarn install; else npm install; fi
    else
        ok "node_modules đã có — bỏ qua install."
    fi

    log "Build backend (tsc)…"
    if [[ "$PKG_MGR" == "yarn" ]]; then yarn build; else npm run build; fi
    popd >/dev/null
}

start_backend() {
    log "Khởi động backend REST API (port $BACKEND_PORT)…"
    pushd "$BACKEND_DIR" >/dev/null

    if [[ -f "$RUN_DIR/backend.pid" ]] && kill -0 "$(cat "$RUN_DIR/backend.pid")" 2>/dev/null; then
        ok "Backend đã chạy (pid $(cat "$RUN_DIR/backend.pid"))."
        popd >/dev/null
        return
    fi

    NODE_ENV=development \
    REDIS_PASSWORD="$REDIS_PASSWORD" \
    nohup node --require source-map-support/register --require dotenv/config ./dist \
        > "$LOG_DIR/backend.log" 2>&1 &
    echo $! > "$RUN_DIR/backend.pid"
    popd >/dev/null

    wait_tcp localhost "$BACKEND_PORT" "Backend API" 60
    ok "Backend đang chạy (pid $(cat "$RUN_DIR/backend.pid")). Log: $LOG_DIR/backend.log"
}

# -------------------- Frontend --------------------
install_frontend() {
    log "Cài đặt dependencies cho frontend…"
    pushd "$FRONTEND_DIR" >/dev/null
    if [[ ! -d node_modules ]]; then
        if [[ "$PKG_MGR" == "yarn" ]]; then yarn install; else npm install; fi
    else
        ok "node_modules đã có — bỏ qua install."
    fi
    popd >/dev/null
}

start_frontend() {
    log "Khởi động frontend (port $FRONTEND_PORT)…"
    pushd "$FRONTEND_DIR" >/dev/null

    if [[ -f "$RUN_DIR/frontend.pid" ]] && kill -0 "$(cat "$RUN_DIR/frontend.pid")" 2>/dev/null; then
        ok "Frontend đã chạy (pid $(cat "$RUN_DIR/frontend.pid"))."
        popd >/dev/null
        return
    fi

    BROWSER=none \
    PORT="$FRONTEND_PORT" \
    REACT_APP_API_BASE_URL="http://localhost:${BACKEND_PORT}" \
    nohup ${PKG_MGR} start > "$LOG_DIR/frontend.log" 2>&1 &
    echo $! > "$RUN_DIR/frontend.pid"
    popd >/dev/null

    ok "Frontend đang biên dịch (pid $(cat "$RUN_DIR/frontend.pid")). Log: $LOG_DIR/frontend.log"
}

# -------------------- Tear-down --------------------
do_down() {
    log "Tearing down toàn bộ stack…"

    for pidfile in "$RUN_DIR"/backend.pid "$RUN_DIR"/frontend.pid; do
        [[ -f "$pidfile" ]] || continue
        pid="$(cat "$pidfile" 2>/dev/null || true)"
        if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
            kill "$pid" 2>/dev/null || true
            ok "Đã dừng pid $pid ($(basename "$pidfile" .pid))."
        fi
        rm -f "$pidfile"
    done

    for c in "$REDIS_CONTAINER" "$MONGO_CONTAINER"; do
        if container_exists "$c"; then
            docker rm -f "$c" >/dev/null 2>&1 || true
            ok "Đã xoá container $c."
        fi
    done

    if [[ -d "$NETWORK_DIR" ]]; then
        pushd "$NETWORK_DIR" >/dev/null
        export PATH="$ROOT_DIR/bin:$PATH"
        export FABRIC_CFG_PATH="$ROOT_DIR/config"
        ./network.sh down || true
        popd >/dev/null
        ok "Đã hạ Fabric network."
    fi

    ok "Stack đã được dừng."
}

# -------------------- Reset --------------------
do_reset() {
    log "Reset toàn bộ trạng thái cũ…"
    do_down
    rm -f "$BACKEND_DIR/.env"
    rm -rf "$RUN_DIR"
    ok "Reset hoàn tất."
}

# -------------------- Main --------------------
print_summary() {
    cat <<EOF

${C_GREEN}╭──────────────────────────────────────────────────────────╮${C_RESET}
${C_GREEN}│              EXAMINATION-MANAGEMENT IS UP                │${C_RESET}
${C_GREEN}╰──────────────────────────────────────────────────────────╯${C_RESET}

  • Frontend     : http://localhost:${FRONTEND_PORT}
  • Backend API  : http://localhost:${BACKEND_PORT}
  • MongoDB      : mongodb://localhost:${MONGO_PORT}
  • Redis        : redis://:${REDIS_PASSWORD}@localhost:${REDIS_PORT}
  • Channel      : ${CHANNEL_NAME}
  • Chaincode    : ${CC_NAME} v${CC_VERSION} (seq ${CC_SEQUENCE})

  API keys (từ backend/.env):
    ORG1_APIKEY = $(grep -E '^ORG1_APIKEY=' "$BACKEND_DIR/.env" 2>/dev/null | cut -d= -f2-)
    ORG2_APIKEY = $(grep -E '^ORG2_APIKEY=' "$BACKEND_DIR/.env" 2>/dev/null | cut -d= -f2-)

  Logs:
    tail -f $LOG_DIR/backend.log
    tail -f $LOG_DIR/frontend.log

  Để dừng toàn bộ: ./start.sh --down
EOF
}

usage() {
    sed -n '2,18p' "$0" | sed 's/^# \{0,1\}//'
    exit 0
}

DO_RESET=0
DO_DOWN=0
SKIP_FRONTEND=0

while [[ $# -gt 0 ]]; do
    case "$1" in
        -h|--help)        usage ;;
        --reset)          DO_RESET=1 ;;
        --down|--stop)    DO_DOWN=1 ;;
        --no-frontend)    SKIP_FRONTEND=1 ;;
        *) die "Tham số không hợp lệ: $1 (xem --help)" ;;
    esac
    shift
done

mkdir -p "$RUN_DIR" "$LOG_DIR"

check_prereqs

if [[ "$DO_DOWN" -eq 1 ]]; then
    do_down
    exit 0
fi

if [[ "$DO_RESET" -eq 1 ]]; then
    do_reset
fi

if [[ -f "$RUN_DIR/redis.password" ]]; then
    REDIS_PASSWORD="$(cat "$RUN_DIR/redis.password")"
else
    REDIS_PASSWORD="$(uuidgen)"
    echo "$REDIS_PASSWORD" > "$RUN_DIR/redis.password"
fi
export REDIS_PASSWORD

start_mongo
start_fabric_network
deploy_chaincode
prepare_backend_env
start_redis
install_backend
start_backend

if [[ "$SKIP_FRONTEND" -eq 0 ]]; then
    install_frontend
    start_frontend
else
    warn "Bỏ qua frontend theo yêu cầu (--no-frontend)."
fi

print_summary
