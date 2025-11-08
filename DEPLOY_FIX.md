# 프론트엔드 배포 오류 해결 가이드

## 문제 상황
프론트엔드 배포 후 메뉴를 불러오는데 실패하는 오류 발생

## 원인 분석

### 1. CORS 설정 문제
백엔드 서버의 CORS 설정에 프론트엔드 URL이 포함되어 있지 않음
- 백엔드: `https://order-app-backend-jic0.onrender.com`
- 프론트엔드: `https://order-app-frontend-yrru.onrender.com`

### 2. 환경 변수 문제
Render.com에서 프론트엔드 빌드 시 환경 변수가 제대로 설정되지 않았을 수 있음

## 해결 방법

### Step 1: 백엔드 서버 CORS 설정 수정

1. `server/src/server.js` 파일 수정
   - 프론트엔드 URL을 CORS 허용 목록에 추가
   - 변경 사항을 GitHub에 푸시

2. Render.com에서 백엔드 서비스 재배포
   - Render 대시보드 → 백엔드 서비스 → Manual Deploy → Clear build cache & deploy

### Step 2: 프론트엔드 환경 변수 확인

Render.com 대시보드에서 프론트엔드 서비스 설정 확인:

1. **Environment Variables** 섹션 확인
   - Key: `VITE_API_URL`
   - Value: `https://order-app-backend-jic0.onrender.com/api`

2. 환경 변수가 없거나 잘못 설정된 경우:
   - "Add Environment Variable" 클릭
   - Key: `VITE_API_URL`
   - Value: `https://order-app-backend-jic0.onrender.com/api`
   - 저장 후 재배포

### Step 3: 재배포

1. **백엔드 재배포**
   - 변경 사항 푸시 후 자동 배포 대기
   - 또는 Manual Deploy 실행

2. **프론트엔드 재배포**
   - 환경 변수 설정 후 자동 배포 대기
   - 또는 Manual Deploy 실행

## 확인 사항

### 브라우저 콘솔 확인
1. 프론트엔드 사이트에서 F12로 개발자 도구 열기
2. Console 탭에서 오류 메시지 확인
3. Network 탭에서 API 요청 상태 확인

### 백엔드 API 테스트
브라우저에서 직접 접속하여 확인:
- https://order-app-backend-jic0.onrender.com/api/menus
- JSON 데이터가 반환되는지 확인

### CORS 헤더 확인
Network 탭에서 API 요청의 Response Headers 확인:
- `Access-Control-Allow-Origin` 헤더가 프론트엔드 URL을 포함하는지 확인

## 추가 디버깅

### API URL 확인
프론트엔드 코드에서 실제 API URL 확인:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

### 네트워크 요청 확인
브라우저 개발자 도구 → Network 탭:
- `/api/menus` 요청의 상태 코드 확인
- CORS 오류인지, 404 오류인지 확인

## 예상 결과

수정 후:
- 메뉴 목록이 정상적으로 로드됨
- 주문 기능이 정상적으로 작동함
- 관리자 페이지가 정상적으로 작동함

