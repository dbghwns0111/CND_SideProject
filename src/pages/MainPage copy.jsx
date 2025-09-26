// src/pages/MainPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

function MainPage() {
  return (
    <div className="flex flex-col md:flex-row w-full min-h-screen">
      {/* Sidebar - Mobile: Hidden, Desktop: visible */}
      <aside className="hidden md:flex flex-col w-full md:w-80 p-6 bg-gray-100 border-r border-gray-200">
        <div className="flex flex-col space-y-4">
            <button className="w-full py-4 px-4 bg-gray-300 rounded-lg text-black font-semibold text-center">
                + 새 상담 시작
            </button>
            <div className="relative">
                {/* 돋보기 아이콘 */}
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                {/* 입력창 */}
                <input
                    type="text"
                    placeholder="상담내역 검색"
                    className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-white focus:outline-none"
                />
            </div>
        </div>
        {/** 상담 보관 안내문 위치는 정중앙 */}
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

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-between p-4 md:p-8">
        {/* Header - Mobile: Hidden, Desktop: visible */}
        <header className="hidden md:flex w-full max-w-5xl justify-between items-center py-4 relative">
        <div className="text-2xl font-bold">LOGO</div>
        <div className="flex space-x-2 relative">
            <button className="py-2 px-4 border border-gray-300 rounded-full text-sm">로그인</button>
            <div className="relative group">
            <button className="py-2 px-4 border border-gray-300 rounded-full text-sm">회원가입</button>
            {/* Promotion Bubble - 위치 조정 */}
            <div className="absolute top-full mt-2 right-0 md:top-full md:mt-2 py-1 px-3 bg-gray-200 rounded-full text-xs font-semibold whitespace-nowrap hidden group-hover:block z-10">
                회원가입 시 상담 10회로 가능!
            </div>
            </div>
        </div>
            </header>

            {/* Mobile Header */}
            <header className="flex md:hidden w-full justify-between items-center py-4 relative">
            <div className="text-lg font-bold">LOGO</div>
            <div className="flex space-x-2 relative">
                <button className="py-2 px-3 border border-gray-300 rounded-full text-xs">로그인</button>
                <div className="relative group">
                <button className="py-2 px-3 border border-gray-300 rounded-full text-xs">회원가입</button>
                {/* Promotion Bubble - 위치 조정 */}
                <div className="absolute top-full mt-2 right-0 py-1 px-3 bg-gray-200 rounded-full text-xs font-semibold whitespace-nowrap hidden group-hover:block z-10">
                    회원가입 시 상담 10회로 가능!
                </div>
                </div>
            </div>
            </header>

        

        {/* Main Section */}
        <section className="flex flex-col items-center text-center my-auto px-4">
          <h1 className="text-lg text-gray-500">당신의 법률비서, LOGO</h1>
          <h2 className="text-2xl md:text-4xl font-bold mt-2 leading-relaxed md:leading-normal">
            누구에게 물어볼까 망설이지 말고
            <br />
            AI 변호사에게
          </h2>
          <div className="relative w-full max-w-2xl mt-8">
            <input
                type="text"
                placeholder="무슨 일이든 편하게 물어보세요!"
                className="w-full py-3 px-6 pr-12 rounded-full border border-gray-300 shadow-md focus:outline-none text-sm md:text-base"
            />
            <Link to="/counseling">
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                    <ArrowRightCircleIcon className="h-5 w-5 md:h-6 md:w-6" />
                </button>
            </Link>
            </div>
        </section>

        {/* Footer/Disclaimer */}
        <footer className="text-center text-xs text-gray-500 mt-auto pt-4 hidden md:block">
          AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
        </footer>
      </main>
    </div>
  );
}

export default MainPage;