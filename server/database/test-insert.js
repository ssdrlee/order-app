// INSERT 문 테스트 스크립트

import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

const main = async () => {
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'coffee_order_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('✓ 데이터베이스 연결 성공\n');

    // 메뉴 데이터 삽입
    console.log('메뉴 데이터 삽입 중...');
    const menuInsert = `
      INSERT INTO menus (name, description, price, image, stock) VALUES
      ('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, '/images/americano-ice.jpg', 10),
      ('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노', 4000, '/images/americano-hot.jpg', 10),
      ('카페라떼', '부드럽고 고소한 카페라떼', 5000, '/images/caffe-latte.jpg', 10),
      ('카푸치노', '우유 거품이 올라간 카푸치노', 5000, '/images/caffe-latte.jpg', 10),
      ('에스프레소', '진한 에스프레소', 3500, '/images/americano-hot.jpg', 10),
      ('바닐라라떼', '바닐라 시럽이 들어간 달콤한 라떼', 5500, '/images/caffe-latte.jpg', 10)
    `;
    
    const menuResult = await client.query(menuInsert);
    console.log(`✓ 메뉴 데이터 삽입 완료 (${menuResult.rowCount}개 행)`);

    // 옵션 데이터 삽입
    console.log('\n옵션 데이터 삽입 중...');
    const optionInsert = `
      INSERT INTO options (name, price, menu_id) VALUES
      ('샷 추가', 500, NULL),
      ('시럽 추가', 0, NULL)
    `;
    
    const optionResult = await client.query(optionInsert);
    console.log(`✓ 옵션 데이터 삽입 완료 (${optionResult.rowCount}개 행)`);

    // 데이터 확인
    console.log('\n📊 데이터 확인:');
    const menusResult = await client.query('SELECT COUNT(*) as count FROM menus');
    console.log(`메뉴 개수: ${menusResult.rows[0].count}`);
    
    const optionsResult = await client.query('SELECT COUNT(*) as count FROM options');
    console.log(`옵션 개수: ${optionsResult.rows[0].count}`);

    if (parseInt(menusResult.rows[0].count) > 0) {
      const menus = await client.query('SELECT id, name, image FROM menus ORDER BY id');
      console.log('\n메뉴 목록:');
      menus.rows.forEach(menu => {
        console.log(`  ${menu.id}. ${menu.name} - ${menu.image}`);
      });
    }

    if (parseInt(optionsResult.rows[0].count) > 0) {
      const options = await client.query('SELECT id, name, price FROM options ORDER BY id');
      console.log('\n옵션 목록:');
      options.rows.forEach(option => {
        console.log(`  ${option.id}. ${option.name} (+${option.price}원)`);
      });
    }

  } catch (error) {
    console.error('오류:', error.message);
    console.error(error);
  } finally {
    await client.end();
  }
};

main();

