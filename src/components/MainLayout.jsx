import React, { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavigation from './SideNavigation';
import { ChatRoomsProvider } from '../store/ChatRoomsContext';

function MainLayout({ chatRooms = [], handleAddChatRoom, handleDeleteChatRoom }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = useCallback(() => setIsSidebarOpen(v => !v), []);

  const SIDEBAR_WIDTH = 288;

  return (
    <div className="relative flex w-full min-h-screen bg-gradient-to-b from-white via-green-50 to-green-100 overflow-hidden">
      <ChatRoomsProvider>
        <SideNavigation
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        <main
          className={'flex-1 flex flex-col min-h-screen transition-all duration-300 relative'}
          style={{ marginLeft: isSidebarOpen ? `${SIDEBAR_WIDTH}px` : '0px' }}
        >
          <Outlet />
        </main>
      </ChatRoomsProvider>
    </div>
  );
}

export default MainLayout;
