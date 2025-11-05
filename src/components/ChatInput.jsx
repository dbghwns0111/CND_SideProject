<<<<<<< HEAD
import React, { useRef, useEffect } from "react";
import { MdSend } from "react-icons/md";
import "../styles/components/chat-input.css";

function ChatInput({
  value = "",
  onChange = () => {},
  onSubmit = () => {},
  placeholder = "지금 어떤 일이 고민이신가요?",
  highlightPlaceholder = "",
  className = "",
  inputClassName = "",
}) {
  const textareaRef = useRef(null);

  // 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // 최대 높이 200px
    }
  }, [value]);

  const handleKeyDown = (e) => {
    // Shift+Enter → 줄바꿈 (커서 위치 보존)
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = value.slice(0, start) + "\n" + value.slice(end);
      // 부모 콜백에 전달할 때는 일반적인 이벤트 형태({ target: { value } })로 호출함
      onChange({ target: { value: newValue } });
      // DOM 업데이트 후 캐럿(커서) 위치 복원
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
        // trigger resize
        textarea.style.height = "auto";
        textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
      });
      return;
    }

    // Enter → 전송
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className={`relative w-full ${className}`}>
      <div className="relative w-full flex justify-center">
        <div className="chat-input-wrapper relative w-full">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={2}
            className={
              "chat-textarea w-full py-4 pr-24 pl-6 rounded-2xl border border-gray-300 shadow-md focus:outline-none text-sm md:text-base " +
              inputClassName
            }
          />
          <button
            type="submit"
            className="absolute right-3 bottom-3 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition z-20"
            disabled={!value || value.trim() === ""}
          >
            {!value || value.trim() === "" ? (
              <img src="/icons/enter_off.svg" alt="enter off" className="w-6 h-6" />
            ) : (
              <img src="/icons/enter_on.svg" alt="enter on" className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
=======
import React, { useCallback } from "react";
import { enterOn, enterOff } from "../components/icons";

/**
 * CounselingPage 스타일의 입력 컴포넌트
 * - textarea + 전송(Enter 아이콘)
 * - Enter: 전송 / Shift+Enter: 줄바꿈
 * props:
 *  - value: string
 *  - onChange: (e) => void
 *  - onSubmit: (e) => void
 *  - placeholder?: string
 *  - className?: string        // 바깥 래퍼
 *  - textareaClassName?: string // textarea 커스터마이즈
 */
function ChatInput({
  value,
  onChange,
  onSubmit,
  placeholder = "무슨 일이든 편하게 물어보세요!",
  className = "",
  textareaClassName = "",
}) {
  const canSend = !!value?.trim();

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (canSend) onSubmit?.(e);
      }
    },
    [canSend, onSubmit]
  );

  return (
    <form onSubmit={onSubmit} className={`relative mx-auto ${className}`}>
      <textarea
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        className={
          "w-full bg-white/10 py-3 px-6 pr-12 rounded-2xl border border-gray-300 shadow-md " +
          "backdrop-blur-sm focus:outline-none text-sm resize-none " +
          textareaClassName
        }
      />
      <button
        type="submit"
        aria-label="전송"
        disabled={!canSend}
        className={
          "absolute right-4 bottom-3 transition " +
          (canSend ? "text-green-600 hover:text-green-700" : "text-gray-400 cursor-not-allowed")
        }
      >
        <img
          src={canSend ? enterOn : enterOff}
          alt={canSend ? "전송" : "전송 불가"}
          className="h-6 w-6"
        />
      </button>
>>>>>>> 923e708aa6b9574452fd6aed39795d6c8958e266
    </form>
  );
}

export default ChatInput;
