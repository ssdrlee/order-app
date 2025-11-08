# 데이터베이스 설정 실행 가이드

## 빠른 시작

다음 명령어를 **순서대로** 실행하세요:

### 1. 데이터베이스 생성
```bash
npm run db:create
```

### 2. 데이터베이스 초기화
```bash
npm run db:init
```

### 3. 연결 테스트
```bash
npm run db:test
```

### 4. 서버 실행
```bash
npm run dev
```

## 문제 해결

### npm 명령어를 찾을 수 없는 경우

다음 명령어로 npm이 설치되어 있는지 확인하세요:
```bash
npm --version
node --version
```

### 명령어에 이상한 문자가 포함되는 경우

1. 명령어를 직접 타이핑하지 말고 복사해서 붙여넣으세요
2. 터미널을 다시 시작하세요
3. Git Bash를 재시작하세요

### 데이터베이스 연결 오류

`npm run db:create` 실행 후 오류가 발생하면:
1. PostgreSQL 서버가 실행 중인지 확인
2. `.env` 파일의 `DB_PASSWORD`를 실제 비밀번호로 변경
3. PostgreSQL 서비스 상태 확인 (Windows: 서비스 관리자)

## 명령어 설명

- `npm run db:create`: 데이터베이스를 자동으로 생성
- `npm run db:init`: 테이블 생성 및 초기 데이터 삽입
- `npm run db:test`: 데이터베이스 연결 테스트
- `npm run dev`: 개발 서버 실행 (nodemon 사용)

