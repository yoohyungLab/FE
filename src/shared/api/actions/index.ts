export { feedbackService as feedbackActions } from '../services/feedback.service';
export { categoryService as categoryActions } from '../services/category.service';

// 기존 유틸(API)도 액션 형태로 접근 가능하게 재노출
// 주의: 내부적으로는 동일 구현을 사용합니다.
export { spamPreventionApi as spamPreventionActions } from '../index';
