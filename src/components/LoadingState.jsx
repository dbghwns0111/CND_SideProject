import React from "react";

function LoadingState({ loadingFade, containerHeightClass = "h-[70vh]" }) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center w-full
        transition-opacity ease-in-out duration-500 
        ${containerHeightClass} 
        ${loadingFade ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="flex flex-col items-center mb-8">
        <img
          src="/logo_icon.svg"
          alt="lawkey Logo"
          className="w-20 h-20 mb-3 animate-pulse"
        />
        <span className="text-2xl font-bold text-green-700">lawkey</span>
      </div>

      <div className="mb-4 text-gray-500">
        새로운 대화 세션을 준비 중입니다...
      </div>

      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
    </div>
  );
}

export default LoadingState;
