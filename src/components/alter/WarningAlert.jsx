// src/components/alter/WarningAlert.jsx
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

function WarningAlert({ isOpen, onClose, title, description, buttons = [], isLoggedIn = false, onConfirm, onSavePDF, user }) {
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
      {/* Dialog width reduced to be narrower on large screens and responsive on small screens */}
      <div className="bg-white rounded-2xl p-6 w-[400px] max-w-[90%] shadow-xl flex flex-col gap-4">
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
        {/* Use a relative container so we can place buttons at 25% / 50% / 75% positions */}
        <div className="relative w-full h-14 mt-4">
          {(buttons && buttons.length > 0) ? (
            // if custom buttons provided, render them centered
            <div className="flex justify-center items-center gap-4">
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
          ) : (
            // default buttons when none provided - center them
            isLoggedIn ? (
              <>
                {/* PDF at 50%, 삭제 at 25%, 취소 at 75% */}
                <button
                  onClick={onSavePDF}
                  className={`absolute left-[50%] translate-x-[-50%] top-0 px-4 py-2 rounded-2xl bg-[#29CC8B] text-white font-bold`}
                >
                  PDF 저장
                </button>
                <button
                  onClick={onConfirm}
                  className={`absolute left-[25%] translate-x-[-50%] top-0 px-4 py-2 rounded-2xl bg-transparent text-black font-extrabold hover:text-red-600`}
                >
                  삭제
                </button>
                <button
                  onClick={onClose}
                  className={`absolute left-[75%] translate-x-[-50%] top-0 px-4 py-2 rounded-2xl border border-gray-400 font-bold`}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                {/* 삭제 at 25%, 취소 at 75% */}
                <button
                  onClick={onConfirm}
                  className={`absolute left-[25%] translate-x-[-50%] top-0 px-4 py-2 rounded-2xl bg-transparent text-black font-extrabold hover:text-red-600`}
                >
                  삭제
                </button>
                <button
                  onClick={onClose}
                  className={`absolute left-[75%] translate-x-[-50%] top-0 px-4 py-2 rounded-2xl border border-gray-400 font-bold`}
                >
                  취소
                </button>
              </>
            )
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default WarningAlert;