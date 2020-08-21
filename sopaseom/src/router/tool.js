
import { requireAuth } from './nav-guard';

/**
 * 어드민 전용 라우트 객체를 생성합니다.
 * @param {string} path 라우팅할 경로
 * @param {string} name 라우트 이름
 * @param {string} componentPath 실제 컴포넌트 이름
 */
// eslint-disable-next-line
export const adminRoute = (path, name) => ({
  path,
  name,
  beforeEnter: requireAuth('ADMIN'),
  meta: {
    layout: () => import('@/views/layout/LayoutAdmin.vue'),
  },
});
