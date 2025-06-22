import React, { useEffect, useState } from 'react';
import { TestResult } from '../types/result';
import { Button } from './ui/button';
import { saveTestResult } from '../lib/supabase';
import { resultData } from '../constant/teto-egen.ts/result';

interface ResultProps {
    result: TestResult;
    answers: number[];
    gender: 'male' | 'female';
    onRestart: () => void;
}

function ResultComponent({ result, answers, gender, onRestart }: ResultProps) {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const data = resultData[result];
    const totalScore = answers.reduce((sum, answer) => sum + answer, 0);

    useEffect(() => {
        // 컴포넌트가 마운트될 때 자동으로 결과 저장
        saveResult();
    }, []);

    const saveResult = async () => {
        try {
            setSaving(true);
            setSaveError(null);

            await saveTestResult({
                gender,
                result,
                score: totalScore,
                answers,
            });

            setSaved(true);
        } catch (error) {
            console.error('Failed to save result:', error);
            setSaveError('결과 저장에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setSaving(false);
        }
    };

    const getScoreDescription = () => {
        if (totalScore >= 10) return '에겐 성향이 매우 강합니다';
        if (totalScore >= 3) return '에겐 성향이 강합니다';
        if (totalScore >= -2) return '균형잡힌 성향입니다';
        if (totalScore >= -9) return '테토 성향이 강합니다';
        return '테토 성향이 매우 강합니다';
    };

    return (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
                <div className="text-5xl md:text-6xl mb-4 block">{data.emoji}</div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                    {data.title}
                </h1>
                <p className="text-lg md:text-xl leading-relaxed opacity-90 m-0">{data.description}</p>
            </div>

            {/* 결과 저장 상태 표시 */}
            <div className="mb-6 text-center">
                {saving && (
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm">결과 저장 중...</span>
                    </div>
                )}
                {saved && (
                    <div className="inline-flex items-center gap-2 bg-green-500/20 rounded-lg px-4 py-2 border border-green-500/30">
                        <span className="text-green-300">✓</span>
                        <span className="text-sm text-green-300">결과가 저장되었습니다!</span>
                    </div>
                )}
                {saveError && (
                    <div className="inline-flex items-center gap-2 bg-red-500/20 rounded-lg px-4 py-2 border border-red-500/30">
                        <span className="text-red-300">✗</span>
                        <span className="text-sm text-red-300">{saveError}</span>
                        <Button variant="glass" size="sm" onClick={saveResult} className="ml-2">
                            재시도
                        </Button>
                    </div>
                )}
            </div>

            <div className="text-left mb-8">
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">점수 분석</h3>
                    <div className="bg-white/10 rounded-xl p-6 text-center border border-white/20">
                        <span className="block text-4xl md:text-5xl font-bold text-pink-400 mb-2">{totalScore}</span>
                        <span className="text-lg opacity-90">{getScoreDescription()}</span>
                    </div>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">주요 특징</h3>
                    <ul className="space-y-3">
                        {data.characteristics.map((char, index) => (
                            <li key={index} className="bg-white/10 rounded-lg p-4 border-l-4 border-blue-400 text-base leading-relaxed">
                                {char}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">에겐·테토란?</h3>
                    <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                        <p className="mb-4 leading-relaxed text-base">
                            <span className="text-pink-400 font-semibold">에겐(Estrogen)</span>: 여성 호르몬의 영향을 받는 성향으로, 감정적
                            교감과 협력을 중시하며 부드럽고 따뜻한 소통을 선호합니다.
                        </p>
                        <p className="leading-relaxed text-base">
                            <span className="text-pink-400 font-semibold">테토(Testosterone)</span>: 남성 호르몬의 영향을 받는 성향으로,
                            직설적이고 결과 지향적이며 리더십과 추진력을 중시합니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-4 justify-center flex-wrap">
                <Button
                    variant="gradient"
                    size="lg"
                    className="min-w-[150px] md:min-w-[200px] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                    onClick={onRestart}
                >
                    다시 테스트하기
                </Button>
                <Button
                    variant="gradient"
                    size="lg"
                    className="min-w-[150px] md:min-w-[200px] hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                    onClick={() => {
                        navigator
                            .share?.({
                                title: '에겐·테토 테스트 결과',
                                text: `나의 성향은 ${data.title}입니다! ${data.description}`,
                                url: window.location.href,
                            })
                            .catch(() => {
                                // 공유 API가 지원되지 않는 경우 클립보드에 복사
                                navigator.clipboard.writeText(`나의 성향은 ${data.title}입니다! ${data.description}`);
                                alert('결과가 클립보드에 복사되었습니다!');
                            });
                    }}
                >
                    결과 공유하기
                </Button>
            </div>
        </div>
    );
}

export default ResultComponent;
