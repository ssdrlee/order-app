-- 초기 데이터 삽입
-- 기존 데이터가 있는 경우를 대비하여 먼저 삭제

-- 기존 데이터 삭제 (외래키 제약조건으로 인해 역순으로 삭제)
DELETE FROM order_item_options;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM options;
DELETE FROM menus;

-- Menus 테이블 초기 데이터
INSERT INTO menus (name, description, price, image, stock) VALUES
('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, '/images/americano-ice.jpg', 10),
('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노', 4000, '/images/americano-hot.jpg', 10),
('카페라떼', '부드럽고 고소한 카페라떼', 5000, '/images/caffe-latte.jpg', 10),
('카푸치노', '우유 거품이 올라간 카푸치노', 5000, '/images/caffe-latte.jpg', 10),
('에스프레소', '진한 에스프레소', 3500, '/images/americano-hot.jpg', 10),
('바닐라라떼', '바닐라 시럽이 들어간 달콤한 라떼', 5500, '/images/caffe-latte.jpg', 10);

-- Options 테이블 초기 데이터
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, NULL),  -- 모든 메뉴에 적용 가능
('시럽 추가', 0, NULL);  -- 모든 메뉴에 적용 가능

