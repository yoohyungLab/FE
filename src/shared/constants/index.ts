// ============================================================================
// 통합 상수 파일 - TypologyLab
// ============================================================================

// ============================================================================
// 테스트 관련 상수
// ============================================================================

// 테스트 카테고리
export const TEST_CATEGORIES = {
    1: '성격',
    2: '연애/인간관계',
    3: '감정/멘탈',
    4: '밸런스 게임',
    5: '사고/결정 방식',
    6: '지능/능력',
    7: '라이프스타일',
    8: 'MBTI 응용',
    9: '기타',
} as const;

export type CategoryId = keyof typeof TEST_CATEGORIES;

// ============================================================================
// 에겐·테토 테스트 상수
// ============================================================================

// 질문 인터페이스
interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        score: number;
        type: string;
    }[];
}

// 에겐·테토 질문
export const EGEN_TETO_QUESTIONS: Question[] = [
    {
        id: 1,
        text: '친구가 힘든 얘기를 꺼낼 때 나는?',
        options: [
            { text: '"그랬구나… 진짜 힘들었겠다" 공감 먼저!', score: 2, type: '에겐 강' },
            { text: '들어주고 나서 "근데 이렇게 해보는 건 어때?"', score: 1, type: '에겐 약' },
            { text: '"그래서 지금 문제는 뭐야?" 정리부터 시작', score: -1, type: '테토 약' },
            { text: '"그냥 넘겨. 다 그런 거야." 현실 조언 시전', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 2,
        text: '프로젝트 D-3, 나는 어떤 타입?',
        options: [
            { text: '팀원 페이스 보며 분위기 조절 담당', score: 2, type: '에겐 강' },
            { text: '"이건 네가, 이건 내가" 역할 분배 시도', score: 1, type: '에겐 약' },
            { text: '일단 내가 시간표 짜고 리딩함', score: -1, type: '테토 약' },
            { text: '답답해서 그냥 내가 다 밀고 감', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 3,
        text: '친구랑 말다툼 날 것 같을 땐?',
        options: [
            { text: '괜히 틀어질까봐 그냥 넘긴다', score: 2, type: '에겐 강' },
            { text: '돌려서 말하면서 눈치 봄', score: 1, type: '에겐 약' },
            { text: '살짝 세게 말하되 수위는 조절함', score: -1, type: '테토 약' },
            { text: '할 말은 다 하고 바로 마무리', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 4,
        text: '단톡방에서 나는 어떤 스타일?',
        options: [
            { text: '💬 이모지+말투 부드러운 감성파', score: 2, type: '에겐 강' },
            { text: 'ㅎㅎ… 말끝이 조심조심', score: 1, type: '에겐 약' },
            { text: '말투 똑 부러지고 정리 잘함', score: -1, type: '테토 약' },
            { text: 'ㅇㅇ / ㄴㄴ 단답+직설 콤보', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 5,
        text: '내 실수에 대해 누가 말해줄 때 나는?',
        options: [
            { text: '속상하지만 "고마워"라고 말함', score: 2, type: '에겐 강' },
            { text: '받아들이되 "아 그런가…" 눈치 봄', score: 1, type: '에겐 약' },
            { text: '오케이 피드백 완료 → 개선모드', score: -1, type: '테토 약' },
            { text: '"그건 이런 이유였어" 반박함', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 6,
        text: '여행 계획 짤 때 나는?',
        options: [
            { text: '"어디 가고 싶어?" 다수 의견 먼저 수집', score: 2, type: '에겐 강' },
            { text: '각자 역할 나눠서 일정 짬', score: 1, type: '에겐 약' },
            { text: '내가 루트 짜서 공유하고 조율', score: -1, type: '테토 약' },
            { text: '그냥 내가 다 정함. 효율이 최고', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 7,
        text: '연애에서 제일 중요한 건?',
        options: [
            { text: '감정 공감과 대화의 온도차 없는 소통', score: 2, type: '에겐 강' },
            { text: '서로 이해하고 표현하는 적당한 균형', score: 1, type: '에겐 약' },
            { text: '역할 정하고 효율 맞춰가기', score: -1, type: '테토 약' },
            { text: '내가 리드하고 끌고 가는 스타일', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 8,
        text: '친구가 "요즘 힘들어"라고 말할 때?',
        options: [
            { text: '말없이 안아주거나 손 잡아줌', score: 2, type: '에겐 강' },
            { text: '"진짜 힘들었겠다…" 공감 멘트', score: 1, type: '에겐 약' },
            { text: '"이런 식으로 바꿔보면 어때?" 제안함', score: -1, type: '테토 약' },
            { text: '"근데 그거 심한 건 아니지 않아?" 현실 직진', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 9,
        text: '새로운 도전을 앞두고 나는?',
        options: [
            { text: '함께하는 사람, 분위기 먼저 체크', score: 2, type: '에겐 강' },
            { text: '주변 반응, 기류 살핀 다음 결정', score: 1, type: '에겐 약' },
            { text: '계획 있으면 바로 실행', score: -1, type: '테토 약' },
            { text: '재고 뭐고 없음. 느낌 오면 바로 고', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 10,
        text: '누가 실수했을 때 나는?',
        options: [
            { text: '기죽을까봐 공감 먼저', score: 2, type: '에겐 강' },
            { text: '"괜찮아~" 분위기 풀기 시전', score: 1, type: '에겐 약' },
            { text: '"다음엔 이렇게 해보자" 제안함', score: -1, type: '테토 약' },
            { text: '바로 지적 후 빠르게 정리함', score: -2, type: '테토 강' },
        ],
    },
];

// 에겐·테토 결과 데이터
interface ResultData {
    title: string;
    description: string;
    characteristics: string[];
    emoji: string;
}

export const EGEN_TETO_RESULTS: Record<string, ResultData> = {
    'egen-male': {
        title: '에겐남',
        description: '말보다 마음을 읽는 타입! \n섬세하지만 강한 내면을 지닌 당신은\n팀의 숨은 중심이자 따뜻한 리더예요.',
        characteristics: [
            '감정의 흐름을 빠르게 캐치하고, 공감 능력으로 분위기를 이끎',
            '겉으로는 조용하지만, 누군가에게는 깊은 위로가 되는 존재',
            '겸손하고 배려 깊으며, 무리에서 중재자 역할을 자주 맡음',
            '직설적인 표현보다는 부드러운 방식으로 갈등을 풀어나감',
            '자신보다 타인의 행복을 우선시하는 편',
        ],
        emoji: '🤝',
    },
    'egen-female': {
        title: '에겐녀',
        description: '따뜻함이 자연스럽게 스며드는 사람! \n섬세하고 감성적인 당신은\n주변 사람들에게 심리적 안식처 같은 존재예요.',
        characteristics: [
            '말 한마디에도 진심이 담겨 있어 듣는 사람을 안심시킴',
            '누군가 슬퍼 보이면 먼저 다가가 따뜻하게 위로해주는 스타일',
            '감정 기복을 잘 다스리며, 안정된 에너지를 주변에 퍼뜨림',
            '분위기 메이커이지만 소란스럽지 않은, 부드러운 리더십 소유자',
            '주변 사람들의 기분 변화에 민감하고 섬세한 배려를 함',
        ],
        emoji: '💕',
    },
    'teto-male': {
        title: '테토남',
        description: '거침없는 직진형! \n할 말은 확실히 하고 책임도 끝까지 지는\n묵직한 존재감의 소유자예요.',
        characteristics: [
            '솔직하고 과감한 커뮤니케이션 스타일로 갈등도 빠르게 해결',
            '계획보단 실행, 말보단 행동으로 보여주는 타입',
            '팀에서 리더나 추진력 있는 역할을 자연스럽게 맡음',
            '정의롭고 의리파, 약자 편에 서는 데 주저하지 않음',
            '냉철해 보이지만 가까워질수록 따뜻한 반전 매력 보유',
        ],
        emoji: '💪',
    },
    'teto-female': {
        title: '테토녀',
        description: '강단 있고 자신감 넘치는 분위기의 핵인싸! \n도전 앞에서 망설임이란 없는 전형적인 걸크러쉬 스타일이에요.',
        characteristics: [
            '무리 속에서도 단연 눈에 띄는 리더형 에너지',
            '하고 싶은 건 반드시 해내고야 마는 추진력',
            '자기 주관이 뚜렷하고, 거침없이 자신의 생각을 표현함',
            '스스로를 챙기면서도 타인을 끌어주는 든든한 존재',
            '새로운 환경에도 빠르게 적응하고 변화를 즐김',
        ],
        emoji: '🔥',
    },
    mixed: {
        title: '혼합형',
        description: '에겐의 섬세함과 테토의 추진력을 동시에 지닌 균형형 인간! \n어떤 상황에서도 자신만의 최적 해답을 찾아내는 능력자예요.',
        characteristics: [
            '사람을 대할 땐 따뜻하게, 문제를 대할 땐 냉철하게',
            '감성과 논리를 유연하게 오가며 상대와 상황에 맞는 태도를 보여줌',
            '어느 무리에서든 중심 역할을 맡게 되는 편',
            '다양한 성향의 사람들과도 무리 없이 어울리는 팔방미인',
            '선택의 순간, 감정과 이성을 적절히 조합해 후회 없는 결정을 내림',
        ],
        emoji: '⚖️',
    },
};

// 에겐·테토 결과 배경 이미지
export const EGEN_TETO_RESULT_BG_IMAGES: Record<string, string> = {
    'egen-male': '/images/egen-teto/bg-egen-male.png',
    'egen-female': '/images/egen-teto/bg-egen-female.png',
    'teto-male': '/images/egen-teto/bg-teto-male.png',
    'teto-female': '/images/egen-teto/bg-egen-female.png',
    mixed: '/images/egen-teto/bg-mixed.jpg',
};

// ============================================================================
// 테스트 목록 상수
// ============================================================================

// 메인 테스트 목록
export const MAIN_TESTS = [
    {
        id: 'egen-teto',
        title: '에겐·테토 테스트',
        description: '호르몬 성향으로 나를 분석해보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'pink',
        category: 1,
        tags: ['감성', '호르몬'],
    },
    {
        id: 'mbti',
        title: 'MBTI 테스트',
        description: '16가지 유형으로 나의 성격을 파악해보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'blue',
        category: 1,
        tags: ['성격', '진단'],
    },
    {
        id: 'love-style',
        title: '연애스타일 테스트',
        description: '당신의 연애 방식은 어떤 유형일까요?',
        image: '/images/egen-teto/thumbnail.png',
        color: 'rose',
        category: 2,
        tags: ['연애', '감정'],
    },
    {
        id: 'enneagram',
        title: '에니어그램 테스트',
        description: '9가지 성격 유형으로 나를 알아보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'purple',
        category: 1,
        tags: ['성격', '자기계발'],
    },
    {
        id: 'iq-quiz',
        title: 'IQ 퀴즈',
        description: '지적 능력을 측정해보세요',
        image: '/images/egen-teto/thumbnail.png',
        color: 'green',
        category: 3,
        tags: ['지능', '퀴즈'],
    },
];

// 밸런스 게임 목록
export const BALANCE_GAMES = [
    {
        id: 'balance-earlybird-vs-nightowl',
        title: '아침형 인간 vs 저녁형 인간',
        description: '당신의 생활 루틴은 어떤 타입인가요?',
        image: '/images/egen-teto/thumbnail.png',
        category: 4,
        tags: ['밸런스 게임'],
    },
    {
        id: 'balance-alone-vs-party',
        title: '혼자 있는게 좋아 vs 친구랑 어울리는게 좋아',
        description: '에너지 충전 방식은 다르니까!',
        image: '/images/egen-teto/thumbnail.png',
        category: 1,
        tags: ['밸런스 게임'],
    },
    {
        id: 'balance-fast-vs-deepthink',
        title: '빨리 결정하는 편 vs 오래 고민하는 편',
        description: '당신의 선택 스타일은?',
        image: '/images/egen-teto/thumbnail.png',
        category: 1,
        tags: ['밸런스 게임'],
    },
];

// 인기 테스트 목록
export const POPULAR_TESTS = [
    {
        id: 'mbti',
        title: 'MBTI 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '성격',
        category: 1,
    },
    {
        id: 'love-style',
        title: '연애 스타일 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '연애',
        category: 2,
    },
    {
        id: 'self-esteem',
        title: '자존감 자가진단 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '자존감',
        category: 1,
    },
    {
        id: 'funny-animal',
        title: '나는 어떤 동물일까 테스트',
        image: '/images/egen-teto/thumbnail.png',
        tag: '웃긴',
        category: 5,
    },
];

// ============================================================================
// 피드백 관련 상수
// ============================================================================

// 피드백 카테고리
export const FEEDBACK_CATEGORIES = {
    test_idea: { label: '🧪 새 테스트 아이디어', value: 'test_idea' },
    feature: { label: '🔧 기능 개선 건의', value: 'feature' },
    bug_report: { label: '🐛 오류 신고', value: 'bug_report' },
    design: { label: '🎨 디자인 관련', value: 'design' },
    mobile: { label: '📱 모바일 이슈', value: 'mobile' },
    other: { label: '💬 기타 의견', value: 'other' },
} as const;

// 피드백 공개 설정
export const FEEDBACK_VISIBILITY = {
    private: { label: '비공개 (나와 관리자만)', icon: '🔒', value: 'private' },
    public: { label: '공개 (모든 사용자)', icon: '📖', value: 'public' },
    anonymous: { label: '익명 공개 (닉네임 숨김)', icon: '👤', value: 'anonymous' },
} as const;

// 피드백 상태
export const FEEDBACK_STATUS = {
    pending: { label: '💡 검토중', color: 'bg-yellow-100 text-yellow-700', value: 'pending' },
    in_progress: { label: '⚡ 진행중', color: 'bg-blue-100 text-blue-700', value: 'in_progress' },
    completed: { label: '✅ 채택됨', color: 'bg-green-100 text-green-700', value: 'completed' },
    replied: { label: '📝 답변완료', color: 'bg-purple-100 text-purple-700', value: 'replied' },
    rejected: { label: '❌ 반려', color: 'bg-red-100 text-red-700', value: 'rejected' },
} as const;

// ============================================================================
// 제한 및 설정 상수
// ============================================================================

// 피드백 작성 제한
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
export const CONTENT_LIMITS = {
    TITLE_MAX: 50,
    CONTENT_MAX: 1000,
    MAX_EXTERNAL_LINKS: 3,
    FILE_SIZE_MAX: 5 * 1024 * 1024, // 5MB
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
} as const;

// ============================================================================
// UI 관련 상수
// ============================================================================

// 색상 테마
export const COLORS = {
    primary: 'pink',
    secondary: 'blue',
    accent: 'rose',
    neutral: 'gray',
    success: 'green',
    warning: 'yellow',
    error: 'red',
} as const;

// 애니메이션 지속 시간
export const ANIMATION_DURATION = {
    fast: 150,
    normal: 300,
    slow: 500,
} as const;

// 반응형 브레이크포인트
export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;
