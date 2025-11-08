# 커피 주문 앱

## 1. 프로젝트 개요

### 1.1 프로젝트 명
커피 주문 앱

### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱

### 1.3 개발 범위
- 주문하기 화면(메뉴 선택 및 장바구니 기능)
- 관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프런트엔드: HTML, CSS, 리액트, 자바스크립트
- 백엔드: Node.js, Express
- 데이터베이스: PostgreSQL

## 3. 기본 사항
- 프런트엔드와 백엔드를 따로 개발
- 기본적인 웹 기술만 사용
- 학습 목적이므로 사용자 인증이나 결제 기능은 제외
- 메뉴는 커피 메뉴만 있음

## 4. 주문하기 화면 PRD

### 4.1 화면 개요
사용자가 커피 메뉴를 선택하고 옵션을 설정하여 장바구니에 담고, 최종적으로 주문할 수 있는 화면입니다.

### 4.2 화면 구성 요소

#### 4.2.1 상단 헤더/내비게이션 영역
- **앱 브랜드명**: 좌측 상단에 "COZY" 텍스트 표시 (녹색 테두리 상자)
- **내비게이션 버튼**: 우측 상단에 두 개의 버튼 배치
  - **주문하기 버튼**: 현재 선택된 화면을 나타내는 버튼 (녹색 테두리 상자)
  - **관리자 버튼**: 관리자 화면으로 이동하는 버튼 (녹색 테두리 상자)

#### 4.2.2 메뉴 항목 영역
화면 중앙에 메뉴 항목들이 카드 형태로 가로 배치됩니다.

**메뉴 카드 구성 요소:**
- **제품 이미지**: 카드 상단에 제품 이미지 표시 영역
- **제품명**: 이미지 아래에 제품명 표시 (예: "아메리카노(ICE)", "아메리카노(HOT)", "카페라떼")
- **가격**: 제품명 아래에 가격 표시 (예: "4,000원", "5,000원")
- **제품 설명**: 가격 아래에 제품에 대한 간단한 설명 표시
- **옵션 선택**: 체크박스 형태의 추가 옵션 제공
  - **샷 추가**: 선택 시 +500원 추가 (체크박스)
  - **시럽 추가**: 선택 시 +0원 (체크박스, 무료 옵션)
- **담기 버튼**: 카드 하단에 회색 테두리의 "담기" 버튼

**초기 메뉴 데이터 (예시):**
- 아메리카노(ICE): 4,000원
- 아메리카노(HOT): 4,000원
- 카페라떼: 5,000원

#### 4.2.3 장바구니 영역
화면 하단에 회색 테두리 박스로 장바구니 정보를 표시합니다.

**장바구니 구성 요소:**
- **제목**: "장바구니" 텍스트
- **담긴 상품 목록**: 
  - 각 상품별로 다음 정보 표시
    - 제품명 및 선택된 옵션 (예: "아메리카노(ICE) (샷 추가)")
    - 수량 (예: "X 1", "X 2")
    - 개별 가격 (예: "4,500원", "8,000원")
- **총 금액**: "총 금액" 텍스트와 함께 총 금액을 굵은 글씨로 표시 (예: "총 금액 **12,500원**")
- **주문하기 버튼**: 장바구니 하단에 회색 테두리의 "주문하기" 버튼

### 4.3 기능 요구사항

#### 4.3.1 메뉴 표시 기능
- **FR-001**: 서버에서 메뉴 목록을 조회하여 화면에 카드 형태로 표시
- **FR-002**: 각 메뉴 카드에 제품 이미지, 제품명, 가격, 설명이 표시되어야 함
- **FR-003**: 메뉴가 많을 경우 스크롤 가능하도록 구현

#### 4.3.2 옵션 선택 기능
- **FR-004**: 각 메뉴 카드에서 "샷 추가" 옵션을 선택할 수 있어야 함
- **FR-005**: 각 메뉴 카드에서 "시럽 추가" 옵션을 선택할 수 있어야 함
- **FR-006**: 옵션 선택 시 가격이 실시간으로 업데이트되어야 함 (담기 버튼 근처에 최종 가격 표시 권장)

#### 4.3.3 장바구니 추가 기능
- **FR-007**: "담기" 버튼 클릭 시 선택한 메뉴와 옵션이 장바구니에 추가되어야 함
- **FR-008**: 같은 메뉴와 옵션 조합이 이미 장바구니에 있으면 수량이 증가해야 함
- **FR-009**: 장바구니에 추가 후 옵션 체크박스는 초기화되어야 함

#### 4.3.4 장바구니 관리 기능
- **FR-010**: 장바구니에 담긴 상품 목록이 실시간으로 표시되어야 함
- **FR-011**: 각 상품의 제품명, 선택된 옵션, 수량, 개별 가격이 표시되어야 함
- **FR-012**: 총 금액이 실시간으로 계산되어 표시되어야 함
- **FR-013**: 장바구니에서 상품을 삭제할 수 있는 기능 (선택 사항, 향후 확장)

#### 4.3.5 주문하기 기능
- **FR-014**: "주문하기" 버튼 클릭 시 장바구니에 담긴 주문을 서버로 전송
- **FR-015**: 주문 성공 시 장바구니가 비워지고 주문 완료 메시지 표시
- **FR-016**: 주문 실패 시 에러 메시지 표시

### 4.4 UI/UX 요구사항

#### 4.4.1 디자인 요구사항
- **UI-001**: 전체 화면은 흰색 배경을 사용
- **UI-002**: 주요 버튼과 브랜드명은 녹색 테두리 상자로 표시
- **UI-003**: 메뉴 카드는 카드 형태로 구분되며, 적절한 여백과 그림자 효과 적용
- **UI-004**: 장바구니 영역은 회색 테두리 박스로 구분
- **UI-005**: 총 금액은 굵은 글씨로 강조 표시

#### 4.4.2 인터랙션 요구사항
- **UX-001**: 버튼 클릭 시 시각적 피드백 제공 (호버 효과, 클릭 효과)
- **UX-002**: 장바구니에 상품 추가 시 애니메이션 효과 또는 시각적 피드백 제공 (선택 사항)
- **UX-003**: 옵션 선택 시 즉각적인 가격 업데이트로 사용자 경험 향상
- **UX-004**: 반응형 디자인 적용 (모바일, 태블릿, 데스크톱 지원)

#### 4.4.3 접근성 요구사항
- **A11Y-001**: 버튼과 링크에 적절한 텍스트 라벨 제공
- **A11Y-002**: 키보드 네비게이션 지원
- **A11Y-003**: 색상 대비 비율 WCAG 2.1 AA 기준 준수

### 4.5 데이터 요구사항

#### 4.5.1 메뉴 데이터 구조
```javascript
{
  id: number,           // 메뉴 고유 ID
  name: string,         // 제품명 (예: "아메리카노(ICE)")
  price: number,        // 기본 가격 (예: 4000)
  description: string,  // 제품 설명
  image: string,        // 제품 이미지 URL
  options: {
    shot: {             // 샷 추가 옵션
      name: string,     // "샷 추가"
      price: number     // 500
    },
    syrup: {            // 시럽 추가 옵션
      name: string,     // "시럽 추가"
      price: number     // 0
    }
  }
}
```

#### 4.5.2 장바구니 아이템 데이터 구조
```javascript
{
  menuId: number,       // 메뉴 ID
  name: string,         // 제품명
  basePrice: number,    // 기본 가격
  options: {
    shot: boolean,      // 샷 추가 여부
    syrup: boolean      // 시럽 추가 여부
  },
  quantity: number,     // 수량
  totalPrice: number    // 개별 총 가격 (기본 가격 + 옵션 가격) * 수량
}
```

#### 4.5.3 주문 데이터 구조
```javascript
{
  items: [              // 장바구니 아이템 배열
    {
      menuId: number,
      name: string,
      basePrice: number,
      options: {
        shot: boolean,
        syrup: boolean
      },
      quantity: number,
      totalPrice: number
    }
  ],
  totalAmount: number   // 총 주문 금액
}
```

### 4.6 API 요구사항

#### 4.6.1 메뉴 조회 API
- **API-001**: `GET /api/menus` - 모든 메뉴 목록 조회
- 응답: 메뉴 데이터 배열

#### 4.6.2 주문 생성 API
- **API-002**: `POST /api/orders` - 주문 생성
- 요청 본문: 주문 데이터 구조
- 응답: 주문 성공/실패 메시지 및 주문 ID

### 4.7 에러 처리 요구사항

#### 4.7.1 에러 케이스
- **ERR-001**: 메뉴 조회 실패 시 에러 메시지 표시 및 재시도 옵션 제공
- **ERR-002**: 주문 생성 실패 시 에러 메시지 표시 및 장바구니 유지
- **ERR-003**: 네트워크 오류 시 사용자에게 알림

### 4.8 성능 요구사항
- **PERF-001**: 메뉴 목록 로딩 시간 2초 이내
- **PERF-002**: 장바구니 업데이트는 즉각적으로 반영
- **PERF-003**: 이미지 로딩 최적화 (lazy loading 등)

### 4.9 향후 확장 계획 (선택 사항)
- 장바구니에서 수량 수정 기능
- 장바구니에서 상품 삭제 기능
- 주문 내역 확인 기능
- 즐겨찾기 메뉴 기능

## 5. 관리자 화면 PRD

### 5.1 화면 개요
관리자가 주문 현황을 확인하고 관리하며, 메뉴별 재고를 조정할 수 있는 화면입니다.

### 5.2 화면 구성 요소

#### 5.2.1 상단 헤더/내비게이션 영역
- **앱 브랜드명**: 좌측 상단에 "COZY" 텍스트 표시 (회색 테두리 상자)
- **내비게이션 버튼**: 우측 상단에 두 개의 버튼 배치
  - **주문하기 버튼**: 주문하기 화면으로 이동하는 버튼 (회색 테두리 상자)
  - **관리자 버튼**: 현재 선택된 화면을 나타내는 버튼 (회색 테두리 상자, 더 진한 테두리로 강조)

#### 5.2.2 관리자 대시보드 섹션
화면 상단에 대시보드 통계 정보를 표시하는 영역입니다.

**대시보드 구성 요소:**
- **제목**: "관리자 대시보드" 텍스트
- **주문 통계**: 한 줄로 다음 통계 정보 표시
  - 총 주문 수 (예: "총 주문 1")
  - 주문 접수 수 (예: "주문 접수 1")
  - 제조 중 수 (예: "제조 중 0")
  - 제조 완료 수 (예: "제조 완료 0")
  - 형식: "총 주문 {total} / 주문 접수 {received} / 제조 중 {inProgress} / 제조 완료 {completed}"

#### 5.2.3 재고 현황 섹션
화면 중앙에 각 메뉴별 재고 수량과 조정 기능을 제공하는 영역입니다.

**재고 현황 구성 요소:**
- **제목**: "재고 현황" 텍스트
- **재고 카드**: 각 메뉴별로 카드 형태로 표시 (가로 배치)
  - **메뉴명**: 카드 상단에 메뉴명 표시 (예: "아메리카노 (ICE)", "아메리카노 (HOT)", "카페라떼")
  - **재고 수량**: 메뉴명 아래에 현재 재고 수량 표시 (예: "10개")
  - **재고 조정 버튼**: 
    - **+ 버튼**: 재고 증가 버튼 (좌측)
    - **- 버튼**: 재고 감소 버튼 (우측)

**초기 재고 데이터 (예시):**
- 아메리카노(ICE): 10개
- 아메리카노(HOT): 10개
- 카페라떼: 10개

#### 5.2.4 주문 현황 섹션
화면 하단에 현재 주문 목록과 주문 상태 관리 기능을 제공하는 영역입니다.

**주문 현황 구성 요소:**
- **제목**: "주문 현황" 텍스트
- **주문 목록**: 각 주문별로 다음 정보를 표시
  - **주문 일시**: 주문 날짜와 시간 (예: "7월 31일 13:00")
  - **주문 상품**: 주문된 메뉴명과 수량 (예: "아메리카노(ICE) x 1")
  - **주문 금액**: 주문 총액 (예: "4,000원")
  - **주문 상태 버튼**: 주문 상태에 따라 다른 버튼 표시
    - "주문 접수" 버튼: 주문 접수 상태일 때 표시
    - "제조 중" 버튼: 제조 중 상태일 때 표시
    - "제조 완료" 버튼: 제조 완료 상태일 때 표시

### 5.3 기능 요구사항

#### 5.3.1 대시보드 통계 표시 기능
- **FR-101**: 실시간으로 주문 통계를 조회하여 대시보드에 표시
- **FR-102**: 총 주문 수, 주문 접수 수, 제조 중 수, 제조 완료 수를 구분하여 표시
- **FR-103**: 주문 상태 변경 시 통계가 실시간으로 업데이트되어야 함

#### 5.3.2 재고 관리 기능
- **FR-104**: 각 메뉴별 현재 재고 수량을 조회하여 표시
- **FR-105**: "+" 버튼 클릭 시 해당 메뉴의 재고가 1 증가
- **FR-106**: "-" 버튼 클릭 시 해당 메뉴의 재고가 1 감소
- **FR-107**: 재고 수량은 0 이하로 내려갈 수 없음 (0 미만으로 감소 시도 시 에러 처리 또는 무시)
- **FR-108**: 재고 변경 시 즉시 서버에 반영되어야 함
- **FR-109**: 재고 변경 후 화면에 즉시 업데이트된 수량 표시

#### 5.3.3 주문 현황 조회 기능
- **FR-110**: 현재 모든 주문 목록을 조회하여 표시
- **FR-111**: 각 주문의 일시, 상품 정보, 수량, 금액을 표시
- **FR-112**: 주문 목록은 최신 주문이 상단에 표시되도록 정렬 (최신순)
- **FR-113**: 주문이 많을 경우 스크롤 가능하도록 구현

#### 5.3.4 주문 상태 관리 기능
- **FR-114**: 주문 접수 상태에서 "주문 접수" 버튼 클릭 시 주문 상태가 "제조 중"으로 변경
- **FR-115**: 제조 중 상태에서 "제조 중" 버튼 클릭 시 주문 상태가 "제조 완료"로 변경
- **FR-116**: 제조 완료 상태에서는 버튼이 비활성화되거나 표시되지 않음
- **FR-117**: 주문 상태 변경 시 해당 주문의 재고가 자동으로 차감되어야 함
- **FR-118**: 주문 상태 변경 시 대시보드 통계가 실시간으로 업데이트되어야 함
- **FR-119**: 주문 상태 변경 후 화면에 즉시 업데이트된 상태 표시

### 5.4 UI/UX 요구사항

#### 5.4.1 디자인 요구사항
- **UI-101**: 전체 화면은 흰색 배경을 사용
- **UI-102**: 주요 섹션은 회색 테두리 박스로 구분
- **UI-103**: 현재 활성화된 내비게이션 버튼(관리자)은 더 진한 테두리로 강조
- **UI-104**: 재고 카드는 동일한 크기로 가로 배치
- **UI-105**: 주문 목록은 목록 형태로 세로 배치
- **UI-106**: 버튼은 명확하게 구분되도록 적절한 여백과 크기 적용

#### 5.4.2 인터랙션 요구사항
- **UX-101**: 버튼 클릭 시 시각적 피드백 제공 (호버 효과, 클릭 효과)
- **UX-102**: 재고 수정 시 즉각적인 화면 업데이트로 사용자 경험 향상
- **UX-103**: 주문 상태 변경 시 시각적 피드백 제공 (버튼 색상 변경 또는 애니메이션)
- **UX-104**: 대시보드 통계는 실시간으로 업데이트되어야 함 (폴링 또는 웹소켓 사용 권장)
- **UX-105**: 반응형 디자인 적용 (모바일, 태블릿, 데스크톱 지원)

#### 5.4.3 접근성 요구사항
- **A11Y-101**: 버튼과 링크에 적절한 텍스트 라벨 제공
- **A11Y-102**: 키보드 네비게이션 지원
- **A11Y-103**: 색상 대비 비율 WCAG 2.1 AA 기준 준수
- **A11Y-104**: 재고 수정 버튼에 명확한 라벨 제공 (+/-)

### 5.5 데이터 요구사항

#### 5.5.1 재고 데이터 구조
```javascript
{
  menuId: number,       // 메뉴 ID
  name: string,         // 메뉴명
  stock: number         // 현재 재고 수량
}
```

#### 5.5.2 주문 상태 데이터 구조
```javascript
{
  id: number,           // 주문 ID
  orderDate: string,    // 주문 일시 (예: "2024-07-31T13:00:00")
  items: [              // 주문 항목 배열
    {
      menuId: number,
      name: string,
      quantity: number,
      price: number
    }
  ],
  totalAmount: number,  // 총 주문 금액
  status: string        // 주문 상태: "주문 접수" | "제조 중" | "제조 완료"
}
```

#### 5.5.3 대시보드 통계 데이터 구조
```javascript
{
  total: number,        // 총 주문 수
  received: number,     // 주문 접수 수
  inProgress: number,   // 제조 중 수
  completed: number     // 제조 완료 수
}
```

#### 5.5.4 재고 수정 요청 데이터 구조
```javascript
{
  menuId: number,       // 메뉴 ID
  change: number        // 변경량 (+1 또는 -1)
}
```

#### 5.5.5 주문 상태 변경 요청 데이터 구조
```javascript
{
  orderId: number,      // 주문 ID
  status: string        // 변경할 상태: "주문 접수" | "제조 중" | "제조 완료"
}
```

### 5.6 API 요구사항

#### 5.6.1 대시보드 통계 조회 API
- **API-101**: `GET /api/admin/dashboard` - 대시보드 통계 조회
- 응답: 대시보드 통계 데이터 구조

#### 5.6.2 재고 조회 API
- **API-102**: `GET /api/admin/inventory` - 모든 메뉴의 재고 조회
- 응답: 재고 데이터 배열

#### 5.6.3 재고 수정 API
- **API-103**: `PUT /api/admin/inventory/:menuId` - 특정 메뉴의 재고 수정
- 요청 본문: 재고 수정 요청 데이터 구조
- 응답: 업데이트된 재고 데이터

#### 5.6.4 주문 목록 조회 API
- **API-104**: `GET /api/admin/orders` - 모든 주문 목록 조회
- 응답: 주문 상태 데이터 배열 (최신순 정렬)

#### 5.6.5 주문 상태 변경 API
- **API-105**: `PUT /api/admin/orders/:orderId/status` - 주문 상태 변경
- 요청 본문: 주문 상태 변경 요청 데이터 구조
- 응답: 업데이트된 주문 데이터

### 5.7 에러 처리 요구사항

#### 5.7.1 에러 케이스
- **ERR-101**: 대시보드 통계 조회 실패 시 에러 메시지 표시 및 재시도 옵션 제공
- **ERR-102**: 재고 조회 실패 시 에러 메시지 표시
- **ERR-103**: 재고 수정 실패 시 에러 메시지 표시 및 변경 사항 롤백
- **ERR-104**: 재고가 0 이하로 내려가려 할 때 에러 메시지 표시
- **ERR-105**: 주문 목록 조회 실패 시 에러 메시지 표시 및 재시도 옵션 제공
- **ERR-106**: 주문 상태 변경 실패 시 에러 메시지 표시 및 상태 롤백
- **ERR-107**: 네트워크 오류 시 사용자에게 알림

### 5.8 성능 요구사항
- **PERF-101**: 대시보드 통계 로딩 시간 2초 이내
- **PERF-102**: 재고 수정은 즉각적으로 반영
- **PERF-103**: 주문 목록 로딩 시간 2초 이내
- **PERF-104**: 대시보드 통계는 주기적으로 업데이트 (폴링 간격: 5초 또는 웹소켓 사용)

### 5.9 비즈니스 로직 요구사항

#### 5.9.1 재고 관리 로직
- **BL-101**: 재고 수량은 0 이상의 정수만 허용
- **BL-102**: 재고 증가 시 제한 없음
- **BL-103**: 재고 감소 시 0 이하로 내려갈 수 없음

#### 5.9.2 주문 상태 변경 로직
- **BL-104**: 주문 상태는 다음 순서로만 변경 가능: "주문 접수" → "제조 중" → "제조 완료"
- **BL-105**: 이전 상태로 되돌릴 수 없음
- **BL-106**: "주문 접수" 상태에서 "제조 중"으로 변경 시 해당 주문의 재고가 차감되어야 함
- **BL-107**: 재고가 부족한 경우 주문 상태 변경을 막아야 함 (선택 사항)

### 5.10 향후 확장 계획 (선택 사항)
- 주문 취소 기능
- 재고 수량 직접 입력 기능 (현재는 +/- 버튼만)
- 주문 상세 정보 보기 기능
- 주문 히스토리 조회 기능
- 재고 알림 기능 (재고 부족 시 알림)
- 매출 통계 기능
- 주문 필터링 기능 (상태별, 날짜별)

## 6. 백엔드 개발 PRD

### 6.1 데이터 모델

#### 6.1.1 Menus 테이블
커피 메뉴 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 메뉴 고유 ID
- `name` (VARCHAR(100), NOT NULL): 커피 이름 (예: "아메리카노(ICE)")
- `description` (TEXT): 메뉴 설명 (예: "시원하고 깔끔한 아이스 아메리카노")
- `price` (INTEGER, NOT NULL): 기본 가격 (예: 4000)
- `image` (VARCHAR(255)): 이미지 URL 또는 파일 경로
- `stock` (INTEGER, NOT NULL, DEFAULT 0): 재고 수량
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 일시

**예시 데이터:**
```sql
INSERT INTO menus (name, description, price, image, stock) VALUES
('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, '/images/americano-ice.jpg', 10),
('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노', 4000, '/images/americano-hot.jpg', 10),
('카페라떼', '부드럽고 고소한 카페라떼', 5000, '/images/caffe-latte.jpg', 10);
```

#### 6.1.2 Options 테이블
메뉴에 추가할 수 있는 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 옵션 고유 ID
- `name` (VARCHAR(100), NOT NULL): 옵션 이름 (예: "샷 추가", "시럽 추가")
- `price` (INTEGER, NOT NULL, DEFAULT 0): 옵션 가격 (예: 500)
- `menu_id` (INTEGER, FOREIGN KEY REFERENCES menus(id)): 연결할 메뉴 ID (NULL일 경우 모든 메뉴에 적용 가능)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 일시

**예시 데이터:**
```sql
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, NULL),  -- 모든 메뉴에 적용 가능
('시럽 추가', 0, NULL);  -- 모든 메뉴에 적용 가능
```

#### 6.1.3 Orders 테이블
주문 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 고유 ID
- `order_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): 주문 일시
- `status` (VARCHAR(20), NOT NULL, DEFAULT '주문 접수'): 주문 상태 ('주문 접수', '제조 중', '제조 완료')
- `total_amount` (INTEGER, NOT NULL): 총 주문 금액
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 일시

**예시 데이터:**
```sql
INSERT INTO orders (order_date, status, total_amount) VALUES
('2024-07-31 13:00:00', '주문 접수', 12500);
```

#### 6.1.4 Order_Items 테이블
주문에 포함된 메뉴와 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 항목 고유 ID
- `order_id` (INTEGER, FOREIGN KEY REFERENCES orders(id), NOT NULL): 주문 ID
- `menu_id` (INTEGER, FOREIGN KEY REFERENCES menus(id), NOT NULL): 메뉴 ID
- `quantity` (INTEGER, NOT NULL, DEFAULT 1): 수량
- `unit_price` (INTEGER, NOT NULL): 단위 가격 (메뉴 기본 가격 + 옵션 가격)
- `total_price` (INTEGER, NOT NULL): 항목 총 가격 (단위 가격 * 수량)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시

**예시 데이터:**
```sql
INSERT INTO order_items (order_id, menu_id, quantity, unit_price, total_price) VALUES
(1, 1, 1, 4500, 4500),  -- 아메리카노(ICE) + 샷 추가
(1, 2, 2, 4000, 8000);  -- 아메리카노(HOT) x 2
```

#### 6.1.5 Order_Item_Options 테이블
주문 항목에 선택된 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 레코드 고유 ID
- `order_item_id` (INTEGER, FOREIGN KEY REFERENCES order_items(id), NOT NULL): 주문 항목 ID
- `option_id` (INTEGER, FOREIGN KEY REFERENCES options(id), NOT NULL): 옵션 ID
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시

**예시 데이터:**
```sql
INSERT INTO order_item_options (order_item_id, option_id) VALUES
(1, 1);  -- 첫 번째 주문 항목에 "샷 추가" 옵션 적용
```

### 6.2 데이터 스키마를 위한 사용자 흐름

#### 6.2.1 메뉴 조회 및 표시
**[1] Menus 테이블에서 메뉴 정보 조회**
- 사용자가 '주문하기' 화면에 접속하면 `GET /api/menus` API를 호출
- Menus 테이블에서 모든 메뉴 정보를 조회 (name, description, price, image)
- 조회된 메뉴 정보를 브라우저 화면에 카드 형태로 표시
- 재고 수량(stock) 정보는 관리자 화면에서만 조회하여 표시 (`GET /api/admin/inventory`)

**흐름도:**
```
사용자 접속 → GET /api/menus → Menus 테이블 조회 → 메뉴 목록 반환 → 화면 표시
```

#### 6.2.2 장바구니 관리
**[2] 사용자가 메뉴 선택 및 장바구니에 추가**
- 사용자가 메뉴 카드에서 옵션(샷 추가, 시럽 추가)을 선택
- "담기" 버튼 클릭 시 프런트엔드에서 장바구니 상태에 추가
- 이 단계에서는 서버 통신 없이 클라이언트 측에서만 관리
- 장바구니에는 메뉴 ID, 옵션 정보, 수량이 저장됨

**흐름도:**
```
메뉴 선택 → 옵션 선택 → 담기 버튼 클릭 → 장바구니에 추가 (클라이언트 측)
```

#### 6.2.3 주문 생성
**[3] 주문하기 버튼 클릭 시 주문 정보 저장**
- 사용자가 장바구니에서 "주문하기" 버튼을 클릭
- `POST /api/orders` API를 호출하여 주문 정보 전송
- 서버에서 다음 작업 수행:
  1. Orders 테이블에 주문 레코드 생성 (order_date, status='주문 접수', total_amount)
  2. Order_Items 테이블에 주문 항목들 생성 (order_id, menu_id, quantity, unit_price, total_price)
  3. Order_Item_Options 테이블에 선택된 옵션 정보 저장
  4. 주문 생성 성공 시 주문 ID 반환

**흐름도:**
```
주문하기 버튼 클릭 → POST /api/orders → 
  → Orders 테이블에 주문 생성
  → Order_Items 테이블에 주문 항목 생성
  → Order_Item_Options 테이블에 옵션 정보 저장
  → 주문 ID 반환 → 주문 완료
```

#### 6.2.4 주문 현황 조회 및 상태 변경
**[4] 관리자 화면에서 주문 현황 표시 및 상태 변경**
- 관리자 화면 접속 시 `GET /api/admin/orders` API를 호출
- Orders, Order_Items, Order_Item_Options 테이블을 JOIN하여 주문 정보 조회
- 주문 상태별로 필터링하여 '주문 현황' 섹션에 표시
- 관리자가 "제조 시작" 버튼 클릭 시:
  1. `PUT /api/admin/orders/:orderId/status` API 호출
  2. Orders 테이블의 status를 '제조 중'으로 업데이트
  3. 해당 주문의 메뉴 재고 차감 (Menus 테이블의 stock 감소)
- 관리자가 "제조 완료" 버튼 클릭 시:
  1. `PUT /api/admin/orders/:orderId/status` API 호출
  2. Orders 테이블의 status를 '제조 완료'로 업데이트

**흐름도:**
```
관리자 화면 접속 → GET /api/admin/orders → 주문 목록 조회 → 화면 표시
제조 시작 클릭 → PUT /api/admin/orders/:id/status → 
  → Orders.status = '제조 중'
  → Menus.stock 감소
제조 완료 클릭 → PUT /api/admin/orders/:id/status → 
  → Orders.status = '제조 완료'
```

### 6.3 API 설계

#### 6.3.1 메뉴 관련 API

##### API-201: 메뉴 목록 조회
- **엔드포인트**: `GET /api/menus`
- **설명**: 데이터베이스에서 모든 커피 메뉴 목록을 조회하여 반환
- **요청**: 없음
- **응답**:
  ```json
  [
    {
      "id": 1,
      "name": "아메리카노(ICE)",
      "description": "시원하고 깔끔한 아이스 아메리카노",
      "price": 4000,
      "image": "/images/americano-ice.jpg"
    },
    {
      "id": 2,
      "name": "아메리카노(HOT)",
      "description": "따뜻하고 진한 핫 아메리카노",
      "price": 4000,
      "image": "/images/americano-hot.jpg"
    }
  ]
  ```
- **에러 응답**:
  - `500 Internal Server Error`: 데이터베이스 오류

##### API-202: 메뉴 상세 조회
- **엔드포인트**: `GET /api/menus/:id`
- **설명**: 특정 메뉴의 상세 정보를 조회
- **요청 파라미터**: `id` (메뉴 ID)
- **응답**:
  ```json
  {
    "id": 1,
    "name": "아메리카노(ICE)",
    "description": "시원하고 깔끔한 아이스 아메리카노",
    "price": 4000,
    "image": "/images/americano-ice.jpg",
    "options": [
      {
        "id": 1,
        "name": "샷 추가",
        "price": 500
      },
      {
        "id": 2,
        "name": "시럽 추가",
        "price": 0
      }
    ]
  }
  ```
- **에러 응답**:
  - `404 Not Found`: 메뉴를 찾을 수 없음
  - `500 Internal Server Error`: 데이터베이스 오류

#### 6.3.2 주문 관련 API

##### API-203: 주문 생성
- **엔드포인트**: `POST /api/orders`
- **설명**: 사용자가 선택한 메뉴와 옵션 정보를 데이터베이스에 저장
- **요청 본문**:
  ```json
  {
    "items": [
      {
        "menuId": 1,
        "name": "아메리카노(ICE)",
        "quantity": 1,
        "basePrice": 4000,
        "options": {
          "shot": true,
          "syrup": false
        },
        "totalPrice": 4500
      },
      {
        "menuId": 2,
        "name": "아메리카노(HOT)",
        "quantity": 2,
        "basePrice": 4000,
        "options": {
          "shot": false,
          "syrup": false
        },
        "totalPrice": 8000
      }
    ],
    "totalAmount": 12500
  }
  ```
- **응답**:
  ```json
  {
    "success": true,
    "orderId": 1,
    "message": "주문이 성공적으로 생성되었습니다."
  }
  ```
- **처리 로직**:
  1. Orders 테이블에 주문 레코드 생성 (order_date: 현재 시간, status: '주문 접수', total_amount)
  2. 각 주문 항목에 대해:
     - Order_Items 테이블에 레코드 생성
     - 선택된 옵션이 있으면 Order_Item_Options 테이블에 레코드 생성
  3. 생성된 주문 ID 반환
- **에러 응답**:
  - `400 Bad Request`: 잘못된 요청 데이터
  - `500 Internal Server Error`: 데이터베이스 오류

##### API-204: 주문 상세 조회
- **엔드포인트**: `GET /api/orders/:id`
- **설명**: 주문 ID를 전달하면 해당 주문 정보를 반환
- **요청 파라미터**: `id` (주문 ID)
- **응답**:
  ```json
  {
    "id": 1,
    "orderDate": "2024-07-31T13:00:00.000Z",
    "status": "주문 접수",
    "totalAmount": 12500,
    "items": [
      {
        "menuId": 1,
        "menuName": "아메리카노(ICE)",
        "quantity": 1,
        "unitPrice": 4500,
        "totalPrice": 4500,
        "options": [
          {
            "id": 1,
            "name": "샷 추가",
            "price": 500
          }
        ]
      },
      {
        "menuId": 2,
        "menuName": "아메리카노(HOT)",
        "quantity": 2,
        "unitPrice": 4000,
        "totalPrice": 8000,
        "options": []
      }
    ]
  }
  ```
- **에러 응답**:
  - `404 Not Found`: 주문을 찾을 수 없음
  - `500 Internal Server Error`: 데이터베이스 오류

##### API-205: 주문 목록 조회 (관리자)
- **엔드포인트**: `GET /api/admin/orders`
- **설명**: 모든 주문 목록을 최신순으로 조회
- **요청**: 없음 (또는 쿼리 파라미터로 필터링 가능: `?status=주문 접수`)
- **응답**:
  ```json
  [
    {
      "id": 1,
      "orderDate": "2024-07-31T13:00:00.000Z",
      "status": "주문 접수",
      "totalAmount": 12500,
      "items": [
        {
          "menuId": 1,
          "menuName": "아메리카노(ICE)",
          "quantity": 1,
          "unitPrice": 4500,
          "totalPrice": 4500,
          "options": ["샷 추가"]
        }
      ]
    }
  ]
  ```
- **에러 응답**:
  - `500 Internal Server Error`: 데이터베이스 오류

##### API-206: 주문 상태 변경 (관리자)
- **엔드포인트**: `PUT /api/admin/orders/:id/status`
- **설명**: 주문 상태를 변경하고, 제조 시작 시 재고를 차감
- **요청 파라미터**: `id` (주문 ID)
- **요청 본문**:
  ```json
  {
    "status": "제조 중"
  }
  ```
- **응답**:
  ```json
  {
    "success": true,
    "orderId": 1,
    "status": "제조 중",
    "message": "주문 상태가 업데이트되었습니다."
  }
  ```
- **처리 로직**:
  1. Orders 테이블에서 주문 조회
  2. 주문 상태 유효성 검증 ('주문 접수' → '제조 중' → '제조 완료' 순서만 허용)
  3. 상태가 '제조 중'으로 변경되는 경우:
     - 해당 주문의 모든 주문 항목 조회
     - 각 주문 항목에 대해 Menus 테이블의 재고 확인
     - 재고가 부족한 경우 에러 반환
     - 재고가 충분한 경우 Menus 테이블의 stock을 감소
  4. Orders 테이블의 status 업데이트
- **에러 응답**:
  - `400 Bad Request`: 잘못된 상태 변경 (예: '제조 완료' → '제조 중')
  - `404 Not Found`: 주문을 찾을 수 없음
  - `409 Conflict`: 재고 부족
  - `500 Internal Server Error`: 데이터베이스 오류

#### 6.3.3 재고 관리 API (관리자)

##### API-207: 재고 목록 조회 (관리자)
- **엔드포인트**: `GET /api/admin/inventory`
- **설명**: 모든 메뉴의 재고 수량을 조회
- **요청**: 없음
- **응답**:
  ```json
  [
    {
      "menuId": 1,
      "name": "아메리카노(ICE)",
      "stock": 10
    },
    {
      "menuId": 2,
      "name": "아메리카노(HOT)",
      "stock": 10
    },
    {
      "menuId": 3,
      "name": "카페라떼",
      "stock": 10
    }
  ]
  ```
- **에러 응답**:
  - `500 Internal Server Error`: 데이터베이스 오류

##### API-208: 재고 수정 (관리자)
- **엔드포인트**: `PUT /api/admin/inventory/:menuId`
- **설명**: 특정 메뉴의 재고 수량을 수정
- **요청 파라미터**: `menuId` (메뉴 ID)
- **요청 본문**:
  ```json
  {
    "stock": 15
  }
  ```
- **응답**:
  ```json
  {
    "success": true,
    "menuId": 1,
    "stock": 15,
    "message": "재고가 업데이트되었습니다."
  }
  ```
- **처리 로직**:
  1. Menus 테이블에서 메뉴 조회
  2. 재고 수량 유효성 검증 (0 이상의 정수)
  3. Menus 테이블의 stock 필드 업데이트
- **에러 응답**:
  - `400 Bad Request`: 잘못된 재고 수량 (음수 등)
  - `404 Not Found`: 메뉴를 찾을 수 없음
  - `500 Internal Server Error`: 데이터베이스 오류

#### 6.3.4 대시보드 통계 API (관리자)

##### API-209: 대시보드 통계 조회 (관리자)
- **엔드포인트**: `GET /api/admin/dashboard`
- **설명**: 주문 통계 정보를 조회
- **요청**: 없음
- **응답**:
  ```json
  {
    "total": 10,
    "received": 5,
    "inProgress": 3,
    "completed": 2
  }
  ```
- **처리 로직**:
  1. Orders 테이블에서 전체 주문 수 카운트
  2. 상태별로 그룹화하여 각 상태별 주문 수 카운트
  3. 통계 정보 반환
- **에러 응답**:
  - `500 Internal Server Error`: 데이터베이스 오류

### 6.4 데이터베이스 스키마 설계

#### 6.4.1 테이블 관계도 (ERD)

```
Menus (1) ──< (N) Order_Items
  │
  │ (1)
  │
  └──< (N) Options (menu_id가 NULL인 경우 모든 메뉴에 적용)

Orders (1) ──< (N) Order_Items
  │
  │ (1)
  │
  └──< (N) Order_Items (1) ──< (N) Order_Item_Options
                                          │
                                          │ (N)
                                          │
                                          └──> (1) Options
```

#### 6.4.2 데이터베이스 스키마 SQL

```sql
-- Menus 테이블 생성
CREATE TABLE menus (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  image VARCHAR(255),
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Options 테이블 생성
CREATE TABLE options (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  menu_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL
);

-- Orders 테이블 생성
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT '주문 접수',
  total_amount INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (status IN ('주문 접수', '제조 중', '제조 완료'))
);

-- Order_Items 테이블 생성
CREATE TABLE order_items (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  order_id INTEGER NOT NULL,
  menu_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE RESTRICT
);

-- Order_Item_Options 테이블 생성
CREATE TABLE order_item_options (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  order_item_id INTEGER NOT NULL,
  option_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
  FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_order_item_option (order_item_id, option_id)
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_order_date ON orders(order_date);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX idx_menus_name ON menus(name);
```

### 6.5 비즈니스 로직 요구사항

#### 6.5.1 주문 생성 로직
- **BL-201**: 주문 생성 시 주문 일시를 현재 시간으로 설정
- **BL-202**: 주문 생성 시 기본 상태는 '주문 접수'로 설정
- **BL-203**: 주문 생성 시 총 금액은 모든 주문 항목의 총 가격 합계와 일치해야 함
- **BL-204**: 주문 항목의 단위 가격은 메뉴 기본 가격 + 선택된 옵션 가격의 합계

#### 6.5.2 주문 상태 변경 로직
- **BL-205**: 주문 상태는 '주문 접수' → '제조 중' → '제조 완료' 순서로만 변경 가능
- **BL-206**: 이전 상태로 되돌릴 수 없음
- **BL-207**: '제조 중'으로 변경 시 해당 주문의 모든 메뉴 재고를 확인
- **BL-208**: 재고가 부족한 경우 상태 변경을 거부하고 에러 반환
- **BL-209**: 재고가 충분한 경우에만 상태 변경 및 재고 차감 수행

#### 6.5.3 재고 관리 로직
- **BL-210**: 재고 수량은 0 이상의 정수만 허용
- **BL-211**: 재고 증가 시 제한 없음
- **BL-212**: 재고 감소 시 0 미만으로 내려갈 수 없음
- **BL-213**: 주문 상태가 '제조 중'으로 변경될 때만 재고 차감
- **BL-214**: 재고 차감은 트랜잭션으로 처리하여 데이터 일관성 보장

### 6.6 에러 처리 요구사항

#### 6.6.1 공통 에러 응답 형식
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "에러 메시지",
    "details": {}
  }
}
```

#### 6.6.2 에러 코드 정의
- **ERR-201**: 메뉴를 찾을 수 없음 (404)
- **ERR-202**: 주문을 찾을 수 없음 (404)
- **ERR-203**: 잘못된 주문 데이터 (400)
- **ERR-204**: 재고 부족 (409)
- **ERR-205**: 잘못된 주문 상태 변경 (400)
- **ERR-206**: 데이터베이스 오류 (500)
- **ERR-207**: 잘못된 재고 수량 (400)

### 6.7 성능 요구사항
- **PERF-201**: 메뉴 목록 조회 응답 시간 500ms 이내
- **PERF-202**: 주문 생성 응답 시간 1초 이내
- **PERF-203**: 주문 목록 조회 응답 시간 1초 이내 (100건 기준)
- **PERF-204**: 데이터베이스 쿼리 최적화 (인덱스 활용)
- **PERF-205**: 트랜잭션 처리로 데이터 일관성 보장

### 6.8 보안 요구사항
- **SEC-201**: SQL Injection 방지 (파라미터화된 쿼리 사용)
- **SEC-202**: 입력 데이터 유효성 검증
- **SEC-203**: CORS 설정 (프런트엔드 도메인만 허용)
- **SEC-204**: 에러 메시지에 민감한 정보 포함 금지

### 6.9 향후 확장 계획
- 주문 취소 기능
- 주문 히스토리 조회 (페이징 처리)
- 메뉴 관리 API (CRUD)
- 옵션 관리 API (CRUD)
- 주문 통계 API (일별, 월별 매출 등)
- 이미지 업로드 기능
- 재고 알림 기능 (재고 부족 시 알림)