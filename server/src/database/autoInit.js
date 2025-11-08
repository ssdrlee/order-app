// 서버 시작 시 데이터베이스 자동 초기화
// 테이블이 없으면 자동으로 생성하고 초기 데이터 삽입

import pool from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQL 파일 읽기
const readSQLFile = (filename) => {
  const filePath = path.join(__dirname, '../../database', filename);
  return fs.readFileSync(filePath, 'utf8');
};

// 데이터베이스 초기화 확인 및 실행
export const checkAndInitDatabase = async () => {
  try {
    // menus 테이블이 있는지 확인
    const checkResult = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'menus'
      );
    `);
    
    if (checkResult.rows[0].exists) {
      console.log('✓ 데이터베이스가 이미 초기화되어 있습니다.');
      return;
    }
    
    console.log('⚠ 데이터베이스가 초기화되지 않았습니다. 초기화를 시작합니다...');
    
    // 트리거 함수 생성
    const functionSQL = readSQLFile('schema.sql');
    const functionRegex = /CREATE OR REPLACE FUNCTION[\s\S]*?\$\$ language 'plpgsql';/;
    const functionMatch = functionSQL.match(functionRegex);
    
    if (functionMatch) {
      try {
        await pool.query(functionMatch[0]);
        console.log('  ✓ 트리거 함수 생성 완료');
      } catch (error) {
        if (error.code !== '42723') {
          console.log(`  ⚠ 함수 생성 경고: ${error.message}`);
        }
      }
    }
    
    // 테이블 생성
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
      try {
        await pool.query(tableSQL);
      } catch (error) {
        if (error.code !== '42P07') {
          console.error(`  ⚠ 테이블 생성 오류: ${error.message}`);
        }
      }
    }
    console.log('  ✓ 테이블 생성 완료');
    
    // 인덱스 생성
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)',
      'CREATE INDEX IF NOT EXISTS idx_orders_order_date ON orders(order_date)',
      'CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id)',
      'CREATE INDEX IF NOT EXISTS idx_order_items_menu_id ON order_items(menu_id)',
      'CREATE INDEX IF NOT EXISTS idx_menus_name ON menus(name)'
    ];
    
    for (const indexSQL of indexes) {
      try {
        await pool.query(indexSQL);
      } catch (error) {
        // 무시
      }
    }
    console.log('  ✓ 인덱스 생성 완료');
    
    // 트리거 생성
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
      try {
        await pool.query(triggerSQL);
      } catch (error) {
        // 무시
      }
    }
    console.log('  ✓ 트리거 생성 완료');
    
    // 초기 데이터 삽입
    try {
      // 메뉴 데이터 삽입
      const menuInsert = `
        INSERT INTO menus (name, description, price, image, stock) VALUES
        ('아메리카노(ICE)', '시원하고 깔끔한 아이스 아메리카노', 4000, '/images/americano-ice.jpg', 10),
        ('아메리카노(HOT)', '따뜻하고 진한 핫 아메리카노', 4000, '/images/americano-hot.jpg', 10),
        ('카페라떼', '부드럽고 고소한 카페라떼', 5000, '/images/caffe-latte.jpg', 10),
        ('카푸치노', '우유 거품이 올라간 카푸치노', 5000, '/images/caffe-latte.jpg', 10),
        ('에스프레소', '진한 에스프레소', 3500, '/images/americano-hot.jpg', 10),
        ('바닐라라떼', '바닐라 시럽이 들어간 달콤한 라떼', 5500, '/images/caffe-latte.jpg', 10)
        ON CONFLICT DO NOTHING
      `;
      await pool.query(menuInsert);
      console.log('  ✓ 메뉴 데이터 삽입 완료');
    } catch (error) {
      console.log(`  ⚠ 메뉴 데이터 삽입 경고: ${error.message}`);
    }
    
    try {
      // 옵션 데이터 삽입
      const optionInsert = `
        INSERT INTO options (name, price, menu_id) VALUES
        ('샷 추가', 500, NULL),
        ('시럽 추가', 0, NULL)
        ON CONFLICT DO NOTHING
      `;
      await pool.query(optionInsert);
      console.log('  ✓ 옵션 데이터 삽입 완료');
    } catch (error) {
      console.log(`  ⚠ 옵션 데이터 삽입 경고: ${error.message}`);
    }
    
    console.log('✅ 데이터베이스 자동 초기화가 완료되었습니다!');
  } catch (error) {
    console.error('❌ 데이터베이스 자동 초기화 중 오류:', error.message);
    console.error('   로컬에서 수동으로 초기화를 실행하세요: npm run db:init-render');
  }
};

