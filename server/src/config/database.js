import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'coffee_order_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  // Render 등의 클라우드 데이터베이스는 SSL 연결이 필요할 수 있음
  ssl: process.env.DB_SSL === 'true' 
    ? { rejectUnauthorized: false } 
    : false,
});

// 연결 에러 핸들러
pool.on('error', (err, client) => {
  console.error('예상치 못한 데이터베이스 연결 오류:', err);
  // 프로세스를 종료하지 않고 로그만 출력
  // 서버가 계속 실행될 수 있도록 함
});

// 쿼리 실행 헬퍼 함수
export const query = async (text, params) => {
  try {
    const result = await pool.query(text, params);
    return result;
  } catch (error) {
    console.error('쿼리 실행 오류:', error);
    throw error;
  }
};

// 연결 종료
export const closePool = async () => {
  await pool.end();
};

export default pool;

