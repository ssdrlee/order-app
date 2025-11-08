// API 테스트 스크립트
// Node.js 18+ 버전에서는 내장 fetch 사용
// Node.js 18 미만인 경우: npm install node-fetch 후 import 필요

const API_BASE_URL = 'http://localhost:5000/api';

// 테스트 결과 추적
let testsPassed = 0;
let testsFailed = 0;

// 테스트 헬퍼 함수
const test = async (name, testFn) => {
  try {
    console.log(`\n🧪 테스트: ${name}`);
    await testFn();
    console.log(`✅ 통과: ${name}`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ 실패: ${name}`);
    console.error(`   오류: ${error.message}`);
    testsFailed++;
  }
};

// API 호출 헬퍼
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || `HTTP ${response.status}`);
  }

  return data;
};

// 테스트 실행
const runTests = async () => {
  console.log('🚀 API 테스트 시작\n');
  console.log('⚠️  주의: 서버가 http://localhost:5000에서 실행 중이어야 합니다.\n');

  let createdOrderId = null;

  // 1. 메뉴 조회 테스트
  await test('메뉴 목록 조회', async () => {
    const menus = await apiCall('/menus');
    if (!Array.isArray(menus) || menus.length === 0) {
      throw new Error('메뉴 목록이 비어있거나 배열이 아닙니다.');
    }
    console.log(`   메뉴 개수: ${menus.length}개`);
  });

  await test('특정 메뉴 조회', async () => {
    const menu = await apiCall('/menus/1');
    if (!menu || !menu.id) {
      throw new Error('메뉴를 찾을 수 없습니다.');
    }
    console.log(`   메뉴 이름: ${menu.name}`);
  });

  // 2. 주문 생성 테스트
  await test('주문 생성', async () => {
    const orderData = {
      items: [
        {
          menuId: 1,
          name: '아메리카노(ICE)',
          quantity: 2,
          price: 4000,
          options: {
            shot: true,
            syrup: false
          }
        }
      ],
      totalAmount: 9000
    };

    const result = await apiCall('/orders', {
      method: 'POST',
      body: orderData
    });

    if (!result.data || !result.data.orderId) {
      throw new Error('주문 ID가 반환되지 않았습니다.');
    }

    createdOrderId = result.data.orderId;
    console.log(`   생성된 주문 ID: ${createdOrderId}`);
  });

  // 3. 주문 조회 테스트
  await test('주문 조회', async () => {
    if (!createdOrderId) {
      throw new Error('주문 ID가 없습니다.');
    }

    const order = await apiCall(`/orders/${createdOrderId}`);
    if (!order || !order.id) {
      throw new Error('주문을 찾을 수 없습니다.');
    }
    console.log(`   주문 상태: ${order.status}`);
  });

  // 4. 관리자 API 테스트
  await test('대시보드 통계 조회', async () => {
    const stats = await apiCall('/admin/dashboard');
    if (!stats || typeof stats.total !== 'number') {
      throw new Error('통계 데이터 형식이 올바르지 않습니다.');
    }
    console.log(`   총 주문: ${stats.total}개`);
  });

  await test('재고 목록 조회', async () => {
    const inventory = await apiCall('/admin/inventory');
    if (!Array.isArray(inventory) || inventory.length === 0) {
      throw new Error('재고 목록이 비어있거나 배열이 아닙니다.');
    }
    console.log(`   재고 항목: ${inventory.length}개`);
  });

  await test('재고 수정', async () => {
    const result = await apiCall('/admin/inventory/1', {
      method: 'PUT',
      body: { stock: 15 }
    });

    if (!result.success || result.stock !== 15) {
      throw new Error('재고 수정에 실패했습니다.');
    }
    console.log(`   수정된 재고: ${result.stock}`);
  });

  await test('주문 목록 조회', async () => {
    const orders = await apiCall('/admin/orders');
    if (!Array.isArray(orders)) {
      throw new Error('주문 목록이 배열이 아닙니다.');
    }
    console.log(`   주문 개수: ${orders.length}개`);
  });

  // 5. 주문 상태 변경 테스트
  if (createdOrderId) {
    await test('주문 상태 변경 (제조 중)', async () => {
      const result = await apiCall(`/admin/orders/${createdOrderId}/status`, {
        method: 'PUT',
        body: { status: '제조 중' }
      });

      if (!result.success || result.status !== '제조 중') {
        throw new Error('주문 상태 변경에 실패했습니다.');
      }
      console.log(`   변경된 상태: ${result.status}`);
    });
  }

  // 테스트 결과 출력
  console.log('\n' + '='.repeat(50));
  console.log('📊 테스트 결과');
  console.log('='.repeat(50));
  console.log(`✅ 통과: ${testsPassed}개`);
  console.log(`❌ 실패: ${testsFailed}개`);
  console.log(`📈 총계: ${testsPassed + testsFailed}개`);

  if (testsFailed === 0) {
    console.log('\n🎉 모든 테스트가 통과했습니다!');
    process.exit(0);
  } else {
    console.log('\n⚠️  일부 테스트가 실패했습니다.');
    process.exit(1);
  }
};

// 서버 연결 확인
const checkServer = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}`);
    const data = await response.json();
    console.log('✓ 서버 연결 확인:', data.message || 'OK');
    return true;
  } catch (error) {
    console.error('✗ 서버에 연결할 수 없습니다.');
    console.error('  서버가 http://localhost:5000에서 실행 중인지 확인하세요.');
    console.error('  실행 방법: cd server && npm run dev');
    return false;
  }
};

// 메인 실행
const main = async () => {
  const serverReady = await checkServer();
  if (!serverReady) {
    process.exit(1);
  }

  await runTests();
};

main().catch(error => {
  console.error('테스트 실행 중 오류 발생:', error);
  process.exit(1);
});

