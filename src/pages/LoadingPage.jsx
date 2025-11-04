import React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { lawkeyLogo } from '../components/icons';

function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  // hash값을 location.state로 전달받음
  const hash = location.state?.hash;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hash) {
        navigate(`/c/${hash}`);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [hash, navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-white">
      <div className="text-2xl font-bold mb-8">LOGO</div>
      <div className="mb-4 text-gray-500">
        새로운 대화 세션을 준비 중입니다...
      </div>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

// function LoadingState({ loadingFade, containerHeightClass = "h-[70vh]" }) {
//   return (
//     <div
//       className={`
//         flex flex-col items-center justify-center w-full
//         transition-opacity ease-in-out duration-500
//         ${containerHeightClass}
//         ${loadingFade ? "opacity-100" : "opacity-0"}
//       `}
//     >
//       {/* 로고 및 텍스트 */}
//       <div className="flex flex-col items-center mb-8">
//         <img src={lawkeyLogo} alt="lawkey Logo" className="w-20 h-20 mb-3 animate-pulse" />
//         <span className="text-2xl font-bold text-green-700">lawkey</span>
//       </div>

//       <div className="mb-4 text-gray-500">
//         새로운 대화 세션을 준비 중입니다...
//       </div>

//       {/* 로딩 스피너 */}
//       <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>

//     </div>
//   );
// }

export default LoadingPage;
