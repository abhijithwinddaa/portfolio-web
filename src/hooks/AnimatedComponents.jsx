import React, { memo } from 'react';
import { useInView } from './useInView';

/**
 * Animated wrapper components for common animations
 * Lightweight replacement for AOS
 */

export const FadeIn = memo(({ children, delay = 0, className = '', direction = 'up' }) => {
    const [ref, isInView] = useInView({ delay, triggerOnce: true });

    const getTransform = () => {
        switch (direction) {
            case 'up': return isInView ? 'translateY(0)' : 'translateY(20px)';
            case 'down': return isInView ? 'translateY(0)' : 'translateY(-20px)';
            case 'left': return isInView ? 'translateX(0)' : 'translateX(-30px)';
            case 'right': return isInView ? 'translateX(0)' : 'translateX(30px)';
            default: return 'none';
        }
    };

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: isInView ? 1 : 0,
                transform: getTransform(),
                transition: 'opacity 0.6s ease-out, transform 0.6s ease-out'
            }}
        >
            {children}
        </div>
    );
});

FadeIn.displayName = 'FadeIn';
