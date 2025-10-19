// src/pages/MainPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
// lawkeyLogo를 "../components/icons"에서 가져오는 것으로 가정합니다.
import { lawkeyLogo, enterOff, enterOn} from "../components/icons"; 

function MainPage({ chatRooms = [], handleAddChatRoom, handleDeleteChatRoom }) {
  // ✅ 기본값: 열린 상태
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  // 📐 새로운 디자인 변수 정의
  const fixedTop = "top-[10px]";     // 상단 여백
  const fixedBottom = "bottom-[10px]"; // 하단 여백

  // 사이드바 폭 정의
  const openWidthClass = "w-72";    // 18rem = 288px (열림 상태)
  const closedWidthClass = "w-16";  // 4rem = 64px (닫힘 상태)

  // 메인 영역 마진 (사이드바 폭에 맞춤)
  const mainMarginOpen = "ml-72";   
  const mainMarginClosed = "ml-16"; 

  // 마우스 오버 상태 
  const [isHovered, setIsHovered] = useState(false); 

  // 사이드바가 완전히 열린 상태 정의 (클릭으로 열려있거나, 마우스 오버 중이거나)
  const isSidebarFullyOpen = isSidebarOpen || isHovered;

  const onToggleClose = (e) => {
    e.stopPropagation();
    setIsSidebarOpen(false);
  };

  const onSidebarClick = () => {
    // 닫힌 상태에서 사이드바 아무 영역 클릭 시 열기
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;
    
    // chatRoomId를 생성하고 채팅 페이지로 이동하는 로직
    const newRoomId = handleAddChatRoom(text);
    navigate(`/counseling/${newRoomId}`, {
      state: { initialMessage: text, chatRoomId: newRoomId },
    });
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    // 1. 엔터 키(keyCode 13)가 눌렸을 때
    if (e.key === 'Enter') {
        // 2. Ctrl 키가 함께 눌리지 않았다면: 전송 처리
        if (!e.shiftKey) {
            e.preventDefault(); // 기본 줄바꿈 동작 방지
            handleSubmit(e); // 폼 제출 함수 호출
        }
        // 3. Ctrl 키가 함께 눌렸다면: 줄바꿈 동작 허용 (기본 동작 유지)
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* =========================
          ⬅️ 팝업 사이드바
      ========================== */}
      <aside
        onClick={onSidebarClick}
        className={`
          // 위치 및 높이 조정: 고정된 팝업 형태
          absolute z-40 ${fixedTop} ${fixedBottom} left-[10px] 
          
          // 스타일 및 레이아웃
          bg-white/10 backdrop-blur-md border border-gray-200 rounded-xl shadow-xl
          transition-all duration-300 ease-in-out
          flex flex-col
          
          // 가로 길이 조정
          ${isSidebarOpen ? openWidthClass : closedWidthClass}
        `}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <div 
            className="flex items-center space-x-2 text-green-700 font-semibold cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <img src={lawkeyLogo} alt="lawkey" className="w-7 h-7" />
            {isSidebarOpen && <span className="text-lg">lawkey</span>}
          </div>

          {/* 닫기 버튼(열림 상태에서만 노출) */}
          {isSidebarOpen && (
            <button
              onClick={onToggleClose}
              className="text-gray-500 hover:text-black"
              aria-label="사이드바 닫기"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* 새 상담 + 검색 */}
        <div className="p-3 space-y-3 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddChatRoom();
            }}
            className={`w-full transition ${
              isSidebarOpen
                ? "py-3 bg-green-100 hover:bg-green-200 rounded-lg text-green-800 font-medium flex items-center justify-center space-x-2"
                : "p-3 bg-green-100 hover:bg-green-200 rounded-xl flex justify-center"
            }`}
          >
            <div className="flex-shrink-0">
              <PencilIcon className="w-5 h-5 text-green-800" />
            </div>
            {isSidebarOpen && <span>새 상담 시작</span>}
          </button>

          {isSidebarOpen ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="상담내역 검색"
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-white focus:outline-none text-sm"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" /> {/* 닫힘 상태 아이콘 크기 조정 */}
            </div>
          )}
        </div>

        {/* 상담 목록 */}
        <div className="flex-1 overflow-y-auto px-3 pb-3">
          {isSidebarOpen ? (
            <>
              <div className="text-sm font-medium text-gray-600 mb-2">
                상담 기록 <span className="text-green-600">{chatRooms.length}</span>건
              </div>
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/counseling/${room.id}`);
                  }}
                  className="relative p-3 mb-2 rounded-lg bg-white/60 hover:bg-green-50 cursor-pointer transition"
                >
                  <p className="font-medium text-gray-800 truncate">{room.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {/* Tags는 chatRooms 데이터 구조에 따라 맵핑 */}
                    {room.tags?.map((tag, i) => ( 
                      <span
                        key={i}
                        className="text-xs text-gray-500 bg-gray-200/70 rounded-full px-2 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChatRoom(room.id);
                    }}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                    aria-label="상담 삭제"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          ) : (
            // 미니 상태: 아이콘만 세로 나열
            <div className="flex flex-col items-center space-y-5 mt-6 text-gray-500">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> {/* 아이콘 크기 조정 */}
              <span className="text-sm font-medium text-gray-600 mb-2">
                <span className="text-green-600">{chatRooms.length}</span>
                /5
              </span>
            </div>
          )}
        </div>

        {/* 사용자 정보 */}
        <div className="border-t border-gray-100 py-3 text-gray-600 flex items-center justify-center flex-shrink-0">
          {isSidebarOpen ? (
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="w-7 h-7 text-green-600" />
              <span>사용자 님</span>
            </div>
          ) : (
            <UserCircleIcon className="w-6 h-6 text-green-600" />
          )}
        </div>
      </aside>

      {/* =========================
          🧠 메인 영역 (수직 중앙 배치 + 좌측 마진)
      ========================== */}
      <main
        className={`
            min-h-screen 
            transition-all duration-300 
            ${isSidebarOpen ? mainMarginOpen : mainMarginClosed} 
            
            // 수직 중앙 정렬을 위한 Flex 설정
            flex 
            flex-col 
            justify-center 
            items-center
        `}
      >
        <div className="flex flex-col items-center px-6 md:px-10">
          <img src={lawkeyLogo} alt="AI 파트너" className="w-16 h-16 mb-4" />

          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 text-center">
            나만의 AI 법률 파트너
          </h1>
          <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed text-center">
            혼자 고민하지 마세요.<br />
            당신의 이야기를 듣고 가장 든든한 편이 되어 드릴게요.
          </p>

          {/* 프롬프트 입력창 */}
          <div className="relative w-full max-w-3xl">
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="무슨 일이든 편하게 물어보세요!"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                className="w-full py-3 px-6 pr-12 rounded-2xl border border-gray-300 shadow-md bg-white/70 backdrop-blur-sm focus:outline-none text-sm md:text-base resize-none"
              />
              <button
                type="submit"
                className={`absolute right-4 bottom-3 transition ${
                  inputValue.trim()
                    ? "text-green-600 hover:text-green-700"
                    : "text-gray-400 cursor-not-allowed"
                }`}
                disabled={!inputValue.trim()}
                aria-label="전송"
              >
                {inputValue.trim() ? (
                  <img src={enterOn} alt="전송" className="h-6 w-6" />
                ) : (
                  <img src={enterOff} alt="전송 불가" className="h-6 w-6" />
                )}
              </button>
            </form>
          </div>

          <footer className="text-center text-xs text-gray-500 mt-4">
            * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
          </footer>
        </div>
      </main>
    </div>
  );
}

export default MainPage;