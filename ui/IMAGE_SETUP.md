# 이미지 설정 가이드

## 이미지 파일 위치

커피 메뉴 이미지는 다음 위치에 저장해야 합니다:

```
ui/public/images/
```

## 이미지 파일 복사 방법

### 방법 1: 수동 복사
1. `실습파일` 폴더에서 다음 이미지 파일을 찾습니다:
   - `americano-ice.jpg`
   - `americano-hot.jpg`
   - `caffe-latte.jpg`

2. 위 이미지 파일들을 `ui/public/images/` 폴더로 복사합니다.

### 방법 2: 명령어 사용 (Git Bash)
```bash
# 프로젝트 루트에서
cp 실습파일/*.jpg ui/public/images/
```

### 방법 3: 명령어 사용 (PowerShell)
```powershell
# 프로젝트 루트에서
Copy-Item "실습파일\*.jpg" -Destination "ui\public\images\" -Force
```

## 이미지 경로 설정

데이터베이스의 `menus` 테이블에 이미지 경로가 다음과 같이 저장되어 있습니다:
- `/images/americano-ice.jpg`
- `/images/americano-hot.jpg`
- `/images/caffe-latte.jpg`

이 경로는 Vite의 `public` 폴더 구조와 일치합니다:
- `ui/public/images/americano-ice.jpg` → `/images/americano-ice.jpg`

## 확인 방법

1. 이미지 파일이 올바른 위치에 있는지 확인:
   ```bash
   ls ui/public/images/
   ```

2. 개발 서버 실행:
   ```bash
   cd ui
   npm run dev
   ```

3. 브라우저에서 이미지가 표시되는지 확인:
   - `http://localhost:3000/images/americano-ice.jpg` 접속
   - 이미지가 표시되면 성공

## 문제 해결

### 이미지가 표시되지 않는 경우
1. 이미지 파일이 `ui/public/images/` 폴더에 있는지 확인
2. 파일 이름이 정확한지 확인 (대소문자 구분)
3. 개발 서버를 재시작
4. 브라우저 캐시 삭제 후 새로고침

### 이미지 경로 오류
- 데이터베이스의 이미지 경로가 `/images/...` 형식인지 확인
- 프런트엔드에서 `menu.image`가 올바르게 사용되는지 확인

