// 데이터베이스 이미지 경로 업데이트 스크립트
import pool from '../src/config/database.js';

const updateImages = async () => {
  const client = await pool.connect();
  
  try {
    console.log('이미지 경로를 업데이트합니다...');
    
    await client.query('BEGIN');
    
    // 아메리카노(ICE)
    const result1 = await client.query(
      "UPDATE menus SET image = '/images/americano-ice.jpg' WHERE name = '아메리카노(ICE)' RETURNING id, name, image"
    );
    if (result1.rows.length > 0) {
      console.log(`✓ ${result1.rows[0].name}: ${result1.rows[0].image}`);
    } else {
      console.log('⚠ 아메리카노(ICE)를 찾을 수 없습니다.');
    }
    
    // 아메리카노(HOT)
    const result2 = await client.query(
      "UPDATE menus SET image = '/images/americano-hot.jpg' WHERE name = '아메리카노(HOT)' RETURNING id, name, image"
    );
    if (result2.rows.length > 0) {
      console.log(`✓ ${result2.rows[0].name}: ${result2.rows[0].image}`);
    } else {
      console.log('⚠ 아메리카노(HOT)를 찾을 수 없습니다.');
    }
    
    // 카페라떼
    const result3 = await client.query(
      "UPDATE menus SET image = '/images/caffe-latte.jpg' WHERE name = '카페라떼' RETURNING id, name, image"
    );
    if (result3.rows.length > 0) {
      console.log(`✓ ${result3.rows[0].name}: ${result3.rows[0].image}`);
    } else {
      console.log('⚠ 카페라떼를 찾을 수 없습니다.');
    }
    
    await client.query('COMMIT');
    
    // 모든 메뉴의 이미지 경로 확인
    console.log('\n현재 메뉴 이미지 경로:');
    const allMenus = await client.query('SELECT id, name, image FROM menus ORDER BY id');
    allMenus.rows.forEach(menu => {
      console.log(`  ${menu.id}. ${menu.name}: ${menu.image}`);
    });
    
    console.log('\n✅ 이미지 경로 업데이트 완료!');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ 이미지 경로 업데이트 실패:', error.message);
    throw error;
  } finally {
    client.release();
  }
};

// 실행
updateImages()
  .then(() => {
    process.exit(0);
  })
  .catch(error => {
    console.error('오류 발생:', error);
    process.exit(1);
  });

