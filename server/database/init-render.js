// Render 데이터베이스 초기화 스크립트
// Render의 External Database URL을 사용하여 로컬에서 실행

import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL 파일 읽기
const readSQLFile = (filename) => {
  const filePath = path.join(__dirname, filename);
  return fs.readFileSync(filePath, 'utf8');
};

// 데이터베이스 초기화
const initDatabase = async () => {
  // .env 파일에서 데이터베이스 연결 정보 읽기
  const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };

  console.log('데이터베이스 연결 정보:');
  console.log(`  Host: ${dbConfig.host}`);
  console.log(`  Port: ${dbConfig.port}`);
  console.log(`  Database: ${dbConfig.database}`);
  console.log(`  User: ${dbConfig.user}`);
  console.log('  Password: ***\n');

  const client = new Client(dbConfig);
  
  try {
    console.log('데이터베이스에 연결 중...');
    await client.connect();
    console.log('✓ 데이터베이스 연결 성공\n');
    
    // 트랜잭션을 사용하지 않고 각 SQL 문을 독립적으로 실행
    // (오류 발생 시 전체가 롤백되지 않도록)
    
    // 스키마 생성
    console.log('📋 스키마를 생성합니다...');
    const schemaSQL = readSQLFile('schema.sql');
    
    // 함수 정의 부분을 먼저 추출 ($$ 블록 포함)
    const functionRegex = /CREATE OR REPLACE FUNCTION[\s\S]*?\$\$ language 'plpgsql';/;
    const functionMatch = schemaSQL.match(functionRegex);
    
    // 함수가 있으면 먼저 실행
    if (functionMatch) {
      try {
        await client.query(functionMatch[0]);
        console.log('  ✓ 트리거 함수 생성 완료');
      } catch (error) {
        // 함수가 이미 존재하는 경우는 문제없음 (CREATE OR REPLACE)
        if (error.code !== '42723' && !error.message.includes('already exists')) {
          console.log(`  ⚠ 함수 생성 경고: ${error.message}`);
        }
      }
    }
    
    // 함수 부분을 제외한 나머지 SQL
    let restSQL = schemaSQL.replace(functionRegex, '');
    
    // SQL 문을 더 정확하게 파싱
    // 각 CREATE/DROP 문을 개별적으로 추출
    const sqlStatements = [];
    const createTableRegex = /CREATE TABLE IF NOT EXISTS[\s\S]*?;/gi;
    const createIndexRegex = /CREATE INDEX IF NOT EXISTS[\s\S]*?;/gi;
    const dropTriggerRegex = /DROP TRIGGER IF EXISTS[\s\S]*?;/gi;
    const createTriggerRegex = /CREATE TRIGGER[\s\S]*?;/gi;
    
    // 각 패턴에 맞는 SQL 문 추출
    let matches;
    
    // CREATE TABLE 문 추출
    while ((matches = createTableRegex.exec(restSQL)) !== null) {
      sqlStatements.push(matches[0].trim());
    }
    
    // CREATE INDEX 문 추출
    while ((matches = createIndexRegex.exec(restSQL)) !== null) {
      sqlStatements.push(matches[0].trim());
    }
    
    // DROP TRIGGER 문 추출
    while ((matches = dropTriggerRegex.exec(restSQL)) !== null) {
      sqlStatements.push(matches[0].trim());
    }
    
    // CREATE TRIGGER 문 추출
    while ((matches = createTriggerRegex.exec(restSQL)) !== null) {
      sqlStatements.push(matches[0].trim());
    }
    
    // 각 SQL 문 실행 (독립적으로)
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i];
      
      try {
        await client.query(sql);
      } catch (error) {
        // 이미 존재하는 객체는 무시
        const ignorableErrors = [
          '42P07', // 테이블이 이미 존재
          '42710', // 객체가 이미 존재 (트리거 등)
          '42P16', // 인덱스가 이미 존재
          '42723', // 함수가 이미 존재
          '42P17', // 스키마가 이미 존재
          '25P02'  // 트랜잭션 오류 (이미 처리됨)
        ];
        
        if (ignorableErrors.includes(error.code) ||
            error.message.includes('already exists') ||
            error.message.includes('이미 있습니다') ||
            error.message.includes('duplicate') ||
            (error.message.includes('does not exist') && sql.toUpperCase().includes('DROP'))) {
          // 무시하고 계속 진행
          continue;
        } else {
          // 다른 오류는 상세 정보와 함께 출력 (하지만 중단하지 않음)
          console.error(`  ⚠ SQL 실행 경고 (${i + 1}/${sqlStatements.length}): ${error.message}`);
          console.error(`     SQL: ${sql.substring(0, 80)}...`);
        }
      }
    }
    console.log('✓ 스키마 생성 완료\n');
    
    // 초기 데이터 삽입
    console.log('🌱 초기 데이터를 삽입합니다...');
    const seedSQL = readSQLFile('seed.sql');
    // SQL 파일을 세미콜론으로 분리하여 각각 실행
    const seedStatements = seedSQL.split(';').filter(stmt => {
      const trimmed = stmt.trim();
      return trimmed.length > 0 && !trimmed.startsWith('--');
    });
    
    for (const statement of seedStatements) {
      try {
        if (statement.trim()) {
          await client.query(statement);
        }
      } catch (error) {
        // 데이터 삽입 오류는 무시하지 않음 (중요한 데이터)
        if (error.code === '23505') { // unique constraint violation
          console.log(`  ⚠ 데이터가 이미 존재합니다: ${statement.substring(0, 50)}...`);
        } else {
          console.error(`  ⚠ 데이터 삽입 경고: ${error.message}`);
        }
      }
    }
    console.log('✓ 초기 데이터 삽입 완료\n');
    
    console.log('✅ 데이터베이스 초기화가 완료되었습니다!\n');
    
    // 생성된 테이블 확인
    console.log('📊 생성된 테이블 확인:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // 메뉴 데이터 확인
    console.log('\n📋 메뉴 데이터 확인:');
    const menusResult = await client.query('SELECT id, name, image FROM menus ORDER BY id');
    menusResult.rows.forEach(menu => {
      console.log(`  ${menu.id}. ${menu.name} - ${menu.image}`);
    });
    
    // 옵션 데이터 확인
    console.log('\n⚙️  옵션 데이터 확인:');
    const optionsResult = await client.query('SELECT id, name, price FROM options ORDER BY id');
    optionsResult.rows.forEach(option => {
      console.log(`  ${option.id}. ${option.name} (+${option.price}원)`);
    });
    
  } catch (error) {
    console.error('❌ 데이터베이스 초기화 중 오류 발생:', error.message);
    console.error('\n오류 상세:');
    console.error(error);
    throw error;
  } finally {
    await client.end();
  }
};

// 메인 실행
const main = async () => {
  try {
    // 환경 변수 확인
    if (!process.env.DB_HOST || !process.env.DB_NAME || !process.env.DB_USER || !process.env.DB_PASSWORD) {
      console.error('❌ 환경 변수가 설정되지 않았습니다.');
      console.error('\n필수 환경 변수:');
      console.error('  - DB_HOST');
      console.error('  - DB_PORT (선택, 기본값: 5432)');
      console.error('  - DB_NAME');
      console.error('  - DB_USER');
      console.error('  - DB_PASSWORD');
      console.error('  - DB_SSL (선택, Render의 경우 true로 설정)');
      console.error('\n.env 파일을 확인하세요.');
      process.exit(1);
    }
    
    await initDatabase();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ 오류 발생:', error);
    process.exit(1);
  }
};

main();

