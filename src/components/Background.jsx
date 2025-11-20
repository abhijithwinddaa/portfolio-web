import React from "react";

const AnimatedBackground = () => {
	return (
		<div className="fixed inset-0 -z-10 overflow-hidden">
			<div className="absolute inset-0 bg-[#030014]">
				{/* Blob 1 - Purple */}
				<div
					className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-20 animate-blob"
				/>

				{/* Blob 2 - Cyan */}
				<div
					className="absolute top-0 -right-4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-20 hidden sm:block animate-blob animation-delay-2000"
				/>

				{/* Blob 3 - Blue Left */}
				<div
					className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[64px] opacity-20 animate-blob animation-delay-4000"
				/>
			</div>

			{/* Grid Overlay */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]"></div>
		</div>
	);
};

export default AnimatedBackground;
