// src/pages/MainPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import {lawkeyLogo, enterOn, enterOff, enterLoading} from '../components/icons';

function MainPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    navigate('/counseling', { state: { initialMessage: inputValue } });
  };

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">

      {/* Sidebar */}
      {isSidebarOpen && (
        <aside className="flex flex-col w-full md:w-80 p-6 bg-white/70 backdrop-blur-sm border-r border-gray-200 shadow-sm">
          {/* 닫기 버튼 */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
            onClick={() => setIsSidebarOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* 로고 */}
          <div className="flex items-center space-x-2 mb-6">
            <div className="flex items-center space-x-2 text-lg font-semibold text-green-700">
              <img src={lawkeyLogo} alt="lawkey" className="w-7 h-7" />
              <span>lawkey</span>
            </div>
          </div>

          {/* 새 상담 & 검색 */}
          <div className="flex flex-col space-y-4">
            <button className="w-full py-3 px-4 bg-green-100 hover:bg-green-200 rounded-lg text-green-800 font-medium">
              + 새 상담 시작
            </button>
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="상담내역 검색"
                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-400"
              />
            </div>
          </div>

          {/* 상담 기록 */}
          <div className="mt-8 flex-1 overflow-y-auto text-gray-600 text-sm space-y-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition"
              >
                <div className="truncate">
                  <p className="text-gray-800 font-medium">재산분할 사건 {n}</p>
                  <p className="text-xs text-gray-500">피해자 신분 • 계약법 • 상법</p>
                </div>
              </div>
            ))}
          </div>

          {/* 사용자 정보 */}
          <div className="border-t pt-3 mt-2 text-center text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                👤
              </div>
              <span>사용자 님</span>
            </div>
          </div>
        </aside>
      )}

      {/* Main Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        {/* Header */}
        {!isSidebarOpen && (
            <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-6 left-6 text-gray-600 hover:text-black transition"
            aria-label="사이드바 열기"
            >
            <Bars3Icon className="w-7 h-7 md:w-8 md:h-8" />
            </button>
        )}

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
              <button
                type="submit"
                className="absolute right-4 bottom-3 text-gray-500 hover:text-green-600 transition"
              >
                <img src={enterOn} className="h-6 w-6" />
              </button>
            </form>
          </div>

          {/* Footer 바로 아래 배치 */}
          <footer className="text-center text-xs text-gray-500 mt-4">
            * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
          </footer>
        </section>
      </main>
    </div>
  );
}

export default MainPage;
