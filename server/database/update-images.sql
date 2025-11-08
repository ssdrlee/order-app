-- 이미지 경로 업데이트
-- 아메리카노(ICE), 아메리카노(HOT), 카페라떼의 이미지 경로를 올바르게 설정

UPDATE menus 
SET image = '/images/americano-ice.jpg' 
WHERE name = '아메리카노(ICE)';

UPDATE menus 
SET image = '/images/americano-hot.jpg' 
WHERE name = '아메리카노(HOT)';

UPDATE menus 
SET image = '/images/caffe-latte.jpg' 
WHERE name = '카페라떼';

-- 확인용 쿼리
SELECT id, name, image FROM menus ORDER BY id;

