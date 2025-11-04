import React, { useRef, useEffect } from "react";
import { MdSend } from "react-icons/md";
import "../styles/chat-input.css";

function ChatInput({
  value = "",
  onChange = () => {},
  onSubmit = () => {},
  placeholder = "무슨 일이든 편하게 물어보세요!",
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
      // call parent onChange with synthetic event shape
      onChange({ target: { value: newValue } });
      // restore caret position after DOM updates
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
              <img src="/enter_off.svg" alt="enter off" className="w-6 h-6" />
            ) : (
              <img src="/enter_on.svg" alt="enter on" className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

export default ChatInput;
