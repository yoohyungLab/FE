interface Question {
    id: number;
    text: string;
    options: {
        text: string;
        score: number;
        type: string;
    }[];
}

export const questions: Question[] = [
    {
        id: 1,
        text: '친구가 고민 상담을 해올 때, 나는 주로?',
        options: [
            { text: '먼저 감정을 충분히 들어주고 공감해준다.', score: 2, type: '에겐 강' },
            { text: '감정을 들어준 후, 해결 방안을 제시해본다.', score: 1, type: '에겐 약' },
            { text: '문제 중심으로 정리해서 방향을 제시한다.', score: -1, type: '테토 약' },
            { text: '"그런 건 그냥 잊어" 식으로 정리하고 넘긴다.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 2,
        text: '프로젝트 마감 3일 전, 나는 어떤 모습일까?',
        options: [
            { text: '다른 사람의 페이스에 맞춰 속도를 조절한다.', score: 2, type: '에겐 강' },
            { text: '협업을 조율하며 마무리를 시도한다.', score: 1, type: '에겐 약' },
            { text: '시간 분배표를 짜고 스스로 리딩한다.', score: -1, type: '테토 약' },
            { text: '내 기준대로 모든 걸 추진해버린다.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 3,
        text: '갈등 상황에서 나는?',
        options: [
            { text: '감정 상할까봐 말을 아낀다.', score: 2, type: '에겐 강' },
            { text: '적당히 표현하고 분위기를 살핀다.', score: 1, type: '에겐 약' },
            { text: '말할 건 말하되 수위는 조절한다.', score: -1, type: '테토 약' },
            { text: '솔직하게 전부 말하고 빠르게 정리한다.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 4,
        text: '단체 채팅방에서 내가 자주 쓰는 말투는?',
        options: [
            { text: '이모지+감정표현이 많고 부드럽다.', score: 2, type: '에겐 강' },
            { text: '말끝을 흐리며 배려가 느껴진다.', score: 1, type: '에겐 약' },
            { text: '명확하고 논리적인 말투가 많다.', score: -1, type: '테토 약' },
            { text: '단답형에 직설적인 어투다.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 5,
        text: '누군가 내 실수에 대해 말해줄 때, 나는?',
        options: [
            { text: '속상하지만 감사를 표현한다.', score: 2, type: '에겐 강' },
            { text: '받아들이되 분위기를 신경쓴다.', score: 1, type: '에겐 약' },
            { text: '피드백 자체에 집중해 반영한다.', score: -1, type: '테토 약' },
            { text: '변명하거나 논리적으로 반박할 때도 있다.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 6,
        text: '여행을 계획할 때 나는?',
        options: [
            { text: '모두의 의견을 먼저 듣고 조율한다.', score: 2, type: '에겐 강' },
            { text: '일정표를 나누어 책임지자고 제안한다.', score: 1, type: '에겐 약' },
            { text: '직접 계획을 짜서 공유하고 리드한다.', score: -1, type: '테토 약' },
            { text: '그냥 내가 정하고 이끌고 간다.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 7,
        text: '연애에서 중요한 건?',
        options: [
            { text: '감정적 교감과 따뜻한 대화', score: 2, type: '에겐 강' },
            { text: '적절한 표현과 이해', score: 1, type: '에겐 약' },
            { text: '역할 분담과 상호 효율', score: -1, type: '테토 약' },
            { text: '내가 주도하고 리드하는 구조', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 8,
        text: '주변 사람이 힘들다고 말할 때 나는?',
        options: [
            { text: '말 없이 안아주거나 위로한다.', score: 2, type: '에겐 강' },
            { text: '"많이 힘들었겠다" 공감 표현.', score: 1, type: '에겐 약' },
            { text: '"그럼 이렇게 해보는 건 어때?" 제안.', score: -1, type: '테토 약' },
            { text: '"그 정도면 괜찮은 거 아냐?" 현실 반응.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 9,
        text: '새로운 도전을 앞뒀을 때 나는?',
        options: [
            { text: '함께할 사람이 있는지, 감정적으로 안정되는지를 본다.', score: 2, type: '에겐 강' },
            { text: '주변 피드백과 감정을 고려한다.', score: 1, type: '에겐 약' },
            { text: '목표와 계획이 있으면 바로 실행한다.', score: -1, type: '테토 약' },
            { text: '판단 끝났으면 그냥 바로 뛰어든다.', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 10,
        text: '누군가 실수했을 때 나는?',
        options: [
            { text: '감정 상할까봐 먼저 공감한다.', score: 2, type: '에겐 강' },
            { text: '"괜찮아"로 안정시키며 마무리.', score: 1, type: '에겐 약' },
            { text: '다음엔 이렇게 하자고 제안.', score: -1, type: '테토 약' },
            { text: '그 자리에서 명확히 지적.', score: -2, type: '테토 강' },
        ],
    },
];
