import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatRoomsContext = createContext(null);

export function ChatRoomsProvider({ children }) {
  const STORAGE_KEY = 'chatRooms_v1';

  const [chatRooms, setChatRooms] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn('Failed to read chatRooms from localStorage', err);
      return [];
    }
  });

  // persist chatRooms to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(chatRooms));
    } catch (err) {
      console.warn('Failed to write chatRooms to localStorage', err);
    }
  }, [chatRooms]);

  // Add a new chat room only if there are fewer than 5 rooms.
  // room should be { id, text }
  function addChatRoom(room) {
    if (!room || !room.id) return { success: false, reason: 'invalid' };
    if (chatRooms.length >= 5) return { success: false, reason: 'max' };

    // prevent duplicates
    if (chatRooms.find(r => r.id === room.id)) return { success: false, reason: 'exists' };

    setChatRooms(prev => [room, ...prev]);
    return { success: true };
  }

  function removeChatRoom(id) {
    setChatRooms(prev => prev.filter(r => r.id !== id));
  }

  function clearChatRooms() {
    setChatRooms([]);
  }

  return (
    <ChatRoomsContext.Provider value={{ chatRooms, addChatRoom, removeChatRoom, clearChatRooms }}>
      {children}
    </ChatRoomsContext.Provider>
  );
}

export function useChatRooms() {
  const ctx = useContext(ChatRoomsContext);
  if (!ctx) throw new Error('useChatRooms must be used within ChatRoomsProvider');
  return ctx;
}

export default ChatRoomsContext;
