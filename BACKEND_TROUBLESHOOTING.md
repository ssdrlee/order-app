# 백엔드 서버 500 오류 해결 가이드

## 문제 상황
프론트엔드에서 API 호출 시 500 서버 오류 및 "SSL/TLS required" 오류 발생

## 원인 분석

### 가능한 원인들:
1. **데이터베이스 연결 실패**
   - Render.com에서 데이터베이스 연결 정보가 잘못 설정됨
   - `DB_SSL=true` 설정이 누락됨

2. **데이터베이스 초기화 미완료**
   - 테이블이 생성되지 않음
   - 초기 데이터가 삽입되지 않음

3. **환경 변수 설정 문제**
   - Render.com에서 환경 변수가 제대로 설정되지 않음

## 해결 방법

### Step 1: Render.com 백엔드 서버 로그 확인

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - 백엔드 서비스 선택

2. **Logs 탭 확인**
   - 왼쪽 사이드바에서 "Logs" 클릭
   - 최근 로그 메시지 확인
   - 데이터베이스 연결 오류가 있는지 확인

3. **확인할 내용**
   - "데이터베이스 연결 성공" 메시지가 있는지
   - 데이터베이스 연결 오류 메시지가 있는지
   - 테이블 조회 오류가 있는지

### Step 2: 환경 변수 확인

Render.com 백엔드 서비스의 Environment Variables 확인:

1. **필수 환경 변수**
   ```
   PORT=10000 (또는 Render가 할당한 포트)
   NODE_ENV=production
   DB_HOST=xxx.xxx.xxx.xxx (Render 데이터베이스 호스트)
   DB_PORT=5432
   DB_NAME=xxx (Render 데이터베이스 이름)
   DB_USER=xxx (Render 데이터베이스 사용자)
   DB_PASSWORD=xxx (Render 데이터베이스 비밀번호)
   DB_SSL=true (중요!)
   FRONTEND_URL=https://order-app-frontend-yrru.onrender.com
   ```

2. **DB_SSL 확인**
   - Render.com PostgreSQL 데이터베이스는 SSL 연결이 필수입니다
   - `DB_SSL=true`가 반드시 설정되어 있어야 합니다

### Step 3: 데이터베이스 초기화

Render.com에서 데이터베이스가 초기화되지 않은 경우:

1. **Render.com Shell 사용**
   - 백엔드 서비스 → Shell 탭
   - 또는 데이터베이스 → Connect → Shell

2. **데이터베이스 초기화 스크립트 실행**
   ```bash
   cd server
   npm install
   npm run db:init-render
   ```

3. **수동으로 SQL 실행**
   - Render.com 데이터베이스 → Connect → psql
   - 또는 외부 도구로 연결하여 SQL 실행

### Step 4: 백엔드 서버 재배포

환경 변수를 수정한 경우:

1. **환경 변수 저장**
   - Environment Variables 섹션에서 저장

2. **서버 재배포**
   - "Manual Deploy" → "Clear build cache & deploy"
   - 또는 코드 변경 후 자동 배포

3. **로그 확인**
   - 배포 후 Logs 탭에서 서버 시작 메시지 확인
   - "데이터베이스 연결 성공" 메시지 확인

## 디버깅 방법

### 1. 백엔드 API 직접 테스트

브라우저에서 직접 접속:
- https://order-app-backend-jic0.onrender.com/
- https://order-app-backend-jic0.onrender.com/api/menus

### 2. 데이터베이스 연결 테스트

Render.com Shell에서:
```bash
cd server
node database/test-connection.js
```

### 3. 데이터베이스 초기화 확인

Render.com Shell에서:
```bash
cd server
node -e "
import('./src/config/database.js').then(({ default: pool }) => {
  pool.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \\'public\\'').then(res => {
    console.log('테이블 목록:', res.rows);
    pool.end();
  }).catch(err => {
    console.error('오류:', err);
    pool.end();
  });
});
"
```

### 4. 메뉴 데이터 확인

Render.com Shell에서:
```bash
cd server
node -e "
import('./src/config/database.js').then(({ default: pool }) => {
  pool.query('SELECT COUNT(*) FROM menus').then(res => {
    console.log('메뉴 개수:', res.rows[0].count);
    pool.end();
  }).catch(err => {
    console.error('오류:', err);
    pool.end();
  });
});
"
```

## 문제 해결 체크리스트

- [ ] Render.com 백엔드 서버 로그 확인
- [ ] 데이터베이스 연결 성공 메시지 확인
- [ ] 환경 변수 `DB_SSL=true` 설정 확인
- [ ] 모든 데이터베이스 환경 변수 확인
- [ ] 데이터베이스 초기화 스크립트 실행
- [ ] 테이블이 생성되었는지 확인
- [ ] 메뉴 데이터가 있는지 확인
- [ ] 백엔드 서버 재배포
- [ ] 브라우저에서 API 직접 테스트
- [ ] 프론트엔드에서 다시 테스트

## 예상 결과

수정 후:
- 백엔드 서버 로그에 "데이터베이스 연결 성공" 메시지
- https://order-app-backend-jic0.onrender.com/api/menus 접속 시 JSON 데이터 반환
- 프론트엔드에서 메뉴 목록 정상 로드

