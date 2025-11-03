import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsSquareHalf } from "react-icons/bs";
import { HiOutlineDocumentAdd, HiSearch, HiOutlineChat, HiUserCircle, HiOutlineTrash } from "react-icons/hi";
import { CgLogOut } from "react-icons/cg";
import Search from './Search';
import CounselingList from './CounselingList';
import WarningAlert from './alter/WarningAlert';
import { useChatRooms } from '../store/ChatRoomsContext';
import { useAuth } from '../store/hooks/useAuth';

function SideNavigation({ isSidebarOpen, setIsSidebarOpen }) {
 const { isLoggedIn, user, login, logout } = useAuth();

 const [showContent, setShowContent] = useState(isSidebarOpen);
 // detect large viewport (1920px width or wider) so we can set sidebar width to 300px
 const [isLargeViewport, setIsLargeViewport] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1920 : false);
 const [maxCounselingCount, setMaxCounselingCount] = useState(5);
 const { chatRooms, removeChatRoom, clearChatRooms } = useChatRooms();
 const [counselingCount, setCounselingCount] = useState(chatRooms.length);
 const [isAlertOpen, setIsAlertOpen] = useState(false);

 const handleDelete = () => {
  clearChatRooms();
  setIsAlertOpen(false);
 };

 const navigate = useNavigate();

 const handleNewCounseling = () => {
  const hash = Math.random().toString(36).substring(2, 10);
  if (navigate) navigate(`/c/${hash}`);
  else window.location.href = `/c/${hash}`;
 };

 React.useEffect(() => {
  if (isSidebarOpen) {
   const timer = setTimeout(() => setShowContent(true), 300);
   return () => clearTimeout(timer);
  } else {
   setShowContent(false);
  }
 }, [isSidebarOpen]);

 // update isLargeViewport on resize
 useEffect(() => {
  const handleResize = () => setIsLargeViewport(window.innerWidth >= 1920);
  window.addEventListener('resize', handleResize);
  // ensure initial value is correct
  handleResize();
  return () => window.removeEventListener('resize', handleResize);
 }, []);

// keep counter in sync with context
useEffect(() => {
  setCounselingCount(chatRooms.length);
}, [chatRooms]);

 const handleSavePDF = () => {};
 const handleLogin = () => {
  login({ name: '홍길동', email: 'hong@example.com' });
  setIsSidebarOpen(true);
 };
 const handleLogout = () => {
  logout();
  setIsSidebarOpen(true);
 };

  // 사이드바 영역 아무 곳 클릭 시 열기
  const onSidebarClick = () => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  // 외부 클릭으로 사이드바를 닫는 기능 제거: 사이드바는 닫기 버튼으로만 닫히도록 유지합니다.

 // If viewport is >=1920px and sidebar is open, use 300px width per request; otherwise fall back to 16rem
 const sidebarWidth = isSidebarOpen ? (isLargeViewport ? '300px' : '16rem') : '4rem';

  return (
    <aside
      onClick={onSidebarClick}
      className="flex flex-col h-[calc(100vh-4rem)] shadow-2xl rounded-2xl border border-gray-100 fixed z-30 bg-white/80"
   style={{
    width: sidebarWidth,
    top: '2rem',
    left: '2rem',
    bottom: '2rem',
    boxShadow: '0 0.5rem 2rem rgba(0,0,0,0.18)',
    backdropFilter: 'blur(0.375rem)',
    transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
    overflow: 'hidden',
    background: `
     linear-gradient(175deg, rgba(255,255,255,1) 15%, rgba(0,0,0,0) 100%),
     linear-gradient(75deg, rgba(41,204,139, 0.05) 100%)
    `,
   }}
  >
      {isSidebarOpen ? (
        <>
          {/* 상단 로고 및 닫기 버튼 */}
          <div className="flex items-center justify-between p-[1rem]">
            <button
              onClick={() => {
                navigate('/');
                setIsSidebarOpen(false);
              }}
              className="p-0 m-0"
              aria-label="홈으로 이동"
            >
              <img src="/full_logo.svg" alt="fullLogo" className="w-[8rem] cursor-pointer" />
            </button>
            <button onClick={() => setIsSidebarOpen(false)}>
              <BsSquareHalf size="1.5rem" color="#8F8F8F" style={{ transform: 'rotate(180deg)' }} />
            </button>
          </div>

     {showContent && (
      <div className="flex flex-col flex-1 p-[1rem]">
       {/* 새 상담 + 검색 */}
       <div className="flex flex-col mt-[1rem] mb-[1rem]">
        <button
         className="flex items-center mb-[1rem] hover:bg-gray-200 transition"
         onClick={handleNewCounseling}
        >
         <HiOutlineDocumentAdd size="2.25rem" className="mr-[0.5rem]" />
         <span className="font-bold text-[0.875rem]">새 상담 시작</span>
        </button>
        <div className="flex items-center mb-[1rem]">
          <Search placeholder="상담내역 검색" />
        </div>
       </div>

       {/* 상담 기록 영역 */}
       <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-row justify-between mb-[1rem] items-center">
         <div className='text-left'>
          <span className="text-gray-600 font-bold mr-[0.75rem] text-[0.875rem]">상담 기록</span>
          <CounselingCounter
           counselingCount={counselingCount}
           maxCounselingCount={maxCounselingCount}
          />
         </div>

         <button
          className="ml-[0.5rem] text-gray-400 hover:text-gray-600"
          title="reset counseling history"
          onClick={() => setIsAlertOpen(true)}
         >
          <HiOutlineTrash size="1.75rem" />
         </button>
        </div>

  <div className="flex-1 overflow-y-auto">
   <CounselingList
    data={chatRooms}
    onDelete={removeChatRoom}
   />
  </div>

        <div className="flex flex-col border-t border-gray-200 pt-[1rem] gap-[0.5rem] min-h-[5.5rem]">
         {isLoggedIn ? (
          <button className="flex items-center gap-[0.75rem]" onClick={handleLogout}>
           <HiUserCircle size="2.625rem" color="#29CC8B" />
           <span className="font-bold text-gray-700">{user?.name} 님</span>
          </button>
         ) : (
          <div className="flex flex-row justify-center mt-auto">
           {/* 통합 버튼: 클릭 시 로그인 처리 (필요시 별도 라우트로 변경 가능) */}
           <div className="relative group">
            <button
             onClick={handleLogin}
             className="px-[1rem] py-[0.5rem] rounded-full bg-[#29CC8B] text-white w-[10rem] font-bold"
             aria-describedby="signupTooltip"
            >
             <span className="text-white text-[0.875rem] font-bold">로그인 / 회원가입</span>
            </button>

            {/* 툴팁(호버/포커스 시 표시) */}
            <div
             id="signupTooltip"
             role="status"
             className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity pointer-events-none"
            >
             <div className="bg-gray-800 text-white text-xs rounded px-3 py-1 whitespace-nowrap shadow">
              회원가입 시 상담 10배로 가능!
             </div>
             <div className="w-2 h-2 bg-gray-800 rotate-45 mt-[-6px] mx-auto" />
            </div>
           </div>
          </div>
         )}
        </div>
       </div>
      </div>
     )}
    </>
  ) : (
   // 닫혀있을 때에도 열린 상태의 상단 여백과 동일하게 맞추기 위해 padding-top을 사용
   <div className="flex flex-col justify-between items-center h-full pt-[1rem]">
     <div className="flex flex-col items-center gap-[2rem]">
      <button onClick={() => { setIsSidebarOpen(true); navigate('/'); }}>
       <img src="/logo_icon.svg" alt="logoIcon" />
      </button>
      <button onClick={() => setIsSidebarOpen(true)}>
       <HiOutlineDocumentAdd size="2.25rem" />
      </button>
      <button onClick={() => setIsSidebarOpen(true)}>
       <HiSearch size="2.25rem" />
      </button>
      <button onClick={() => setIsSidebarOpen(true)}>
       <HiOutlineChat size="2.25rem" />
       <CounselingCounter
        counselingCount={counselingCount}
        maxCounselingCount={maxCounselingCount}
       />
      </button>
     </div>

     <div className="mb-[2rem]">
      {isLoggedIn ? (
       <HiUserCircle size="2.25rem" color="#29CC8B" />
      ) : (
       <div className="flex items-center justify-center w-[2.75rem] h-[2.75rem] p-[0.5rem] rounded-full bg-[#29CC8B]">
        <CgLogOut
         size="2.25rem"
         className="text-gray-700"
         style={{ transform: 'rotate(180deg)' }}
         color="white"
        />
       </div>
      )}
     </div>
    </div>
   )}

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
   isLoggedIn={isLoggedIn}
   onConfirm={handleDelete}
   onSavePDF={handleSavePDF}
   user={user}
  />
  
  </aside>
 );
}

const CounselingCounter = ({ counselingCount, maxCounselingCount }) => {
 const isExceeded = counselingCount >= maxCounselingCount;

 return (
  <span className="font-bold">
   <span className={isExceeded ? 'text-red-500' : 'text-[#29CC8B]'}>
    {counselingCount}
   </span>
   <span className="mx-[0.25rem]">/</span>
   <span className={isExceeded ? 'text-red-500' : 'text-gray-900'}>
    {maxCounselingCount}
   </span>
  </span>
 );
};

export default SideNavigation;