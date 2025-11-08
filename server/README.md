# 커피 주문 앱 - 백엔드 서버

Express.js를 사용한 커피 주문 앱의 백엔드 서버입니다.

## 기술 스택

- Node.js
- Express.js
- PostgreSQL
- pg (PostgreSQL 클라이언트)

## 개발 환경 설정

### 1. 의존성 설치

Git Bash 또는 터미널에서 다음 명령어를 실행하세요:

```bash
cd server
npm install
```

### 2. PostgreSQL 데이터베이스 생성

PostgreSQL에 접속하여 데이터베이스를 생성하세요:

```sql
CREATE DATABASE coffee_order_db;
```

또는 psql 명령어로:

```bash
createdb -U postgres coffee_order_db
```

### 3. 환경 변수 설정

`.env` 파일을 열어 데이터베이스 설정을 확인하고 수정하세요:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=postgres
```

**중요**: `DB_PASSWORD`를 실제 PostgreSQL 비밀번호로 변경하세요.

### 4. 데이터베이스 초기화

데이터베이스 스키마를 생성하고 초기 데이터를 삽입합니다:

```bash
npm run db:init
```

이 명령어는 다음을 수행합니다:
- 데이터베이스 연결 테스트
- 테이블 생성 (menus, options, orders, order_items, order_item_options)
- 인덱스 생성
- 트리거 생성 (updated_at 자동 업데이트)
- 초기 데이터 삽입 (메뉴 6개, 옵션 2개)

### 5. 데이터베이스 연결 테스트

연결을 테스트하려면:

```bash
npm run db:test
```

### 6. 서버 실행

#### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

#### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## 프로젝트 구조

```
server/
├── database/
│   ├── schema.sql           # 데이터베이스 스키마
│   ├── seed.sql             # 초기 데이터
│   ├── init.js              # 데이터베이스 초기화 스크립트
│   ├── test-connection.js   # 연결 테스트 스크립트
│   └── README.md            # 데이터베이스 설정 가이드
├── src/
│   ├── config/
│   │   └── database.js      # 데이터베이스 연결 설정
│   ├── controllers/
│   │   ├── menuController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   ├── models/
│   │   ├── menuModel.js
│   │   ├── orderModel.js
│   │   └── adminModel.js
│   ├── routes/
│   │   ├── menuRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   └── server.js            # 메인 서버 파일
├── .env                     # 환경 변수 설정
├── .gitignore
├── package.json
├── README.md
└── SETUP.md                 # 상세 설정 가이드
```

## API 엔드포인트

### 메뉴 관련
- `GET /api/menus` - 모든 메뉴 목록 조회
- `GET /api/menus/:id` - 특정 메뉴 상세 조회

### 주문 관련
- `POST /api/orders` - 주문 생성
- `GET /api/orders/:id` - 주문 상세 조회

### 관리자 관련
- `GET /api/admin/dashboard` - 대시보드 통계 조회
- `GET /api/admin/inventory` - 재고 목록 조회
- `PUT /api/admin/inventory/:menuId` - 재고 수정
- `GET /api/admin/orders` - 주문 목록 조회
- `PUT /api/admin/orders/:orderId/status` - 주문 상태 변경

자세한 API 명세는 `docs/PRD.md`의 6.3 섹션을 참고하세요.

## 개발 가이드

### 데이터베이스 모델 구현

현재 모델 파일들은 더미 데이터를 반환합니다. 실제 데이터베이스 연결 후 다음 파일들을 구현해야 합니다:

- `src/models/menuModel.js`
- `src/models/orderModel.js`
- `src/models/adminModel.js`

### 에러 처리

모든 컨트롤러는 에러를 `next()`로 전달하여 중앙 에러 핸들러에서 처리합니다.

### 트랜잭션 처리

주문 생성 및 주문 상태 변경 시 트랜잭션을 사용하여 데이터 일관성을 보장해야 합니다.

## 참고 문서

- [Express.js 공식 문서](https://expressjs.com/)
- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [node-postgres 문서](https://node-postgres.com/)
- 프로젝트 PRD: `docs/PRD.md`

