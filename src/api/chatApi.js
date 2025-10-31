import { API_BASE_URL, API_KEY } from './config';

async function requestApi(endpoint, body) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY && { 'Authorization': `Bearer ${API_KEY}` }),
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 호출 실패: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return await response.json();
}

// Step 1: 대화 시작
export function sendStep1Message(message) {
  return requestApi('/chat/step1', { message });
}

// Step 2: 사건 세부 유형 선택
export function sendStep2Message(sessionId, selectedOptions) {
  return requestApi('/chat/step2', { sessionId, selectedOptions });
}

// Step 3: 피해 수위 선택
export function sendStep3Message(sessionId, selectedSeverity) {
  return requestApi('/chat/step3', { sessionId, selectedSeverity });
}

// Step 4: 상세 설명 입력
export function sendStep4Message(sessionId, detail) {
  return requestApi('/chat/step4', { sessionId, detail });
}

// Step 5: 대처 방안 선택
export function sendStep5Message(sessionId, selectedOption) {
  return requestApi('/chat/step5', { sessionId, selectedOption });
}

// 자유 질문
export function sendFreeQuestion(sessionId, question) {
  return requestApi('/chat/free', { sessionId, question });
}