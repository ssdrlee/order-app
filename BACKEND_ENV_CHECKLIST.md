# 백엔드 Environment Variables 체크리스트

## 현재 설정된 환경 변수

다음 환경 변수들이 설정되어 있는지 확인하세요:

### 필수 환경 변수

1. **데이터베이스 연결 정보**
   - `DB_HOST` ✅ (확인됨)
   - `DB_PORT` ✅ (확인됨, 값: 5432)
   - `DB_NAME` ✅ (확인됨)
   - `DB_USER` ✅ (확인됨)
   - `DB_PASSWORD` ✅ (확인됨)
   - `DB_SSL` ✅ (확인됨, **값이 "true"인지 확인 필요**)

2. **서버 설정**
   - `NODE_ENV` ✅ (확인됨, 값: production)
   - `PORT` ⚠️ (선택사항, Render가 자동 할당)

3. **CORS 설정**
   - `FRONTEND_URL` ❌ (누락됨, 추가 필요)

## 추가해야 할 환경 변수

### 1. FRONTEND_URL (필수)

**목적**: CORS 설정에서 프론트엔드 URL을 허용하기 위해 사용

**설정 방법**:
- Key: `FRONTEND_URL`
- Value: `https://order-app-frontend-yrru.onrender.com`

**중요성**: 프론트엔드에서 API를 호출할 수 있도록 CORS 설정에 필요합니다.

### 2. PORT (선택사항)

**목적**: 서버 포트 설정 (Render가 자동으로 할당하므로 필수는 아님)

**설정 방법**:
- Key: `PORT`
- Value: Render가 할당한 포트 번호 (예: 10000)

**참고**: Render가 자동으로 PORT 환경 변수를 설정하므로, 명시적으로 설정하지 않아도 됩니다.

## 확인해야 할 사항

### DB_SSL 값 확인

`DB_SSL` 환경 변수의 값이 정확히 `true` (문자열)인지 확인하세요:

1. **값 확인 방법**:
   - 환경 변수 행의 눈 아이콘을 클릭하여 값 확인
   - 또는 "Edit" 버튼을 클릭하여 값 확인

2. **올바른 값**:
   - ✅ `true` (문자열)
   - ❌ `True`, `TRUE`, `1`, `yes` 등은 작동하지 않을 수 있음

### 모든 환경 변수 값 확인

각 환경 변수의 값이 올바른지 확인:

- `DB_HOST`: Render 데이터베이스 호스트 (예: `dpg-xxxxx-a.oregon-postgres.render.com`)
- `DB_PORT`: `5432`
- `DB_NAME`: Render 데이터베이스 이름
- `DB_USER`: Render 데이터베이스 사용자
- `DB_PASSWORD`: Render 데이터베이스 비밀번호
- `DB_SSL`: `true` (문자열)
- `NODE_ENV`: `production`

## 환경 변수 설정 절차

### Step 1: FRONTEND_URL 추가

1. "Edit" 버튼 클릭
2. "Add Environment Variable" 클릭
3. Key: `FRONTEND_URL`
4. Value: `https://order-app-frontend-yrru.onrender.com`
5. 저장

### Step 2: DB_SSL 값 확인

1. `DB_SSL` 행의 눈 아이콘 클릭하여 값 확인
2. 값이 `true`가 아닌 경우:
   - "Edit" 버튼 클릭
   - `DB_SSL` 값 수정: `true`
   - 저장

### Step 3: 모든 환경 변수 저장

1. 모든 변경사항 저장
2. 백엔드 서버 재배포 (자동 재배포 또는 Manual Deploy)

## 최종 환경 변수 목록

```
DB_HOST=<Render 데이터베이스 호스트>
DB_PORT=5432
DB_NAME=<Render 데이터베이스 이름>
DB_USER=<Render 데이터베이스 사용자>
DB_PASSWORD=<Render 데이터베이스 비밀번호>
DB_SSL=true
NODE_ENV=production
FRONTEND_URL=https://order-app-frontend-yrru.onrender.com
PORT=<Render가 할당한 포트, 선택사항>
```

## 문제 해결

### DB_SSL 오류가 계속 발생하는 경우

1. `DB_SSL` 값이 정확히 `true` (문자열)인지 확인
2. 환경 변수 저장 후 서버 재배포 확인
3. 로그에서 "데이터베이스 연결 성공" 메시지 확인

### CORS 오류가 발생하는 경우

1. `FRONTEND_URL` 환경 변수가 설정되었는지 확인
2. 백엔드 서버의 CORS 설정 확인
3. 프론트엔드 URL이 CORS 허용 목록에 포함되었는지 확인

