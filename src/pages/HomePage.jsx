// src/pages/HomePage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "../components/ChatInput"; // 공통 입력 컴포넌트 사용
import LoadingState from "../components/LoadingState"; // 로딩 컴포넌트 사용
import { lawkeyLogo } from "../components/icons";
import { useChatApi } from "../hooks/useChatApi"; // API 훅 사용

function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFade, setLoadingFade] = useState(false);
  
  const navigate = useNavigate();
  const { sendStep1 } = useChatApi(); // Step 1 API만 사용

  // ====== 핵심 로직: 첫 메시지로 세션 생성 및 라우팅 ======
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    try {
      setIsLoading(true);
      setLoadingFade(true);

      // Step 1: 세션 생성 API 호출
      const data = await sendStep1(text);

      if (data && data.sessionId) {
        const newSessionId = data.sessionId;
        
        // 성공 시 ChatPage로 이동 (라우팅)
        navigate(`/c/${newSessionId}`, { replace: true });
        
        // NOTE: HomePage는 여기서 종료되고 ChatPage가 시작됨.
        // 첫 메시지와 응답은 ChatPage에서 로딩 및 상태 관리 시작.
      } else {
        throw new Error("세션 정보 또는 메시지를 받지 못했습니다. 서버 응답을 확인하세요.");
      }
    } catch (error) {
      console.error("API 호출 중 에러 발생:", error);
      alert(`메시지 전송 실패: ${error.message}`);
    } finally {
      // 로딩 상태를 해제하지만, 실제로 페이지가 전환되므로 짧게 유지
      setIsLoading(false);
      setLoadingFade(false);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-6 md:px-10">
      
      {/* 로딩 화면 */}
      {isLoading && (
        <LoadingState loadingFade={loadingFade} containerHeightClass="h-screen" />
      )}
      
      {/* 히어로 섹션 (로딩 중이 아닐 때만) */}
      {!isLoading && (
        <div className="flex flex-col items-center w-full max-w-4xl pt-16 pb-24">
          <img src={lawkeyLogo} alt="lawkey" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
            나만의 AI 법률 파트너
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed text-center">
            혼자 고민하지 마세요.
            <br />
            당신의 이야기를 듣고 가장 든든한 편이 되어 드릴게요.
          </p>

          <div className="relative w-full max-w-2xl">
            {/* ChatInput 컴포넌트를 사용하여 입력창 렌더링 */}
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleMessageSubmit}
              // ChatInput 내부에서 handleKeyDown을 처리하므로 별도 props 불필요
            />
          </div>

          <footer className="text-center text-xs text-gray-500 mt-4">
            * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
          </footer>
        </div>
      )}
    </div>
  );
}

export default HomePage;