import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { BsSquareHalf } from "react-icons/bs";
import {
  HiOutlineDocumentAdd,
  HiSearch,
  HiOutlineChat,
  HiUserCircle,
  HiOutlineTrash,
} from "react-icons/hi";
import { CgLogOut } from "react-icons/cg";
import Search from "./Search";
import CounselingList from "./CounselingList";
import WarningAlert from "./alter/WarningAlert";
import { useChatRooms } from "../store/ChatRoomsContext";
import { useAuth } from "../store/hooks/useAuth";
import "../styles/side-navigation.css";

function SideNavigation({ isSidebarOpen, setIsSidebarOpen }) {
  const { isLoggedIn, user, login, logout } = useAuth();

  const [showContent, setShowContent] = useState(isSidebarOpen);
  // detect large viewport (1920px width or wider) so we can set sidebar width to 300px
  const [isLargeViewport, setIsLargeViewport] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1920 : false,
  );
  const [maxCounselingCount, setMaxCounselingCount] = useState(5);
  const { chatRooms, removeChatRoom, clearChatRooms } = useChatRooms();
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [showMaxRoomsLimit, setShowMaxRoomsLimit] = useState(false);
  const [counselingCount, setCounselingCount] = useState(chatRooms.length);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDelete = () => {
    // Deprecated: use handleConfirmDelete via modal
    clearChatRooms();
    setIsAlertOpen(false);
    // After clearing all rooms, navigate to home
    navigate("/");
  };

  const handleConfirmDelete = () => {
    // If a specific room is pending deletion, delete it; otherwise clear all
    if (pendingDeleteId) {
      removeChatRoom(pendingDeleteId);
      // if deleting current open room, navigate home
      if (pendingDeleteId === currentRoomId) {
        navigate("/");
      }
      setPendingDeleteId(null);
    } else {
      clearChatRooms();
      navigate("/");
    }
    setIsAlertOpen(false);
  };

  const navigate = useNavigate();
  const location = useLocation();
  const pathMatch = location.pathname.match(/^\/c\/([^/]+)/);
  const currentRoomId = pathMatch ? pathMatch[1] : null;

  const handleNewCounseling = () => {
    // Prevent creating more than 5 chat rooms
    if (chatRooms.length >= 5) {
      setShowMaxRoomsLimit(true);
      return;
    }
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
    window.addEventListener("resize", handleResize);
    // ensure initial value is correct
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // keep counter in sync with context
  useEffect(() => {
    setCounselingCount(chatRooms.length);
  }, [chatRooms]);

  const handleSavePDF = () => {};
  const handleLogin = () => {
    // Navigate to auth page instead of performing auto-login
    navigate("/auth");
    setIsSidebarOpen(false);
  };
  const handleLogout = () => {
    logout();
    setIsSidebarOpen(true);
  };

  // 사이드바 영역 아무 곳 클릭 시 열기
  const onSidebarClick = () => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  // If viewport is >=1920px and sidebar is open, use 300px width per request; otherwise fall back to 16rem
  const sidebarWidth = isSidebarOpen
    ? isLargeViewport
      ? "300px"
      : "16rem"
    : "4rem";

  return (
    <aside
      onClick={onSidebarClick}
      className="flex flex-col h-[calc(100vh-4rem)] shadow-2xl rounded-2xl border border-gray-100 fixed z-30 bg-white/80"
      style={{
        width: sidebarWidth,
        top: "2rem",
        left: "2rem",
        bottom: "2rem",
        boxShadow: "0 0.5rem 2rem rgba(0,0,0,0.18)",
        backdropFilter: "blur(0.375rem)",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        overflow: "hidden",
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
                navigate("/");
                setIsSidebarOpen(false);
              }}
              className="p-0 m-0"
              aria-label="홈으로 이동"
            >
              <img
                src="/full_logo.svg"
                alt="fullLogo"
                className="w-[8rem] cursor-pointer"
              />
            </button>
            <button onClick={() => setIsSidebarOpen(false)}>
              <BsSquareHalf
                size="1.5rem"
                color="#8F8F8F"
                style={{ transform: "rotate(180deg)" }}
              />
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
                  <HiOutlineDocumentAdd
                    size="2.25rem"
                    className="mr-[0.5rem]"
                  />
                  <span className="font-bold text-[0.875rem]">
                    새 상담 시작
                  </span>
                </button>
                <div className="flex items-center mb-[1rem]">
                  <Search placeholder="상담내역 검색" />
                </div>
              </div>

              {/* 상담 기록 영역 */}
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex flex-row justify-between mb-[1rem] items-center">
                  <div className="text-left">
                    <span className="text-gray-600 font-bold mr-[0.75rem] text-[0.875rem]">
                      상담 기록
                    </span>
                    <CounselingCounter
                      counselingCount={counselingCount}
                      maxCounselingCount={maxCounselingCount}
                    />
                  </div>

                  <button
                    className="ml-[0.5rem] text-gray-400 hover:text-gray-600"
                    title="reset counseling history"
                    onClick={() => {
                      setPendingDeleteId(null);
                      setIsAlertOpen(true);
                    }}
                  >
                    <HiOutlineTrash size="1.75rem" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto">
                  <CounselingList
                    data={chatRooms}
                    onDelete={(id) => {
                      // open confirm modal for single delete
                      setPendingDeleteId(id);
                      setIsAlertOpen(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        // 닫혀있을 때에도 열린 상태의 상단 여백과 동일하게 맞추기 위해 padding-top을 사용
        <div className="flex flex-col justify-between items-center h-full pt-[1rem]">
          <div className="flex flex-col items-center gap-[2rem]">
            <button
              onClick={() => {
                setIsSidebarOpen(true);
                navigate("/");
              }}
            >
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

          {/* 빈 플레이스홀더 제거; 아래에 통합된 사용자 영역을 렌더함 */}
        </div>
      )}

      {/* 열림/닫힘 상태에서도 동일한 높이에 표시되도록 사용자 영역 위치 지정 */}
      <div
        style={{
          position: "absolute",
          left: "1rem",
          right: "1rem",
          bottom: "1rem",
        }}
      >
        {isLoggedIn ? (
          <button
            className="flex items-center gap-[0.75rem] justify-center w-full"
            onClick={handleLogout}
          >
            <HiUserCircle
              size={isSidebarOpen ? "2.625rem" : "2.25rem"}
              className="text-lawkey-green"
            />
            {isSidebarOpen && (
              <span className="font-bold text-gray-700">{user?.name} 님</span>
            )}
          </button>
        ) : isSidebarOpen ? (
          <div className="flex flex-row justify-center">
            <div className="relative group">
              <button
                onClick={handleLogin}
                className="px-[1rem] py-[0.5rem] rounded-full sn-login-btn w-[10rem] font-bold"
                aria-describedby="signupTooltip"
              >
                <span className="text-white text-[0.875rem] font-bold">
                  로그인 / 회원가입
                </span>
              </button>

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
        ) : (
          <div className="flex items-center justify-center w-[2.75rem] h-[2.75rem] p-[0.5rem] rounded-full bg-[#29CC8B] mx-auto">
            <CgLogOut
              size="2.25rem"
              className="text-white"
              style={{ transform: "rotate(180deg)" }}
            />
          </div>
        )}
      </div>

      <WarningAlert
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          setPendingDeleteId(null);
        }}
        title={
          pendingDeleteId
            ? "상담을 삭제하시겠습니까?"
            : "전체 상담내역을 삭제하시겠습니까?"
        }
        description={
          pendingDeleteId
            ? isLoggedIn
              ? `선택한 상담을 삭제하면 복구할 수 없습니다.`
              : `선택한 상담을 삭제하면 복구할 수 없습니다.`
            : isLoggedIn
              ? `전체 상담내역을 삭제하면 복구할 수 없습니다. 필요한 경우, 삭제 전에 주요 상담 내역을 PDF로 저장하세요.`
              : `전체 상담내역을 삭제하면 복구할 수 없습니다.`
        }
        isLoggedIn={isLoggedIn}
        onConfirm={handleConfirmDelete}
        onSavePDF={handleSavePDF}
        user={user}
      />
      <WarningAlert
        isOpen={showMaxRoomsLimit}
        onClose={() => setShowMaxRoomsLimit(false)}
        title="채팅방 생성 제한"
        description={`채팅방은 최대 ${maxCounselingCount}개까지 생성할 수 있습니다. 기존 채팅방을 삭제한 후 다시 시도하세요.`}
        buttons={[
          {
            label: "확인",
            onClick: () => setShowMaxRoomsLimit(false),
            className: "bg-[#29CC8B] text-white",
          },
        ]}
      />
    </aside>
  );
}

const CounselingCounter = ({ counselingCount, maxCounselingCount }) => {
  const isExceeded = counselingCount >= maxCounselingCount;

  return (
    <span className="font-bold">
      <span className={isExceeded ? "text-red-500" : "text-[#29CC8B]"}>
        {counselingCount}
      </span>
      <span className="mx-[0.25rem]">/</span>
      <span className={isExceeded ? "text-red-500" : "text-gray-900"}>
        {maxCounselingCount}
      </span>
    </span>
  );
};

export default SideNavigation;
