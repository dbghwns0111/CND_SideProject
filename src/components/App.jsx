// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CounselingPage from '../pages/CounselingPage';
import MainPage from '../pages/MainPage'; // MainPage 컴포넌트 import
import ProfilePage from '../pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} /> {/* 메인 페이지 경로*/}
        <Route path="/counseling" element={<CounselingPage />} /> {/* 상담 페이지 경로 */}
        <Route path="/profile" element={<ProfilePage />} /> {/* 프로필 페이지 경로 */}
      </Routes>
    </Router>
  );
}

export default App;