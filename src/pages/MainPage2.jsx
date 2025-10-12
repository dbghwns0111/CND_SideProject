// src/pages/MainPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

function MainPage() {
    // 사이드바 열림/닫힘 상태
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // 프롬프트 입력
    const [inputValue, setInputValue] = useState('');
    // 페이지 이동을 위한 useNavigate 훅
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '') return;
        // state로 값 전달하면서 CounselingPage로 이동
        navigate('/counseling', { state: { initialMessage: inputValue } });
    };

    return (
        <div className="flex flex-col md:flex-row w-full min-h-screen">

            {/* Sidebar */}
            {isSidebarOpen && (
                <aside className="flex flex-col w-full md:w-80 p-6 bg-gray-100 border-r border-gray-200 relative">
                    {/* 닫기 버튼 (X) */}
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-black"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col space-y-4 mt-8">
                        <button className="w-full py-4 px-4 bg-gray-300 rounded-lg text-black font-semibold text-center">
                        + 새 상담 시작
                        </button>
                        <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="상담내역 검색"
                            className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 bg-white focus:outline-none"
                        />
                        </div>
                    </div>

                    {/** 상담 보관 안내문 */}
                    <div className="flex flex-col h-full">
                        <div className="flex-grow flex items-center justify-center">
                        <div className="text-sm text-gray-500 text-center leading-relaxed">
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
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-between p-4 md:p-8">
                {/* Header */}
                <header className="flex w-full max-w-5xl justify-between items-center py-4 relative">
                <div className="flex items-center space-x-2">
                    {/* 햄버거 버튼 (사이드바 닫힌 경우에만 표시) */}
                    {!isSidebarOpen && (
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        // 햄버거 버튼 위치 조정(왼쪽 끝)
                        className="text-gray-600 hover:text-black"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                    )}
                    {/* 로고 위치 조정(가운데 정렬) */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold">LOGO</div>
                </div>

                <div className="flex space-x-2 relative">
                    <button className="py-2 px-3 md:px-4 border border-gray-300 rounded-full text-xs md:text-sm">로그인</button>
                    <div className="relative group">
                    <button className="py-2 px-3 md:px-4 border border-gray-300 rounded-full text-xs md:text-sm">회원가입</button>
                    <div className="absolute top-full mt-2 right-0 py-1 px-3 bg-gray-200 rounded-full text-xs font-semibold whitespace-nowrap hidden group-hover:block z-10">
                        회원가입 시 상담 10회로 가능!
                    </div>
                    </div>
                </div>
                </header>
                
                

                {/* Main Section */}
                <section className="flex flex-col items-center text-center my-auto px-4">
                    <h1 className="text-2xl md:text-4xl font-bold mt-2 leading-relaxed md:leading-normal">
                        나만의 AI 법률 파트너
                    </h1>
                    <h2 className="text-lg text-gray-500 mt-4 leading-relaxed md:leading-normal">
                        혼자 고민하지 마세요.<br />
                        당신의 이야기를 듣고 가장 든든한 편이 되어 드릴게요
                    </h2>

                    <div className="relative w-full max-w-4xl mt-4 md:mt-8 mx-auto">
                        <form onSubmit={handleSubmit}>
                            {/* 사이드바 상태에 따라 안내문 다르게 표시 */}
                            {isSidebarOpen ? (
                            // ✅ 사이드바 열린 상태 (textarea 2줄로 변경)
                            <textarea
                                placeholder="무슨 일이든 편하게 물어보세요!"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                rows={2} // 2줄 높이
                                className="w-full py-3 px-6 pr-12 rounded-2xl border border-gray-300 shadow-md focus:outline-none text-sm md:text-base resize-none"
                            />
                            ) : (
                            // 사이드바 닫힌 상태
                            <div className="w-full border rounded-2xl shadow-md bg-white text-left text-sm leading-relaxed max-h-50 overflow-y-auto px-6 py-4">
                                <p>1 무슨 일이든 편하게 물어보세요!</p>
                                <p>2 여기는 8줄까지만</p>
                                <p>3 최대로</p>
                                <p>4 노출됩니다.</p>
                                <p>5 8줄 초과일 시,</p>
                                <p>6 스크롤이 노출됩니다</p>
                                <p>7 이건 첫 질문 뿐 아니라</p>
                                <p>8 이후 질문에도 동일하게 적용됩니다</p>
                            </div>
                            )}

                            {/* 전송 버튼 */}
                            <Link
                            to="/counseling"
                            state={{ initialMessage: inputValue }} // 입력값을 상담 페이지로 전달
                            >
                            <button className="absolute right-4 bottom-1 transform -translate-y-1/2 text-gray-500">
                                <ArrowRightCircleIcon className="h-6 w-6 md:h-6 md:w-6" />
                            </button>
                            </Link>
                        </form>
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center text-xs text-gray-500 mt-auto pt-4 hidden md:block">
                AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
                </footer>
            </main>
        </div>
    );
}

export default MainPage;
