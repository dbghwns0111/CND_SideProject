import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatInput from "../components/ChatInput";
import LoadingState from "../components/LoadingState";
import { useChatApi } from "../hooks/useChatApi";
import { useChatRooms } from "../store/ChatRoomsContext";
import { useAuth } from "../store/hooks/useAuth";
import WarningAlert from "../components/alter/WarningAlert";

function HomePage() {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingFade, setLoadingFade] = useState(false);

  const navigate = useNavigate();
  const { sendStep1 } = useChatApi();
  const { chatRooms, addChatRoom, updateChatRoomId, addMessageToRoom } =
    useChatRooms();
  const { isLoggedIn } = useAuth();
  const [showMaxRoomsAlert, setShowMaxRoomsAlert] = useState(false);

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    // Prevent creating more than 5 chat rooms
    if (chatRooms.length >= 5) {
      setShowMaxRoomsAlert(true);
      return;
    }

    // Always create a local chat room first so the room appears in the sidebar
    // even if the backend call fails or is slow. Use a temporary local id.
    const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    // include the first user message in the room.messages so chat page shows it immediately
    const added = addChatRoom({
      id: localId,
      text,
      messages: [{ sender: "user", text, createdAt: Date.now() }],
    });
    if (added && added.success === false && added.reason === "max") {
      alert(
        "채팅방은 최대 5개까지만 생성할 수 있습니다. 기존 채팅방을 삭제한 후 다시 시도하세요.",
      );
      return;
    }

    // Navigate immediately to the new chat room (local fallback)
    navigate(`/c/${localId}`, { replace: true });

    try {
      setIsLoading(true);
      setLoadingFade(true);

      const data = await sendStep1(text);

      // If server returns a sessionId, replace the local id with server id
      if (data && data.sessionId) {
        const serverId = data.sessionId;
        if (serverId !== localId) {
          updateChatRoomId(localId, serverId);
          // replace the url to reflect server-side id
          navigate(`/c/${serverId}`, { replace: true });
        }

        // If server provided the assistant's first reply, append it to the room
        if (data.reply) {
          addMessageToRoom(serverId, {
            sender: "ai",
            text: data.reply,
            createdAt: Date.now(),
          });
        }
      } else if (data && data.reply) {
        // Server returned a reply but no sessionId: append reply to local room
        addMessageToRoom(localId, {
          sender: "ai",
          text: data.reply,
          createdAt: Date.now(),
        });
      } else {
        // Server returned no session info and no reply; append a graceful fallback assistant reply to the local room
        const fallback =
          "지금 서버 연결이 원활하지 않아 임시 안내를 드립니다. 자세한 내용은 서버 연결 후 더 정확히 안내해 드릴게요.";
        addMessageToRoom(localId, {
          sender: "ai",
          text: fallback,
          createdAt: Date.now(),
        });
        console.warn(
          "서버에서 세션 정보를 받지 못했습니다. 로컬 세션으로 계속 진행합니다.",
        );
      }
    } catch (error) {
      // If backend fails, still keep the local chat room. Append a fallback assistant reply so user sees a reply.
      console.error("API 호출 중 에러 발생:", error);
      const fallback =
        "서버에 연결할 수 없어 현재는 간단한 안내만 드립니다. 서버가 복구되면 더 완전한 답변을 제공하겠습니다.";
      addMessageToRoom(localId, {
        sender: "ai",
        text: fallback,
        createdAt: Date.now(),
      });
    } finally {
      setIsLoading(false);
      setLoadingFade(false);
      setInputValue("");
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full min-h-screen px-6 md:px-10"
      style={{ position: "relative" }}
    >
      {isLoading && (
        <LoadingState
          loadingFade={loadingFade}
          containerHeightClass="h-screen"
        />
      )}

      {!isLoading && (
        <div className="flex flex-col items-center w-full max-w-4xl pt-16 pb-24">
            <img src="/icons/logo_icon.svg" alt="lawkey" className="w-16 h-16 mb-4" />
          <p className="font-bold text-gray-800 text-center text-[42px]">
            나만의 AI 법률 파트너
          </p>
          <p className="text-gray-600 mb-10 leading-relaxed text-center text-[20px]">
            당신의 상황을 듣고, 함께 답을 찾아드릴게요.
          </p>

          <div
            className="relative mx-auto"
            style={{
              width: "clamp(320px, 44.375vw, 852px)",
              height: "136px",
            }}
          >
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onSubmit={handleMessageSubmit}
              rows={2}
              inputClassName="h-full"
            />
          </div>

          <WarningAlert
            isOpen={showMaxRoomsAlert}
            onClose={() => setShowMaxRoomsAlert(false)}
            title={isLoggedIn ? "채팅방 생성 제한" : ""}
            description={
              isLoggedIn
                ? `채팅방은 최대 ${5}개까지 생성할 수 있습니다. 기존 채팅방을 삭제한 후 다시 시도하세요.`
                : `더 많은 상담방은\n회원가입 후 이용할 수 있습니다.`
            }
            icon={
              !isLoggedIn ? (
                <img src="/icons/logo_icon.svg" alt="logo" className="w-12 h-12" />
              ) : null
            }
            buttons={
              isLoggedIn
                ? [
                    {
                      label: "확인",
                      onClick: () => setShowMaxRoomsAlert(false),
                      className: "bg-[#29CC8B] text-white",
                    },
                  ]
                : [
                    {
                      label: "확인",
                      onClick: () => setShowMaxRoomsAlert(false),
                      className:
                        "border border-gray-300 px-4 py-2 rounded-full",
                    },
                    {
                      label: "회원가입",
                      onClick: () => {
                        setShowMaxRoomsAlert(false);
                        navigate("/auth");
                      },
                      className: "bg-black text-white px-4 py-2 rounded-full",
                    },
                  ]
            }
            buttonsWrapperClass={isLoggedIn ? null : "gap-4"}
          />

          <footer
            className="text-center text-xs text-gray-500 py-4"
            style={{
              position: "fixed",
              bottom: "30px",
              width: "100%",
              zIndex: 10,
            }}
          >
            <div className="mx-auto px-6 md:px-10">
              * AI가 제공하는 정보는 법적 효력을 갖지 않으며, 전문적인 법률
              자문을 대체하지 않습니다.
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default HomePage;
