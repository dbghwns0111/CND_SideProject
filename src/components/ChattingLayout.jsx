import React, { useState } from "react";
import SideNavigation from "../components/SideNavigation";
import ChatArea from "../components/ChatArea";

function ChattingLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 사이드바 폭(px)
  const sidebarWidth = isSidebarOpen ? 288 : 64; // Tailwind 기준 w-72 / w-16

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 transition-all duration-300">
      {/* 사이드바 */}
      <SideNavigation
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* 채팅 영역 */}
      <div
        className="transition-all duration-300 flex-1 flex justify-center items-center"
        style={{
          width: `calc(100% - ${sidebarWidth}px)`,
          marginLeft: `${sidebarWidth}px`,
        }}
      >
        <ChatArea />
      </div>
    </div>
  );
}

export default ChattingLayout;
