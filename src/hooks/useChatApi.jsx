// src/hooks/useChatApi.js
import { useState, useCallback } from 'react';
import {
  sendStep1Message,
  sendStep2Message,
  sendStep3Message,
  sendStep4Message,
  sendStep5Message,
  sendFreeQuestion
} from '../api/chatApi';

export function useChatApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (apiFunc, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFunc(...args);
      return res;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // 각 단계별 API 호출 함수
    sendStep1: (msg) => call(sendStep1Message, msg),
    sendStep2: (sessionId, selectedOptions) => call(sendStep2Message, sessionId, selectedOptions),
    sendStep3: (sessionId, selectedSeverity) => call(sendStep3Message, sessionId, selectedSeverity),
    sendStep4: (sessionId, detail) => call(sendStep4Message, sessionId, detail),
    sendStep5: (sessionId, selectedOption) => call(sendStep5Message, sessionId, selectedOption),
    sendFree: (sessionId, question) => call(sendFreeQuestion, sessionId, question),
    // 공통 API 상태
    loading,
    error
  };
}