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
    </form>
  );
}

export default ChatInput;
