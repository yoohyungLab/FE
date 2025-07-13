export const CATEGORIES = {
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

export type CategoryId = keyof typeof CATEGORIES;
