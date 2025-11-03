import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatArea from '../components/ChatArea';
import LoadingState from '../components/LoadingState';
import { useChatApi } from '../hooks/useChatApi';

function ChatPage() {
  const { id: urlSessionId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [options, setOptions] = useState(null);
  const [nextStep, setNextStep] = useState(null);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [chatLoading, setChatLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const { sendStep2, sendStep3, sendStep4, sendStep5, sendFree, loading: apiLoading, error: apiError, loadSession } = useChatApi();

  useEffect(() => {
    if (!urlSessionId) {
      navigate('/', { replace: true });
      return;
    }

    const loadChatHistory = async () => {
      try {
        setChatLoading(true);
        // TODO: implement loadSession(urlSessionId) in useChatApi if needed
        setMessages([]);
        setOptions(null);
        setNextStep(null);
        setChatLoading(false);
      } catch (error) {
        console.error('세션 기록 로드 실패:', error);
        alert('세션 정보를 불러오는 데 실패했습니다.');
        navigate('/', { replace: true });
      }
    };

    loadChatHistory();
  }, [urlSessionId, navigate]);

  const addMessage = useCallback((sender, text) => {
    setMessages(prev => ([
      ...prev,
      { sender, text, createdAt: Date.now() },
    ]));
  }, []);

  const handleStep2Select = async (selectedOptions) => {
    if (!urlSessionId) return;
    setIsBotTyping(true);
    addMessage('user', `[선택] ${Array.isArray(selectedOptions) ? selectedOptions.join(', ') : selectedOptions}`);

    const data = await sendStep2(urlSessionId, selectedOptions);
    setIsBotTyping(false);
    if (!data) return;

    addMessage('bot', data.message);
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };

  const handleStep3Select = async (selectedSeverity) => {
    if (!urlSessionId) return;
    setIsBotTyping(true);
    addMessage('user', `[피해 수위] ${selectedSeverity}`);

    const data = await sendStep3(urlSessionId, selectedSeverity);
    setIsBotTyping(false);
    if (!data) return;

    addMessage('bot', data.message);
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };

  const handleStep4Submit = async (detail) => {
    if (!urlSessionId) return;
    setIsBotTyping(true);
    addMessage('user', detail);

    const data = await sendStep4(urlSessionId, detail);
    setIsBotTyping(false);
    if (!data) return;

    addMessage('bot', data.message);
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };

  const handleStep5Select = async (selectedOption) => {
    if (!urlSessionId) return;
    setIsBotTyping(true);
    addMessage('user', `[대처 선택] ${selectedOption}`);

    const data = await sendStep5(urlSessionId, selectedOption);
    setIsBotTyping(false);
    if (!data) return;

    addMessage('bot', data.message);
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };

  const handleFreeQuestion = async (e) => {
    e.preventDefault();
    const question = inputValue.trim();
    if (!question || !urlSessionId) return;

    setInputValue('');
    setIsBotTyping(true);
    addMessage('user', question);

    const data = await sendFree(urlSessionId, question);
    setIsBotTyping(false);
    if (!data) return;

    addMessage('bot', data.message);
    setOptions(data.options || null);
    setNextStep(data.nextStep || null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFreeQuestion(e);
    }
  };

  if (chatLoading || apiLoading) {
    return <LoadingState loadingFade={true} containerHeightClass="h-screen" />;
  }

  return (
    <div className="flex-1 w-full relative">
      <ChatArea
        sessionId={urlSessionId}
        messages={messages}
        isBotTyping={isBotTyping}
        options={options}
        nextStep={nextStep}

        inputValue={inputValue}
        onInputChange={e => setInputValue(e.target.value)}
        onSubmit={handleFreeQuestion}
        onKeyDown={handleKeyDown}

        onSelectOptions={handleStep2Select}
        onSelectSeverity={handleStep3Select}
        onSubmitDetail={handleStep4Submit}
        onSelectAction={handleStep5Select}
      />
    </div>
  );
}

export default ChatPage;
