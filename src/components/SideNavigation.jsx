import React, { useState } from 'react';
import { MdClose, MdOutlineSearch } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function SideNavigation({ isSidebarOpen, setIsSidebarOpen }) {
  const sidebarWidth = 320;

  const [maxCounselingCount, setMaxCounselingCount] = useState(1); // 최대 상담 개수
  const [counselingCount, setCounselingCount] = useState(0);

  const navigate = useNavigate();
  const handleNewCounseling = () => {
    const hash = Math.random().toString(36).substring(2, 10);
    if (navigate) navigate(`/c/${hash}`);
    else window.location.href = `/c/${hash}`;
  };

  return (
    <aside
      className="flex flex-col border-r border-gray-400 bg-[#EAEAEA] fixed top-0 left-0 h-full z-30"
      style={{
          width: sidebarWidth,
          transform: isSidebarOpen ? 'translateX(0)' : `translateX(-${sidebarWidth}px)`,
          transition: 'transform 0.4s ease',
        }}
    >
      {/* 닫기 버튼 */}
      <div className="flex justify-end p-2 ">
          <button onClick={() => setIsSidebarOpen(false)}>
            <MdClose size={28}/>
          </button>
        </div>

      {/* 사이드바 내용 */}
      <div className="flex flex-col mt-6 mx-4">
        <button className="rounded-lg bg-[#C4C4C4]" onClick={handleNewCounseling}>+ 새 상담 시작</button>
        <div className="relative mt-6">
          <div className="flex items-center w-full bg-white rounded-lg border border-gray-300">
            <MdOutlineSearch className="ml-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="상담내역 검색"
              className="flex-1 py-2 pl-2 rounded-lg bg-transparent focus:outline-none border-none"
            />
          </div>
        </div>
      </div>

      {/* 상담 보관 안내문 */}
      <div className="flex flex-col h-full">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-sm text-gray-500 text-center leading-relaxed">
            <p>비회원 상담은 마지막 대화 이후</p>
            <p><span className="font-bold text-black">30일간 보관</span>되며</p>
            <p>회원님의 개인정보 보호를 위해</p>
            <p><span className="font-bold text-black">자동 삭제</span>됩니다.</p>
          </div>
        </div>
        <div className="text-center text-gray-500 mb-16">
          비회원 상담 기록
          {/* if (counselingCount >= maxCounselingCount), Red */}
          <p className={`text-center text-gray-800 ${counselingCount >= maxCounselingCount ? 'text-red-500' : ''}`}>{counselingCount}/{maxCounselingCount}</p>
        </div>
      </div>
    </aside>
  );
}

export default SideNavigation;