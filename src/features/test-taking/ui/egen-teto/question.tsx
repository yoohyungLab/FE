import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Gender } from '@/shared/types/result';
import { questions } from '@/shared/constants/tests/egen-teto/question';
import { Button } from '@/shared/ui/button';

interface QuestionProps {
    gender: Gender;
    onComplete: (answers: number[]) => void;
}

function Question({ gender, onComplete }: QuestionProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    const handleAnswer = (score: number) => {
        const newAnswers = [...answers, score];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            onComplete(newAnswers);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setAnswers(answers.slice(0, -1));
        }
    };

    return (
        <div className="relative w-full bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-5 border border-white/40 min-h-[480px] flex flex-col">
            {/* 상단: 이전 버튼 + 진행 바 */}
            <div className="flex items-center justify-between mb-5">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
        ${
            currentQuestion === 0
                ? 'text-gray-300 bg-gray-100 border border-gray-200 cursor-not-allowed'
                : 'text-sky-700 bg-white/80 hover:bg-white/90 border border-sky-200 active:scale-95'
        }
    `}
                >
                    <ArrowLeft size={14} />
                    이전
                </button>

                <div className="flex-1 ml-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-sky-400 to-rose-300 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 질문 텍스트 */}
            <h2 className="text-base  font-bold text-center text-gray-900 mb-4 leading-relaxed min-h-[60px] flex items-center justify-center px-2">
                {question.text}
            </h2>

            {/* 옵션 카드들 */}
            <div className="flex flex-col gap-3 flex-grow">
                {question.options.map((option, index) => (
                    <Button
                        key={index}
                        variant="outline"
                        onClick={() => handleAnswer(option.score)}
                        className="w-full bg-white border border-gray-200 text-gray-800 rounded-lg shadow-sm p-4 min-h-[64px] text-left hover:bg-gray-50 transition-all duration-200 active:scale-95 flex items-center"
                    >
                        <div className="text-sm font-medium text-center break-words leading-snug w-full">{option.text}</div>
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default Question;
