import pool from '../src/config/database.js';

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    console.log('데이터베이스 연결을 테스트합니다...');
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✓ 데이터베이스 연결 성공!');
    console.log('현재 시간:', result.rows[0].current_time);
    console.log('PostgreSQL 버전:', result.rows[0].pg_version.split(',')[0]);
    
    // 테이블 존재 확인
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log('\n생성된 테이블:');
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('\n⚠ 테이블이 없습니다. `npm run db:init`을 실행하여 데이터베이스를 초기화하세요.');
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('✗ 데이터베이스 연결 실패:', error.message);
    console.error('\n문제 해결 방법:');
    console.error('1. PostgreSQL 서버가 실행 중인지 확인');
    console.error('2. .env 파일의 데이터베이스 설정을 확인');
    console.error('3. 데이터베이스가 생성되어 있는지 확인');
    process.exit(1);
  }
};

testConnection();

