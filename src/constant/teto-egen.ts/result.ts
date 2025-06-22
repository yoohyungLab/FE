import { TestResult } from '../../types/result';

interface ResultData {
    title: string;
    description: string;
    characteristics: string[];
    emoji: string;
}

export const resultData: Record<TestResult, ResultData> = {
    'egen-male': {
        title: '에겐남',
        description: '감성적이고 공감 능력을 중시하는 당신. 은근히 부드러운 리더십을 가지고 있어요.',
        characteristics: [
            '감정적 교감을 중요시함',
            '타인의 감정에 민감하고 공감 능력이 뛰어남',
            '협력적이고 조화로운 관계를 추구',
            '부드럽고 따뜻한 소통 스타일',
            '갈등 상황에서 중재자 역할을 잘함',
        ],
        emoji: '🤝',
    },
    'egen-female': {
        title: '에겐녀',
        description: '섬세하고 따뜻한 성향의 당신. 부드러운 분위기 메이커 역할을 해요.',
        characteristics: [
            '감정적 교감과 따뜻한 대화를 중시',
            '타인의 감정을 잘 이해하고 위로해줌',
            '조화로운 분위기를 만드는 능력이 뛰어남',
            '배려심이 많고 타인을 먼저 생각함',
            '감정적 안정감을 제공하는 존재',
        ],
        emoji: '💕',
    },
    'teto-male': {
        title: '테토남',
        description: '직설적이고 터프하지만 의리 있는 당신. 테토남 기질이 뿜뿜해요.',
        characteristics: [
            '직설적이고 솔직한 소통 스타일',
            '결과와 효율성을 중시',
            '리더십과 추진력이 뛰어남',
            '논리적이고 객관적인 판단',
            '의리 있고 책임감이 강함',
        ],
        emoji: '💪',
    },
    'teto-female': {
        title: '테토녀',
        description: '활발하고 추진력 있는 성향의 당신. 걸크러쉬 스타일이에요.',
        characteristics: [
            '활발하고 적극적인 성격',
            '목표 지향적이고 추진력이 뛰어남',
            '직설적이고 솔직한 소통',
            '독립적이고 자립적인 성향',
            '도전적이고 새로운 것을 추구함',
        ],
        emoji: '🔥',
    },
    mixed: {
        title: '혼합형',
        description: '에겐과 테토의 균형잡힌 성향을 가진 당신. 상황에 따라 유연하게 대응하는 스타일이에요.',
        characteristics: [
            '상황에 따라 에겐/테토 성향을 조절',
            '균형잡힌 사고와 판단',
            '적응력이 뛰어남',
            '다양한 관점에서 상황을 바라봄',
            '유연한 소통 스타일',
        ],
        emoji: '⚖️',
    },
};
