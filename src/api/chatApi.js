import { API_BASE_URL, API_KEY } from './config';

// 공통 요청 함수: 타임아웃 + 에러메시지 상세화
async function requestApi(endpoint, body, { timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  // API_BASE_URL이 설정되지 않은 경우 에러 처리
  if (!API_BASE_URL) {
    throw new Error('API 기본 URL이 설정되지 않았습니다.');
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(API_KEY ? { Authorization: `Bearer ${API_KEY}` } : {}),
      },
      body: JSON.stringify(body),
      signal: controller.signal
    });

    // 200번대가 아닌 경우 에러 처리
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error(`API 호출 실패: ${res.status} - ${text}`);
      throw new Error(`API ${res.status}: ${text || '요청 실패'}`);
    }
    return await res.json();
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('요청 시간 초과');
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// 각 단계별 API 함수
export const sendStep1Message = (message) =>
  requestApi('/chat/step1', { message });

export const sendStep2Message = (sessionId, selectedOptions) =>
  requestApi('/chat/step2', { sessionId, selectedOptions });

export const sendStep3Message = (sessionId, selectedSeverity) =>
  requestApi('/chat/step3', { sessionId, selectedSeverity });

export const sendStep4Message = (sessionId, detail) =>
  requestApi('/chat/step4', { sessionId, detail });

export const sendStep5Message = (sessionId, selectedOption) =>
  requestApi('/chat/step5', { sessionId, selectedOption });

export const sendFreeQuestion = (sessionId, question) =>
  requestApi('/chat/free', { sessionId, question });
