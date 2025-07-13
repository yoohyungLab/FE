import { getPersonalityKeyword, getTitleColor } from '../model/result-calculator';

interface ResultHeaderProps {
    totalScore: number;
    gender: 'male' | 'female';
    description: string;
    bgImage: string;
}

export function ResultHeader({ totalScore, gender, description, bgImage }: ResultHeaderProps) {
    const personalityKeyword = getPersonalityKeyword(totalScore, gender);
    const titleColor = getTitleColor(totalScore, gender);

    return (
        <>
            <div className="relative w-full">
                <div className="w-full bg-top bg-no-repeat bg-cover aspect-[3/4]" style={{ backgroundImage: `url('${bgImage}')` }}></div>
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-b from-transparent to-white"></div>
            </div>
            <div className="max-w-md mx-auto px-5 -mt-20 pb-16 relative z-10">
                <div className="text-center mb-6">
                    <h1 className={`text-4xl font-bold mb-2 ${titleColor}`}>{personalityKeyword}</h1>
                    <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">{description}</p>
                </div>
            </div>
        </>
    );
}
