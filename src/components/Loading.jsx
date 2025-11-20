import React from 'react';

const Loading = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#030014] z-50">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-t-4 border-purple-500 border-solid rounded-full animate-spin-slow"></div>
                <div className="absolute inset-4 border-t-4 border-indigo-500 border-solid rounded-full animate-spin-reverse"></div>
            </div>
        </div>
    );
};

export default Loading;
