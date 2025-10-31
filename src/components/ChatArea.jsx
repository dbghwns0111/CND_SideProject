import React, { useState } from 'react';
import ChatInput from '../components/ChatInput';
import { useChatApi } from '../hooks/useChatApi'; // ✅ 추가

function ChatArea({ sessionId }) {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '안녕하세요! 어떤 법률 상담이 필요하신가요?' }
  ]);

  const { sendStep1, loading, error } = useChatApi(); // ✅ Hook 연결

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    // 1️⃣ 유저 메시지 추가
    const userMsg = { sender: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    // 2️⃣ API 호출
    const res = await sendStep1(inputValue);

    // 3️⃣ 응답 처리
    if (res?.reply) {
      setMessages(prev => [...prev, { sender: 'ai', text: res.reply }]);
    } else {
      setMessages(prev => [...prev, { sender: 'ai', text: '서버에서 응답을 받지 못했습니다.' }]);
    }
  };

  return (
    <div className="absolute inset-0 flex justify-center pointer-events-none">
      <div className="w-full max-w-5xl flex flex-col h-full pointer-events-auto bg-white/0">
        <div className="p-4 text-sm text-gray-500 text-center border-b border-gray-200/20 flex-shrink-0">
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        {/* 메시지 리스트 */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
          {messages.map((msg, idx) => (
            msg.sender === 'user' ? (
              <div key={idx} className="self-end bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-xs break-words">
                {msg.text}
              </div>
            ) : (
              <div key={idx} className="flex items-start space-x-2 self-start">
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-xs font-bold">
                  LOGO
                </div>
                <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs break-words">
                  {msg.text}
                </div>
              </div>
            )
          ))}

          {/* 로딩 상태 */}
          {loading && (
            <div className="self-start bg-gray-200 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs text-gray-500 italic">
              AI가 생각 중이에요...
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="text-center text-red-500 text-sm mt-2">
              ⚠️ 오류가 발생했습니다: {error.message}
            </div>
          )}
        </div>

        {/* 입력창 고정 */}
        <div className="p-4 border-t border-gray-200/20 flex-shrink-0 bg-white/0">
          <ChatInput
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onSubmit={handleSubmit}
            placeholder="무슨 일이든 편하게 물어보세요!"
            highlightPlaceholder="법률 상담"
          />
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
