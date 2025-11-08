# Render.com 프론트엔드 환경 변수 설정 가이드

## 문제 상황
프론트엔드가 `http://localhost:5000/api/menus`로 요청하여 메뉴를 불러오지 못함

## 원인
Render.com에서 프론트엔드 빌드 시 `VITE_API_URL` 환경 변수가 설정되지 않아 기본값(`http://localhost:5000/api`)을 사용함

## 해결 방법

### Step 1: Render.com 대시보드에서 환경 변수 설정

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - 프론트엔드 서비스 선택

2. **Environment 섹션으로 이동**
   - 왼쪽 사이드바에서 "Environment" 클릭
   - 또는 서비스 설정 페이지에서 "Environment" 탭 클릭

3. **환경 변수 추가**
   - "Add Environment Variable" 버튼 클릭
   - **Key**: `VITE_API_URL`
   - **Value**: `https://order-app-backend-jic0.onrender.com/api`
   - "Save Changes" 클릭

4. **환경 변수 확인**
   - 설정한 환경 변수가 목록에 표시되는지 확인
   - Key: `VITE_API_URL`
   - Value: `https://order-app-backend-jic0.onrender.com/api`

### Step 2: 프론트엔드 재배포

환경 변수를 추가한 후 자동으로 재배포가 시작되지 않을 수 있으므로:

1. **Manual Deploy 실행**
   - 서비스 페이지에서 "Manual Deploy" 버튼 클릭
   - "Clear build cache & deploy" 선택 (권장)
   - "Deploy latest commit" 클릭

2. **빌드 로그 확인**
   - 배포가 시작되면 "Logs" 탭에서 빌드 진행 상황 확인
   - 빌드가 성공적으로 완료되는지 확인

3. **배포 완료 대기**
   - 빌드 완료까지 약 2-5분 소요
   - "Live" 상태가 되면 배포 완료

### Step 3: 배포 확인

1. **사이트 접속**
   - https://order-app-frontend-yrru.onrender.com 접속

2. **브라우저 콘솔 확인**
   - F12로 개발자 도구 열기
   - Console 탭에서 오류 메시지 확인
   - 이제 `http://localhost:5000` 대신 올바른 API URL로 요청하는지 확인

3. **Network 탭 확인**
   - Network 탭에서 `/api/menus` 요청 확인
   - 요청 URL이 `https://order-app-backend-jic0.onrender.com/api/menus`인지 확인
   - 상태 코드가 200인지 확인

## 중요 사항

### Vite 환경 변수의 특징
- Vite 환경 변수는 **빌드 시점**에 주입됩니다
- 환경 변수를 추가한 후에는 **반드시 재배포**해야 합니다
- `.env.production` 파일은 Render.com Static Site에서 사용되지 않습니다
- Render.com 대시보드에서 환경 변수를 설정해야 합니다

### 환경 변수 이름 규칙
- Vite 환경 변수는 반드시 `VITE_` 접두사로 시작해야 합니다
- 예: `VITE_API_URL` ✅
- 예: `API_URL` ❌ (빌드 시 포함되지 않음)

### 빌드 캐시 클리어
- 환경 변수 변경 후 첫 배포 시 "Clear build cache" 옵션을 사용하는 것이 좋습니다
- 이전 빌드 캐시가 남아있을 수 있기 때문입니다

## 문제 해결 체크리스트

- [ ] Render.com 대시보드에서 `VITE_API_URL` 환경 변수 설정
- [ ] 환경 변수 값이 올바른지 확인 (`https://order-app-backend-jic0.onrender.com/api`)
- [ ] 프론트엔드 서비스 재배포 (Manual Deploy)
- [ ] 빌드 로그에서 오류가 없는지 확인
- [ ] 배포 완료 후 사이트 접속 확인
- [ ] 브라우저 콘솔에서 오류가 없는지 확인
- [ ] Network 탭에서 API 요청 URL이 올바른지 확인
- [ ] 메뉴가 정상적으로 로드되는지 확인

## 추가 디버깅

### 환경 변수가 제대로 주입되었는지 확인
빌드 로그에서 다음과 같은 메시지를 확인:
- 환경 변수가 빌드 시 사용되는지 확인
- 빌드 성공 메시지 확인

### 브라우저에서 API URL 확인
프론트엔드 코드에 임시로 추가:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```
브라우저 콘솔에서 올바른 URL이 출력되는지 확인

### 백엔드 API 직접 테스트
브라우저에서 직접 접속:
- https://order-app-backend-jic0.onrender.com/api/menus
- JSON 데이터가 반환되는지 확인

