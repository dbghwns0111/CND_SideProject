import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "../components/ChatInput";
import LoadingState from "../components/LoadingState";
import { useChatRooms } from "../store/ChatRoomsContext";

function TestHomePage() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFade, setLoadingFade] = useState(false);

  const navigate = useNavigate();
  const { chatRooms, addChatRoom } = useChatRooms();

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // Simulate network delay for UX parity with real HomePage
    try {
      if (chatRooms.length >= 5) {
        alert(
          "채팅방은 최대 5개까지만 생성할 수 있습니다. 기존 채팅방을 삭제한 후 다시 시도하세요.",
        );
        return;
      }

      setIsLoading(true);
      setLoadingFade(true);

      await new Promise((r) => setTimeout(r, 600)); // small simulated delay

      // create fake session id and add locally
      const sessionId = Math.random().toString(36).substring(2, 10);
      addChatRoom({ id: sessionId, text });
      navigate(`/c/${sessionId}`, { replace: true });
    } catch (error) {
      console.error("테스트 생성 중 에러:", error);
      alert(`테스트 채팅방 생성 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingFade(false);
      setInputValue("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-6 md:px-10">
      {isLoading && (
        <LoadingState
          loadingFade={loadingFade}
          containerHeightClass="h-screen"
        />
      )}

      {!isLoading && (
        <div className="flex flex-col items-center w-full max-w-4xl pt-16 pb-24">
          <img src="/logo_icon.svg" alt="lawkey" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
            테스트용 AI 법률 파트너 (로컬)
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed text-center">
            이 페이지는 백엔드와 연결하지 않고 로컬에서 채팅방 생성 과정을
            테스트합니다.
          </p>

          <div className="relative w-full max-w-2xl">
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleMessageSubmit}
              placeholder="테스트용 메시지를 입력하세요"
            />
          </div>

          <footer className="text-center text-xs text-gray-500 mt-4">
            * 이 페이지는 개발용 테스트 페이지입니다. 배포 시 제거하세요.
          </footer>
        </div>
      )}
    </div>
  );
}

export default TestHomePage;
