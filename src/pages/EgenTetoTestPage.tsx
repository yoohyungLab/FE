import React, { useState } from 'react';
import GenderSelection from '../components/GenderSelection';
import Questionnaire from '../components/Questionnaire';
import Result from '../components/Result';
import { TestResult } from '../types/result';

export type Gender = 'male' | 'female';

const EgenTetoTestPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<'gender' | 'questionnaire' | 'result'>('gender');
    const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
    const [answers, setAnswers] = useState<number[]>([]);
    const [result, setResult] = useState<TestResult | null>(null);

    const handleGenderSelect = (gender: Gender) => {
        setSelectedGender(gender);
        setCurrentStep('questionnaire');
    };

    const handleQuestionnaireComplete = (finalAnswers: number[]) => {
        setAnswers(finalAnswers);
        const score = finalAnswers.reduce((sum, answer) => sum + answer, 0);

        let testResult: TestResult;
        if (score >= 3) {
            testResult = selectedGender === 'male' ? 'egen-male' : 'egen-female';
        } else if (score <= -3) {
            testResult = selectedGender === 'male' ? 'teto-male' : 'teto-female';
        } else {
            testResult = 'mixed';
        }

        setResult(testResult);
        setCurrentStep('result');
    };

    const handleRestart = () => {
        setCurrentStep('gender');
        setSelectedGender(null);
        setAnswers([]);
        setResult(null);
    };

    return (
        <div
            className="min-h-screen bg-center bg-cover flex items-center justify-center px-4"
            style={{ backgroundImage: "url('/images/background.png')" }}
        >
            <div className="w-full max-w-[360px] flex flex-col items-center justify-start pt-[40%] relative z-10">
                {currentStep === 'gender' && (
                    <div className="w-full bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-4 -mt-40">
                        <header className="text-center mb-4">
                            <h1 className="text-xl font-bold text-blue-500 tracking-tight ">에겐·테토 테스트</h1>
                            <p className="text-sm text-gray-600 mt-1">나의 호르몬 성향을 알아보는 심리테스트</p>
                        </header>

                        <div className="grid grid-cols-2 gap-3 mt-2">
                            <button
                                onClick={() => handleGenderSelect('male')}
                                className="flex gap-1 items-center justify-center bg-white border border-blue-200 rounded-lg shadow-sm hover:bg-blue-50 text-blue-700 py-3 font-medium text-sm transition"
                            >
                                <img src="/icons/men.svg" alt="남자" className="w-6 h-6 mb-1" />
                                남자
                            </button>
                            <button
                                onClick={() => handleGenderSelect('female')}
                                className="flex gap-1 items-center justify-center bg-white border border-rose-200 rounded-lg shadow-sm hover:bg-rose-50 text-rose-600 py-3 font-medium text-sm transition"
                            >
                                <img src="/icons/women.svg" alt="여자" className="w-6 h-6 mb-1" />
                                여자
                            </button>
                        </div>
                    </div>
                )}
                {currentStep === 'questionnaire' && selectedGender && (
                    <Questionnaire gender={selectedGender} onComplete={handleQuestionnaireComplete} />
                )}

                {currentStep === 'result' && result && selectedGender && (
                    <Result result={result} answers={answers} gender={selectedGender} onRestart={handleRestart} />
                )}
            </div>
        </div>
    );
};

export default EgenTetoTestPage;
