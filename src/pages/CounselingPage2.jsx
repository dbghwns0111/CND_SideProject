// src/pages/CounselingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ChatBubbleLeftEllipsisIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { lawkeyLogo, enterOff, enterOn} from "../components/icons"; 

const STORAGE_KEY = "chatMessages"; // ✅ 로컬스토리지 키

function CounselingPage({ chatRooms = [], handleDeleteChatRoom, chatMessages, updateChatMessages }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const initialMessage = location.state?.initialMessage || "";

  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 기본값: 열린 상태로 변경

  const currentChatId = String(chatRoomId); // ✅ 문자열로 통일
  const messages = chatMessages?.[currentChatId] || [];

  const messagesEndRef = useRef(null);
  
  // 사이드바 너비 클래스
  const openWidthClass = "w-72";    // 288px
  const closedWidthClass = "w-16";  // 64px
  const fixedTop = "top-[10px]";
  const fixedBottom = "bottom-[10px]";

  // 마진 클래스
  const openMarginClass = "ml-72";   // 288px
  const closedMarginClass = "ml-16"; // 64px
  
  /** ---------------------------
   * 사이드바 제어 함수
   * ---------------------------
   */
  const toggleSidebar = () => setIsSidebarOpen((v) => !v);
  
  const onToggleClose = (e) => {
    e.stopPropagation();
    setIsSidebarOpen(false);
  };
  
  const onSidebarClick = () => {
    // 닫힌 상태에서 사이드바 아무 영역 클릭 시 열기
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };
  
  /** ---------------------------
   * 로컬스토리지 유틸 (유지)
   * ---------------------------
   */
  const loadAllFromStorage = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  };

  const saveToStorage = (roomId, arr) => {
    const all = loadAllFromStorage();
    all[roomId] = arr;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  };

  const hydrateFromStorage = (roomId) => {
    const all = loadAllFromStorage();
    const stored = all?.[roomId];
    if (stored && Array.isArray(stored) && stored.length > 0) {
      // 상위 상태가 비어 있거나 길이가 다르면 복원
      if (!messages || messages.length !== stored.length) {
        updateChatMessages(roomId, stored);
      }
    }
  };
  
  // ... (나머지 useEffect, getBotResponse, handleSendMessage 함수 유지)
  
  /** ---------------------------
   * 스크롤 유지 (유지)
   * ---------------------------
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  /** ---------------------------
   * 방 변경 시: 저장된 내역 복원 (유지)
   * ---------------------------
   */
  useEffect(() => {
    hydrateFromStorage(currentChatId);
    // 초기 질문이 있고, 아직 아무 메시지도 없다면 첫 메시지로 저장
    if (initialMessage && (!messages || messages.length === 0)) {
      const first = {
        sender: "user",
        text: initialMessage.trim(),
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        createdAt: Date.now(),
      };
      const next = [first];
      updateChatMessages(currentChatId, next);
      saveToStorage(currentChatId, next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChatId]);

  /** ---------------------------
   * 메시지 변경 시: 로컬스토리지에 저장 (유지)
   * ---------------------------
   */
  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      saveToStorage(currentChatId, messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  /** ---------------------------
   * 봇 응답 시뮬레이션 (유지)
   * ---------------------------
   */
  const getBotResponse = () => {
    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      const botResponse = {
        sender: "bot",
        text: "로키가 생각 중입니다... 잠시만 기다려 주세요.",
        time: new Date().toLocaleTimeString("ko-KR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        createdAt: Date.now(),
      };
      const next = [...(chatMessages?.[currentChatId] || []), botResponse];
      updateChatMessages(currentChatId, next);
      saveToStorage(currentChatId, next); // ✅ 저장
    }, 900);
  };

  /** ---------------------------
   * 사용자 메시지 전송 (유지)
   * ---------------------------
   */
  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = inputMessage.trim();
    if (!text) return;

    const userMsg = {
      sender: "user",
      text,
      time: new Date().toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      createdAt: Date.now(),
    };
  
    const next = [...messages, userMsg];
    updateChatMessages(currentChatId, next);
    saveToStorage(currentChatId, next); // ✅ 저장

    setInputMessage("");
    getBotResponse();
  };

  const handleKeyDown = (e) => {
    // 1. 엔터 키(e.key === 'Enter')가 눌렸을 때
    if (e.key === 'Enter') {
        // 2. Ctrl 키가 함께 눌리지 않았다면: 전송 처리
        if (!e.shiftKey) {
            e.preventDefault(); // 기본 줄바꿈 동작 방지
            
            // 전송 로직 호출 (e가 폼 이벤트가 아니므로 handleSendMessage 함수를 직접 호출)
            // handleSendMessage가 폼 제출 이벤트를 인수로 받으므로, 임시 폼 이벤트 객체를 전달합니다.
            // 또는, 입력값이 있을 경우에만 전송 버튼을 클릭하는 동작을 시뮬레이션합니다.
            if (inputMessage.trim()) {
                 handleSendMessage(e);
            }
        }
        // 3. Ctrl 키가 함께 눌렸다면: 줄바꿈 동작 허용 (기본 동작 유지)
    }
  };
  
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Floating Sidebar (업데이트된 스타일 적용) */}
      <aside
        onClick={onSidebarClick}
        className={`
          // 위치 및 높이 조정: 고정된 팝업 형태
          absolute z-40 ${fixedTop} ${fixedBottom} left-[10px] 
          
          // 스타일 조정
          bg-white/10 backdrop-blur-md
          rounded-xl shadow-xl border border-gray-200 // border-r 제거, rounded-xl, border 적용
          overflow-hidden flex flex-col
          transition-all duration-300 ease-in-out
          
          // 가로 길이 조정
          ${isSidebarOpen ? openWidthClass : closedWidthClass}
        `}
      >
        {/* 상단 헤더 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <div 
            className="flex items-center space-x-2 text-green-700 font-semibold cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src={lawkeyLogo} alt="lawkey" className="w-7 h-7" />
            {isSidebarOpen && <span className="text-lg">lawkey</span>} {/* 열린 상태에서만 텍스트 표시 */}
          </div>
          {/* 닫기 버튼(열림 상태에서만 노출) */}
          {isSidebarOpen && (
            <button onClick={onToggleClose} className="text-gray-500 hover:text-black">
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* 새 상담 + 검색 */}
        <div className="p-3 space-y-3 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate("/");
            }}
            className={`w-full transition ${
              isSidebarOpen
                ? "py-3 bg-green-100 hover:bg-green-200 rounded-xl text-green-800 font-medium flex items-center justify-center space-x-2"
                : "p-3 bg-green-100 hover:bg-green-200 rounded-xl flex justify-center" // 닫힘 상태 버튼 스타일
            }`}
          >
            <PencilIcon className="w-5 h-5 text-green-800" />
            {isSidebarOpen && <span>새 상담 시작</span>}
          </button>
          
          {/* 검색창/아이콘 조건부 렌더링 */}
          {isSidebarOpen ? (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="상담내역 검색"
                className="w-full py-2 pl-10 pr-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-400 text-sm"
              />
            </div>
          ) : (
            <div className="flex justify-center">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" /> {/* 아이콘 크기 조정 */}
            </div>
          )}
        </div>

        {/* Chat List (상담 목록) */}
        <div className="flex-1 overflow-y-auto px-3 pb-3"> {/* px/pb 패딩 조정 */}
          {isSidebarOpen ? (
            <>
              <div className="text-sm font-medium text-gray-600 mb-2">상담 기록 {chatRooms.length}건</div>
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/counseling/${room.id}`);
                  }}
                  className="relative p-3 mb-2 rounded-xl bg-white/70 hover:bg-green-50 cursor-pointer transition"
                >
                  <p className="font-medium text-gray-800 truncate">{room.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
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
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          ) : (
            // 닫힌 상태 (미니 상태): 아이콘 나열
            <div className="flex flex-col items-center space-y-5 mt-6 text-gray-500">
              <ChatBubbleLeftEllipsisIcon className="w-5 h-5" /> {/* 아이콘 크기 조정 */}
              <span className="text-xs text-gray-400">1/{chatRooms.length || 0}</span>
            </div>
          )}
        </div>

        {/* User Info */}
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

      {/* Main Chat Section */}
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? openMarginClass : closedMarginClass
        }`}
      >
        {/* Header */}
        

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto pb-28">
          <div className="max-w-4xl mx-auto space-y-5">
            {/* ... (메시지 목록 유지) ... */}
            {messages.map((message, idx) => {
              // 현재 메시지의 날짜를 구합니다.
              const messageDate = new Date(message.createdAt).toLocaleDateString("ko-KR", {
                month: "long",
                day: "numeric",
              });

              // 이전 메시지가 있고, 이전 메시지의 날짜와 현재 메시지의 날짜가 다를 경우 구분선을 표시합니다.
              const prevMessage = messages[idx - 1];
              const prevMessageDate = prevMessage
                ? new Date(prevMessage.createdAt).toLocaleDateString("ko-KR", {
                    month: "long",
                    day: "numeric",
                  })
                : null;

              const showDateSeparator = idx === 0 || messageDate !== prevMessageDate;

              return (
                <React.Fragment key={idx}>
                  {/* 날짜 구분선 렌더링 */}
                  {showDateSeparator && (
                    <div className="flex justify-center my-4">
                      <span className="text-xs text-gray-500 px-3 py-1 bg-gray-200 rounded-full font-medium">
                        --- {messageDate} ---
                      </span>
                    </div>
                  )}

                  {/* 기존 메시지 버블 렌더링 */}
                  {message.sender === "user" ? (
                    <div className="flex justify-end">
                      <div className="max-w-xs md:max-w-md bg-green-500 text-white px-4 py-2 rounded-2xl rounded-br-none shadow-md whitespace-pre-wrap">
                        {message.text}
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start space-x-3">
                      <img
                        src={lawkeyLogo}
                        alt="로키"
                        className="w-10 h-10 rounded-full bg-white shadow"
                      />
                      <div className="max-w-xs md:max-w-md bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none shadow">
                        {message.text}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}

            {isBotTyping && (
              <div className="flex items-start space-x-3">
                <img src={lawkeyLogo} alt="로키" className="w-10 h-10 rounded-full bg-white shadow" />
                <div className="max-w-xs md:max-w-md bg-white/80 text-gray-700 px-4 py-2 rounded-2xl rounded-tl-none shadow animate-pulse">
                  로키가 답변을 준비 중입니다...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Box */}
        <footer
          className={`
            fixed bottom-0 z-30
            p-4 border-t border-gray-200 
            transition-all duration-300
            left-0 right-0 
            flex flex-col items-center
            ${isSidebarOpen ? openMarginClass : closedMarginClass}
          `}
        >
          {/* 1. 프롬프트 폼 영역: max-w-4xl로 폭 제한 및 중앙 정렬 역할 */}
          <div className="flex justify-center w-full"> 
              <form onSubmit={handleSendMessage} className="relative flex items-end w-full max-w-3xl"> 
                <textarea
                    rows={3} // 3줄
                    placeholder="무슨 일이든 편하게 물어보세요!"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow py-3 px-6 rounded-2xl border border-gray-300 shadow-md focus:outline-none pr-12 text-sm resize-none" 
                />
                <button 
                    type="submit" 
                    className={`absolute right-4 bottom-3 transition ${
                      inputMessage.trim()
                        ? "text-green-600 hover:text-green-700"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    disabled={!inputMessage.trim()}
                    aria-label="전송"
                >
                  {inputMessage.trim() ? (
                    <img src={enterOn} alt="전송" className="h-6 w-6" />
                  ) : (
                    <img src={enterOff} alt="전송 불가" className="h-6 w-6" />
                  )}
                </button>
              </form>
          </div>
          
          {/* 2. 고지사항 텍스트 영역: W-full을 주어 위 프롬프트 영역 폭과 맞춰 중앙 정렬되도록 합니다. */}
          <div className="w-full max-w-4xl">
              <p className="text-center text-xs text-gray-500 mt-2">
                * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
              </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default CounselingPage;