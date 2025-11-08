# 백엔드 서버 설정 가이드

## 1. 의존성 설치

Git Bash 또는 터미널에서 다음 명령어를 실행하세요:

```bash
cd server
npm install
```

## 2. PostgreSQL 데이터베이스 생성

### 방법 1: 자동 생성 (권장)
다음 명령어를 실행하면 데이터베이스가 자동으로 생성됩니다:

```bash
npm run db:create
```

이 명령어는:
- PostgreSQL 서버 연결 확인
- `coffee_order_db` 데이터베이스가 없으면 자동 생성
- 연결 정보 오류 시 해결 방법 안내

### 방법 2: 수동 생성
PostgreSQL에 직접 접속하여 데이터베이스를 생성하세요:

#### psql 명령어 사용
```bash
psql -U postgres
CREATE DATABASE coffee_order_db;
\q
```

#### createdb 명령어 사용
```bash
createdb -U postgres coffee_order_db
```

## 3. 환경 변수 설정

`server/.env` 파일을 열어 데이터베이스 설정을 확인하고 수정하세요:

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

## 4. 데이터베이스 초기화

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

## 5. 데이터베이스 연결 테스트

연결을 테스트하려면:

```bash
npm run db:test
```

## 6. 서버 실행

데이터베이스 초기화가 완료되면 서버를 실행할 수 있습니다:

```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## 문제 해결

### PostgreSQL 연결 오류

**문제**: `데이터베이스 연결 실패`

**해결 방법**:
1. PostgreSQL 서버가 실행 중인지 확인
   ```bash
   # Windows에서 PostgreSQL 서비스 확인
   services.msc
   # 또는
   pg_ctl status
   ```

2. `.env` 파일의 데이터베이스 설정 확인
   - DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD가 올바른지 확인

3. PostgreSQL 사용자 권한 확인
   ```sql
   -- PostgreSQL에 접속하여 확인
   \du
   ```

4. 데이터베이스가 존재하는지 확인
   ```sql
   \l
   ```

### 테이블이 이미 존재하는 경우

초기화 스크립트는 `CREATE TABLE IF NOT EXISTS`를 사용하므로 안전하게 실행할 수 있습니다.
기존 데이터를 삭제하고 다시 초기화하려면:

```sql
-- PostgreSQL에 접속하여 실행
DROP TABLE IF EXISTS order_item_options CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS options CASCADE;
DROP TABLE IF EXISTS menus CASCADE;
```

그 다음 다시 `npm run db:init`을 실행하세요.

### 포트가 이미 사용 중인 경우

서버 포트(기본값: 5000)가 이미 사용 중이면 `.env` 파일에서 `PORT` 값을 변경하세요.

## 다음 단계

데이터베이스 초기화가 완료되면:
1. 모델 파일들(`src/models/*.js`)을 실제 데이터베이스 쿼리로 구현
2. API 엔드포인트 테스트
3. 프런트엔드와 연동

자세한 내용은 `server/README.md`와 `docs/PRD.md`를 참고하세요.

