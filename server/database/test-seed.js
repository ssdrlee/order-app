// seed.sql 데이터 삽입 테스트 스크립트

import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readSQLFile = (filename) => {
  const filePath = path.join(__dirname, filename);
  return fs.readFileSync(filePath, 'utf8');
};

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

    const seedSQL = readSQLFile('seed.sql');
    const statements = seedSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`총 ${statements.length}개의 SQL 문을 실행합니다...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement) continue;

      try {
        const result = await client.query(statement);
        if (statement.toUpperCase().includes('DELETE')) {
          console.log(`${i + 1}. DELETE 실행 완료`);
        } else if (statement.toUpperCase().includes('INSERT')) {
          console.log(`${i + 1}. INSERT 실행 완료 (영향받은 행: ${result.rowCount || 0})`);
        } else {
          console.log(`${i + 1}. SQL 실행 완료`);
        }
      } catch (error) {
        console.error(`${i + 1}. SQL 실행 오류:`, error.message);
        console.error(`   SQL: ${statement.substring(0, 100)}...`);
      }
    }

    // 데이터 확인
    console.log('\n📊 데이터 확인:');
    const menusResult = await client.query('SELECT COUNT(*) as count FROM menus');
    console.log(`메뉴 개수: ${menusResult.rows[0].count}`);
    
    const optionsResult = await client.query('SELECT COUNT(*) as count FROM options');
    console.log(`옵션 개수: ${optionsResult.rows[0].count}`);

    if (parseInt(menusResult.rows[0].count) > 0) {
      const menus = await client.query('SELECT id, name FROM menus ORDER BY id');
      console.log('\n메뉴 목록:');
      menus.rows.forEach(menu => {
        console.log(`  ${menu.id}. ${menu.name}`);
      });
    }

    if (parseInt(optionsResult.rows[0].count) > 0) {
      const options = await client.query('SELECT id, name FROM options ORDER BY id');
      console.log('\n옵션 목록:');
      options.rows.forEach(option => {
        console.log(`  ${option.id}. ${option.name}`);
      });
    }

  } catch (error) {
    console.error('오류:', error);
  } finally {
    await client.end();
  }
};

main();

