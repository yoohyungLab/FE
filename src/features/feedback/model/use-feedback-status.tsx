import React from 'react';
import { Clock, CheckCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { FEEDBACK_STATUS } from '@/shared/constants';

export function useFeedbackStatus() {
    const getStatusText = (status: string): string => {
        return FEEDBACK_STATUS[status as keyof typeof FEEDBACK_STATUS]?.label || '검토중';
    };

    const getStatusBadgeColor = (status: string): string => {
        return FEEDBACK_STATUS[status as keyof typeof FEEDBACK_STATUS]?.color || 'bg-gray-100 text-gray-700';
    };

    const getStatusIcon = (status: string, size: 'sm' | 'md' = 'sm'): React.ReactNode => {
        const sizeClasses = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
        switch (status) {
            case 'pending':
                return <Clock className={`${sizeClasses} text-yellow-600`} />;
            case 'completed':
                return <CheckCircle className={`${sizeClasses} text-green-600`} />;
            case 'replied':
                return <MessageSquare className={`${sizeClasses} text-blue-600`} />;
            case 'in_progress':
                return <AlertCircle className={`${sizeClasses} text-blue-600`} />;
            case 'rejected':
                return <AlertCircle className={`${sizeClasses} text-red-600`} />;
            default:
                return <Clock className={`${sizeClasses} text-gray-600`} />;
        }
    };

    return { getStatusText, getStatusBadgeColor, getStatusIcon };
}
