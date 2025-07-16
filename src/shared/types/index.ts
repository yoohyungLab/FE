// 타입들 export
export * from './result';

export interface TestResult {
    id: string;
    testType: string;
    scores: Record<string, number>;
    result: any;
    userId?: string;
    createdAt: string;
}

export interface User {
    id: string;
    email?: string;
    name?: string;
    avatar_url?: string;
    provider?: 'kakao' | 'google' | 'email';
}

// 건의사항 피드백 관련 타입들
export interface Feedback {
    id: string;
    title: string;
    content: string;
    category: FeedbackCategory;
    visibility: FeedbackVisibility;
    status: FeedbackStatus;
    author_id?: string;
    author_name: string;
    author_email?: string;
    attached_file_url?: string;
    views: number;
    created_at: string;
    updated_at: string;
    admin_reply?: string;
    admin_reply_at?: string;
    admin_id?: string;
}

export type FeedbackCategory =
    | 'test_idea' // 새 테스트 아이디어
    | 'feature' // 기능 개선 건의
    | 'bug_report' // 오류 신고
    | 'design' // 디자인 관련
    | 'mobile' // 모바일 이슈
    | 'other'; // 기타 의견

export type FeedbackVisibility =
    | 'private' // 비공개 (작성자 + 관리자만)
    | 'public' // 공개 (모든 사용자)
    | 'anonymous'; // 익명 공개

export type FeedbackStatus =
    | 'pending' // 검토중
    | 'in_progress' // 진행중
    | 'completed' // 완료/채택됨
    | 'replied' // 답변완료
    | 'rejected'; // 반려

export interface FeedbackComment {
    id: string;
    feedback_id: string;
    content: string;
    author_id?: string;
    author_name: string;
    is_admin: boolean;
    created_at: string;
}

export interface FeedbackFilters {
    category?: FeedbackCategory;
    status?: FeedbackStatus;
    visibility?: FeedbackVisibility;
    search?: string;
}
