
import React, { useState } from 'react';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import ImageGrid from './components/ImageGrid';
import { generatePromptsFromSrt, generateImage } from './services/geminiService';
import type { GeneratedImage } from './types';

type LoadingState = 'idle' | 'generating_prompts' | 'generating_images' | 'done' | 'error';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (content: string) => {
    setLoadingState('generating_prompts');
    setError(null);
    setGeneratedImages([]);

    try {
      const prompts = await generatePromptsFromSrt(content);
      if (prompts.length === 0) {
        throw new Error("No prompts were generated from the SRT file.");
      }
      
      setLoadingState('generating_images');

      const imagePromises = prompts.map(prompt => 
        generateImage(prompt).then(imageUrl => ({ prompt, imageUrl }))
      );
      
      const images = await Promise.all(imagePromises);
      setGeneratedImages(images);
      setLoadingState('done');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(err);
      setError(errorMessage);
      setLoadingState('error');
    }
  };

  const handleReset = () => {
    setLoadingState('idle');
    setError(null);
    setGeneratedImages([]);
  };

  const renderContent = () => {
    switch (loadingState) {
      case 'idle':
        return <FileUpload onFileSelect={handleFileSelect} disabled={false} />;
      case 'generating_prompts':
        return <Loader message="Analyzing subtitles and generating creative prompts..." />;
      case 'generating_images':
        return <Loader message="Crafting historical images from prompts..." />;
      case 'done':
        return (
          <>
            <ImageGrid images={generatedImages} />
            <div className="text-center my-8">
              <button
                onClick={handleReset}
                className="bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Start Over
              </button>
            </div>
          </>
        );
      case 'error':
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl text-red-400 mb-4">An Error Occurred</h2>
            <p className="text-gray-400 bg-gray-800 p-4 rounded-md">{error}</p>
            <button
                onClick={handleReset}
                className="mt-6 bg-gray-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                Try Again
              </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8">
        <Header />
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
