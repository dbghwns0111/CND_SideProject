// src/components/SideNavigation.jsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  ArrowLeftOnRectangleIcon, // 로그아웃 아이콘
  ArrowRightOnRectangleIcon, // 로그인 아이콘 (축소 상태)
} from "@heroicons/react/24/outline";
import WarningAlert from './alter/WarningAlert'; // WarningAlert 컴포넌트 경로 가정
import { useAuth } from '../store/hooks/useAuth'; // useAuth 훅 경로 가정

// CounselingCounter 컴포넌트 (팀원 코드에서 가져옴)
const CounselingCounter = ({ counselingCount, maxCounselingCount }) => {
  const isExceeded = counselingCount >= maxCounselingCount;

  return (
    <span className="font-bold">
      <span className={isExceeded ? 'text-red-500' : 'text-green-600'}> {/* Tailwind에 맞게 색상 조정 */}
        {counselingCount}
      </span>
      <span className="mx-[0.25rem]">/</span>
      <span className={isExceeded ? 'text-red-500' : 'text-gray-900'}>
        {maxCounselingCount}
      </span>
    </span>
  );
};

function SideNavigation({
  isSidebarOpen,
  setIsSidebarOpen,
  chatRooms = [],
  handleDeleteChatRoom,
  handleAddChatRoom,
}) {
  const navigate = useNavigate();
  // 인증 로직을 위한 useAuth 훅 사용 (팀원 코드에서 가져옴)
  const { isLoggedIn, user, login, logout } = useAuth(); 

  // 상태 추가 (팀원 코드에서 가져옴)
  const [maxCounselingCount, setMaxCounselingCount] = useState(5);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [showContent, setShowContent] = useState(isSidebarOpen); // 사이드바 내용 표시를 위한 상태

  // 사이드바 폭 정의 (사용자 코드)
  const openWidthClass = "w-[clamp(240px,22vw,320px)]";
  const closedWidthClass = "w-[clamp(56px,6vw,80px)]";
  const fixedTop = "top-[var(--safe-gap)]";
  const fixedBottom = "bottom-[var(--safe-gap)]";
  const safeGap = "clamp(8px, 2vw, 16px)";

  const searchRef = useRef(null);

  // ********** 동적 기능: 사이드바 영역 클릭 시 열기 (사용자 코드) **********
  const onSidebarClick = () => {
    // 닫힌 상태에서 사이드바 영역 클릭 시 열기
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  // 새 상담 시작 버튼 클릭 시 홈으로 이동
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
  
  // 전체 상담 기록 삭제 핸들러 (팀원 코드에서 가져옴)
  const handleDelete = () => {
    // 실제 백엔드 연동 로직은 여기서 처리 (예: 모든 chatRooms 삭제 API 호출)
    // chatRooms = []; // 실제 상태 관리는 props로 들어온 함수를 사용해야 함
    setIsAlertOpen(false);
  };

  const handleSavePDF = () => {
    // PDF 저장 로직 (팀원 코드에서 가져옴)
    // ...
  };
  
  // 로그인/로그아웃 핸들러 (팀원 코드에서 가져옴)
  const handleLogin = () => {
    login({ name: '홍길동', email: 'hong@example.com' });
    setIsSidebarOpen(true);
  };
  const handleLogout = () => {
    logout();
    setIsSidebarOpen(true);
  };

  // 사이드바 내용 표시 지연 useEffect (두 코드에 모두 있음, 사용자 코드에 맞춰 사용)
  useEffect(() => {
    if (isSidebarOpen) {
      const timer = setTimeout(() => setShowContent(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [isSidebarOpen]);


  return (
    <aside
      onClick={onSidebarClick} // ********** 동적 기능: 사이드바 영역 클릭 시 열기 (사용자 코드) **********
      style={{ '--safe-gap': safeGap, left: safeGap, }}
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
            onClick={() => navigate('/')} 
          >
            <img src="/logo_icon.svg" alt="lawkey" className="w-8 h-8" /> 
            <span>lawkey</span>
          </div>
        ) : (
          <div className="flex w-full justify-center py-4"> 
            <img src="/logo_icon.svg" alt="lawkey" className="w-8 h-8 transition-transform duration-300 hover:scale-105" /> 
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
          <PencilIcon className="w-7 h-7 text-green-800" />
          {isSidebarOpen && <span>새 상담 시작</span>}
        </button>

        {/* 검색 UI */}
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
            <MagnifyingGlassIcon className="w-7 h-7 text-gray-500" />
          </div>
        )}
      </div>

      {/* 상담 목록 */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {isSidebarOpen ? (
          <>
            {/* 상담 기록 헤더 (카운터 및 전체 삭제 버튼 추가) */}
            <div className="flex flex-row justify-between items-center mb-3">
                <div className='text-left text-sm font-medium'>
                    <span className="text-gray-600 mr-1">상담 기록</span>
                    {/* CounselingCounter 로직 통합 */}
                    <CounselingCounter
                        counselingCount={chatRooms.length}
                        maxCounselingCount={maxCounselingCount}
                    />
                </div>
                {/* 전체 삭제 버튼 (경고창 로직 연결) */}
                <button
                    className="ml-2 text-gray-400 hover:text-red-500"
                    title="전체 상담 기록 삭제"
                    onClick={() => setIsAlertOpen(true)}
                >
                    <TrashIcon className="w-5 h-5" />
                </button>
            </div>
            
            {/* 채팅방 목록 */}
            {chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleRoomClick(room.id)}
                className="relative p-3 mb-2 rounded-xl bg-white/70 hover:bg-green-50 cursor-pointer transition"
              >
                <p className="font-medium text-gray-800 truncate">{room.title}</p>
                {/* 개별 삭제 버튼 */}
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
            <ChatBubbleLeftEllipsisIcon className="w-7 h-7" />
            {/* 축소 상태 카운터 로직 통합 */}
            <span className="text-xs font-bold">
              <CounselingCounter
                counselingCount={chatRooms.length}
                maxCounselingCount={maxCounselingCount}
              />
            </span>
          </div>
        )}
      </div>

      {/* 사용자 정보 및 로그인/로그아웃 (인증 로직 통합) */}
      <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-600 flex items-center justify-center flex-shrink-0">
        {isSidebarOpen ? (
          <div className="flex items-center w-full justify-between space-x-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2">
                    <UserCircleIcon className="w-7 h-7 text-green-600" />
                    <span className="font-medium text-gray-800">{user?.name} 님</span>
                </div>
                <button onClick={handleLogout} className="text-gray-500 hover:text-black p-1 rounded-full" title="로그아웃">
                    <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                </button>
              </>
            ) : (
              <div className="flex flex-row justify-between w-full gap-2">
                <button
                  onClick={handleLogin}
                  className="flex-1 px-3 py-1.5 rounded-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-900 text-xs font-bold"
                >
                  로그인
                </button>
                <button className="flex-1 px-3 py-1.5 rounded-full bg-green-600 hover:bg-green-700 text-white text-xs font-bold">
                  회원가입
                </button>
              </div>
            )}
          </div>
        ) : (
          isLoggedIn ? (
            <UserCircleIcon className="w-6 h-6 text-green-600" />
          ) : (
            // 비로그인 상태 (축소 시 로그인 유도 아이콘)
            <button 
                onClick={handleLogin} 
                className="flex items-center justify-center w-7 h-7 rounded-full bg-green-600 text-white"
                title="로그인"
            >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
            </button>
          )
        )}
      </div>

      {/* 경고 알림창 (팀원 코드에서 가져옴) */}
      <WarningAlert
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="상담내역을 삭제하시겠습니까?"
        description={
          isLoggedIn
            ? `삭제 후에는 복구가 불가능합니다.
      필요하신 경우, 삭제 전에 주요 상담 내역을 
      PDF로 저장할 수 있습니다.`
            : "삭제 후에는 복구가 불가능합니다."
        }
        buttons={
          isLoggedIn
            ? [
                {
                  label: 'PDF 저장',
                  onClick: handleSavePDF,
                  className: 'flex-1 px-[1rem] py-[0.5rem] rounded-full bg-green-600 text-white font-bold',
                },
                {
                  label: '삭제',
                  onClick: handleDelete,
                  className: 'flex-1 px-[1rem] py-[0.5rem] rounded-full bg-black text-white font-extrabold',
                },
                {
                  label: '취소',
                  onClick: () => setIsAlertOpen(false),
                  className: 'flex-1 px-[1rem] py-[0.5rem] rounded-full border border-gray-400 font-bold',
                },
              ]
            : [
                {
                  label: '삭제',
                  onClick: handleDelete,
                  className: 'flex-1 px-[1rem] py-[0.5rem] rounded-full bg-black text-white font-extrabold ml-[2.5rem]',
                },
                {
                  label: '취소',
                  onClick: () => setIsAlertOpen(false),
                  className: 'flex-1 px-[1rem] py-[0.5rem] rounded-full border border-gray-400 font-bold',
                },
              ]
        }
      />
    </aside>
  );
}

export default SideNavigation;