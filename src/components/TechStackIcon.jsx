import React, { memo } from 'react';
import Card from './Card';

const TechStackIcon = memo(({ TechStackIcon, Language }) => {
  return (
    <Card className="group p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 cursor-pointer shadow-lg hover:shadow-xl bg-slate-800/50 hover:bg-slate-700/50">
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-50 blur transition duration-300"></div>
        <img
          src={TechStackIcon}
          alt={`${Language} icon`}
          className="relative h-16 w-16 md:h-20 md:w-20 transform transition-transform duration-300"
        />
      </div>
      <span className="text-slate-300 font-semibold text-sm md:text-base tracking-wide group-hover:text-white transition-colors duration-300">
        {Language}
      </span>
    </Card>
  );
});

export default TechStackIcon;
