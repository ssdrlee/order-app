# Render.com 배포 가이드

## 배포 순서

1. PostgreSQL 데이터베이스 생성
2. 백엔드 서버 배포
3. 프런트엔드 배포

---

## 1. PostgreSQL 데이터베이스 생성

### 1.1 Render 대시보드에서 데이터베이스 생성

1. [Render.com](https://render.com)에 로그인
2. **New +** 버튼 클릭 → **PostgreSQL** 선택
3. 데이터베이스 설정:
   - **Name**: `coffee-order-db` (또는 원하는 이름)
   - **Database**: `coffee_order_db`
   - **User**: `coffee_user` (또는 자동 생성)
   - **Region**: 가장 가까운 지역 선택
   - **PostgreSQL Version**: 최신 버전 선택
   - **Plan**: Free (또는 원하는 플랜)

4. **Create Database** 클릭

### 1.2 데이터베이스 정보 확인

생성 후 **Connections** 탭에서 다음 정보를 확인합니다:
- **Internal Database URL**: 백엔드에서 사용
- **External Database URL**: 로컬에서 연결 시 사용
- **Host**: 데이터베이스 호스트
- **Port**: 5432
- **Database**: 데이터베이스 이름
- **User**: 사용자 이름
- **Password**: 비밀번호 (저장해두세요!)

### 1.3 데이터베이스 초기화

로컬에서 데이터베이스를 초기화하려면:

1. **External Database URL** 복사
2. `.env` 파일 생성 (로컬):
   ```env
   DB_HOST=<host>
   DB_PORT=5432
   DB_NAME=<database>
   DB_USER=<user>
   DB_PASSWORD=<password>
   ```
3. 데이터베이스 초기화:
   ```bash
   cd server
   npm run db:init
   ```

또는 Render의 **Shell** 기능을 사용하여 초기화할 수 있습니다.

---

## 2. 백엔드 서버 배포

### 2.1 GitHub 저장소 준비

1. GitHub에 저장소 생성 (또는 기존 저장소 사용)
2. 코드 푸시:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### 2.2 Render에서 Web Service 생성

1. Render 대시보드에서 **New +** → **Web Service** 선택
2. GitHub 저장소 연결
3. 서비스 설정:
   - **Name**: `coffee-order-api` (또는 원하는 이름)
   - **Region**: 데이터베이스와 같은 지역 선택
   - **Branch**: `main` (또는 배포할 브랜치)
   - **Root Directory**: `server` (백엔드 폴더)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (또는 원하는 플랜)

### 2.3 환경 변수 설정

**Environment Variables** 섹션에서 다음 변수들을 추가:

```env
NODE_ENV=production
PORT=10000

# 데이터베이스 연결 정보 (PostgreSQL에서 복사)
DB_HOST=<데이터베이스 호스트>
DB_PORT=5432
DB_NAME=<데이터베이스 이름>
DB_USER=<사용자 이름>
DB_PASSWORD=<비밀번호>
```

**중요**: Render의 PostgreSQL은 Internal Database URL을 사용하거나, 각 환경 변수를 개별적으로 설정할 수 있습니다.

### 2.4 배포 확인

1. **Manual Deploy** → **Deploy latest commit** 클릭
2. 배포 로그 확인
3. 배포 완료 후 서비스 URL 확인 (예: `https://coffee-order-api.onrender.com`)

### 2.5 데이터베이스 초기화 (배포된 서버에서)

배포된 서버에서 데이터베이스를 초기화하려면:

1. Render 대시보드에서 서비스의 **Shell** 탭 열기
2. 다음 명령어 실행:
   ```bash
   cd server
   npm run db:init
   ```

또는 로컬에서 External Database URL을 사용하여 초기화할 수 있습니다.

---

## 3. 프런트엔드 배포

### 3.1 환경 변수 설정 파일 생성

프런트엔드에서 API URL을 설정해야 합니다.

`ui/.env.production` 파일 생성:
```env
VITE_API_URL=https://coffee-order-api.onrender.com/api
```

### 3.2 Render에서 Static Site 생성

1. Render 대시보드에서 **New +** → **Static Site** 선택
2. GitHub 저장소 연결
3. 서비스 설정:
   - **Name**: `coffee-order-app` (또는 원하는 이름)
   - **Branch**: `main` (또는 배포할 브랜치)
   - **Root Directory**: `ui` (프런트엔드 폴더)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (Vite 빌드 출력 폴더)
   - **Environment Variables**:
     - `VITE_API_URL`: `https://coffee-order-api.onrender.com/api`

### 3.3 배포 확인

1. **Manual Deploy** → **Deploy latest commit** 클릭
2. 배포 로그 확인
3. 배포 완료 후 사이트 URL 확인 (예: `https://coffee-order-app.onrender.com`)

---

## 4. 배포 후 확인사항

### 4.1 백엔드 API 확인

```bash
# 브라우저에서 접속
https://coffee-order-api.onrender.com

# API 엔드포인트 테스트
https://coffee-order-api.onrender.com/api/menus
```

### 4.2 프런트엔드 확인

1. 브라우저에서 프런트엔드 URL 접속
2. 메뉴가 정상적으로 로드되는지 확인
3. 주문 기능이 정상적으로 작동하는지 확인
4. 관리자 화면이 정상적으로 작동하는지 확인

### 4.3 CORS 설정 확인

백엔드에서 프런트엔드 도메인을 허용하도록 CORS 설정을 확인합니다.

`server/src/server.js`에서:
```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://coffee-order-app.onrender.com'
  ]
}));
```

---

## 5. 문제 해결

### 5.1 데이터베이스 연결 오류

- 환경 변수가 올바르게 설정되었는지 확인
- Internal Database URL 사용 시 호스트 이름 확인
- 방화벽 설정 확인

### 5.2 빌드 오류

- Node.js 버전 확인 (Render는 기본적으로 최신 LTS 버전 사용)
- `package.json`의 스크립트 확인
- 빌드 로그 확인

### 5.3 환경 변수 오류

- 환경 변수 이름 확인 (대소문자 구분)
- 프런트엔드는 `VITE_` 접두사 필요
- 백엔드는 일반 환경 변수 사용

### 5.4 이미지 경로 오류

- 이미지 파일이 `ui/public/images/` 폴더에 있는지 확인
- 빌드 후 `dist/images/` 폴더에 이미지가 포함되는지 확인

---

## 6. 추가 설정

### 6.1 자동 배포

GitHub에 푸시할 때마다 자동으로 배포되도록 설정되어 있습니다.

### 6.2 커스텀 도메인

Render에서 커스텀 도메인을 설정할 수 있습니다.

### 6.3 SSL 인증서

Render는 자동으로 SSL 인증서를 제공합니다 (HTTPS).

---

## 7. 배포 체크리스트

- [ ] PostgreSQL 데이터베이스 생성
- [ ] 데이터베이스 초기화 (스키마 및 초기 데이터)
- [ ] 백엔드 환경 변수 설정
- [ ] 백엔드 배포 및 확인
- [ ] 프런트엔드 환경 변수 설정
- [ ] 프런트엔드 배포 및 확인
- [ ] CORS 설정 확인
- [ ] 이미지 파일 확인
- [ ] 전체 기능 테스트

---

## 참고 자료

- [Render 공식 문서](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Node.js on Render](https://render.com/docs/node)
- [Static Sites on Render](https://render.com/docs/static-sites)

