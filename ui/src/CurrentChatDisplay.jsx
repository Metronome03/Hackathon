import ChatMessagesDisplay from './ChatMessagesDisplay.jsx'
import { sendMessage, fileUpload } from "./SocketMethods.jsx";


function CurrentChatDisplay({ setChatMessages, currentChat, chatMessages }) {

  const handleSend = () => {
    const message = document.getElementById("message-input");
    if (message.value.length != 0) {
      sendMessage(user, currentChat, message.value);
      message.value = "";
    }
  };

  const handleFileSend = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".jpg, .png, .jpeg";

    input.onchange = async (event) => {
      try {
        const file = event.target.files[0];
        if (file) {
          const convertFileToBase64 = (file) => {
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result.split(",")[1]);
              reader.onerror = (error) => reject(error);
            });
          };
          const base64Data = await convertFileToBase64(file);
          const jsonData = {
            filename: file.name,
            type: file.type,
            data: base64Data,
          };
          fileUpload(user, currentChat, jsonData);
        }
      } catch (e) {
        console.log("Couldn't upload the image");
      }
    };

    input.click();
  };
  return (
    <div
      id="chat-conFtainer"
      className="w-full h-full flex flex-col justify-evenly items-center"
    >
      <div
        id="chat-header"
        className="w-full bg-slate-900 basis-1/6 bg-slate-900 flex flex-row justify-start items-center"
      >
        <div className="basis-5/6 overflow-x-auto max-w-full">
          {currentChat.username}
        </div>
      </div>
      <div
        id="message-container"
        className="w-full h-5/6 flex flex-col justify-center items-center"
      >
        {chatMessages[currentChat.email] &&
        chatMessages[currentChat.email].length != 0 ? (
          <ChatMessagesDisplay setChatMessages={setChatMessages} currentChat={currentChat} chatMessages={chatMessages}/>
        ) : (
          <div
            id="empty-chat"
            className="w-full h-full flex flex-col justify-center items-center"
          >
            There are no messages sent or received
          </div>
        )}
      </div>
      <div className="w-full basis-1/6 flex flex-row justify-evenly items-center">
        <div className="basis-5/6 border-2 border-black rounded-xl">
          <input
            id="message-input"
            className="rounded-xl border-black w-full text-black"
            type="text"
          ></input>
        </div>
        <div className="basis-1/6 w-full flex flex-row justify-evenly items-center">
          <div className="basis-2/6 flex flex-row justify-evenly items-center">
            <button
              onClick={handleFileSend}
              className="rounded-xl border-2 border-black bg-white hover:bg-green"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M12 17L12 10M12 10L15 13M12 10L9 13"
                  stroke="#1C274C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 7H12H8"
                  stroke="#1C274C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                  stroke="#1C274C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <button
              className="rounded-2xl border-black border-2 bg-white hover:bg-green"
              onClick={handleSend}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20.7639 12H10.0556M3 8.00003H5.5M4 12H5.5M4.5 16H5.5M9.96153 12.4896L9.07002 15.4486C8.73252 16.5688 8.56376 17.1289 8.70734 17.4633C8.83199 17.7537 9.08656 17.9681 9.39391 18.0415C9.74792 18.1261 10.2711 17.8645 11.3175 17.3413L19.1378 13.4311C20.059 12.9705 20.5197 12.7402 20.6675 12.4285C20.7961 12.1573 20.7961 11.8427 20.6675 11.5715C20.5197 11.2598 20.059 11.0295 19.1378 10.5689L11.3068 6.65342C10.2633 6.13168 9.74156 5.87081 9.38789 5.95502C9.0808 6.02815 8.82627 6.24198 8.70128 6.53184C8.55731 6.86569 8.72427 7.42461 9.05819 8.54246L9.96261 11.5701C10.0137 11.7411 10.0392 11.8266 10.0493 11.9137C10.0583 11.991 10.0582 12.069 10.049 12.1463C10.0387 12.2334 10.013 12.3188 9.96153 12.4896Z"
                  stroke="#000000"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentChatDisplay;
