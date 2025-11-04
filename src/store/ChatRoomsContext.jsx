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

  // persist chatRooms to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatRooms));
    } catch (err) {
      console.warn("Failed to write chatRooms to localStorage", err);
    }
  }, [chatRooms]);

  // Add a new chat room only if there are fewer than 5 rooms.
  // room should be { id, text, messages }
  function addChatRoom(room) {
    if (!room || !room.id) return { success: false, reason: "invalid" };

    const toAdd = {
      id: room.id,
      text: room.text || "",
      messages: Array.isArray(room.messages) ? room.messages : [],
      createdAt: room.createdAt || Date.now(),
    };

    // Use functional update and perform duplicate/max checks inside it to avoid race conditions
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

  // Add a message to a specific chat room and persist
  function addMessageToRoom(roomId, message) {
    if (!roomId || !message) return { success: false, reason: "invalid" };
    setChatRooms((prev) =>
      prev.map((r) =>
        r.id === roomId ? { ...r, messages: [...r.messages, message] } : r,
      ),
    );
    return { success: true };
  }

  // Replace entire messages array for a room (e.g., on load from server)
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

  // Update a chat room's id (e.g., replace a temporary local id with server-provided id)
  function updateChatRoomId(oldId, newId) {
    if (!oldId || !newId) return { success: false, reason: "invalid" };
    setChatRooms((prev) => {
      // prevent duplicates if newId already exists
      if (prev.find((r) => r.id === newId)) return prev;
      return prev.map((r) => (r.id === oldId ? { ...r, id: newId } : r));
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
