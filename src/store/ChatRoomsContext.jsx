import React, { createContext, useContext, useState, useEffect } from "react";

const ChatRoomsContext = createContext(null);

export function ChatRoomsProvider({ children }) {
  const STORAGE_KEY = "chatRooms_v1";

  const [chatRooms, setChatRooms] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn("Failed to read chatRooms from localStorage", err);
      return [];
    }
  });

  // chatRooms가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatRooms));
    } catch (err) {
      console.warn("Failed to write chatRooms to localStorage", err);
    }
  }, [chatRooms]);

  // 채팅방은 최대 5개까지만 추가 가능함
  // room 객체는 { id, text, messages } 형태여야 함
  function addChatRoom(room) {
    if (!room || !room.id) return { success: false, reason: "invalid" };

    const toAdd = {
      id: room.id,
      text: room.text || "",
      messages: Array.isArray(room.messages) ? room.messages : [],
      createdAt: room.createdAt || Date.now(),
    };

  // 상태 업데이트에서 함수형 업데이트를 사용하고, 내부에서 중복 및 최대 개수 검사를 하여 레이스 컨디션을 방지함
    let result = { success: false, reason: "unknown" };
    setChatRooms((prev) => {
      if (prev.find((r) => r.id === toAdd.id)) {
        result = { success: false, reason: "exists" };
        return prev;
      }
      if (prev.length >= 5) {
        result = { success: false, reason: "max" };
        return prev;
      }
      result = { success: true };
      return [toAdd, ...prev];
    });

    return result;
  }

  // 특정 채팅방에 메시지를 추가하고 변경사항을 저장함
  function addMessageToRoom(roomId, message) {
    if (!roomId || !message) return { success: false, reason: "invalid" };
    setChatRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, messages: [...r.messages, message] } : r,
      ),
    );
    return { success: true };
  }

  // 특정 채팅방의 메시지 배열을 통째로 교체함 (예: 서버에서 불러올 때)
  function setRoomMessages(roomId, messages) {
    if (!roomId) return { success: false, reason: "invalid" };
    setChatRooms((prev) =>
      prev.map((r) =>
        r.id === roomId
          ? { ...r, messages: Array.isArray(messages) ? messages : [] }
          : r,
      ),
    );
    return { success: true };
  }

  // 채팅방의 id를 업데이트함 (예: 로컬 임시 id를 서버에서 받은 id로 교체)
  function updateChatRoomId(oldId, newId) {
    if (!oldId || !newId) return { success: false, reason: "invalid" };
    setChatRooms((prev) => {
      // prevent duplicates if newId already exists
      if (prev.find((r) => r.id === newId)) return prev;
      return prev.map((r) => (r.id === oldId ? { ...r, id: newId } : r));
    });
    return { success: true };
  }

  // 채팅방을 목록 맨 위(최신)로 이동시킴 — 채팅방을 열 때 사용
  function moveRoomToTop(id) {
    if (!id) return { success: false, reason: "invalid" };
    setChatRooms((prev) => {
      const idx = prev.findIndex((r) => r.id === id);
      if (idx <= 0) return prev; // already at top or not found
      const room = prev[idx];
      const rest = prev.filter((_, i) => i !== idx);
      return [room, ...rest];
    });
    return { success: true };
  }

  function removeChatRoom(id) {
    setChatRooms((prev) => prev.filter((r) => r.id !== id));
  }

  function clearChatRooms() {
    setChatRooms([]);
  }

  return (
    <ChatRoomsContext.Provider
      value={{
        chatRooms,
        addChatRoom,
        updateChatRoomId,
        moveRoomToTop,
        addMessageToRoom,
        setRoomMessages,
        removeChatRoom,
        clearChatRooms,
      }}
    >
      {children}
    </ChatRoomsContext.Provider>
  );
}

export function useChatRooms() {
  const ctx = useContext(ChatRoomsContext);
  if (!ctx)
    throw new Error("useChatRooms must be used within ChatRoomsProvider");
  return ctx;
}

export default ChatRoomsContext;
