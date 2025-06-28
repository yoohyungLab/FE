import { Gender } from '@/types/result';
import { Button } from '@/components/ui/button';

interface GenderSelectionProps {
    onSelect: (gender: Gender) => void;
}

function GenderSelection({ onSelect }: GenderSelectionProps) {
    return (
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-8 text-center">성별을 선택해주세요</h2>
            <div className="flex gap-4 md:gap-8 justify-center flex-wrap">
                <Button
                    variant="glass"
                    size="lg"
                    className="flex flex-col items-center gap-4 p-6 md:p-8 min-w-[150px] md:min-w-[180px] hover:bg-white/25 hover:border-white/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                    onClick={() => onSelect('male')}
                >
                    <div className="text-4xl md:text-5xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">♂</div>
                    <span className="text-lg md:text-xl font-semibold">남성</span>
                </Button>
                <Button
                    variant="glass"
                    size="lg"
                    className="flex flex-col items-center gap-4 p-6 md:p-8 min-w-[150px] md:min-w-[180px] hover:bg-white/25 hover:border-white/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                    onClick={() => onSelect('female')}
                >
                    <div className="text-4xl md:text-5xl font-bold text-pink-400 group-hover:text-pink-300 transition-colors">♀</div>
                    <span className="text-lg md:text-xl font-semibold">여성</span>
                </Button>
            </div>
        </div>
    );
}

export default GenderSelection;
