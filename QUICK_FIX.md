# 빠른 해결 가이드: 데이터베이스 테이블 없음 오류

## 문제
콘솔에 "relation 'menus' does not exist" 오류 발생

## 즉시 해결 방법

### Step 1: Render.com Shell에서 데이터베이스 초기화

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - 백엔드 서비스 (`order-app-backend-jic0`) 선택

2. **Shell 탭 클릭**
   - 왼쪽 사이드바에서 "Shell" 클릭

3. **다음 명령어 실행**
   ```bash
   cd server
   npm install
   npm run db:init-render
   ```

4. **초기화 완료 대기**
   - "✅ 데이터베이스 초기화가 완료되었습니다!" 메시지가 나타날 때까지 대기
   - 약 1-2분 소요

### Step 2: 백엔드 서버 재배포

1. **서비스 페이지로 이동**
   - 백엔드 서비스 페이지로 돌아가기

2. **Manual Deploy 실행**
   - "Manual Deploy" → "Clear build cache & deploy" 클릭
   - 또는 자동 재배포 대기

### Step 3: 확인

1. **브라우저에서 API 테스트**
   - https://order-app-backend-jic0.onrender.com/api/menus 접속
   - JSON 데이터가 반환되는지 확인

2. **프론트엔드 확인**
   - https://order-app-frontend-yrru.onrender.com 접속
   - 메뉴 목록이 정상적으로 로드되는지 확인

## 완료!

이제 메뉴 목록이 정상적으로 표시되어야 합니다.

