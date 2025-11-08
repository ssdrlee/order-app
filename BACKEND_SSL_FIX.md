# 백엔드 SSL/TLS 오류 해결 가이드

## 문제 상황
백엔드 로그에 "SSL/TLS required" 오류 발생
- 에러 코드: `28000` (PostgreSQL SSL/TLS 연결 오류)
- 데이터베이스 연결 실패

## 원인
Render.com PostgreSQL 데이터베이스는 SSL 연결이 필수인데, 백엔드 서버의 환경 변수에서 `DB_SSL=true`가 설정되지 않았습니다.

## 해결 방법

### Step 1: Render.com 백엔드 서비스 환경 변수 확인

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - 백엔드 서비스 (`order-app-backend-jic0`) 선택

2. **Environment 섹션으로 이동**
   - 왼쪽 사이드바에서 "Environment" 클릭
   - 또는 서비스 설정에서 "Environment" 탭 클릭

3. **필수 환경 변수 확인 및 설정**

   다음 환경 변수들이 모두 설정되어 있는지 확인:

   ```
   PORT=10000 (또는 Render가 할당한 포트)
   NODE_ENV=production
   DB_HOST=xxx (Render 데이터베이스 호스트)
   DB_PORT=5432
   DB_NAME=xxx (Render 데이터베이스 이름)
   DB_USER=xxx (Render 데이터베이스 사용자)
   DB_PASSWORD=xxx (Render 데이터베이스 비밀번호)
   DB_SSL=true (중요! 반드시 설정 필요)
   FRONTEND_URL=https://order-app-frontend-yrru.onrender.com
   ```

4. **DB_SSL 환경 변수 추가/수정**
   - "Add Environment Variable" 클릭 (또는 기존 항목 수정)
   - **Key**: `DB_SSL`
   - **Value**: `true` (문자열 "true"로 입력)
   - "Save Changes" 클릭

### Step 2: 데이터베이스 연결 정보 확인

Render.com 데이터베이스에서 연결 정보 확인:

1. **Render.com 대시보드 → 데이터베이스 선택**
2. **"Connections" 또는 "Info" 탭 확인**
   - Internal Database URL 또는 Connection String 확인
   - 호스트, 포트, 데이터베이스 이름, 사용자, 비밀번호 확인

3. **환경 변수와 일치하는지 확인**
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`가 올바른지 확인

### Step 3: 백엔드 서버 재배포

환경 변수를 수정한 후:

1. **환경 변수 저장 확인**
   - 모든 환경 변수가 올바르게 저장되었는지 확인

2. **서버 재배포**
   - "Manual Deploy" → "Clear build cache & deploy" 실행
   - 또는 코드 변경 후 자동 배포 대기

3. **로그 확인**
   - 배포 후 Logs 탭에서 서버 시작 메시지 확인
   - "데이터베이스 연결 성공" 메시지 확인
   - "SSL/TLS required" 오류가 사라졌는지 확인

### Step 4: 데이터베이스 초기화 확인

데이터베이스가 초기화되지 않았을 수 있습니다:

1. **Render.com Shell 사용**
   - 백엔드 서비스 → Shell 탭
   - 또는 데이터베이스 → Connect → Shell

2. **데이터베이스 초기화 실행**
   ```bash
   cd server
   npm install
   npm run db:init-render
   ```

3. **초기화 확인**
   - 로그에서 "데이터베이스 초기화가 완료되었습니다!" 메시지 확인
   - 테이블과 데이터가 생성되었는지 확인

## 환경 변수 설정 예시

Render.com에서 설정해야 하는 환경 변수:

```
PORT=10000
NODE_ENV=production
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=coffee_order_db_xxxxx
DB_USER=coffee_order_db_user
DB_PASSWORD=your_password_here
DB_SSL=true
FRONTEND_URL=https://order-app-frontend-yrru.onrender.com
```

**중요**: `DB_SSL=true`는 반드시 문자열 "true"로 입력해야 합니다.

## 문제 해결 체크리스트

- [ ] Render.com 백엔드 서비스 환경 변수 확인
- [ ] `DB_SSL=true` 환경 변수 설정 확인
- [ ] 모든 데이터베이스 연결 정보 확인
- [ ] 환경 변수 저장
- [ ] 백엔드 서버 재배포
- [ ] 로그에서 "데이터베이스 연결 성공" 메시지 확인
- [ ] "SSL/TLS required" 오류가 사라졌는지 확인
- [ ] 데이터베이스 초기화 실행 (필요한 경우)
- [ ] 브라우저에서 API 직접 테스트
- [ ] 프론트엔드에서 메뉴 로드 확인

## 예상 결과

수정 후:
- 로그에 "데이터베이스 연결 성공" 메시지 표시
- "SSL/TLS required" 오류 사라짐
- https://order-app-backend-jic0.onrender.com/api/menus 접속 시 JSON 데이터 반환
- 프론트엔드에서 메뉴 목록 정상 로드

