# Render.com 데이터베이스 초기화 가이드 (Shell 없이)

## 문제
Render.com 무료 요금제에서는 Shell 기능을 사용할 수 없습니다.
데이터베이스 초기화를 위한 대안 방법을 안내합니다.

## 해결 방법

### 방법 1: 로컬에서 Render 데이터베이스에 직접 연결 (권장)

가장 확실한 방법입니다.

#### Step 1: Render.com 데이터베이스 정보 확인

1. **Render.com 대시보드 접속**
   - https://dashboard.render.com
   - PostgreSQL 데이터베이스 선택

2. **Connections 탭 확인**
   - "Connections" 또는 "Info" 탭 클릭
   - **External Database URL** 복사
   - 또는 개별 정보 확인:
     - Host
     - Port (5432)
     - Database
     - User
     - Password

#### Step 2: 로컬 .env 파일 설정

`server/.env` 파일을 열어 Render 데이터베이스 정보로 설정:

```env
# Render 데이터베이스 연결 정보
DB_HOST=<Render 데이터베이스 호스트>
DB_PORT=5432
DB_NAME=<Render 데이터베이스 이름>
DB_USER=<Render 데이터베이스 사용자>
DB_PASSWORD=<Render 데이터베이스 비밀번호>
DB_SSL=true

# 기타 설정
NODE_ENV=production
```

**예시**:
```env
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=coffee_order_db_xxxxx
DB_USER=coffee_order_db_user
DB_PASSWORD=your_password_here
DB_SSL=true
```

#### Step 3: 로컬에서 데이터베이스 초기화 실행

로컬 컴퓨터에서 다음 명령어 실행:

```bash
cd server
npm install
npm run db:init-render
```

#### Step 4: 초기화 확인

초기화가 성공하면 다음 메시지가 표시됩니다:

```
✓ 데이터베이스 연결 성공
✓ 트리거 함수 생성 완료
✓ 테이블 생성 완료 (5개)
✓ 인덱스 생성 완료
✓ 트리거 생성 완료
✓ 메뉴 데이터 삽입 완료 (6개 행)
✓ 옵션 데이터 삽입 완료 (2개 행)
✅ 데이터베이스 초기화가 완료되었습니다!
```

### 방법 2: 백엔드 서버 시작 시 자동 초기화

서버 시작 시 데이터베이스가 초기화되지 않았으면 자동으로 초기화하는 기능을 추가합니다.

**주의**: 이 방법은 서버 시작 시간이 늘어날 수 있습니다.

#### 구현 방법

`server/src/server.js` 파일을 수정하여 서버 시작 시 데이터베이스 초기화 확인 및 실행:

```javascript
// 데이터베이스 초기화 확인 및 실행
const checkAndInitDatabase = async () => {
  try {
    // menus 테이블이 있는지 확인
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'menus'
      );
    `);
    
    if (!result.rows[0].exists) {
      console.log('데이터베이스가 초기화되지 않았습니다. 초기화를 시작합니다...');
      // 초기화 스크립트 실행
      // (이 부분은 별도 함수로 구현)
    }
  } catch (error) {
    console.error('데이터베이스 초기화 확인 중 오류:', error);
  }
};
```

### 방법 3: 별도의 초기화 API 엔드포인트 생성

초기화를 위한 별도의 API 엔드포인트를 만들어 브라우저나 Postman에서 호출합니다.

**주의**: 보안을 위해 특별한 토큰이나 비밀번호를 요구해야 합니다.

#### 구현 예시

```javascript
// 초기화 API 엔드포인트 (보안 주의!)
app.post('/api/admin/init-database', async (req, res) => {
  const { secret } = req.body;
  
  // 보안: 특별한 비밀번호 요구
  if (secret !== process.env.INIT_SECRET) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  
  try {
    // 데이터베이스 초기화 로직 실행
    // ...
    res.json({ success: true, message: 'Database initialized' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 권장 방법

**방법 1 (로컬에서 직접 연결)**을 강력히 권장합니다:
- ✅ 가장 확실하고 안전함
- ✅ 초기화 과정을 직접 확인 가능
- ✅ 오류 발생 시 즉시 확인 가능
- ✅ Shell 기능이 필요 없음

## 문제 해결

### 연결 오류 발생 시

1. **방화벽 확인**
   - Render 데이터베이스는 External Database URL을 사용해야 함
   - Internal Database URL은 Render 서비스 내부에서만 사용 가능

2. **SSL 설정 확인**
   - `DB_SSL=true` 설정 확인
   - Render 데이터베이스는 SSL 연결이 필수

3. **연결 정보 확인**
   - 호스트, 포트, 데이터베이스 이름, 사용자, 비밀번호가 정확한지 확인

### 초기화 실패 시

1. **로그 확인**
   - 초기화 스크립트 실행 시 상세한 로그가 출력됨
   - 오류 메시지를 확인하여 문제 파악

2. **수동으로 SQL 실행**
   - psql 클라이언트가 설치되어 있다면:
     ```bash
     psql "postgresql://user:password@host:port/database?sslmode=require"
     ```
   - `schema.sql` 파일의 내용을 복사하여 실행

## 다음 단계

1. **로컬에서 초기화 실행**
   - `server/.env` 파일에 Render 데이터베이스 정보 설정
   - `npm run db:init-render` 실행

2. **초기화 확인**
   - 브라우저에서 https://order-app-backend-jic0.onrender.com/api/menus 접속
   - JSON 데이터가 반환되는지 확인

3. **프론트엔드 확인**
   - https://order-app-frontend-yrru.onrender.com 접속
   - 메뉴 목록이 정상적으로 로드되는지 확인

