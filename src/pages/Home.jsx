import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SideNavigation from '../components/SideNavigation';
import ChatInput from '../components/ChatInput';
import ChatArea from '../components/ChatArea';
import { RiMenu2Line } from 'react-icons/ri';

function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [showOpenButton, setShowOpenButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFade, setLoadingFade] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const sidebarWidth = 320;
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputValue || !inputValue.trim()) return;

    setIsSidebarOpen(false);
    setIsLoading(true);
    setTimeout(() => setLoadingFade(true), 50);

    const hash = Math.random().toString(36).substring(2, 10);
    setTimeout(() => {
      setIsLoading(false);
      setLoadingFade(false);
      setSessionId(hash);
      navigate(`/c/${hash}`, { replace: false });
    }, 1050);
  };

  useEffect(() => {
    if (!isSidebarOpen) {
      const timer = setTimeout(() => setShowOpenButton(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowOpenButton(false);
    }
  }, [isSidebarOpen]);

  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-16 flex items-center z-20">
        <div
          className="text-xl md:text-2xl font-bold mx-auto transition-all duration-400"
          style={{
            transform: isSidebarOpen 
              ? 'translateX(160px)' // 사이드바 절반만큼 밀기
              : 'translateX(0)',
          }}
        >
          LOGO
        </div>

        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2">
          <button className="m-5 !px-10 border border-gray-500 rounded-full">로그인</button>
          <button className="m-5 !px-10 border border-gray-500 rounded-full">회원가입</button>
        </div>
      </header>
      {/* Sidebar */}
      <SideNavigation isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Open Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className={`absolute top-10 left-10 z-30 transition-opacity duration-500 ${
          showOpenButton ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* 메뉴 아이콘 */}
        <RiMenu2Line size={40} color="black"/>
      </button>
      <main
        className="flex flex-col flex-1 transition-all duration-400 p-4 md:p-8 relative"
        style={{
          marginLeft: isSidebarOpen ? sidebarWidth : 0,
        }}
      >        

        {/* 메인 영역 */}
        <section className="w-full flex flex-col my-auto">
          {!sessionId && !isLoading && (
            <div className="px-4 relative w-full max-w-6xl mx-auto">
              <h2 className="text-lg text-gray-500 text-left">당신의 법률비서, LOGO</h2>
              <h1 className="text-2xl md:text-4xl font-bold mt-2 leading-relaxed md:leading-normal text-left">
                누구에게 물어볼까 망설이지 말고<br />AI 변호사에게
              </h1>
              <div className="relative mt-32">
                <ChatInput
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onSubmit={handleSubmit}
                  placeholder="더 많은 상담방은 회원가입 후 이용할 수 있습니다."
                  highlightPlaceholder="회원가입 후"
                />
              </div>
            </div>
          )}

          {isLoading && (
            <div className={`flex flex-col items-center justify-center w-full h-full transition-opacity duration-500 ${loadingFade ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-2xl font-bold mb-8">LOGO</div>
              <div className="mb-4 text-gray-500">새로운 대화 세션을 준비 중입니다...</div>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {sessionId && !isLoading && (
            <ChatArea sessionId={sessionId}/>
          )}
        </section>

        <footer className="text-center text-xs text-gray-500 mt-auto pt-4 hidden md:block">
          AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
        </footer>
      </main>
    </div>
  );
}

export default Home;