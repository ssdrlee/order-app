# Render 데이터베이스 설정 가이드

## 1. Render에서 데이터베이스 정보 확인

1. Render 대시보드에서 PostgreSQL 데이터베이스 선택
2. **Connections** 탭에서 다음 정보 확인:
   - **Internal Database URL**: Render 서비스 내부에서 사용
   - **External Database URL**: 로컬에서 연결 시 사용
   - 또는 개별 정보:
     - Host
     - Port
     - Database
     - User
     - Password

## 2. 로컬 .env 파일 설정

`server/.env` 파일을 다음과 같이 설정:

```env
# Render 데이터베이스 연결 정보
DB_HOST=<Render 데이터베이스 호스트>
DB_PORT=5432
DB_NAME=<데이터베이스 이름>
DB_USER=<사용자 이름>
DB_PASSWORD=<비밀번호>
DB_SSL=true  # Render의 경우 SSL 연결 필요
```

### 방법 1: External Database URL 사용

External Database URL 형식:
```
postgresql://user:password@host:port/database
```

URL을 파싱하여 환경 변수로 설정:
```env
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=coffee_order_db_xxxx
DB_USER=coffee_user
DB_PASSWORD=your_password
DB_SSL=true
```

### 방법 2: Render 대시보드에서 정보 복사

Render 대시보드의 **Connections** 탭에서 개별 정보를 복사하여 설정합니다.

## 3. 데이터베이스 초기화

로컬에서 Render 데이터베이스에 연결하여 초기화:

```bash
cd server
npm run db:init-render
```

이 명령어는:
1. `.env` 파일에서 데이터베이스 연결 정보 읽기
2. Render 데이터베이스에 연결
3. 스키마 생성 (테이블, 인덱스, 트리거)
4. 초기 데이터 삽입 (메뉴, 옵션)

## 4. 연결 확인

### 방법 1: 스크립트로 확인

```bash
cd server
npm run db:test
```

### 방법 2: 직접 확인

```bash
# psql 사용 (설치되어 있는 경우)
psql "postgresql://user:password@host:port/database?sslmode=require"

# 또는 연결 문자열 사용
psql $DATABASE_URL
```

## 5. 문제 해결

### SSL 연결 오류

Render의 데이터베이스는 SSL 연결이 필요합니다:
```env
DB_SSL=true
```

또는 연결 문자열에 `?sslmode=require` 추가

### 연결 시간 초과

- 방화벽 설정 확인
- External Database URL 사용 (로컬에서 연결 시)
- 네트워크 연결 확인

### 인증 오류

- 사용자 이름과 비밀번호 확인
- 데이터베이스 이름 확인
- 호스트 주소 확인

## 6. Render Shell에서 직접 실행 (대안)

Render 대시보드의 **Shell** 기능을 사용하여 직접 실행할 수도 있습니다:

1. Render 대시보드 → 서비스 선택 → **Shell** 탭
2. 다음 명령어 실행:
   ```bash
   cd server
   npm run db:init
   ```

이 경우 Internal Database URL이 자동으로 사용됩니다.

## 7. 확인

초기화가 완료되면 다음을 확인:

1. 테이블 생성 확인:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

2. 메뉴 데이터 확인:
   ```sql
   SELECT * FROM menus;
   ```

3. 옵션 데이터 확인:
   ```sql
   SELECT * FROM options;
   ```

## 8. 참고사항

- Render의 Free 플랜 데이터베이스는 90일 후 자동으로 삭제될 수 있습니다
- 프로덕션 환경에서는 Paid 플랜 사용 권장
- 데이터베이스 비밀번호는 안전하게 보관하세요
- 환경 변수는 절대 Git에 커밋하지 마세요

