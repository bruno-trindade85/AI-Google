
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-gray-700">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-200">
        WW-Era Image Generator
      </h1>
      <p className="mt-2 text-gray-400">
        Transform SRT subtitles into historical black & white images from the World Wars.
      </p>
    </header>
  );
};

export default Header;
