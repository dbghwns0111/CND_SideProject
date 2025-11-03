import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChatRooms } from '../store/ChatRoomsContext';
import ChatInput from '../components/ChatInput';

function TestCreateRoom() {
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const { chatRooms, addChatRoom } = useChatRooms();

  const handleSubmit = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const text = value.trim();
    if (!text) return;

    if (chatRooms.length >= 5) {
      alert('채팅방은 최대 5개까지만 생성할 수 있습니다. 기존 채팅방을 삭제하세요.');
      return;
    }

    // Generate a fake session id and add locally
    const sessionId = Math.random().toString(36).substring(2, 10);
    addChatRoom({ id: sessionId, text });
    setValue('');
    navigate(`/c/${sessionId}`);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen px-6 md:px-10">
      <div className="flex flex-col items-center w-full max-w-2xl pt-16 pb-24">
        <h2 className="text-2xl font-bold mb-4">테스트: 백엔드 없이 채팅방 생성</h2>
        <p className="text-sm text-gray-600 mb-6">여기에 입력하면(엔터) 로컬로 채팅방이 생성되고 /c/:id로 이동합니다.</p>

        <div className="w-full">
          <ChatInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onSubmit={handleSubmit}
            placeholder="테스트 메시지를 입력하세요"
          />
        </div>
      </div>
    </div>
  );
}

export default TestCreateRoom;
