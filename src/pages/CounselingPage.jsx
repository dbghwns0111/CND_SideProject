// src/pages/CounselingPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";
import { lawkeyLogo } from "../components/icons";

const STORAGE_KEY = "chatMessages"; // ✅ 로컬스토리지 키

function CounselingPage({ chatRooms, handleDeleteChatRoom, chatMessages, updateChatMessages }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const initialMessage = location.state?.initialMessage || "";

  const [inputMessage, setInputMessage] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentChatId = String(chatRoomId); // ✅ 문자열로 통일
  const messages = chatMessages?.[currentChatId] || [];

  const messagesEndRef = useRef(null);

  /** ---------------------------
   *  로컬스토리지 유틸
   *  ---------------------------
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

  /** ---------------------------
   *  스크롤 유지
   *  ---------------------------
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  /** ---------------------------
   *  방 변경 시: 저장된 내역 복원
   *  ---------------------------
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
   *  메시지 변경 시: 로컬스토리지에 저장
   *  ---------------------------
   */
  useEffect(() => {
    if (messages && Array.isArray(messages)) {
      saveToStorage(currentChatId, messages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  /** ---------------------------
   *  봇 응답 시뮬레이션
   *  ---------------------------
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
   *  사용자 메시지 전송
   *  ---------------------------
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

  const toggleSidebar = () => setIsSidebarOpen((v) => !v);

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Floating Sidebar (왼쪽) */}
      <aside
        className={`
          fixed z-50
          top-6 left-4 md:left-6
          w-[300px] md:w-[340px]
          max-h-[80vh]
          bg-white/80 backdrop-blur-md
          rounded-3xl shadow-2xl border border-gray-200
          overflow-hidden flex flex-col
          transition-all duration-300 ease-out transform
          ${isSidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2 text-green-700 font-semibold">
            <img src={lawkeyLogo} alt="lawkey" className="w-7 h-7" />
            <span>lawkey</span>
          </div>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-black">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* New Chat + Search */}
        <div className="px-5 pt-4 pb-3 space-y-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-green-100 hover:bg-green-200 rounded-xl text-green-800 font-medium flex items-center justify-center space-x-2"
          >
            <PencilIcon className="w-5 h-5" />
            <span>새 상담 시작</span>
          </button>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="상담내역 검색"
              className="w-full py-2 pl-10 pr-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-400 text-sm"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="px-5 pb-4 flex-1 overflow-y-auto">
          <div className="text-sm font-medium text-gray-600 mb-2">상담 기록 {chatRooms.length}건</div>
          {chatRooms.map((room) => (
            <div
              key={room.id}
              onClick={() => navigate(`/counseling/${room.id}`)}
              className="relative p-3 mb-2 rounded-xl bg-white/70 hover:bg-green-50 cursor-pointer transition"
            >
              <p className="font-medium text-gray-800 truncate">{room.title}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {room.tags.map((tag, i) => (
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
        </div>

        {/* User Info */}
        <div className="px-5 py-3 border-t border-gray-100 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="w-7 h-7 text-green-600" />
            <span>사용자 님</span>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40" onClick={toggleSidebar} />
      )}

      {/* 햄버거 버튼 */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-3 left-4 md:top-4 md:left-6 z-[60]
                     p-2 rounded-full bg-white/70 backdrop-blur-md shadow-md
                     text-gray-700 hover:text-green-600 transition"
        >
          <Bars3Icon className="w-6 h-6 md:w-7 md:h-7" />
        </button>
      )}

      {/* Main Chat Section */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-center py-4 border-b border-gray-200 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center space-x-2 text-green-700 font-semibold text-lg">
            <img src={lawkeyLogo} alt="로키" className="w-6 h-6" />
            <span>lawkey</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5">
          {messages.map((message, idx) => (
            <div key={idx}>
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
            </div>
          ))}

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

        {/* Input Box */}
        <footer className="p-4 border-t border-gray-200 bg-white/70 backdrop-blur-sm">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              placeholder="무슨 일이든 편하게 물어보세요!"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow py-3 px-6 rounded-full border border-gray-300 bg-white/70 shadow focus:outline-none pr-12 text-sm"
            />
            <button type="submit" className="absolute right-4 text-gray-500 hover:text-green-600">
              <ArrowRightCircleIcon className="h-6 w-6" />
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-2">
            * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
          </p>
        </footer>
      </main>
    </div>
  );
}

export default CounselingPage;
