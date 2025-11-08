// Render 데이터베이스 초기화 스크립트 (개선 버전)
// 각 SQL 문을 순차적으로 실행하되, 오류가 발생해도 계속 진행

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

// SQL 문을 안전하게 실행
const executeSQL = async (client, sql, description = '') => {
  try {
    await client.query(sql);
    return { success: true };
  } catch (error) {
    // 무시할 수 있는 오류 코드
    const ignorableErrors = [
      '42P07', // 테이블이 이미 존재
      '42710', // 객체가 이미 존재 (트리거 등)
      '42P16', // 인덱스가 이미 존재
      '42723', // 함수가 이미 존재
      '42P17', // 스키마가 이미 존재
      '23505', // unique constraint violation (데이터 중복)
    ];
    
    const ignorableMessages = [
      'already exists',
      '이미 있습니다',
      'duplicate',
      'does not exist' // DROP 문에서
    ];
    
    if (ignorableErrors.includes(error.code) ||
        ignorableMessages.some(msg => error.message.includes(msg))) {
      return { success: false, ignored: true, error };
    }
    
    return { success: false, ignored: false, error };
  }
};

// 데이터베이스 초기화
const initDatabase = async () => {
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
    
    // 1. 트리거 함수 생성
    console.log('📋 1. 트리거 함수 생성...');
    const schemaSQL = readSQLFile('schema.sql');
    const functionRegex = /CREATE OR REPLACE FUNCTION[\s\S]*?\$\$ language 'plpgsql';/;
    const functionMatch = schemaSQL.match(functionRegex);
    
    if (functionMatch) {
      const result = await executeSQL(client, functionMatch[0], '트리거 함수');
      if (result.success) {
        console.log('  ✓ 트리거 함수 생성 완료');
      } else if (result.ignored) {
        console.log('  ⚠ 트리거 함수가 이미 존재합니다');
      }
    }
    
    // 2. 테이블 생성
    console.log('\n📋 2. 테이블 생성...');
    const tables = [
      `CREATE TABLE IF NOT EXISTS menus (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        image VARCHAR(255),
        stock INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      `CREATE TABLE IF NOT EXISTS options (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price INTEGER NOT NULL DEFAULT 0,
        menu_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE SET NULL
      )`,
      `CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20) NOT NULL DEFAULT '주문 접수',
        total_amount INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CHECK (status IN ('주문 접수', '제조 중', '제조 완료'))
      )`,
      `CREATE TABLE IF NOT EXISTS order_items (
        id SERIAL PRIMARY KEY,
        order_id INTEGER NOT NULL,
        menu_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price INTEGER NOT NULL,
        total_price INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_id) REFERENCES menus(id) ON DELETE RESTRICT
      )`,
      `CREATE TABLE IF NOT EXISTS order_item_options (
        id SERIAL PRIMARY KEY,
        order_item_id INTEGER NOT NULL,
        option_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
        FOREIGN KEY (option_id) REFERENCES options(id) ON DELETE RESTRICT,
        UNIQUE (order_item_id, option_id)
      )`
    ];
    
    for (const tableSQL of tables) {
      const result = await executeSQL(client, tableSQL);
      if (result.success) {
        console.log('  ✓ 테이블 생성 완료');
      } else if (!result.ignored) {
        console.log(`  ⚠ 테이블 생성 경고: ${result.error.message}`);
      }
    }
    
    // 3. 인덱스 생성
    console.log('\n📋 3. 인덱스 생성...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
      'CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date)',
      'CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)',
      'CREATE INDEX IF NOT EXISTS idx_order_items_menu_id ON order_items(menu_id)',
      'CREATE INDEX IF NOT EXISTS idx_menus_name ON menus(name)'
    ];
    
    for (const indexSQL of indexes) {
      await executeSQL(client, indexSQL);
    }
    console.log('  ✓ 인덱스 생성 완료');
    
    // 4. 트리거 생성
    console.log('\n📋 4. 트리거 생성...');
    const triggers = [
      'DROP TRIGGER IF EXISTS update_menus_updated_at ON menus',
      `CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
      'DROP TRIGGER IF EXISTS update_options_updated_at ON options',
      `CREATE TRIGGER update_options_updated_at BEFORE UPDATE ON options
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`,
      'DROP TRIGGER IF EXISTS update_orders_updated_at ON orders',
      `CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()`
    ];
    
    for (const triggerSQL of triggers) {
      await executeSQL(client, triggerSQL);
    }
    console.log('  ✓ 트리거 생성 완료');
    
    // 5. 초기 데이터 삽입
    console.log('\n📋 5. 초기 데이터 삽입...');
    
    // 기존 데이터 삭제
    console.log('  기존 데이터 삭제 중...');
    try {
      await client.query('DELETE FROM order_item_options');
      await client.query('DELETE FROM order_items');
      await client.query('DELETE FROM orders');
      await client.query('DELETE FROM options');
      await client.query('DELETE FROM menus');
      console.log('  ✓ 기존 데이터 삭제 완료');
    } catch (error) {
      console.log(`  ⚠ 데이터 삭제 경고: ${error.message}`);
    }
    
    // 메뉴 데이터 삽입
    console.log('  메뉴 데이터 삽입 중...');
    try {
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
      console.log(`  ✓ 메뉴 데이터 삽입 완료 (${menuResult.rowCount}개 행)`);
    } catch (error) {
      console.error(`  ❌ 메뉴 데이터 삽입 실패: ${error.message}`);
      throw error;
    }
    
    // 옵션 데이터 삽입
    console.log('  옵션 데이터 삽입 중...');
    try {
      const optionInsert = `
        INSERT INTO options (name, price, menu_id) VALUES
        ('샷 추가', 500, NULL),
        ('시럽 추가', 0, NULL)
      `;
      const optionResult = await client.query(optionInsert);
      console.log(`  ✓ 옵션 데이터 삽입 완료 (${optionResult.rowCount}개 행)`);
    } catch (error) {
      console.error(`  ❌ 옵션 데이터 삽입 실패: ${error.message}`);
      throw error;
    }
    
    console.log('  ✓ 초기 데이터 삽입 완료');
    
    // 6. 확인
    console.log('\n📊 생성된 테이블 확인:');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    tablesResult.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    console.log('\n📋 메뉴 데이터 확인:');
    const menusResult = await client.query('SELECT id, name, image FROM menus ORDER BY id');
    menusResult.rows.forEach(menu => {
      console.log(`  ${menu.id}. ${menu.name} - ${menu.image}`);
    });
    
    console.log('\n⚙️  옵션 데이터 확인:');
    const optionsResult = await client.query('SELECT id, name, price FROM options ORDER BY id');
    optionsResult.rows.forEach(option => {
      console.log(`  ${option.id}. ${option.name} (+${option.price}원)`);
    });
    
    console.log('\n✅ 데이터베이스 초기화가 완료되었습니다!');
    
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

