import React from 'react';
import SideNavigation from '../components/SideNavigation';
import { Outlet } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="relative flex h-screen w-full overflow-hidden">
      <main className="flex flex-col flex-1">
        {/* Header */}
        <header className="relative w-full h-24 flex items-center border-b border-gray-200">
          <div className="text-xl md:text-2xl font-bold fixed left-1/2 transform -translate-x-1/2">
              LOGO
          </div>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex space-x-2 z-40">
            <button className="m-5 !px-10 border border-gray-500 rounded-full">로그인</button>
            <button className="m-5 !px-10 border border-gray-500 rounded-full">회원가입</button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
