import { useState } from "react";
import {
  sendStep1Message,
  sendStep2Message,
  sendStep3Message,
  sendStep4Message,
  sendStep5Message,
  sendFreeQuestion,
} from "../api/chatApi";

export function useChatApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = async (apiFunc, ...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFunc(...args);
      return res;
    } catch (err) {
      console.error(err);
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    sendStep1: (msg) => callApi(sendStep1Message, msg),
    sendStep2: (sessionId, selectedOptions) =>
      callApi(sendStep2Message, sessionId, selectedOptions),
    sendStep3: (sessionId, selectedSeverity) =>
      callApi(sendStep3Message, sessionId, selectedSeverity),
    sendStep4: (sessionId, detail) =>
      callApi(sendStep4Message, sessionId, detail),
    sendStep5: (sessionId, selectedOption) =>
      callApi(sendStep5Message, sessionId, selectedOption),
    sendFree: (sessionId, question) =>
      callApi(sendFreeQuestion, sessionId, question),
    loading,
    error,
  };
}
