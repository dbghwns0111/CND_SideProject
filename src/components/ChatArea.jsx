import React from 'react';
import ChatInput from '../components/ChatInput';

function ChatArea({ inputValue, onInputChange, onSubmit }) {
  return (
    <div className="md:h-[90vh] bg-white rounded-2xl shadow-lg mt-4 overflow-y-auto transition-opacity duration-500 relative">
      <div className="p-4 text-sm text-gray-500 text-center border-b">
        {new Date().toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </div>
      <div className="p-4 flex flex-col space-y-4 text-left">
        <div className="self-end bg-blue-500 text-white px-4 py-2 rounded-2xl rounded-br-none max-w-xs">
          {inputValue}
        </div>
        <div className="flex items-start space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full text-xs font-bold">
            LOGO
          </div>
          <div className="bg-gray-200 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs">
            안녕하세요! 어떤 법률 상담이 필요하신가요?
          </div>
        </div>
      </div>
      {/* 입력창 맨 아래, footer 바로 위에 고정 */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-white border-t border-gray-200">
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSubmit={onSubmit}
          highlightPlaceHolder={
            <span>
              <span className="font-bold">상담 내용을 입력</span>해 주세요
            </span>
          }
        />
      </div>
    </div>
  );
}

export default ChatArea;
