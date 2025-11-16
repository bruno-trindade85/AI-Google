
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-6 border-b border-gray-700">
      <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-200">
        Gerador de Imagens da Era das Guerras
      </h1>
      <p className="mt-2 text-gray-400">
        Transforme legendas SRT em imagens históricas em preto e branco das Guerras Mundiais.
      </p>
    </header>
  );
};

export default Header;
