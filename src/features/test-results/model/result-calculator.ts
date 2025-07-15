// 점수와 성별에 따른 성격 키워드 반환
export function getPersonalityKeyword(score: number, gender: 'male' | 'female'): string {
    if (score >= 80) return gender === 'male' ? '도전적인 남성' : '도전적인 여성';
    if (score >= 60) return gender === 'male' ? '활발한 남성' : '활발한 여성';
    if (score >= 40) return gender === 'male' ? '균형잡힌 남성' : '균형잡힌 여성';
    if (score >= 20) return gender === 'male' ? '신중한 남성' : '신중한 여성';
    return gender === 'male' ? '차분한 남성' : '차분한 여성';
}

// 점수와 성별에 따른 제목 색상 반환
export function getTitleColor(score: number, gender: 'male' | 'female'): string {
    if (score >= 80) return gender === 'male' ? 'text-blue-600' : 'text-pink-600';
    if (score >= 60) return gender === 'male' ? 'text-green-600' : 'text-purple-600';
    if (score >= 40) return gender === 'male' ? 'text-yellow-600' : 'text-rose-600';
    if (score >= 20) return gender === 'male' ? 'text-gray-600' : 'text-indigo-600';
    return gender === 'male' ? 'text-slate-600' : 'text-teal-600';
}

// 점수에 따른 호환성 있는 성향들 반환
export function getCompatibility(score: number): string[] {
    if (score >= 80) {
        return ['리더십형', '모험가형', '혁신가형', '도전자형'];
    }
    if (score >= 60) {
        return ['사교형', '활동가형', '열정가형', '추진력형'];
    }
    if (score >= 40) {
        return ['조화형', '중재자형', '안정형', '협력자형'];
    }
    if (score >= 20) {
        return ['분석가형', '계획자형', '신중형', '사색가형'];
    }
    return ['내향형', '관찰자형', '완벽주의형', '평화주의형'];
}

// 점수에 따른 추천 직업들 반환
export function getCareerSuggestions(score: number): string[] {
    if (score >= 80) {
        return ['CEO', '창업가', '영업관리자', '마케팅 디렉터', '프로젝트 매니저', '컨설턴트'];
    }
    if (score >= 60) {
        return ['영업사원', '이벤트 플래너', '방송인', '교사', 'PR 전문가', '여행가이드'];
    }
    if (score >= 40) {
        return ['인사담당자', '상담사', '간호사', '사회복지사', '코디네이터', '중재전문가'];
    }
    if (score >= 20) {
        return ['연구원', '데이터분석가', '회계사', '변호사', '도서관사서', '편집자'];
    }
    return ['작가', '예술가', '프로그래머', '번역가', '아키텍트', '디자이너'];
}

// 점수 범위별 결과 타입 반환
export function getResultType(score: number): 'egen-male' | 'egen-female' | 'teto-male' | 'teto-female' | 'mixed' {
    // 이 함수는 실제 테스트 로직에 따라 수정해야 합니다
    if (score >= 70) return 'egen-male';
    if (score >= 50) return 'egen-female';
    if (score >= 30) return 'teto-male';
    if (score >= 10) return 'teto-female';
    return 'mixed';
}

// 점수에 따른 상세 설명 반환
export function getDetailedDescription(score: number): string {
    if (score >= 80) {
        return '당신은 타고난 리더십을 가지고 있으며, 새로운 도전을 두려워하지 않는 진취적인 성격입니다. 목표 달성을 위해 적극적으로 행동하며, 변화를 주도하는 것을 좋아합니다.';
    }
    if (score >= 60) {
        return '활발하고 사교적인 성격으로 다른 사람들과 잘 어울리며, 에너지가 넘치는 활동을 선호합니다. 긍정적인 마인드로 주변에 좋은 영향을 미칩니다.';
    }
    if (score >= 40) {
        return '균형감각이 뛰어나며 상황에 따라 유연하게 대처할 수 있는 능력을 가지고 있습니다. 조화를 중시하며 안정적인 관계를 선호합니다.';
    }
    if (score >= 20) {
        return '신중하고 분석적인 성격으로 결정을 내리기 전에 충분히 생각하는 편입니다. 계획성이 있고 체계적으로 일을 처리하는 것을 좋아합니다.';
    }
    return '조용하고 사려깊은 성격으로 깊이 있는 사고를 하며, 혼자만의 시간을 소중히 여깁니다. 완벽함을 추구하고 세심한 관찰력을 가지고 있습니다.';
}
