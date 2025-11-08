# 이미지 파일

이 폴더에는 커피 메뉴 이미지가 저장됩니다.

## 파일 목록

- `americano-ice.jpg` - 아메리카노(ICE) 이미지
- `americano-hot.jpg` - 아메리카노(HOT) 이미지
- `caffe-latte.jpg` - 카페라떼 이미지

## 사용 방법

Vite 프로젝트에서 `public` 폴더의 파일은 루트 경로(`/`)에서 제공됩니다.

예: `ui/public/images/americano-ice.jpg` → `/images/americano-ice.jpg`

## 데이터베이스 이미지 경로

데이터베이스의 `menus` 테이블에서 이미지 경로는 다음과 같이 저장됩니다:
- `/images/americano-ice.jpg`
- `/images/americano-hot.jpg`
- `/images/caffe-latte.jpg`

이 경로는 프런트엔드에서 직접 사용됩니다.

