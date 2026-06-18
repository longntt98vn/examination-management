#!/bin/bash
# Script test score blockchain integration

API_KEY="01C6FD49-703F-4B13-8837-4A772882AB55"
BASE_URL="http://localhost:3000"

echo "=== TEST SCORE BLOCKCHAIN INTEGRATION ==="
echo ""

# Step 1: Check current scores in database
echo "1. Scores hiện tại trong DATABASE:"
curl -s -H "X-Api-Key: $API_KEY" "$BASE_URL/api/score" | jq -r '.[] | "  - Student: \(.student_id), Score: \(.value), Status: \(.status)"'
echo ""

# Step 2: Check current scores on blockchain
echo "2. Scores hiện tại trên BLOCKCHAIN:"
BLOCKCHAIN_SCORES=$(curl -s -H "X-Api-Key: $API_KEY" "$BASE_URL/api/score?getOnChain=true")
if [ "$BLOCKCHAIN_SCORES" = "[]" ]; then
    echo "  (Rỗng - chưa có dữ liệu trên blockchain)"
else
    echo "$BLOCKCHAIN_SCORES" | jq .
fi
echo ""

echo "3. Để test việc đẩy score lên blockchain:"
echo "   Bạn cần:"
echo "   a) Login để lấy token:"
echo "      curl -X POST -H 'Content-Type: application/json' \\"
echo "           -d '{\"username\":\"your_username\",\"password\":\"your_password\"}' \\"
echo "           '$BASE_URL/api/auth/login'"
echo ""
echo "   b) Sử dụng token để POST score:"
echo "      curl -X POST -H 'Content-Type: application/json' \\"
echo "           -H 'token: YOUR_TOKEN_HERE' \\"
echo "           -d '{\"examId\":\"6a0dd28f9efa7d2403b4e3ff\",\"scores\":[{\"studentId\":\"6a0dc09d4120c00f364db7b9\",\"value\":2},{\"studentId\":\"6a0dc09d4120c00f364db7ba\",\"value\":1}]}' \\"
echo "           '$BASE_URL/api/score'"
echo ""
echo "   c) Response sẽ trả về blockchainJobId. Kiểm tra job status:"
echo "      curl -H 'X-Api-Key: $API_KEY' '$BASE_URL/api/jobs/JOB_ID_HERE'"
echo ""
echo "   d) Sau khi job hoàn thành, kiểm tra blockchain:"
echo "      curl -H 'X-Api-Key: $API_KEY' '$BASE_URL/api/score?getOnChain=true'"
echo ""

echo "=== LƯU Ý ==="
echo "Lỗi ban đầu: Worker không tìm thấy contract cho transaction 'UpdateScore'"
echo "Đã sửa: Thêm case 'UpdateScore' vào switch trong backend/src/utils/jobs.ts"
echo "Sau khi sửa, UpdateScore job sẽ được xử lý và đẩy lên blockchain thành công"
