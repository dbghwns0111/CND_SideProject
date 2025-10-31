import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideNavigation from '../components/SideNavigation';
import ChatInput from '../components/ChatInput';
import ChatArea from '../components/ChatArea';
import { useChatApi } from '../hooks/useChatApi';

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [loadingFade, setLoadingFade] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const isMobile = window.innerWidth < 768; // md 기준

  const sidebarWidth = 320;
  const navigate = useNavigate();
  const location = useLocation();

  const { sendStep1, loading, error } = useChatApi();

  // URL에서 세션 확인
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts[1] === 'c' && pathParts[2]) {
      setSessionId(pathParts[2]);
      setIsSidebarOpen(false);
    } else {
      setSessionId(null);
      setIsSidebarOpen(true);
    }
  }, [location.pathname]);

  // 입력 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setIsSidebarOpen(false);
    setMessages([...messages, { sender: 'user', text: inputValue }]);
    setInputValue('');
    setLoadingFade(true);

    // Step1 API 호출
    const res = await sendStep1(inputValue);

    if (res) {
      // 백엔드에서 받은 sessionId 세팅
      setSessionId(res.sessionId);

      // AI 메시지 추가
      setMessages(prev => [
        ...prev,
        { sender: 'ai', text: res.message, options: res.options || [] }
      ]);

      // URL 업데이트
      navigate(`/c/${res.sessionId}`, { replace: false });
    }

    setLoadingFade(false);
  };

  return (
    <div
      className="relative flex h-screen w-full overflow-hidden"
      style={{
        background: `
          linear-gradient(175deg, rgba(255,255,255,1) 15%, rgba(0,0,0,0) 100%),
          linear-gradient(75deg, rgba(41,204,139,0.2) 31%, rgba(222,228,55,0.14) 100%)
        `,
        backgroundBlendMode: 'normal',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center z-20">
        <div
          className="text-xl md:text-2xl font-bold mx-auto transition-all duration-400"
          style={{
            transform: isSidebarOpen
              ? 'translateX(160px)'
              : 'translateX(0)',
          }}
        >
        </div>
      </header>

      {/* Sidebar */}
      <SideNavigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <main
        className="flex flex-col flex-1 transition-all duration-400 p-4 md:p-8 relative"
        style={{
          marginLeft: isSidebarOpen && !isMobile ? sidebarWidth : 0
        }}
      >
        <section className="w-full flex flex-col my-auto">
          {!sessionId && !loadingFade && (
            <div className="px-4 relative w-3/5 max-w-6xl mx-auto">
              <div className="px-4 relative w-full md:w-3/5 max-w-6xl mx-auto">
                <img src="/logo_icon.svg" alt="logoIcon" className="w-16 md:w-24 mb-8" />
                <h1 className="text-lg md:text-xl font-bold mt-2 leading-relaxed mb-4">
                  나만의 AI 법률 파트너
                </h1>
                <span className="text-base md:text-xl text-center">
                  혼자 고민하지 마세요.<br />
                  당신의 이야기를 듣고 가장 든든한 편이 되어 드릴게요.
                </span>
              </div>
              <div className="relative mt-32">
                <ChatInput
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onSubmit={handleSubmit}
                  placeholder="무슨 일이든 편하게 물어보세요!"
                />
                <div className='text-center text-s text-gray-900 mt-4'>
                  AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
                </div>
              </div>
            </div>
          )}

          {loadingFade && (
            <div className="flex flex-col items-center justify-center w-full h-full">
              <div className="text-2xl font-bold mb-8">LOGO</div>
              <div className="mb-4 text-gray-500">새로운 대화 세션을 준비 중입니다...</div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {sessionId && !loadingFade && (
            <ChatArea
              sessionId={sessionId}
              messages={messages}
              setMessages={setMessages}
            />
          )}
        </section>
      </main>
    </div>
  );
}

export default Home;
