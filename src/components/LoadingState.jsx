// src/components/LoadingState.jsx

import React from 'react';
// lawkeyLogo를 "../components/icons"에서 가져오는 것으로 가정합니다.
import { lawkeyLogo } from '../components/icons'; 

/**
 * 로딩 상태를 표시하는 UI 컴포넌트
 * @param {boolean} loadingFade - 페이드 인/아웃 효과를 위한 opacity 제어
 * @param {string} containerHeightClass - 로딩 컴포넌트의 높이 (예: 'h-[70vh]' 또는 'h-screen')
 */
function LoadingState({ loadingFade, containerHeightClass = "h-[70vh]" }) {
  return (
    <div
      // Home.jsx의 원래 컨테이너 스타일(높이 및 페이드 효과)을 props로 적용
      className={`
        flex flex-col items-center justify-center w-full
        transition-opacity ease-in-out duration-500 
        ${containerHeightClass} 
        ${loadingFade ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* LoadingPage.jsx의 로고 및 텍스트 스타일 적용 */}
      <div className="flex flex-col items-center mb-8">
        <img src={lawkeyLogo} alt="lawkey Logo" className="w-20 h-20 mb-3 animate-pulse" />
        <span className="text-2xl font-bold text-green-700">lawkey</span>
      </div>
      
      <div className="mb-4 text-gray-500">
        새로운 대화 세션을 준비 중입니다...
      </div>
      
      {/* 로딩 스피너 (색상은 LoadingPage.jsx의 green-500 사용) */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      
    </div>
  );
}

export default LoadingState;