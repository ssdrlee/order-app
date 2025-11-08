# 개발 서버 실행 방법

## Git Bash에서 실행 (권장)

Git Bash 터미널을 열고 다음 명령어를 순서대로 실행하세요:

```bash
# 프로젝트 루트로 이동
cd /d/CURSOR/order-app/ui

# 또는 절대 경로 사용
cd d:/CURSOR/order-app/ui

# 의존성 설치 (최초 1회만)
npm install

# 개발 서버 실행
npm run dev
```

## PowerShell에서 실행하는 경우

PowerShell에서 npm이 인식되지 않는다면:

1. PowerShell을 관리자 권한으로 다시 시작하거나
2. 환경 변수를 새로고침:
   ```powershell
   $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
   ```

그 다음:
```powershell
cd ui
npm install
npm run dev
```

## 개발 서버 접속

개발 서버가 실행되면:
- 자동으로 브라우저가 열리거나
- 수동으로 `http://localhost:3000` 접속

## 서버 중지

개발 서버를 중지하려면 터미널에서 `Ctrl + C`를 누르세요.

