import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import HomePage from '../pages/HomePage';
import ChatPage from '../pages/ChatPage';

import HomeTest from '../pages/HomeTest';


function Router() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<MainLayout />}> 
          <Route path="/" element={<HomePage />} />
          <Route path="/c/:sessionId" element={<ChatPage />} />

          {/* 테스트 페이지 */}
          <Route path="/test" element={<HomeTest />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
