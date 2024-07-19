import { useContext, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import { sendMessage, fileUpload } from "./SocketMethods.jsx";
import config from "./UserMethods.jsx";

function CurrentChatDisplay({ setChatMessages, currentChat, chatMessages }) {
  const { user } = useContext(UserContext);
  const handleSend = () => {
    const message = document.getElementById("message-input");
    if (message.value.length != 0) {
      sendMessage(user, currentChat, message.value);
      message.value = "";
    }
  };

  const handleMisinfo = async (message) => {
    try {
      const response = await fetch(config.server+"/check-misinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });
      if (response.ok) {
        const result = await response.json();
        setChatMessages((prevObject) => {
          let newObject = JSON.parse(JSON.stringify(prevObject));
          if (Object.keys(newObject).length != 0) {
            const veryNew = newObject.map((element) => {
              if (
                element["timestamp"] == message["timestamp"] &&
                element["sender" == message["timestamp"]]
              ) {
                element["misinfo"] = message["misinfo"];
              }
              return element;
            });
            return veryNew;
          }
          return newObject;
        });
      }
    } catch (e) {
      console.log(e);
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
      id="chat-container"
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
          <div
            id="chat-messages"
            className="w-full h-full overflow-y-auto max-h-full gap-y-6 flex flex-col justify-start items-center"
          >
            {chatMessages[currentChat.email].map((message) => {
              if (message["type"] == "text") {
                if (message["sender"] == user.email) {
                  return (
                    <div
                      key={message["timestamp"] + message["sender"]}
                      className="w-full basis-1/6 flex flex-row justify-end items-center"
                    >
                      <div className="p-2 border-black border-2 border rounded-3xl">
                        {message["content"]}
                      </div>
                      <div className="w-1/12"></div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={message["timestamp"] + message["sender"]}
                      className=                       
                        "w-full basis-1/6 flex flex-row justify-start items-center"
                      
                    >
                      <div className="w-1/12"></div>
                      <div className={(message["misinfo"] ? "border-rose-500 border-2 " : "border-black border-2 ") +"p-2 rounded-3xl"}>
                        {message["content"]}
                      </div>
                      <button
                        onClick={() => handleMisinfo(message)}
                        className=""
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlns:xlink="http://www.w3.org/1999/xlink"
                          width="20px"
                          height="20px"
                          viewBox="0 0 512 512"
                          version="1.1"
                        >
                          <title>ai</title>
                          <g
                            id="Page-1"
                            stroke="none"
                            stroke-width="1"
                            fill="none"
                            fill-rule="evenodd"
                          >
                            <g
                              id="icon"
                              fill="#f7f7f7"
                              transform="translate(64.000000, 64.000000)"
                            >
                              <path
                                d="M320,64 L320,320 L64,320 L64,64 L320,64 Z M171.749388,128 L146.817842,128 L99.4840387,256 L121.976629,256 L130.913039,230.977 L187.575039,230.977 L196.319607,256 L220.167172,256 L171.749388,128 Z M260.093778,128 L237.691519,128 L237.691519,256 L260.093778,256 L260.093778,128 Z M159.094727,149.47526 L181.409039,213.333 L137.135039,213.333 L159.094727,149.47526 Z M341.333333,256 L384,256 L384,298.666667 L341.333333,298.666667 L341.333333,256 Z M85.3333333,341.333333 L128,341.333333 L128,384 L85.3333333,384 L85.3333333,341.333333 Z M170.666667,341.333333 L213.333333,341.333333 L213.333333,384 L170.666667,384 L170.666667,341.333333 Z M85.3333333,0 L128,0 L128,42.6666667 L85.3333333,42.6666667 L85.3333333,0 Z M256,341.333333 L298.666667,341.333333 L298.666667,384 L256,384 L256,341.333333 Z M170.666667,0 L213.333333,0 L213.333333,42.6666667 L170.666667,42.6666667 L170.666667,0 Z M256,0 L298.666667,0 L298.666667,42.6666667 L256,42.6666667 L256,0 Z M341.333333,170.666667 L384,170.666667 L384,213.333333 L341.333333,213.333333 L341.333333,170.666667 Z M0,256 L42.6666667,256 L42.6666667,298.666667 L0,298.666667 L0,256 Z M341.333333,85.3333333 L384,85.3333333 L384,128 L341.333333,128 L341.333333,85.3333333 Z M0,170.666667 L42.6666667,170.666667 L42.6666667,213.333333 L0,213.333333 L0,170.666667 Z M0,85.3333333 L42.6666667,85.3333333 L42.6666667,128 L0,128 L0,85.3333333 Z"
                                id="Combined-Shape"
                              ></path>
                            </g>
                          </g>
                        </svg>
                      </button>
                    </div>
                  );
                }
              } else {
                if (message["sender"] == user.email) {
                  return (
                    <div
                      key={message["timestamp"] + message["sender"]}
                      className="w-full basis-1/6 flex flex-row justify-end items-center"
                    >
                      <div className="basis-4/6 h-full border-black border-2">
                        <div className="p-2 bg-slate-900">
                          <img
                            className="w-full h-fit"
                            src={`data:${message["content"]["type"]};base64,${message["content"]["data"]}`}
                          ></img>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={message["timestamp"] + message["sender"]}
                      className=                    
                        "w-full basis-1/6 flex flex-row justify-start items-center"
                      
                    >
                      <div className={(message["misinfo"] ? "border-rose-500 border-2 " : "border-black border-2 ") +"basis-4/6 h-full "}>
                        <div className="p-2 bg-slate-900">
                          <img
                            className="w-full h-fit"
                            src={`data:${message["content"]["type"]};base64,${message["content"]["data"]}`}
                          ></img>
                          <button
                            onClick={() => handleMisinfo(message)}
                            className=""
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              xmlns:xlink="http://www.w3.org/1999/xlink"
                              width="20px"
                              height="20px"
                              viewBox="0 0 512 512"
                              version="1.1"
                            >
                              <title>ai</title>
                              <g
                                id="Page-1"
                                stroke="none"
                                stroke-width="1"
                                fill="none"
                                fill-rule="evenodd"
                              >
                                <g
                                  id="icon"
                                  fill="#f7f7f7"
                                  transform="translate(64.000000, 64.000000)"
                                >
                                  <path
                                    d="M320,64 L320,320 L64,320 L64,64 L320,64 Z M171.749388,128 L146.817842,128 L99.4840387,256 L121.976629,256 L130.913039,230.977 L187.575039,230.977 L196.319607,256 L220.167172,256 L171.749388,128 Z M260.093778,128 L237.691519,128 L237.691519,256 L260.093778,256 L260.093778,128 Z M159.094727,149.47526 L181.409039,213.333 L137.135039,213.333 L159.094727,149.47526 Z M341.333333,256 L384,256 L384,298.666667 L341.333333,298.666667 L341.333333,256 Z M85.3333333,341.333333 L128,341.333333 L128,384 L85.3333333,384 L85.3333333,341.333333 Z M170.666667,341.333333 L213.333333,341.333333 L213.333333,384 L170.666667,384 L170.666667,341.333333 Z M85.3333333,0 L128,0 L128,42.6666667 L85.3333333,42.6666667 L85.3333333,0 Z M256,341.333333 L298.666667,341.333333 L298.666667,384 L256,384 L256,341.333333 Z M170.666667,0 L213.333333,0 L213.333333,42.6666667 L170.666667,42.6666667 L170.666667,0 Z M256,0 L298.666667,0 L298.666667,42.6666667 L256,42.6666667 L256,0 Z M341.333333,170.666667 L384,170.666667 L384,213.333333 L341.333333,213.333333 L341.333333,170.666667 Z M0,256 L42.6666667,256 L42.6666667,298.666667 L0,298.666667 L0,256 Z M341.333333,85.3333333 L384,85.3333333 L384,128 L341.333333,128 L341.333333,85.3333333 Z M0,170.666667 L42.6666667,170.666667 L42.6666667,213.333333 L0,213.333333 L0,170.666667 Z M0,85.3333333 L42.6666667,85.3333333 L42.6666667,128 L0,128 L0,85.3333333 Z"
                                    id="Combined-Shape"
                                  ></path>
                                </g>
                              </g>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              }
            })}
          </div>
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
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 7H12H8"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
              />
              <path
                d="M22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C21.5093 4.43821 21.8356 5.80655 21.9449 8"
                stroke="#1C274C"
                stroke-width="1.5"
                stroke-linecap="round"
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
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
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
