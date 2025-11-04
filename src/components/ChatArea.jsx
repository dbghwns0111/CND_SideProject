import React from "react";
import ChatInput from "../components/ChatInput";

// Presentational ChatArea: receives messages and handlers from parent (ChatPage)
function ChatArea({
  sessionId,
  messages = [],
  isBotTyping = false,
  options = null,
  nextStep = null,

  inputValue = "",
  onInputChange = () => {},
  onSubmit = () => {},
  onKeyDown = () => {},

  onSelectOptions = () => {},
  onSelectSeverity = () => {},
  onSubmitDetail = () => {},
  onSelectAction = () => {},
}) {
  return (
    <div className="absolute inset-0 flex justify-center pointer-events-none">
      <div className="w-full flex flex-col h-full pointer-events-auto bg-white/0">
        <div className="chat-content-wrapper w-full flex flex-col h-full">
          <div className="p-4 text-sm text-gray-500 text-center border-b border-gray-200/20 flex-shrink-0">
            {new Date().toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>

          {/* 메시지 리스트 */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
            {Array.isArray(messages) &&
              messages.map((msg, idx) =>
                msg.sender === "user" ? (
                  <div
                    key={idx}
                    className="self-end bg-[#E6F8EE] text-gray-900 px-4 py-2 rounded-2xl rounded-br-none max-w-xs break-words"
                  >
                    {msg.text}
                  </div>
                ) : (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 self-start"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-transparent overflow-hidden">
                      <img
                        src="/logo_icon.svg"
                        alt="lawkey"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="max-w-prose break-words text-gray-800 leading-relaxed">
                      <div className="text-sm font-semibold text-gray-800 mb-2">
                        로키
                      </div>
                      <div>{msg.text}</div>
                    </div>
                  </div>
                ),
              )}

            {/* 로딩 상태 */}
            {isBotTyping && (
              <div className="self-start bg-gray-200 px-4 py-2 rounded-2xl rounded-tl-none max-w-xs text-gray-500 italic">
                AI가 생각 중이에요...
              </div>
            )}
          </div>

          {/* 입력창 고정 */}
          <div className="p-4 flex-shrink-0 bg-white/0">
            <ChatInput
              value={inputValue}
              onChange={onInputChange}
              onSubmit={onSubmit}
              onKeyDown={onKeyDown}
              placeholder="무슨 일이든 편하게 물어보세요!"
              highlightPlaceholder="법률 상담"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
