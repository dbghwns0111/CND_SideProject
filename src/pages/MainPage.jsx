// src/pages/MainPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, TrashIcon, UserCircleIcon, PencilIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { ArrowUpIcon } from '@heroicons/react/24/solid'; 
import { lawkeyLogo, enterOn } from '../components/icons';

function MainPage({ chatRooms, handleAddChatRoom, handleDeleteChatRoom }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 초기 상태는 닫힘(false)으로 변경하여 햄버거 버튼이 보이도록 함
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleNewChat = (initialMessage = '') => {
    const newRoomId = handleAddChatRoom(initialMessage);
    navigate(`/counseling/${newRoomId}`, { state: { initialMessage: initialMessage, chatRoomId: newRoomId } });
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); 
    handleDeleteChatRoom(id); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageToSend = inputValue.trim();
    if (messageToSend === '') return;
    
    handleNewChat(messageToSend);
    setInputValue('');
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      
      {/* Sidebar - Fixed (항상 플로팅 상태 유지) */}
      <aside className={`fixed top-0 left-0 w-80 h-screen flex flex-col p-6 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out 
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          
          {/* 로고 및 닫기 버튼 영역 */}
          <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <div className="flex items-center space-x-2 text-lg font-semibold text-green-700">
              <img src={lawkeyLogo} alt="lawkey" className="w-7 h-7" />
              <span>lawkey</span>
            </div>
            {/* 닫기 버튼 (사이드바 내부) */}
            <button
                className="text-gray-500 hover:text-black"
                onClick={toggleSidebar}
            >
                <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* 새 상담 & 검색 */}
          <div className="flex flex-col space-y-4 flex-shrink-0 pb-4 border-b border-gray-100">
            <button 
                onClick={() => handleNewChat()}
                className="w-full py-3 px-4 bg-green-100 hover:bg-green-200 rounded-lg text-green-800 font-medium flex items-center justify-center space-x-2 transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
              <span>새 상담 시작</span>
            </button>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="상담내역 검색"
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-400 text-sm"
              />
            </div>
          </div>

          {/* 상담 기록 목록 */}
          <div className="mt-4 flex-1 overflow-y-auto text-gray-600 text-sm space-y-2">
            <div className="text-sm font-medium text-gray-600 mb-2">상담 기록 {chatRooms.length}건</div>
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => navigate(`/counseling/${room.id}`)}
                className="relative flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-gray-800 font-medium truncate">{room.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.tags.map((tag, i) => (
                      <span key={i} className="text-xs text-gray-500">
                        {tag}
                        {i < room.tags.length - 1 ? ' • ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{room.time}</span>
                <button
                  onClick={(e) => handleDelete(e, room.id)}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* 사용자 정보 */}
          <div className="border-t pt-3 mt-2 text-center text-sm text-gray-600 flex-shrink-0">
            <div className="flex items-center justify-center space-x-2">
              <UserCircleIcon className="w-8 h-8 text-green-600" />
              <span>사용자 님</span>
            </div>
          </div>
        </aside>

      {/* Main Area (사이드바와 독립된 영역) */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        
        {/* Header - 햄버거 버튼만 표시 */}
        <header className="relative w-full h-0">
          {/* 사이드바가 닫혔을 때만 표시 */}
          {!isSidebarOpen && (
            <button
              onClick={toggleSidebar}
              // 👉 화면 최상단 고정 + 오버레이 위로
              className="fixed top-2 left-3 md:top-3 md:left-6 z-[60] 
                        p-2 rounded-full bg-white/70 backdrop-blur-md shadow-md
                        text-gray-700 hover:text-green-600 transition"
              aria-label="사이드바 열기"
            >
              <Bars3Icon className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          )}
        </header>

        {/* Main Text Section */}
        <section className="flex flex-col items-center text-center mt-10">
          <img src={lawkeyLogo} alt="AI 파트너" className="w-16 h-16 mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            나만의 AI 법률 파트너
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
            혼자 고민하지 마세요.<br />
            당신의 이야기를 듣고 가장 든든한 편이 되어 드릴게요.
          </p>

          {/* Prompt Box */}
          <div className="relative w-full max-w-3xl">
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="무슨 일이든 편하게 물어보세요!"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                rows={2}
                className="w-full py-3 px-6 pr-12 rounded-2xl border border-gray-300 shadow-md bg-white/70 backdrop-blur-sm focus:outline-none text-sm md:text-base resize-none"
              />
              {/* 전송 버튼 */}
              <button
                type="submit"
                className={`absolute right-4 bottom-3 transition ${inputValue.trim() ? 'text-green-600 hover:text-green-700' : 'text-gray-400 cursor-not-allowed'}`}
                disabled={!inputValue.trim()}
              >
                <ArrowUpIcon className="h-6 w-6" /> 
              </button>
            </form>
          </div>

          {/* Footer 바로 아래 배치 */}
          <footer className="text-center text-xs text-gray-500 mt-4">
            * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
          </footer>
        </section>
      </main>
      
      {/* Overlay (사이드바가 열렸을 때 화면 어둡게 만듦) */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
}

export default MainPage;