import React, { useEffect, useState, useRef, useCallback } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const rafRef = useRef(null);
    const lastCheckTime = useRef(0);
    const cachedPointerState = useRef(false);

    useEffect(() => {
        const updatePosition = (e) => {
            // Cancel pending RAF to avoid stacking
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                setPosition({ x: e.clientX, y: e.clientY });

                // Throttle pointer state check to every 100ms for performance
                const now = Date.now();
                if (now - lastCheckTime.current > 100) {
                    lastCheckTime.current = now;
                    const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
                    if (hoveredElement) {
                        const isPointerElement =
                            hoveredElement.tagName === 'A' ||
                            hoveredElement.tagName === 'BUTTON' ||
                            hoveredElement.closest('a') ||
                            hoveredElement.closest('button') ||
                            hoveredElement.closest('[role="button"]');

                        if (isPointerElement !== cachedPointerState.current) {
                            cachedPointerState.current = isPointerElement;
                            setIsPointer(isPointerElement);
                        }
                    }
                }
            });
        };

        const handleMouseEnter = () => setIsHidden(false);
        const handleMouseLeave = () => setIsHidden(true);

        // Use passive listener for better scroll performance
        window.addEventListener('mousemove', updatePosition, { passive: true });
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // Don't render on mobile or touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
        return null;
    }

    return (
        <>
            <style jsx global>{`
        body {
          cursor: none;
        }
        a, button, [role="button"] {
          cursor: none;
        }
      `}</style>
            <div
                className={`fixed pointer-events-none z-[9999] will-change-transform transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    transform: `translate3d(${position.x - 6}px, ${position.y - 6}px, 0)`
                }}
            >
                {/* Main dot */}
                <div
                    className={`w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] transition-transform duration-200 ease-out ${isPointer ? 'scale-0' : 'scale-100'}`}
                />

                {/* Outer ring */}
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/50 rounded-full transition-all duration-300 ease-out
            ${isPointer ? 'w-12 h-12 bg-white/10 border-white/80 backdrop-blur-[1px]' : 'w-8 h-8 border-white/30'}
          `}
                />
            </div>
        </>
    );
};

export default CustomCursor;
