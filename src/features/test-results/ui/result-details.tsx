import { getCompatibility, getCareerSuggestions } from '../model/result-calculator';

interface ResultDetailsProps {
    totalScore: number;
    characteristics: string[];
}

export function ResultDetails({ totalScore, characteristics }: ResultDetailsProps) {
    const compatibility = getCompatibility(totalScore);
    const careerSuggestions = getCareerSuggestions(totalScore);

    return (
        <div className="space-y-6">
            {/* 특징 */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-base mb-4">✨ 주요 특징</h3>
                <ul className="text-gray-700 space-y-2 text-sm">
                    {characteristics.map((char, i) => (
                        <li
                            key={i}
                            className="relative pl-4 before:absolute before:left-0 before:top-2 before:w-1 before:h-1 before:rounded-full before:bg-gray-700"
                        >
                            {char}
                        </li>
                    ))}
                </ul>
            </div>

            {/* 잘 맞는 성향 */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-base mb-4">💛 잘 맞는 성향</h3>
                <div className="flex flex-wrap gap-2">
                    {compatibility.map((type, i) => (
                        <span
                            key={i}
                            className="bg-blue-50 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200"
                        >
                            {type}
                        </span>
                    ))}
                </div>
            </div>

            {/* 추천 직업 */}
            <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-900 text-base mb-4">💼 추천 직업</h3>
                <div className="flex flex-wrap gap-2">
                    {careerSuggestions.map((job, i) => (
                        <span
                            key={i}
                            className="bg-orange-50 text-orange-600 text-xs font-medium px-3 py-1.5 rounded-full border border-orange-200"
                        >
                            {job}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
