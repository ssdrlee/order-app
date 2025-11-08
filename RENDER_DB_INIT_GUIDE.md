# Render.com 데이터베이스 초기화 가이드

## 문제 상황
콘솔에 "relation 'menus' does not exist" 및 "relation 'orders' does not exist" 오류 발생
- 데이터베이스 테이블이 생성되지 않음
- 데이터베이스 초기화가 완료되지 않음

## 해결 방법

### 방법 1: Render.com Shell 사용 (권장)

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - 백엔드 서비스 (`order-app-backend-jic0`) 선택

2. **Shell 탭으로 이동**
   - 왼쪽 사이드바에서 "Shell" 클릭
   - 또는 서비스 페이지에서 "Shell" 탭 클릭

3. **데이터베이스 초기화 실행**
   ```bash
   cd server
   npm install
   npm run db:init-render
   ```

4. **초기화 완료 확인**
   - 로그에서 "데이터베이스 초기화가 완료되었습니다!" 메시지 확인
   - 테이블 목록 확인
   - 메뉴 데이터 확인

### 방법 2: 로컬에서 Render 데이터베이스에 연결

1. **Render.com 데이터베이스 정보 확인**
   - Render 대시보드 → 데이터베이스 선택
   - "Connections" 또는 "Info" 탭에서 연결 정보 확인

2. **로컬 .env 파일 설정**
   `server/.env` 파일에 Render 데이터베이스 정보 설정:
   ```env
   DB_HOST=<Render 데이터베이스 호스트>
   DB_PORT=5432
   DB_NAME=<Render 데이터베이스 이름>
   DB_USER=<Render 데이터베이스 사용자>
   DB_PASSWORD=<Render 데이터베이스 비밀번호>
   DB_SSL=true
   ```

3. **로컬에서 초기화 실행**
   ```bash
   cd server
   npm install
   npm run db:init-render
   ```

### 방법 3: Render 데이터베이스 Shell 사용

1. **Render.com 데이터베이스 선택**
   - Render 대시보드 → PostgreSQL 데이터베이스 선택

2. **Connect → Shell 선택**
   - 데이터베이스 페이지에서 "Connect" 클릭
   - "Shell" 선택

3. **SQL 직접 실행**
   ```sql
   -- schema.sql 파일의 내용을 복사하여 실행
   -- 또는 seed.sql 파일의 내용을 복사하여 실행
   ```

## 초기화 스크립트 실행 결과 확인

초기화 스크립트가 성공적으로 실행되면 다음 메시지들이 표시됩니다:

```
✓ 데이터베이스 연결 성공
✓ 트리거 함수 생성 완료
✓ 테이블 생성 완료
✓ 인덱스 생성 완료
✓ 트리거 생성 완료
✓ 기존 데이터 삽입 완료
✓ 메뉴 데이터 삽입 완료 (6개 행)
✓ 옵션 데이터 삽입 완료 (2개 행)
✓ 초기 데이터 삽입 완료
✅ 데이터베이스 초기화가 완료되었습니다!

📊 생성된 테이블 확인:
  - menus
  - options
  - order_item_options
  - order_items
  - orders

📋 메뉴 데이터 확인:
  1. 아메리카노(ICE) - /images/americano-ice.jpg
  2. 아메리카노(HOT) - /images/americano-hot.jpg
  ...
```

## 초기화 후 확인 사항

### 1. 백엔드 서버 재배포

데이터베이스 초기화 후:
- 백엔드 서버가 자동으로 재시작되거나
- Manual Deploy 실행

### 2. API 테스트

브라우저에서 직접 접속하여 확인:
- https://order-app-backend-jic0.onrender.com/api/menus
- JSON 데이터가 반환되는지 확인

### 3. 프론트엔드 테스트

프론트엔드에서:
- 메뉴 목록이 정상적으로 로드되는지 확인
- 주문 기능이 작동하는지 확인
- 관리자 페이지가 작동하는지 확인

## 문제 해결

### 초기화 스크립트 실행 오류

1. **환경 변수 확인**
   - Shell에서 환경 변수가 올바르게 설정되었는지 확인
   - `echo $DB_HOST`, `echo $DB_SSL` 등으로 확인

2. **의존성 설치 확인**
   - `npm install`이 성공적으로 완료되었는지 확인
   - `node_modules` 폴더가 생성되었는지 확인

3. **데이터베이스 연결 확인**
   - 데이터베이스 호스트, 포트, 이름, 사용자, 비밀번호 확인
   - `DB_SSL=true` 설정 확인

### 테이블이 여전히 없는 경우

1. **수동으로 SQL 실행**
   - Render 데이터베이스 Shell 사용
   - `schema.sql` 파일의 내용을 복사하여 실행

2. **초기화 스크립트 재실행**
   - 기존 데이터 삭제 후 재실행
   - 또는 테이블이 없으면 자동으로 생성됨

## 예상 결과

초기화 완료 후:
- ✅ 모든 테이블 생성됨 (menus, options, orders, order_items, order_item_options)
- ✅ 초기 데이터 삽입됨 (메뉴 6개, 옵션 2개)
- ✅ 백엔드 API가 정상적으로 작동함
- ✅ 프론트엔드에서 메뉴 목록이 정상적으로 로드됨

