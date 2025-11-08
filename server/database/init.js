import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../src/config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL 파일 읽기
const readSQLFile = (filename) => {
  const filePath = path.join(__dirname, filename);
  return fs.readFileSync(filePath, 'utf8');
};

// 데이터베이스 초기화
const initDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('데이터베이스 초기화를 시작합니다...');
    
    // 트랜잭션 시작
    await client.query('BEGIN');
    
    try {
      // 스키마 생성
      console.log('스키마를 생성합니다...');
      const schemaSQL = readSQLFile('schema.sql');
      await client.query(schemaSQL);
      console.log('✓ 스키마 생성 완료');
      
      // 초기 데이터 삽입
      console.log('초기 데이터를 삽입합니다...');
      const seedSQL = readSQLFile('seed.sql');
      // SQL 파일을 세미콜론으로 분리하여 각각 실행
      const statements = seedSQL.split(';').filter(stmt => stmt.trim().length > 0);
      for (const statement of statements) {
        if (statement.trim()) {
          await client.query(statement);
        }
      }
      console.log('✓ 초기 데이터 삽입 완료');
      
      // 트랜잭션 커밋
      await client.query('COMMIT');
      console.log('데이터베이스 초기화가 완료되었습니다!');
    } catch (error) {
      // 트랜잭션 롤백
      await client.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('데이터베이스 초기화 중 오류 발생:', error);
    throw error;
  } finally {
    client.release();
  }
};

// 데이터베이스 연결 테스트
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✓ 데이터베이스 연결 성공');
    console.log('데이터베이스 시간:', result.rows[0].now);
    client.release();
    return true;
  } catch (error) {
    console.error('✗ 데이터베이스 연결 실패:', error.message);
    return false;
  }
};

// 메인 실행
const main = async () => {
  try {
    // 연결 테스트
    const connected = await testConnection();
    if (!connected) {
      console.error('데이터베이스 연결에 실패했습니다. .env 파일의 설정을 확인하세요.');
      process.exit(1);
    }
    
    // 데이터베이스 초기화
    await initDatabase();
    
    process.exit(0);
  } catch (error) {
    console.error('오류 발생:', error);
    process.exit(1);
  }
};

main();

