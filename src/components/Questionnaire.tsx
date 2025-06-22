import React, { useState } from 'react';
import { questions } from '../constant/\bteto-egen.ts/question';
import { Gender } from '../pages/EgenTetoTestPage';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface QuestionnaireProps {
    gender: Gender;
    onComplete: (answers: number[]) => void;
}

const Questionnaire: React.FC<QuestionnaireProps> = ({ gender, onComplete }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);

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

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="relative w-full max-w-md bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/40 shadow-xl min-h-[520px] flex flex-col">
            {/* 상단: 이전 버튼 + 진행 바 */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-medium transition-all
                        ${
                            currentQuestion === 0
                                ? 'text-gray-300 bg-gray-100 cursor-not-allowed'
                                : 'text-sky-700 bg-white/80 hover:bg-white/90 border border-sky-200'
                        }
                    `}
                >
                    <ArrowLeft size={16} />
                    이전 질문
                </button>

                <div className="flex-1 ml-4 h-2 bg-white/30 rounded-full overflow-hidden relative">
                    <div
                        className="h-full bg-gradient-to-r from-sky-400 to-rose-300 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* 질문 텍스트 */}
            <h2 className="text-lg font-bold text-center text-gray-900 mb-3 leading-relaxed min-h-[60px] flex items-center justify-center">
                {question.text}
            </h2>

            {/* 옵션 카드들 */}
            {/* TODO: 텍스트 길 경우 2줄처리 */}
            <div className="flex flex-col gap-4 flex-grow">
                {question.options.map((option, index) => (
                    <Button
                        key={index}
                        variant="glass"
                        onClick={() => handleAnswer(option.score)}
                        className="w-full bg-white/90 border border-white/40 text-gray-800 rounded-xl shadow-sm p-4 min-h-[72px] text-left hover:bg-white transition-all duration-200 hover:-translate-y-0.5 flex items-center"
                    >
                        <div className="text-base font-medium break-words leading-snug w-full">{option.text}</div>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default Questionnaire;
