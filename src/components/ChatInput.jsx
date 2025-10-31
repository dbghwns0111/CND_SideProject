import React from 'react';
import { MdSend } from 'react-icons/md';

function ChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  placeholder = "", 
  highlightPlaceholder = "", 
  className = "", 
  inputClassName = "" 
}) {
  const highlighted = placeholder.replace(
    new RegExp(`(${highlightPlaceholder})`, 'gi'),
    '<span class="font-bold text-gray-600">$1</span>'
  );

  return (
    <form onSubmit={onSubmit} className={`relative ${className}`}>
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={
            "w-full py-6 pr-16 pl-6 rounded-full border border-gray-300 shadow-md focus:outline-none text-sm md:text-base relative z-0 text-gray-800 " 
            + inputClassName
          }
          style={{
            background: `
              linear-gradient(0deg,
                rgba(255,255,255, 0.25) 100%
              )`,
            backgroundSize: '400% 400%',
            animation: 'liquidMove 6s ease infinite',
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
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black text-white w-15 h-15 rounded-full flex items-center justify-center hover:bg-gray-800 transition z-20"
          onClick={onSubmit}
          disabled={!value || value.trim() === ""}
        >
          <MdSend size={30} />
        </button>
      </div>
    </form>
  );
}

export default ChatInput;