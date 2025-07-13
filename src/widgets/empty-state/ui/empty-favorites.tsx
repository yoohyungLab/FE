import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';

export function EmptyFavorites() {
    return (
        <div className="text-center py-12 space-y-6">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">찜한 테스트가 없어요</h3>
                <p className="text-gray-500">마음에 드는 테스트를 찜하고 여기서 빠르게 접근해보세요!</p>
            </div>
            <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
            >
                <Search size={16} /> 테스트 둘러보기
            </Link>
        </div>
    );
} 