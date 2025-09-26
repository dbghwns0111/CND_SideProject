// src/pages/CounselingPage.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

function CounselingPage() {
  const location = useLocation();
  const initialMessage = location.state?.initialMessage || ''; // MainPage에서 전달된 초기 메시지
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [typingDots, setTypingDots] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 사이드바 상태 추가

  // 점 세 개가 실시간으로 움직이는 효과를 위한 useEffect
  useEffect(() => {
    let interval;
    if (isBotTyping) {
      interval = setInterval(() => {
        setTypingDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
      }, 500);
    } else {
      clearInterval(interval);
      setTypingDots('');
    }
    return () => clearInterval(interval);
  }, [isBotTyping]);

  // 초기 메시지를 첫 번째 사용자 메시지로 설정
  useEffect(() => {
    if (initialMessage.trim() !== '') {
      const userMessage = {
        sender: 'user',
        text: initialMessage,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      setMessages([userMessage]);

      // 봇 응답 트리거
      setIsBotTyping(true);
      setTimeout(() => {
        setIsBotTyping(false);
        const botResponse = {
          sender: 'bot',
          text: '죄송합니다. 아직 답변을 준비 중입니다.',
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
        };
        setMessages(prevMessages => [...prevMessages, botResponse]);
      }, 3000);
    }
  }, [initialMessage]);

  // 메시지 전송 핸들러
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newUserMessage = {
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
    };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputMessage('');

    setIsBotTyping(true);
    setTimeout(() => {
      setIsBotTyping(false);
      const botResponse = {
        sender: 'bot',
        text: '죄송합니다. 아직 답변을 준비 중입니다.',
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
      };
      setMessages(prevMessages => [...prevMessages, botResponse]);
    }, 3000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Sidebar - Overlay와 함께 토글 */}
      <div className={`fixed inset-y-0 left-0 w-80 flex flex-col bg-gray-100 border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* 상단 닫기 버튼 및 섹션 */}
      <div className="flex justify-end p-4">
        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-grow p-6 flex flex-col">
        <div className="flex flex-col space-y-4">
          <button className="w-full py-4 px-4 bg-gray-300 rounded-lg text-black font-semibold text-center">
            + 새 상담 시작
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="상담내역 검색"
              className="w-full py-2 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none pl-10"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        {/* Sidebar - Overlay와 함께 토글 */}
<div
  className={`fixed inset-y-0 left-0 w-80 flex flex-col bg-gray-100 border-r border-gray-200 z-50 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
>
  {/* 상단 닫기 버튼 및 섹션 */}
  <div className="flex justify-end p-4">
    <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

  <div className="flex-grow p-6 flex flex-col">
    <div className="flex flex-col space-y-4">
      <button className="w-full py-4 px-4 bg-gray-300 rounded-lg text-black font-semibold text-center">
        + 새 상담 시작
      </button>
      <div className="relative">
        <input
          type="text"
          placeholder="상담내역 검색"
          className="w-full py-2 px-4 rounded-lg border border-gray-300 bg-white focus:outline-none pl-10"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
    <div className="flex flex-col h-full">
            <div className="flex-grow flex items-center justify-center">
                <div className="text-sm text-gray-500 text-center leading-relaxed">
                    {/* 텍스트 세로 간격을 띄우기*/}
                    <p>상담은 마지막 대화 이후</p>
                    <p><span className="font-bold text-black">30일간 보관</span>되며</p>
                    <p>회원님의 개인정보 보호를 위해</p>
                    <p>자동 삭제됩니다.</p>
                </div>
            </div>

            <div className="text-center text-gray-500 py-2 border-t">
                비회원 상담 기록<br />0/1
            </div>
        </div>
  </div>
</div>
{isSidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40"
    onClick={toggleSidebar}
  ></div>
)}
      </div>
    </div>
{isSidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 z-40"
    onClick={toggleSidebar}
  ></div>
)}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main Content */}
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-white shadow-sm border-b border-gray-200">
          <div className="text-gray-500 cursor-pointer" onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>
          <div className="text-xl font-bold">LOGO</div>
          <div className="rounded-full bg-gray-300 w-8 h-8 cursor-pointer"></div>
        </header>

        {/* Main Chat Area */}
        <main className="flex-1 p-4 overflow-y-auto">
          <div className="flex justify-center my-4 text-sm text-gray-400">
            <div className="py-1 px-3 bg-gray-200 rounded-full">
              {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div key={index}>
                {message.sender === 'user' ? (
                  <div className="flex justify-end">
                    <div className="flex items-end space-x-2">
                      <span className="text-xs text-gray-500 self-end">{message.time}</span>
                      <div className="max-w-xs md:max-w-md bg-blue-500 text-white p-3 rounded-xl rounded-br-none shadow-md">
                        {message.text}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-xs font-bold">
                        LOGO
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="max-w-xs md:max-w-md bg-gray-200 text-black p-3 rounded-xl rounded-tl-none shadow-md">
                        {message.text}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isBotTyping && (
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full text-xs font-bold">
                    LOGO
                  </div>
                </div>
                <div className="flex-grow">
                  <div className="max-w-xs md:max-w-md bg-gray-200 text-black p-3 rounded-xl rounded-tl-none shadow-md">
                    당신의 법률비서가 조회하거나 하나하나 확인 중입니다{typingDots}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
        
        {/* Footer */}
        <footer className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              type="text"
              placeholder="무슨 일이든 편하게 물어보세요!"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-grow py-3 px-6 rounded-full border border-gray-300 shadow-md focus:outline-none pr-12 text-sm"
            />
            <button type="submit" className="absolute right-4 text-gray-500">
              <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                <ArrowRightCircleIcon className="h-5 w-5 md:h-6 md:w-6" />
              </button>   
            </button>
          </form>
          <div className="mt-2 text-center text-xs text-gray-500">
            AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
          </div>
        </footer>
      </div>
    </div>
  );
}

export default CounselingPage;