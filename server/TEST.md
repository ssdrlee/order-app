# API 연동 테스트 가이드

## 1. 사전 준비

### 1.1 서버 실행 확인
```bash
# 서버 폴더에서
cd server
npm run dev
```

서버가 정상적으로 실행되면 다음과 같은 메시지가 표시됩니다:
```
서버가 포트 5000에서 실행 중입니다.
환경: development
✓ 데이터베이스 연결 성공
```

### 1.2 데이터베이스 확인
```bash
# 데이터베이스 연결 테스트
npm run db:test
```

## 2. API 엔드포인트 직접 테스트

### 2.1 메뉴 조회 API 테스트

#### 모든 메뉴 조회
```bash
# curl 사용 (Git Bash 또는 터미널)
curl http://localhost:5000/api/menus

# 또는 브라우저에서 직접 접속
# http://localhost:5000/api/menus
```

**예상 응답:**
```json
[
  {
    "id": 1,
    "name": "아메리카노(ICE)",
    "description": "시원하고 깔끔한 아이스 아메리카노",
    "price": 4000,
    "image": "/images/americano-ice.jpg",
    "stock": 10
  },
  ...
]
```

#### 특정 메뉴 조회
```bash
curl http://localhost:5000/api/menus/1
```

### 2.2 주문 생성 API 테스트

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "menuId": 1,
        "name": "아메리카노(ICE)",
        "quantity": 2,
        "price": 4000,
        "options": {
          "shot": true,
          "syrup": false
        }
      }
    ],
    "totalAmount": 9000
  }'
```

**예상 응답:**
```json
{
  "success": true,
  "data": {
    "orderId": 1,
    "totalAmount": 9000
  },
  "message": "주문이 성공적으로 생성되었습니다."
}
```

### 2.3 주문 조회 API 테스트

```bash
# 위에서 생성한 주문 ID로 조회
curl http://localhost:5000/api/orders/1
```

### 2.4 관리자 API 테스트

#### 대시보드 통계 조회
```bash
curl http://localhost:5000/api/admin/dashboard
```

**예상 응답:**
```json
{
  "total": 1,
  "received": 1,
  "inProgress": 0,
  "completed": 0
}
```

#### 재고 목록 조회
```bash
curl http://localhost:5000/api/admin/inventory
```

**예상 응답:**
```json
[
  {
    "menuId": 1,
    "name": "아메리카노(ICE)",
    "stock": 10
  },
  ...
]
```

#### 재고 수정
```bash
curl -X PUT http://localhost:5000/api/admin/inventory/1 \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 15
  }'
```

#### 주문 목록 조회
```bash
curl http://localhost:5000/api/admin/orders
```

#### 주문 상태 변경
```bash
curl -X PUT http://localhost:5000/api/admin/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "제조 중"
  }'
```

## 3. 프런트엔드 통합 테스트

### 3.1 프런트엔드 서버 실행
```bash
# 새 터미널에서
cd ui
npm run dev
```

### 3.2 테스트 시나리오

#### 시나리오 1: 메뉴 조회
1. 브라우저에서 `http://localhost:3000` 접속
2. "주문하기" 탭 클릭
3. 메뉴 목록이 표시되는지 확인
4. 브라우저 개발자 도구(F12) → Network 탭에서 `/api/menus` 요청 확인

#### 시나리오 2: 주문 생성
1. 메뉴 카드에서 원하는 메뉴 선택
2. 옵션 선택 (샷 추가, 시럽 추가)
3. "장바구니에 추가" 클릭
4. 장바구니에 항목이 추가되는지 확인
5. "주문하기" 버튼 클릭
6. 주문 완료 메시지 확인
7. 개발자 도구에서 `/api/orders` POST 요청 확인

#### 시나리오 3: 관리자 기능
1. "관리자" 탭 클릭
2. 대시보드에 주문 통계가 표시되는지 확인
3. 재고 현황에서 재고 수량 확인
4. 재고 +/- 버튼으로 재고 수정 테스트
5. 주문 현황에서 생성된 주문 확인
6. "제조 시작" 버튼 클릭
7. 주문 상태가 "제조 중"으로 변경되는지 확인
8. 재고가 차감되는지 확인
9. "제조 완료" 버튼 클릭
10. 주문 상태가 "제조 완료"로 변경되는지 확인

## 4. 자동화 테스트 스크립트

### 4.1 간단한 테스트 스크립트 실행

```bash
# server 폴더에서
node test-api.js
```

## 5. 문제 해결

### 5.1 CORS 오류
- **증상**: 브라우저 콘솔에 CORS 오류 메시지
- **해결**: `server/src/server.js`에서 `app.use(cors())` 확인

### 5.2 데이터베이스 연결 오류
- **증상**: "데이터베이스 연결 실패" 메시지
- **해결**: 
  - PostgreSQL 서버가 실행 중인지 확인
  - `.env` 파일의 데이터베이스 설정 확인
  - `npm run db:test` 실행

### 5.3 API 응답 오류
- **증상**: 404, 500 등의 HTTP 오류
- **해결**:
  - 서버가 실행 중인지 확인
  - API 엔드포인트 URL 확인
  - 서버 콘솔 로그 확인

### 5.4 프런트엔드에서 데이터가 로드되지 않음
- **증상**: "메뉴를 불러오는 중..." 또는 빈 화면
- **해결**:
  - 브라우저 개발자 도구에서 Network 탭 확인
  - API 요청이 실패하는지 확인
  - 서버가 실행 중인지 확인
  - `ui/src/utils/api.js`의 `API_BASE_URL` 확인

## 6. 테스트 체크리스트

- [ ] 백엔드 서버가 정상적으로 실행됨
- [ ] 데이터베이스 연결 성공
- [ ] 메뉴 조회 API 정상 작동
- [ ] 주문 생성 API 정상 작동
- [ ] 주문 조회 API 정상 작동
- [ ] 대시보드 통계 API 정상 작동
- [ ] 재고 조회 API 정상 작동
- [ ] 재고 수정 API 정상 작동
- [ ] 주문 목록 조회 API 정상 작동
- [ ] 주문 상태 변경 API 정상 작동
- [ ] 프런트엔드에서 메뉴가 정상적으로 표시됨
- [ ] 프런트엔드에서 주문이 정상적으로 생성됨
- [ ] 프런트엔드에서 관리자 기능이 정상적으로 작동함
- [ ] 재고 차감이 정상적으로 작동함
- [ ] 에러 처리가 정상적으로 작동함

