import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // 빌드 최적화
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // 청크 크기 제한 경고 비활성화 (선택 사항)
    chunkSizeWarningLimit: 1000,
  },
  // 프로덕션 환경에서 base 경로 설정 (필요한 경우)
  // base: '/coffee-order-app/',
})

