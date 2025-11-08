import { getMenusFromDB, getMenuByIdFromDB } from '../models/menuModel.js';

// GET /api/menus - 모든 메뉴 목록 조회
export const getMenus = async (req, res, next) => {
  try {
    const menus = await getMenusFromDB();
    res.json(menus);
  } catch (error) {
    console.error('메뉴 목록 조회 중 오류:', error);
    // 데이터베이스 연결 오류인 경우 더 자세한 정보 제공
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(500).json({
        success: false,
        error: {
          code: 'DATABASE_CONNECTION_ERROR',
          message: '데이터베이스에 연결할 수 없습니다.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }
      });
    }
    next(error);
  }
};

// GET /api/menus/:id - 특정 메뉴 상세 조회
export const getMenuById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const menu = await getMenuByIdFromDB(id);
    
    if (!menu) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'ERR-201',
          message: '메뉴를 찾을 수 없습니다.'
        }
      });
    }
    
    res.json(menu);
  } catch (error) {
    next(error);
  }
};

