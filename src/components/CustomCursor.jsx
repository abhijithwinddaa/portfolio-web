import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const updateCursorType = () => {
            const hoveredElement = document.elementFromPoint(position.x, position.y);
            if (hoveredElement) {
                const computedStyle = window.getComputedStyle(hoveredElement);
                setIsPointer(
                    computedStyle.cursor === 'pointer' ||
                    hoveredElement.tagName === 'A' ||
                    hoveredElement.tagName === 'BUTTON' ||
                    hoveredElement.closest('a') ||
                    hoveredElement.closest('button')
                );
            }
        };

        const handleMouseEnter = () => setIsHidden(false);
        const handleMouseLeave = () => setIsHidden(true);

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mousemove', updateCursorType);
        document.body.addEventListener('mouseenter', handleMouseEnter);
        document.body.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mousemove', updateCursorType);
            document.body.removeEventListener('mouseenter', handleMouseEnter);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [position.x, position.y]);

    // Don't render on mobile
    if (typeof navigator !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
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
                className={`fixed pointer-events-none z-[9999] transition-opacity duration-300 ${isHidden ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transform: 'translate(-50%, -50%)'
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
