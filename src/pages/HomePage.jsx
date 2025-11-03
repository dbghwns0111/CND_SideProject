import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import LoadingState from '../components/LoadingState';
import { useChatApi } from '../hooks/useChatApi';

function HomePage() {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFade, setLoadingFade] = useState(false);

  const navigate = useNavigate();
  const { sendStep1 } = useChatApi();

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    try {
      setIsLoading(true);
      setLoadingFade(true);

      const data = await sendStep1(text);

      if (data && data.sessionId) {
        navigate(`/c/${data.sessionId}`, { replace: true });
      } else {
        throw new Error('세션 정보 또는 메시지를 받지 못했습니다. 서버 응답을 확인하세요.');
      }
    } catch (error) {
      console.error('API 호출 중 에러 발생:', error);
      alert(`메시지 전송 실패: ${error.message}`);
    } finally {
      setIsLoading(false);
      setLoadingFade(false);
      setInputValue('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-6 md:px-10">
      {isLoading && (
        <LoadingState loadingFade={loadingFade} containerHeightClass="h-screen" />
      )}

      {!isLoading && (
        <div className="flex flex-col items-center w-full max-w-4xl pt-16 pb-24">
          <img src="/logo_icon.svg" alt="lawkey" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">나만의 AI 법률 파트너</h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed text-center">
            혼자 고민하지 마세요.
            <br />
            당신의 이야기를 듣고 가장 든든한 편이 되어 드릴게요.
          </p>

          <div className="relative w-full max-w-2xl">
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleMessageSubmit}
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
