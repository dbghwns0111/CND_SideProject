// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import CounselingPage from '../pages/CounselingPage';

// localStorage 키 정의
const ROOMS_STORAGE_KEY = 'lawkeyChatRooms';
const MESSAGES_STORAGE_KEY = 'lawkeyChatMessages';

function App() {
  // 1. [상담 목록] 상태 (기존 코드)
  const [chatRooms, setChatRooms] = useState(() => {
    try {
      const saved = localStorage.getItem(ROOMS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Failed to load chat rooms from localStorage:", error);
      return [];
    }
  });

  // 2. [메시지] 상태 (새로 추가됨: {roomId: [messages...]})
  const [chatMessages, setChatMessages] = useState(() => {
    try {
      const saved = localStorage.getItem(MESSAGES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error("Failed to load chat messages from localStorage:", error);
      return {};
    }
  });

  // 3. 상담 목록 상태 변경 시 저장
  useEffect(() => {
    try {
      localStorage.setItem(ROOMS_STORAGE_KEY, JSON.stringify(chatRooms));
    } catch (error) {
      console.error("Failed to save chat rooms to localStorage:", error);
    }
  }, [chatRooms]);

  // 4. 메시지 상태 변경 시 저장 (새로 추가됨)
  useEffect(() => {
    try {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(chatMessages));
    } catch (error) {
      console.error("Failed to save chat messages to localStorage:", error);
    }
  }, [chatMessages]);

  // 특정 채팅방의 메시지를 업데이트하는 함수 (새로 추가됨)
  const updateChatMessages = (roomId, newMessages) => {
    setChatMessages(prev => ({
      ...prev,
      [roomId]: newMessages
    }));
  };

  // 새로운 채팅방 추가 (기존 로직 유지)
  const handleAddChatRoom = (initialMessage) => {
    const newRoomId = Date.now();
    const newTitle = `상담 기록 ${chatRooms.length + 1}`;
    
    const tagContent = initialMessage.length > 0 
        ? initialMessage.substring(0, Math.min(initialMessage.length, 10)) + '...' 
        : '';

    const newRoom = {
      id: newRoomId,
      title: newTitle,
      tags: initialMessage ? [tagContent] : [], 
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    };
    
    setChatRooms(prevRooms => [newRoom, ...prevRooms]);
    
    // 새 방 생성 시 초기 메시지 상태도 초기화 (빈 배열 또는 초기 메시지 포함)
    updateChatMessages(newRoomId, initialMessage ? [{
      sender: 'user',
      text: initialMessage,
      time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }),
    }] : []);
    
    return newRoomId;
  };

  // 채팅방 삭제 시 메시지도 삭제하도록 수정
  const handleDeleteChatRoom = (id) => {
    setChatRooms(chatRooms.filter(room => room.id !== id));
    // 메시지 상태에서도 해당 ID의 메시지를 삭제
    setChatMessages(prev => {
        const newState = { ...prev };
        delete newState[id];
        return newState;
    });
  };
    
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <MainPage 
              chatRooms={chatRooms} 
              handleAddChatRoom={handleAddChatRoom} 
              handleDeleteChatRoom={handleDeleteChatRoom} 
            />
          } 
        />
        <Route 
          path="/counseling/:chatRoomId" 
          element={
            <CounselingPage 
              chatRooms={chatRooms} 
              handleDeleteChatRoom={handleDeleteChatRoom}
              chatMessages={chatMessages} // 메시지 전체 상태 전달
              updateChatMessages={updateChatMessages} // 메시지 업데이트 함수 전달
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;