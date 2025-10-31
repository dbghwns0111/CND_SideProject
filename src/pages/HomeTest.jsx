// src/pages/HomeTest.jsx (테스트용 파일 - HomePage 역할 대행)
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// 필요한 아이콘 및 컴포넌트 임포트
import { XMarkIcon, PencilIcon, MagnifyingGlassIcon, TrashIcon, UserCircleIcon, ChatBubbleLeftEllipsisIcon } from "@heroicons/react/24/outline";
import ChatArea from "../components/ChatArea"; // ChatArea 경로 확인
import LoadingState from "../components/LoadingState"; // LoadingState 경로 확인
import ChatInput from "../components/ChatInput"; // ChatInput 컴포넌트 사용
import { lawkeyLogo, enterOff, enterOn } from "../components/icons"; // 아이콘 경로 확인

// useChatApi 훅 대신 빈 객체 사용 (테스트 목적으로 API 호출을 건너뜀)
const dummyChatApi = {
    sendStep1: () => Promise.resolve({
        sessionId: "hardcoded-test-session-12345",
        message: "테스트 세션이 성공적으로 시작되었습니다. 하드코딩된 응답입니다.",
        options: ["선택지1", "선택지2"],
        nextStep: 2,
    }),
    sendStep2: async (sessionId, selectedOptions) => ({ message: `Step 2 응답 (${selectedOptions})`, options: ["A", "B"], nextStep: 3 }),
    sendStep3: async (sessionId, selectedSeverity) => ({ message: `Step 3 응답 (${selectedSeverity})`, options: ["Low", "High"], nextStep: 4 }),
    sendStep4: async (sessionId, detail) => ({ message: `Step 4 응답 (${detail.substring(0, 10)}...)`, options: ["Option1", "Option2"], nextStep: 5 }),
    sendStep5: async (sessionId, selectedOption) => ({ message: `Step 5 응답 (${selectedOption})`, options: null, nextStep: 6 }),
    sendFree: async (sessionId, question) => ({ message: `자유 질문에 대한 테스트 응답: ${question}`, options: null, nextStep: null }),
    loading: false, 
    error: null
};


function HomeTest() {
  // ====== 상태 및 훅 ======
  // 사이드바 관련 상태 제거 (MainLayout에 위임)
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFade, setLoadingFade] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [options, setOptions] = useState([]);
  const [nextStep, setNextStep] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { sendStep1, sendStep2, sendStep3, sendStep4, sendStep5, sendFree } = dummyChatApi; // **더미 API 사용**

  // URL 변화로 세션 감지 (ChatPage 역할을 시뮬레이션하기 위한 로직)
  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (pathParts[1] === "c" && pathParts[2]) {
      const currentSessionId = pathParts[2];
      setSessionId(currentSessionId);
      // Note: 실제 ChatPage라면 여기서 메시지를 로딩해야 함
    } else {
      setSessionId(null);
      setMessages([]);
    }
  }, [location.pathname]);

  // ====== 핵심 로직: 첫 메시지 전송 및 하드코딩 세션 생성 ======
  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    if (sessionId) {
      // 이미 세션이 있으면 ChatPage처럼 동작 (ChatArea의 입력창이 담당해야 함)
      navigate(`/c/${sessionId}`); 
      setInputValue("");
      return;
    }
    
    // 첫 메시지는 Hero 섹션에서만 처리
    const userMessage = { sender: "user", text, createdAt: Date.now() };

    try {
      setIsLoading(true);
      setLoadingFade(true);
      setIsBotTyping(true);

      const data = await dummyChatApi.sendStep1(text);

      if (data && data.sessionId && data.message) {
        const newSessionId = data.sessionId;
        const botMessage = {
          sender: "bot",
          text: data.message,
          createdAt: Date.now(),
        };

        setSessionId(newSessionId);
        setMessages([userMessage, botMessage]);
        setOptions(data.options || null);
        setNextStep(data.nextStep || null);

        // **핵심**: URL을 하드코딩된 세션 ID로 변경하여 ChatArea 렌더링 유도
        // 실제 앱에서는 ChatPage로 리다이렉트하는 역할
        navigate(`/c/${newSessionId}`, { replace: true }); 
      } else {
        throw new Error("테스트 세션 정보가 하드코딩되지 않았습니다.");
      }
    } catch (error) {
      console.error("테스트 시뮬레이션 에러:", error);
      const errMsg = {
        sender: "bot",
        text: `[오류] 시뮬레이션 전송 실패: ${error.message}`,
        createdAt: Date.now(),
      };
      setMessages([userMessage, errMsg]);
    } finally {
      setIsLoading(false);
      setLoadingFade(false);
      setIsBotTyping(false);
      setInputValue("");
    }
  };

  // Step2, 3, 4, 5 및 자유 질문 핸들러 (ChatArea로 전달됨)
  // ... (handleStep2Select ~ handleFreeQuestion 로직은 변경 없음. 그대로 사용)
  
  const addMessage = (sender, text) => {
    setMessages(prev => ([
      ...prev,
      { sender, text, createdAt: Date.now() },
    ]));
  };
  
  const handleStep2Select = async (selectedOptions) => { /* ... 로직 유지 ... */ };
  const handleStep3Select = async (selectedSeverity) => { /* ... 로직 유지 ... */ };
  const handleStep4Submit = async (detail) => { /* ... 로직 유지 ... */ };
  const handleStep5Select = async (selectedOption) => { /* ... 로직 유지 ... */ };
  
  const handleFreeQuestion = async (question) => {
    if (!sessionId) return;
    setIsBotTyping(true);
    addMessage("user", question); // 사용자 메시지 바로 추가
    
    const data = await dummyChatApi.sendFree(sessionId, question);
    setIsBotTyping(false);
    if (!data) return;

    addMessage("bot", data.message); // 봇 응답 추가
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit(e); // 첫 메시지 입력일 때만 사용됨
    }
  };


  return (
    // HomeTest는 MainLayout 내부에 렌더링된다고 가정하고 스타일을 조정
    <div
      className="w-full min-h-screen bg-gradient-to-b from-white to-green-50 overflow-hidden"
    >
      {/* 사이드바는 MainLayout이 렌더링한다고 가정하고 제거 */}
      
      {/* ====== 메인 콘텐츠 영역 ====== */}
      <div
        className={`
          min-h-screen
          flex flex-col justify-center items-center
          px-6 md:px-10
        `}
      >
        {/* 세션 진입 전 & 로딩 아님 → 히어로 섹션 */}
        {!sessionId && !isLoading && (
          <div className="flex flex-col items-center w-full max-w-4xl pt-16 pb-24">
            <img src={lawkeyLogo} alt="lawkey" className="w-16 h-16 mb-4" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
              나만의 AI 법률 파트너 (테스트 버전)
            </h1>
            <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed text-center">
              혼자 고민하지 마세요.
              <br />
              당신의 이야기를 듣고 가장 든든한 편이 되어 드릴게요.
            </p>

            {/* 🚨 입력창 컨테이너 수정: 폭 줄임 (max-w-2xl) 및 중앙 정렬 (mx-auto) */}
            <div className="relative w-full max-w-2xl mx-auto"> 
              <ChatInput
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onSubmit={handleMessageSubmit}
                // ChatInput 내부에서 handleKeyDown을 처리하므로 별도 props 불필요
                textareaClassName="rows-2" // ChatInput의 textarea 스타일 오버라이드
              />
            </div>

            <footer className="text-center text-xs text-gray-500 mt-4">
              * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
            </footer>
          </div>
        )}

        {/* 로딩 화면 */}
        {isLoading && (
          <LoadingState loadingFade={loadingFade} containerHeightClass="h-[70vh]" />
        )}

        {/* 세션 진입 후: ChatArea 렌더링 (대화 화면) */}
        {sessionId && !isLoading && (
          <ChatArea
            sessionId={sessionId}
            messages={messages} // 메시지 목록 전달
            options={options}
            nextStep={nextStep}
            isBotTyping={isBotTyping}
            
            // ChatInput 관련 props (ChatArea 내부의 ChatInput으로 전달됨)
            inputValue={inputValue}
            onInputChange={(e) => setInputValue(e.target.value)}
            onSubmit={(e) => { // ChatArea 내부에서 사용할 자유 질문 핸들러
                e.preventDefault();
                handleFreeQuestion(inputValue);
                setInputValue("");
            }}
            
            // Step별 핸들러
            onSelectOptions={handleStep2Select}
            onSelectSeverity={handleStep3Select}
            onSubmitDetail={handleStep4Submit}
            onSelectAction={handleStep5Select}
          />
        )}
      </div>
    </div>
  );
}

// ====== Step 핸들러 로직 (HomeTest 함수 밖으로 분리) ======

const handleStep2Select = async (selectedOptions) => { /* ... */ }; // 이 함수들은 ChatPage에서 정의되어야 함
const handleStep3Select = async (selectedSeverity) => { /* ... */ }; // 현재는 HomeTest 내부에서만 시뮬레이션
const handleStep4Submit = async (detail) => { /* ... */ };
const handleStep5Select = async (selectedOption) => { /* ... */ };


export default HomeTest;