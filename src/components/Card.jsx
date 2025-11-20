import React, { memo } from 'react';

const Card = memo(({ children, className = '', onClick }) => {
    return (
        <div
            className={`relative overflow-hidden rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 ${className}`}
            onClick={onClick}
        >
            {/* Glassmorphism background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
});

Card.displayName = 'Card';

export default Card;
