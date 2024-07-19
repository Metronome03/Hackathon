import CurrentChatDisplay from "./CurrentChatDisplay.jsx";

function ChatDisplay({
  chatMessages,
  setChatMessages,
  currentChat,
}) {
  return (
    <div
      id="chat-display"
      className="basis-4/6 w-full sm:h-full flex flex-col justify-center items-center"
    >
      {Object.keys(currentChat).length == 0 ? (
        <div>Please select a chat to view or send messages</div>
      ) : (
        <CurrentChatDisplay
          setChatMessages={setChatMessages}
          chatMessages={chatMessages}
          currentChat={currentChat}
        />
      )}
    </div>
  );
}

export default ChatDisplay;
