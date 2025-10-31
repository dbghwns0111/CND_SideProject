// src/components/SideNavigation.jsx

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { lawkeyLogo } from "../components/icons"; // 상대 경로 수정

/**
 * SideNavigation 컴포넌트는 Layout에서 관리하는 isSidebarOpen 상태를 받습니다.
 * - 채팅방 목록 렌더링 및 클릭 이벤트 처리
 */
function SideNavigation({
  isSidebarOpen,
  setIsSidebarOpen,
  chatRooms = [],
  handleDeleteChatRoom,
  handleAddChatRoom, // 새 채팅방 추가 이벤트 핸들러 추가
}) {
  const navigate = useNavigate();

  // 사이드바 폭 정의 (MainLayout의 SIDEBAR_WIDTH와 일치해야 함)
  const openWidthClass = "w-[clamp(240px,22vw,320px)]";
  const closedWidthClass = "w-[clamp(56px,6vw,80px)]";
  const fixedTop = "top-[var(--safe-gap)]";
  const fixedBottom = "bottom-[var(--safe-gap)]";
  const safeGap = "clamp(8px, 2vw, 16px)"; // MainLayout의 스타일과 통일

  const searchRef = useRef(null);

  const onSidebarClick = () => {
    // 닫힌 상태에서 사이드바 영역 클릭 시 열기
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  // 새 상담 시작 버튼 클릭 시 홈으로 이동 (새 세션 생성 유도)
  const handleNewChat = (e) => {
    e.stopPropagation();
    navigate("/");
    if (!isSidebarOpen) setIsSidebarOpen(true); // 새 상담 시작 시 사이드바 열기
  };

  // 채팅방 아이템 클릭 시 해당 세션으로 이동
  const handleRoomClick = (id) => {
    navigate(`/c/${id}`); // 라우팅 경로 '/c/:sessionId' 사용
    setIsSidebarOpen(false); // 채팅방 진입 시 사이드바 닫기
  };

  return (
    <aside
      onClick={onSidebarClick}
      // Tailwind 변수 스타일링을 위해 인라인 스타일 추가
      style={{
        '--safe-gap': safeGap,
        left: safeGap,
      }}
      className={`
        absolute z-40 ${fixedTop} ${fixedBottom}
        bg-white/10 backdrop-blur-md
        rounded-xl shadow-xl border border-gray-200
        overflow-hidden flex flex-col
        transition-all duration-300 ease-in-out

        ${isSidebarOpen ? openWidthClass : closedWidthClass}
      `}
    >
      {/* 상단 헤더 */}
      <div className={`p-4 flex items-center justify-between flex-shrink-0 border-b border-gray-100 ${!isSidebarOpen && 'justify-center'}`}>

        {isSidebarOpen ? (
          <div 
            className="flex items-center space-x-2 text-xl font-bold text-green-700 cursor-pointer"
            onClick={() => navigate('/')} // 로고 클릭 시 홈으로 이동
          >
            <img src={lawkeyLogo} alt="lawkey" className="w-7 h-7" /> 
            <span>lawkey</span>
          </div>
        ) : (
          <div className="flex w-full justify-center py-4"> 
            <img src={lawkeyLogo} alt="lawkey" className="w-7 h-7 transition-transform duration-300 hover:scale-105" /> 
          </div>
        )}

        {isSidebarOpen && (
          <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 hover:text-black p-1 rounded-full">
            <XMarkIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* 새 상담 + 검색 */}
      <div className="p-3 space-y-3 flex-shrink-0">
        <button
          onClick={handleNewChat}
          className={`w-full transition ${
            isSidebarOpen
              ? "py-3 bg-green-100 hover:bg-green-200 rounded-xl text-green-800 font-medium flex items-center justify-center space-x-2"
              : "p-3 bg-green-100 hover:bg-green-200 rounded-xl flex justify-center"
          }`}
        >
          <PencilIcon className="w-5 h-5 text-green-800" />
          {isSidebarOpen && <span>새 상담 시작</span>}
        </button>

        {/* ... (검색 UI는 그대로 유지) ... */}
        {isSidebarOpen ? (
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={searchRef}
              type="text"
              placeholder="상담내역 검색"
              className="w-full py-2 pl-10 pr-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-400 text-sm"
              aria-label="상담내역 검색"
            />
          </div>
        ) : (
          <div className="flex justify-center">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          </div>
        )}
      </div>

      {/* 상담 목록 */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isSidebarOpen ? (
          <>
            <div className="text-sm font-medium text-gray-600 mb-2">
              상담 기록 {chatRooms.length}건
            </div>
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                className="relative p-3 mb-2 rounded-xl bg-white/70 hover:bg-green-50 cursor-pointer transition"
              >
                <p className="font-medium text-gray-800 truncate">{room.title}</p>
                {/* ... (태그 및 삭제 버튼 UI 유지) ... */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChatRoom?.(room.id);
                  }}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  aria-label="채팅방 삭제"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center space-y-5 mt-6 text-gray-500">
            <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
            <span className="text-xs text-gray-400">1/{chatRooms.length || 0}</span>
          </div>
        )}
      </div>

      {/* ... (사용자 정보 UI는 그대로 유지) ... */}
       <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-600 flex items-center justify-center flex-shrink-0">
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
  );
}

export default SideNavigation;