# 데이터베이스 설정 가이드

## 1. PostgreSQL 데이터베이스 생성

PostgreSQL에 접속하여 데이터베이스를 생성하세요:

```sql
CREATE DATABASE coffee_order_db;
```

또는 psql 명령어로:

```bash
createdb coffee_order_db
```

## 2. 환경 변수 설정

`server/.env` 파일을 열어 데이터베이스 설정을 확인하세요:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=postgres
```

실제 환경에 맞게 수정하세요.

## 3. 데이터베이스 초기화

의존성이 설치된 후 다음 명령어를 실행하세요:

```bash
npm run db:init
```

이 명령어는 다음을 수행합니다:
1. 데이터베이스 연결 테스트
2. 스키마 생성 (테이블, 인덱스, 트리거)
3. 초기 데이터 삽입 (메뉴, 옵션)

## 4. 데이터베이스 연결 테스트

연결을 테스트하려면:

```bash
npm run db:test
```

## 파일 설명

- `schema.sql`: 데이터베이스 스키마 (테이블, 인덱스, 트리거)
- `seed.sql`: 초기 데이터 (메뉴, 옵션)
- `init.js`: 데이터베이스 초기화 스크립트

## 문제 해결

### 연결 오류
- PostgreSQL 서버가 실행 중인지 확인
- `.env` 파일의 데이터베이스 설정이 올바른지 확인
- PostgreSQL 사용자 권한 확인

### 테이블이 이미 존재하는 경우
- `schema.sql`에서 `CREATE TABLE IF NOT EXISTS`를 사용하므로 안전하게 실행 가능
- 필요시 기존 테이블을 삭제하고 다시 초기화:
  ```sql
  DROP TABLE IF EXISTS order_item_options CASCADE;
  DROP TABLE IF EXISTS order_items CASCADE;
  DROP TABLE IF EXISTS orders CASCADE;
  DROP TABLE IF EXISTS options CASCADE;
  DROP TABLE IF EXISTS menus CASCADE;
  ```

