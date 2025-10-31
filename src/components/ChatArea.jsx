// src/components/ChatArea.jsx
import React, { useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import { lawkeyLogo } from "../components/icons";

/**
 * ChatArea
 * - 사이드바 열림 시 chatArea와 chatInput이 동일하게 밀리도록 margin-left를 공유
 * - 부모 레이아웃에서 사이드바 너비(px)를 sidebarOffset으로 내려주세요.
 *   예) open: 288, closed: 64
 */
function ChatArea({
  sessionId,
  messages = [],
  isBotTyping = false,
  inputValue,
  onInputChange,
  onSubmit,
  onKeyDown,
  /** 사이드바에 의해 밀려야 하는 좌측 오프셋(px). 부모에서 상태에 맞게 전달 */
  sidebarOffset = 0,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  const dateLabel = new Date().toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });

  return (
    // ✅ 메시지와 프롬프트가 같은 margin-left를 공유하도록 style에 sidebarOffset 적용
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ marginLeft: `${sidebarOffset}px` }}
    >
      {/* 컨텐츠 폭은 동일하게 중앙 정렬 (messages / input 둘 다 max-w-4xl + mx-auto) */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-28">
        {/* 날짜 배지 */}
        <div className="flex justify-center my-4 pt-4">
          <span className="text-xs text-gray-500 px-3 py-1 bg-gray-200 rounded-full font-medium">
            --- {dateLabel} ---
          </span>
        </div>

        {/* 메시지 영역 */}
        <div className="max-w-4xl mx-auto px-0 flex flex-col space-y-5 text-left">
          {messages.map((message, index) => (
            <div key={index}>
              {message.sender === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-[70%] bg-green-500 text-white px-4 py-2 rounded-2xl rounded-br-none shadow-md whitespace-pre-wrap">
                    {message.text}
                  </div>
                </div>
              ) : (
                <div className="flex items-start space-x-3">
                  <img
                    src={lawkeyLogo}
                    alt="lawkey"
                    className="w-10 h-10 rounded-full bg-white shadow"
                  />
                  <div className="max-w-[70%] bg-white/80 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none shadow whitespace-pre-wrap">
                    {message.text}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* 봇 타이핑 UI */}
          {isBotTyping && (
            <div className="flex items-start space-x-3">
              <img
                src={lawkeyLogo}
                alt="lawkey"
                className="w-10 h-10 rounded-full bg-white shadow"
              />
              <div className="max-w-[70%] bg-white/80 text-gray-700 px-4 py-2 rounded-2xl rounded-tl-none shadow animate-pulse">
                로키가 생각 중입니다...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ✅ 프롬프트 영역: fixed → sticky로 바꿔 동일 오프셋/폭을 공유 */}
      <div className="sticky bottom-4 z-20 w-full">
        <div className="max-w-4xl mx-auto px-4">
          <ChatInput
            value={inputValue}
            onChange={onInputChange}
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
          />
          <p className="text-center text-[12px] text-gray-500 mt-2">
            * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률 자문을 대체하지 않습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ChatArea;
