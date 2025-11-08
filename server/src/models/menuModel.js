import { query } from '../config/database.js';

// 모든 메뉴 목록 조회
export const getMenusFromDB = async () => {
  try {
    const result = await query(
      'SELECT id, name, description, price, image, stock FROM menus ORDER BY id'
    );
    return result.rows;
  } catch (error) {
    console.error('메뉴 목록 조회 오류:', error);
    throw error;
  }
};

// 특정 메뉴 조회
export const getMenuByIdFromDB = async (id) => {
  try {
    const result = await query(
      'SELECT id, name, description, price, image, stock FROM menus WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('메뉴 조회 오류:', error);
    throw error;
  }
};

