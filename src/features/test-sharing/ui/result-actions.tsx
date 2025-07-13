import { Button } from '@/shared/ui/button';
import { Share2 } from 'lucide-react';
import { getPersonalityKeyword } from '@/features/test-results/model/result-calculator';

interface ResultActionsProps {
    totalScore: number;
    gender: 'male' | 'female';
    isShared: boolean;
    onRestart: () => void;
}

export function ResultActions({ totalScore, gender, isShared, onRestart }: ResultActionsProps) {
    const handleShare = async () => {
        const personalityKeyword = getPersonalityKeyword(totalScore, gender);
        const shareText = `나의 성향은 "${personalityKeyword}"이에요! 당신도 테스트해보세요 💫\n\n${window.location.origin}/tests/egen-teto`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: '테토-에겐 성향 테스트',
                    text: shareText,
                    url: window.location.origin + '/tests/egen-teto',
                });
            } catch (error) {
                console.log('공유가 취소되었습니다.');
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareText);
                alert('링크가 클립보드에 복사되었습니다!');
            } catch (error) {
                alert('공유 링크를 복사할 수 없습니다.');
            }
        }
    };

    return (
        <div className="pt-8 flex gap-3">
            <Button variant="outline" className="flex-1 text-sm py-3 rounded-lg font-medium bg-white" onClick={onRestart}>
                {isShared ? '나도 테스트해보기' : '다시 테스트하기'}
            </Button>
            <Button
                onClick={handleShare}
                className="flex-1 text-sm py-3 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium"
            >
                <Share2 className="w-4 h-4 mr-2" /> 공유하기
            </Button>
        </div>
    );
}
