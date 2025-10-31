import React, { useRef, useEffect } from "react";
import { MdSend } from "react-icons/md";

function ChatInput({
  value = "",
  onChange = () => {},
  onSubmit = () => {},
  placeholder = "",
  highlightPlaceholder = "",
  className = "",
  inputClassName = ""
}) {
  const textareaRef = useRef(null);

  const highlighted = placeholder.replace(
    new RegExp(`(${highlightPlaceholder})`, "gi"),
    '<span class="font-bold text-gray-600">$1</span>'
  );

  // 자동 높이 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`; // 최대 높이 200px
    }
  }, [value]);

  const handleKeyDown = (e) => {
    // Shift+Enter → 줄바꿈
    if (e.key === "Enter" && e.shiftKey) return;

    // Enter → 전송
    if (e.key === "Enter") {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <form onSubmit={onSubmit} className={`relative w-full ${className}`}>
      <div className="relative w-full">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          className={
            "w-full py-4 pr-16 pl-6 rounded-full border border-gray-300 shadow-md focus:outline-none text-sm md:text-base resize-none overflow-y-auto " +
            inputClassName
          }
          style={{
            maxHeight: "200px",
            background: `
              linear-gradient(0deg,
                rgba(255,255,255, 0.25) 100%
              )`,
            backgroundSize: "400% 400%",
            animation: "liquidMove 6s ease infinite",
          }}
        />
        {value === "" && (
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm md:text-base z-10"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )}
        <button
          type="submit"
          className="absolute right-3 bottom-3 bg-black text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-gray-800 transition z-20"
          disabled={!value || value.trim() === ""}
        >
          <MdSend size={28} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;