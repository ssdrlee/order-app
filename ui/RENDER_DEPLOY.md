# Render.com 프론트엔드 배포 가이드

## 1. 코드 수정 사항

### ✅ 이미 완료된 사항
- `src/utils/api.js`에서 `VITE_API_URL` 환경 변수 사용
- `render.yaml` 파일 생성됨

### 📝 추가 확인 사항

1. **API URL 설정 확인**
   - `src/utils/api.js`의 기본값이 `http://localhost:5000/api`로 설정되어 있음
   - Render 배포 시 환경 변수로 백엔드 URL을 설정해야 함

2. **환경 변수 파일**
   - `.env.example` 파일 생성됨
   - 로컬 개발 시 `.env.local` 파일 생성하여 사용

## 2. Render.com 배포 절차

### Step 1: GitHub 저장소 준비
1. 프로젝트를 GitHub에 푸시
2. `ui` 폴더가 포함되어 있는지 확인

### Step 2: Render.com에서 Static Site 생성

1. **Render 대시보드 접속**
   - https://dashboard.render.com 접속
   - 로그인 후 "New +" 버튼 클릭
   - "Static Site" 선택

2. **저장소 연결**
   - GitHub 저장소 선택
   - Branch: `main` (또는 사용하는 브랜치)
   - Root Directory: `ui` (중요!)

3. **빌드 설정**
   - **Name**: `coffee-order-app` (원하는 이름)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **환경 변수 설정**
   - "Environment" 섹션에서 "Add Environment Variable" 클릭
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-service.onrender.com/api`
     - 백엔드 서비스가 배포된 후 실제 URL로 변경
     - 예: `https://coffee-order-api.onrender.com/api`

5. **고급 설정 (선택)**
   - **Auto-Deploy**: `Yes` (기본값)
   - **Pull Request Previews**: `Yes` (선택 사항)

6. **배포 시작**
   - "Create Static Site" 버튼 클릭
   - 빌드 로그 확인

### Step 3: 배포 확인

1. **빌드 로그 확인**
   - Render 대시보드에서 빌드 진행 상황 확인
   - 오류 발생 시 로그 확인

2. **사이트 접속**
   - 배포 완료 후 제공되는 URL로 접속
   - 예: `https://coffee-order-app.onrender.com`

3. **기능 테스트**
   - 메뉴 목록 로드 확인
   - 주문 기능 테스트
   - 관리자 페이지 테스트

## 3. 환경 변수 설정

### 로컬 개발 환경
`.env.development` 파일 생성 (Git에 커밋되지 않음):
```env
VITE_API_URL=http://localhost:5000/api
```

### 로컬 프로덕션 빌드 테스트
`.env.production` 파일 생성 (Git에 커밋되지 않음):
```env
VITE_API_URL=https://your-backend-service.onrender.com/api
```

**주의**: `.env.production` 파일에 실제 프로덕션 URL을 넣지 마세요. 
이 파일은 Git에 커밋되지 않지만, 로컬에서 프로덕션 빌드를 테스트할 때만 사용하세요.

### Render 프로덕션 환경
Render 대시보드 → Environment Variables:
```
VITE_API_URL=https://your-backend-service.onrender.com/api
```

**권장 사항**: 
- Render.com에서는 환경 변수를 대시보드에서 설정하는 것이 가장 안전합니다.
- `.env.production` 파일은 로컬에서 프로덕션 빌드를 테스트할 때만 사용하세요.

## 4. 문제 해결

### 빌드 실패
- **원인**: 의존성 설치 오류
- **해결**: `package.json` 확인, `npm install` 로컬에서 테스트

### API 연결 실패
- **원인**: 환경 변수 설정 오류
- **해결**: Render 대시보드에서 `VITE_API_URL` 확인

### CORS 오류
- **원인**: 백엔드 CORS 설정 문제
- **해결**: 백엔드 서버의 CORS 설정 확인 (프론트엔드 URL 허용)

### 이미지 로드 실패
- **원인**: 이미지 경로 문제
- **해결**: `public/images/` 폴더에 이미지가 있는지 확인

## 5. 배포 후 확인 사항

- [ ] 빌드가 성공적으로 완료되었는가?
- [ ] 사이트가 정상적으로 로드되는가?
- [ ] 메뉴 목록이 표시되는가?
- [ ] 주문 기능이 작동하는가?
- [ ] 관리자 페이지가 작동하는가?
- [ ] 이미지가 정상적으로 표시되는가?
- [ ] API 연결이 정상적으로 작동하는가?

## 6. 자동 배포 설정

GitHub에 코드를 푸시하면 자동으로 배포됩니다:
1. `git push origin main`
2. Render가 자동으로 빌드 시작
3. 배포 완료 후 사이트 업데이트

## 7. 참고 사항

- **빌드 시간**: 약 2-5분 소요
- **무료 플랜 제한**: 일정 시간 비활성 시 자동으로 스핀다운 (첫 접속 시 지연)
- **도메인 커스터마이징**: Render 대시보드에서 설정 가능

