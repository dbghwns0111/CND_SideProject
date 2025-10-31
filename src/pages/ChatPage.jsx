// src/pages/ChatPage.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatArea from "../components/ChatArea";
import LoadingState from "../components/LoadingState";
import { useChatApi } from "../hooks/useChatApi";

function ChatPage() {
  const { sessionId: urlSessionId } = useParams(); // URL에서 세션 ID 추출
  const navigate = useNavigate();
  
  // ====== 상태 ======
  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState(null);
  const [nextStep, setNextStep] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatLoading, setChatLoading] = useState(true); // 세션 로딩 상태
  
  // ChatInput에서 사용할 입력 상태
  const [inputValue, setInputValue] = useState(""); 

  // API 훅
  const { sendStep2, sendStep3, sendStep4, sendStep5, sendFree, 
    loading: apiLoading, error: apiError, loadSession } = useChatApi();

  // ====== 세션 로딩 및 유효성 검사 ======
  useEffect(() => {
    if (!urlSessionId) {
      // 세션 ID가 없으면 홈으로 리다이렉트 (안전 장치)
      navigate("/", { replace: true });
      return;
    }
    
    // TODO: 백엔드에서 해당 세션 ID의 대화 기록을 로드하는 로직 구현 필요
    const loadChatHistory = async () => {
      try {
        setChatLoading(true);
        // 예시: API를 통해 세션 기록, 마지막 옵션/스텝 등을 로드
        // const historyData = await loadSession(urlSessionId); 
        
        // (현재는 임시로 빈 배열/초기값 설정)
        setMessages([]);
        setOptions(null);
        setNextStep(null); 
        
        setChatLoading(false);
      } catch (error) {
        console.error("세션 기록 로드 실패:", error);
        alert("세션 정보를 불러오는 데 실패했습니다.");
        navigate("/", { replace: true });
      }
    };

    loadChatHistory();
  }, [urlSessionId, navigate]);


  // ====== Step별 핸들러 (기존 Home.jsx 로직 이관) ======

  // --- 공통 메시지 추가 함수 ---
  const addMessage = useCallback((sender, text) => {
    setMessages(prev => ([
      ...prev,
      { sender, text, createdAt: Date.now() },
    ]));
  }, []);

  // --- Step2: 사건 세부 유형 선택 ---
  const handleStep2Select = async (selectedOptions) => {
    if (!urlSessionId) return;
    setIsBotTyping(true);
    addMessage("user", `[선택] ${Array.isArray(selectedOptions) ? selectedOptions.join(", ") : selectedOptions}`);
    
    const data = await sendStep2(urlSessionId, selectedOptions);
    setIsBotTyping(false);
    if (!data) return;

    addMessage("bot", data.message);
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };
  
  // --- Step3: 피해 수위 선택 ---
  const handleStep3Select = async (selectedSeverity) => {
      if (!urlSessionId) return;
      setIsBotTyping(true);
      addMessage("user", `[피해 수위] ${selectedSeverity}`);
      
      const data = await sendStep3(urlSessionId, selectedSeverity);
      setIsBotTyping(false);
      if (!data) return;

      addMessage("bot", data.message);
      setOptions(data.options || null);
      setNextStep(data.nextStep || null);
  };

  // --- Step4: 상세 설명 입력 ---
  const handleStep4Submit = async (detail) => {
      if (!urlSessionId) return;
      setIsBotTyping(true);
      addMessage("user", detail);
      
      const data = await sendStep4(urlSessionId, detail);
      setIsBotTyping(false);
      if (!data) return;

      addMessage("bot", data.message);
      setOptions(data.options || null);
      setNextStep(data.nextStep || null);
  };

  // --- Step5: 대처 방안 선택 ---
  const handleStep5Select = async (selectedOption) => {
      if (!urlSessionId) return;
      setIsBotTyping(true);
      addMessage("user", `[대처 선택] ${selectedOption}`);
      
      const data = await sendStep5(urlSessionId, selectedOption);
      setIsBotTyping(false);
      if (!data) return;

      addMessage("bot", data.message);
      setOptions(data.options || null);
      setNextStep(data.nextStep || null);
  };

  // --- 자유 질문 (ChatArea의 ChatInput을 통해 전송) ---
  const handleFreeQuestion = async (e) => {
    e.preventDefault();
    const question = inputValue.trim();
    if (!question || !urlSessionId) return;

    setInputValue(""); // 입력창 초기화
    setIsBotTyping(true);
    addMessage("user", question);
    
    const data = await sendFree(urlSessionId, question);
    setIsBotTyping(false);
    if (!data) return;

    addMessage("bot", data.message);
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };
  
  // ... (handleKeyDown 로직은 ChatInput 내부에 있으므로 여기서는 FreeQuestion용으로만) ...

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleFreeQuestion(e);
    }
  };


  if (chatLoading || apiLoading) {
    return <LoadingState loadingFade={true} containerHeightClass="h-screen" />;
  }
  
  return (
    <div className="flex-1 w-full relative">
      <ChatArea
        sessionId={urlSessionId}
        messages={messages} // 세션 메시지 전달
        isBotTyping={isBotTyping}
        options={options}
        nextStep={nextStep}
        
        // ChatInput에 전달할 props
        inputValue={inputValue}
        onInputChange={e => setInputValue(e.target.value)}
        onSubmit={handleFreeQuestion} // 자유 질문 제출 핸들러
        onKeyDown={handleKeyDown}

        // Step별 핸들러 전달
        onSelectOptions={handleStep2Select}
        onSelectSeverity={handleStep3Select}
        onSubmitDetail={handleStep4Submit}
        onSelectAction={handleStep5Select}
      />
    </div>
  );
}

export default ChatPage;