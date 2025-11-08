import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

// 데이터베이스 존재 여부 확인 및 생성
const checkAndCreateDatabase = async () => {
  // 먼저 postgres 데이터베이스에 연결하여 확인
  const adminClient = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'postgres', // 기본 데이터베이스에 연결
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  });

  try {
    await adminClient.connect();
    console.log('PostgreSQL 서버에 연결되었습니다.');

    const dbName = process.env.DB_NAME || 'coffee_order_db';

    // 데이터베이스 존재 여부 확인
    const checkResult = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [dbName]
    );

    if (checkResult.rows.length === 0) {
      console.log(`데이터베이스 "${dbName}"가 없습니다. 생성합니다...`);
      await adminClient.query(`CREATE DATABASE ${dbName}`);
      console.log(`✓ 데이터베이스 "${dbName}" 생성 완료`);
    } else {
      console.log(`✓ 데이터베이스 "${dbName}"가 이미 존재합니다.`);
    }

    await adminClient.end();
    return true;
  } catch (error) {
    console.error('오류 발생:', error.message);
    
    console.error('\n=== 오류 진단 ===');
    console.error('에러 메시지:', error.message);
    console.error('\n=== 현재 설정 ===');
    console.error('DB_HOST:', process.env.DB_HOST || 'localhost');
    console.error('DB_PORT:', process.env.DB_PORT || 5432);
    console.error('DB_USER:', process.env.DB_USER || 'postgres');
    console.error('DB_NAME:', process.env.DB_NAME || 'coffee_order_db');
    console.error('DB_PASSWORD:', process.env.DB_PASSWORD ? '*** (설정됨)' : '❌ (설정되지 않음)');
    
    if (error.message.includes('password authentication failed') || error.code === '28P01') {
      console.error('\n=== 해결 방법 ===');
      console.error('❌ 비밀번호 인증 실패');
      console.error('1. .env 파일의 DB_PASSWORD를 확인하세요');
      console.error('2. PostgreSQL 사용자 비밀번호가 올바른지 확인하세요');
      console.error('3. PostgreSQL 설치 시 설정한 비밀번호를 확인하세요');
    } else if (error.message.includes('connect ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      console.error('\n=== 해결 방법 ===');
      console.error('❌ PostgreSQL 서버에 연결할 수 없음');
      console.error('1. PostgreSQL 서버가 실행 중인지 확인하세요');
      console.error('   Windows: 서비스 관리자에서 PostgreSQL 서비스 확인');
      console.error('2. .env 파일의 DB_HOST와 DB_PORT를 확인하세요');
      console.error('3. 방화벽이 포트 5432를 차단하고 있는지 확인하세요');
    } else if (error.message.includes('does not exist') || error.code === '3D000') {
      console.error('\n=== 해결 방법 ===');
      console.error('❌ 데이터베이스가 존재하지 않음');
      console.error('1. 이 스크립트가 자동으로 데이터베이스를 생성하려고 시도합니다');
      console.error('2. 권한 문제일 수 있으므로 수동으로 생성해보세요:');
      console.error('   psql -U postgres -c "CREATE DATABASE coffee_order_db;"');
    } else {
      console.error('\n=== 일반적인 해결 방법 ===');
      console.error('1. PostgreSQL 서버가 실행 중인지 확인');
      console.error('2. .env 파일의 모든 설정이 올바른지 확인');
      console.error('3. PostgreSQL 사용자 권한 확인');
    }
    
    await adminClient.end().catch(() => {});
    return false;
  }
};

checkAndCreateDatabase().then(success => {
  if (success) {
    console.log('\n이제 "npm run db:init"을 실행하여 데이터베이스를 초기화할 수 있습니다.');
    process.exit(0);
  } else {
    process.exit(1);
  }
});

