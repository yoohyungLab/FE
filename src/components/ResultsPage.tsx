import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { getTestResults, TestResultData } from '../lib/supabase';

interface ResultsPageProps {
    onBack: () => void;
}

// TODO: 결과 페이지 디자인 수정
const ResultsPage: React.FC<ResultsPageProps> = ({ onBack }) => {
    const [results, setResults] = useState<TestResultData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            setLoading(true);
            const data = await getTestResults();
            setResults(data || []);
        } catch (err) {
            setError('결과를 불러오는데 실패했습니다.');
            console.error('Failed to fetch results:', err);
        } finally {
            setLoading(false);
        }
    };

    const getResultEmoji = (result: string) => {
        const emojiMap: Record<string, string> = {
            'egen-male': '🤝',
            'egen-female': '💕',
            'teto-male': '💪',
            'teto-female': '🔥',
            mixed: '⚖️',
        };
        return emojiMap[result] || '❓';
    };

    const getResultTitle = (result: string) => {
        const titleMap: Record<string, string> = {
            'egen-male': '에겐남',
            'egen-female': '에겐녀',
            'teto-male': '테토남',
            'teto-female': '테토녀',
            mixed: '혼합형',
        };
        return titleMap[result] || '알 수 없음';
    };

    const getGenderText = (gender: string) => {
        return gender === 'male' ? '남성' : '여성';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-lg">결과를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="text-center">
                    <p className="text-red-300 mb-4">{error}</p>
                    <Button variant="glass" onClick={fetchResults}>
                        다시 시도
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                    전체 테스트 결과
                </h1>
                <Button variant="glass" onClick={onBack}>
                    뒤로 가기
                </Button>
            </div>

            {results.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg opacity-80 mb-4">아직 저장된 결과가 없습니다.</p>
                    <p className="opacity-60">테스트를 완료하면 결과가 여기에 표시됩니다.</p>
                </div>
            ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {results.map((result) => (
                        <div
                            key={result.id}
                            className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl">{getResultEmoji(result.result)}</div>
                                    <div>
                                        <h3 className="font-semibold text-lg">{getResultTitle(result.result)}</h3>
                                        <p className="text-sm opacity-80">
                                            {getGenderText(result.gender)} • 점수: {result.score}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm opacity-60">{result.created_at && formatDate(result.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">🤝</div>
                        <p className="font-semibold">에겐남</p>
                        <p className="text-sm opacity-80">{results.filter((r) => r.result === 'egen-male').length}명</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">💕</div>
                        <p className="font-semibold">에겐녀</p>
                        <p className="text-sm opacity-80">{results.filter((r) => r.result === 'egen-female').length}명</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">💪</div>
                        <p className="font-semibold">테토남</p>
                        <p className="text-sm opacity-80">{results.filter((r) => r.result === 'teto-male').length}명</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                        <div className="text-2xl mb-2">🔥</div>
                        <p className="font-semibold">테토녀</p>
                        <p className="text-sm opacity-80">{results.filter((r) => r.result === 'teto-female').length}명</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
