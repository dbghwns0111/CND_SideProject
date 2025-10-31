import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

function WarningAlert({ isOpen, onClose, title, description, buttons = [] }) {
  const alertRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // ESC 키로 닫기
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKeyDown);

    // 첫 버튼으로 포커스 이동
    const firstButton = alertRef.current?.querySelector('button');
    firstButton?.focus();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      ref={alertRef}
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    >
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl flex flex-col gap-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#C43939] text-[#C43939] font-bold text-2xl">
            !
          </div>
        </div>
        {/* Title */}
        <h2 className="text-center text-lg font-extrabold">{title}</h2>
        {/* Description */}
        <p className="text-center text-sm text-gray-600">{description}</p>
        {/* Button Area */}
        <div className="flex justify-center gap-4 mt-4 mx-auto w-full">
          {buttons.map(({ label, onClick, className }, idx) => (
            <button
              key={idx}
              onClick={onClick}
              className={`px-4 py-2 rounded-2xl font-bold ${className || ''}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default WarningAlert;