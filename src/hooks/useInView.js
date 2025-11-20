import { useEffect, useRef, useState } from 'react';

/**
 * Lightweight hook to detect when an element is in viewport
 * Replaces heavy AOS library for better performance
 */
export const useInView = (options = {}) => {
    const {
        threshold = 0.1,
        rootMargin = '0px',
        triggerOnce = true,
        delay = 0
    } = options;

    const ref = useRef(null);
    const [isInView, setIsInView] = useState(false);
    const [hasBeenInView, setHasBeenInView] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        // Don't setup observer if already been in view and triggerOnce is true
        if (triggerOnce && hasBeenInView) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                const inView = entry.isIntersecting;

                if (delay > 0 && inView) {
                    setTimeout(() => {
                        setIsInView(true);
                        setHasBeenInView(true);
                    }, delay);
                } else {
                    setIsInView(inView);
                    if (inView) setHasBeenInView(true);
                }
            },
            { threshold, rootMargin }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [threshold, rootMargin, triggerOnce, hasBeenInView, delay]);

    return [ref, isInView];
};

/**
 * Predefined animation variants
 */
export const fadeIn = {
    hidden: { opacity: 0, transform: 'translateY(20px)' },
    visible: { opacity: 1, transform: 'translateY(0)' }
};

export const fadeInLeft = {
    hidden: { opacity: 0, transform: 'translateX(-30px)' },
    visible: { opacity: 1, transform: 'translateX(0)' }
};

export const fadeInRight = {
    hidden: { opacity: 0, transform: 'translateX(30px)' },
    visible: { opacity: 1, transform: 'translateX(0)' }
};

export const zoomIn = {
    hidden: { opacity: 0, transform: 'scale(0.95)' },
    visible: { opacity: 1, transform: 'scale(1)' }
};
