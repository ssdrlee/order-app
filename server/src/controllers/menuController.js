import { getMenusFromDB, getMenuByIdFromDB } from '../models/menuModel.js';

// GET /api/menus - 모든 메뉴 목록 조회
export const getMenus = async (req, res, next) => {
  try {
    const menus = await getMenusFromDB();
    res.json(menus);
  } catch (error) {
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

