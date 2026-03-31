#!/bin/bash

# Configuration
API_BASE_URL="http://localhost:8081"
SAMPLE_DATA_DIR="../SampleData"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}→ $1${NC}"
}

# Function to check if server is running
check_server() {
    print_info "Checking if server is running..."
    if curl -s "${API_BASE_URL}" > /dev/null 2>&1; then
        print_success "Server is running"
        return 0
    else
        print_error "Server is not running at ${API_BASE_URL}"
        return 1
    fi
}

# Function to upload file
upload_file() {
    local file_path=$1
    local api_endpoint=$2
    local file_field_name=${3:-"file"}
    
    print_info "Uploading $(basename $file_path) to $api_endpoint..."
    
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -F "${file_field_name}=@${file_path}" \
        "${API_BASE_URL}${api_endpoint}")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        print_success "Successfully uploaded $(basename $file_path)"
        return 0
    else
        print_error "Failed to upload $(basename $file_path) (HTTP $http_code)"
        echo "Response: $body"
        return 1
    fi
}

# Main initialization script
main() {
    echo "========================================="
    echo "  Data Initialization Script"
    echo "========================================="
    echo ""
    
    # Check if server is running
    if ! check_server; then
        echo ""
        print_error "Please start the server first!"
        exit 1
    fi
    
    echo ""
    print_info "Starting data initialization..."
    echo ""
    
    # 1. Upload Semester data
    print_info "Step 1: Uploading semester data..."
    if [ -f "${SAMPLE_DATA_DIR}/semester.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/semester.csv" "/api/semesters/upload"
    else
        print_error "semester.csv not found"
    fi
    echo ""
    
    # 2. Upload Subjects (DSMH - Danh sách môn học)
    print_info "Step 2: Uploading subjects data..."
    if [ -f "${SAMPLE_DATA_DIR}/subjects.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/subjects.csv" "/api/upload/dsmh"
    else
        print_error "subjects.csv not found"
    fi
    echo ""
    
    # 3. Upload Students (DSSV - Danh sách sinh viên)
    print_info "Step 3: Uploading students data..."
    if [ -f "${SAMPLE_DATA_DIR}/users_student.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/users_student.csv" "/api/upload/dssv"
    else
        print_error "users_student.csv not found"
    fi
    echo ""
    
    # 4. Upload Teachers (DSCV - Danh sách cán bộ/giảng viên)
    print_info "Step 4: Uploading teachers data..."
    if [ -f "${SAMPLE_DATA_DIR}/users_teacher.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/users_teacher.csv" "/api/upload/dscv"
    else
        print_error "users_teacher.csv not found"
    fi
    echo ""
    
    # 5. Upload Student Status
    print_info "Step 5: Uploading student status..."
    if [ -f "${SAMPLE_DATA_DIR}/update_status.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/update_status.csv" "/api/status/import"
    else
        print_error "update_status.csv not found"
    fi
    echo ""
    
    # 6. Upload Scores for different subjects
    print_info "Step 6: Uploading scores data..."
    
    # Upload FLF2104 scores
    if [ -f "${SAMPLE_DATA_DIR}/flf2104_score.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/flf2104_score.csv" "/api/scores/import"
    fi
    
    # Upload INT1001 scores
    if [ -f "${SAMPLE_DATA_DIR}/int1001_score.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/int1001_score.csv" "/api/scores/import"
    fi
    
    # Upload INT1002 scores
    if [ -f "${SAMPLE_DATA_DIR}/int1002_score.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/int1002_score.csv" "/api/scores/import"
    fi
    
    # Upload MAT1093 scores
    if [ -f "${SAMPLE_DATA_DIR}/mat1093_score.csv" ]; then
        upload_file "${SAMPLE_DATA_DIR}/mat1093_score.csv" "/api/scores/import"
    fi
    echo ""
    
    # Note: Class member imports require classId parameter
    print_info "Note: Class member imports (caclc3_classmember.csv, caclc4_classmember.csv)"
    print_info "require classId parameter and should be done after classes are created."
    print_info "Use: curl -F 'file=@file.csv' ${API_BASE_URL}/api/classes/{classId}/members/import"
    
    echo ""
    echo "========================================="
    print_success "Data initialization completed!"
    echo "========================================="
}

# Run main function
main