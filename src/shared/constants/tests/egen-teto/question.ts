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
        text: '친구가 힘든 얘기를 꺼낼 때 나는?',
        options: [
            { text: '"그랬구나… 진짜 힘들었겠다" 공감 먼저!', score: 2, type: '에겐 강' },
            { text: '들어주고 나서 “근데 이렇게 해보는 건 어때?”', score: 1, type: '에겐 약' },
            { text: '“그래서 지금 문제는 뭐야?” 정리부터 시작', score: -1, type: '테토 약' },
            { text: '"그냥 넘겨. 다 그런 거야." 현실 조언 시전', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 2,
        text: '프로젝트 D-3, 나는 어떤 타입?',
        options: [
            { text: '팀원 페이스 보며 분위기 조절 담당', score: 2, type: '에겐 강' },
            { text: '“이건 네가, 이건 내가” 역할 분배 시도', score: 1, type: '에겐 약' },
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
            { text: '속상하지만 “고마워”라고 말함', score: 2, type: '에겐 강' },
            { text: '받아들이되 “아 그런가…” 눈치 봄', score: 1, type: '에겐 약' },
            { text: '오케이 피드백 완료 → 개선모드', score: -1, type: '테토 약' },
            { text: '“그건 이런 이유였어” 반박함', score: -2, type: '테토 강' },
        ],
    },
    {
        id: 6,
        text: '여행 계획 짤 때 나는?',
        options: [
            { text: '“어디 가고 싶어?” 다수 의견 먼저 수집', score: 2, type: '에겐 강' },
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
        text: '친구가 “요즘 힘들어”라고 말할 때?',
        options: [
            { text: '말없이 안아주거나 손 잡아줌', score: 2, type: '에겐 강' },
            { text: '“진짜 힘들었겠다…” 공감 멘트', score: 1, type: '에겐 약' },
            { text: '“이런 식으로 바꿔보면 어때?” 제안함', score: -1, type: '테토 약' },
            { text: '“근데 그거 심한 건 아니지 않아?” 현실 직진', score: -2, type: '테토 강' },
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
            { text: '“괜찮아~” 분위기 풀기 시전', score: 1, type: '에겐 약' },
            { text: '“다음엔 이렇게 해보자” 제안함', score: -1, type: '테토 약' },
            { text: '바로 지적 후 빠르게 정리함', score: -2, type: '테토 강' },
        ],
    },
];
