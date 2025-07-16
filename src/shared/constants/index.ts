// 상수들 export

// 피드백 관련 상수들
export const FEEDBACK_CATEGORIES = {
    test_idea: { label: '🧪 새 테스트 아이디어', value: 'test_idea' },
    feature: { label: '🔧 기능 개선 건의', value: 'feature' },
    bug_report: { label: '🐛 오류 신고', value: 'bug_report' },
    design: { label: '🎨 디자인 관련', value: 'design' },
    mobile: { label: '📱 모바일 이슈', value: 'mobile' },
    other: { label: '💬 기타 의견', value: 'other' },
} as const;

export const FEEDBACK_VISIBILITY = {
    private: { label: '비공개 (나와 관리자만)', icon: '🔒', value: 'private' },
    public: { label: '공개 (모든 사용자)', icon: '📖', value: 'public' },
    anonymous: { label: '익명 공개 (닉네임 숨김)', icon: '👤', value: 'anonymous' },
} as const;

export const FEEDBACK_STATUS = {
    pending: { label: '💡 검토중', color: 'bg-yellow-100 text-yellow-700', value: 'pending' },
    in_progress: { label: '⚡ 진행중', color: 'bg-blue-100 text-blue-700', value: 'in_progress' },
    completed: { label: '✅ 채택됨', color: 'bg-green-100 text-green-700', value: 'completed' },
    replied: { label: '📝 답변완료', color: 'bg-purple-100 text-purple-700', value: 'replied' },
    rejected: { label: '❌ 반려', color: 'bg-red-100 text-red-700', value: 'rejected' },
} as const;

// 작성 제한
export const FEEDBACK_LIMITS = {
    GUEST: {
        DAILY: 3,
        HOURLY: 1,
    },
    USER: {
        DAILY: 10,
        INTERVAL_MINUTES: 10,
    },
    IP: {
        HOURLY: 5,
    },
} as const;

// 콘텐츠 제한
export const FEEDBACK_CONTENT_LIMITS = {
    TITLE_MAX: 50,
    CONTENT_MAX: 1000,
    MAX_EXTERNAL_LINKS: 3,
    FILE_SIZE_MAX: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;
