#!/bin/bash
# Script kiểm tra trạng thái Blockchain Network

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       KIỂM TRA TRẠNG THÁI BLOCKCHAIN NETWORK                ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check function
check_container() {
    local container=$1
    local name=$2
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        echo -e "${GREEN}✓${NC} ${name}: ${GREEN}Running${NC}"
        return 0
    else
        echo -e "${RED}✗${NC} ${name}: ${RED}Not Running${NC}"
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}1. FABRIC CORE COMPONENTS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_container "orderer.example.com" "Orderer"
check_container "peer0.org1.example.com" "Peer Org1"
check_container "peer0.org2.example.com" "Peer Org2"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}2. CHAINCODE CONTAINERS${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

CHAINCODE_COUNT=$(docker ps --format '{{.Names}}' | grep "dev-peer.*candidate" | wc -l | xargs)
if [ "$CHAINCODE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Chaincode 'candidate': ${GREEN}Running${NC} (${CHAINCODE_COUNT} containers)"
    docker ps --format '  - {{.Names}}' | grep "dev-peer.*candidate"
else
    echo -e "${RED}✗${NC} Chaincode 'candidate': ${RED}Not Running${NC}"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}3. SUPPORTING SERVICES${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check_container "examination-mongo" "MongoDB"
check_container "fabric-sample-redis" "Redis" || check_container "examination-redis" "Redis"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}4. BACKEND API${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ready 2>/dev/null)
if [ "$HEALTH_CHECK" = "200" ]; then
    echo -e "${GREEN}✓${NC} Backend API: ${GREEN}Healthy${NC} (http://localhost:3000)"
else
    echo -e "${RED}✗${NC} Backend API: ${RED}Not Responding${NC}"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}5. NETWORK CONNECTIVITY${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check channel
CHANNEL_CHECK=$(docker exec peer0.org1.example.com peer channel list 2>&1 | grep -c "mychannel")
if [ "$CHANNEL_CHECK" -gt 0 ]; then
    echo -e "${GREEN}✓${NC} Channel 'mychannel': ${GREEN}Active${NC}"
else
    echo -e "${RED}✗${NC} Channel 'mychannel': ${RED}Not Found${NC}"
fi

# Check blockchain query
BLOCKCHAIN_TEST=$(curl -s -H "X-Api-Key: 01C6FD49-703F-4B13-8837-4A772882AB55" \
    "http://localhost:3000/api/score?getOnChain=true" 2>/dev/null)
if [ "$BLOCKCHAIN_TEST" != "" ]; then
    echo -e "${GREEN}✓${NC} Blockchain Query: ${GREEN}Working${NC}"
    SCORE_COUNT=$(echo "$BLOCKCHAIN_TEST" | jq 'length' 2>/dev/null || echo "0")
    echo -e "  Số lượng scores trên blockchain: ${SCORE_COUNT}"
else
    echo -e "${RED}✗${NC} Blockchain Query: ${RED}Failed${NC}"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}6. CONTAINER UPTIME${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

docker ps --format "table {{.Names}}\t{{.Status}}" | grep -E "peer0|orderer|mongo|redis" | head -10
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                      TỔNG KẾT                                ║"
echo "╚══════════════════════════════════════════════════════════════╝"

# Count running components
RUNNING_COUNT=0
TOTAL_COUNT=7

check_container "orderer.example.com" "" >/dev/null && ((RUNNING_COUNT++))
check_container "peer0.org1.example.com" "" >/dev/null && ((RUNNING_COUNT++))
check_container "peer0.org2.example.com" "" >/dev/null && ((RUNNING_COUNT++))
[ "$CHAINCODE_COUNT" -gt 0 ] && ((RUNNING_COUNT++))
check_container "examination-mongo" "" >/dev/null && ((RUNNING_COUNT++))
(check_container "fabric-sample-redis" "" >/dev/null || check_container "examination-redis" "" >/dev/null) && ((RUNNING_COUNT++))
[ "$HEALTH_CHECK" = "200" ] && ((RUNNING_COUNT++))

echo ""
if [ "$RUNNING_COUNT" -eq "$TOTAL_COUNT" ]; then
    echo -e "${GREEN}🎉 Tất cả components đang hoạt động bình thường!${NC}"
    echo -e "   Status: ${GREEN}${RUNNING_COUNT}/${TOTAL_COUNT} components running${NC}"
else
    echo -e "${YELLOW}⚠️  Một số components chưa hoạt động${NC}"
    echo -e "   Status: ${YELLOW}${RUNNING_COUNT}/${TOTAL_COUNT} components running${NC}"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Chi tiết các endpoints:"
echo "  • REST API:    http://localhost:3000"
echo "  • Health:      http://localhost:3000/ready"
echo "  • MongoDB:     mongodb://localhost:27017"
echo "  • Redis:       redis://localhost:6379"
echo "  • Peer Org1:   localhost:7051"
echo "  • Peer Org2:   localhost:9051"
echo "  • Orderer:     localhost:7050"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
