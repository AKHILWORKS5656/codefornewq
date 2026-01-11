import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black transition-opacity duration-500 animate-fade-in">
      
      {/* Circular Dot Spinner */}
      <div className="relative w-20 h-20 mb-8">
        {[...Array(10)].map((_, i) => {
          const angle = (i * 36); // 360 / 10 dots
          return (
            <div 
              key={i}
              className="absolute w-2.5 h-2.5 bg-white rounded-full animate-dot-fade"
              style={{
                top: `${50 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
                left: `${50 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.1}s`,
                opacity: 0.2
              }}
            ></div>
          );
        })}
      </div>

      {/* Loading Text */}
      <div className="text-white text-lg font-light tracking-[0.4em] mb-4">
        LOADING...
      </div>

      {/* Horizontal Progress Bar */}
      <div className="w-32 h-[3px] bg-white/20 rounded-full overflow-hidden">
        <div className="h-full bg-white w-2/3 animate-slide-progress"></div>
      </div>

      <style>{`
        @keyframes dot-fade {
          0%, 20%, 80%, 100% { opacity: 0.2; }
          40% { opacity: 1; }
        }
        .animate-dot-fade {
          animation: dot-fade 1s linear infinite;
        }
        @keyframes slide-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide-progress {
          animation: slide-progress 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;