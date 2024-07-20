import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import config from "./UserMethods.jsx";

function ChatMessagesDisplay({setChatMessages, currentChat, chatMessages,messageSelected,setMessageSelected}){
    const { user } = useContext(UserContext);
    const lastMessageRef=useRef(null);
    const selectMessage=(message)=>{
        setMessageSelected(prevMessage=>{
            if(prevMessage==null||prevMessage!=message)
            {
                return message;
            }
            else
            {
                return null;
            }
        });
    };
    useEffect(()=>{
        if(lastMessageRef.current)
        {
            lastMessageRef.current.scrollIntoView({});
        }
    },[currentChat]);
  
    const handleMisinfo = async (message) => {
      try {
        const response = await fetch(config.server + "/check-misinfo", {
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
  
    return (
      <div
              id="chat-messages"
              className="w-full h-full overflow-y-auto max-h-full gap-y-6 flex flex-col justify-start items-center"
            >
              {chatMessages[currentChat.email].map((message) => {
                const isSelected=messageSelected&&messageSelected["timestamp"]==message["timestamp"]&&messageSelected["sender"]==message["sender"];
                if (message["type"] == "text") {
                  if (message["sender"] == user.email) {
                    return (
                      <div
                        key={message["timestamp"] + message["sender"]}
                        className={`w-full basis-1/6 flex flex-row justify-end items-center ${isSelected ? "bg-green-400 bg-opacity-50" : ""}`}
                        ref={lastMessageRef}
                        onClick={()=>selectMessage(message)}
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
                        className={`w-full basis-1/6 flex flex-row justify-start items-center ${isSelected ? "bg-green-400 bg-opacity-50" : ""}`}
                        ref={lastMessageRef}
                        onClick={()=>selectMessage(message)}
                      >
                        <div className="w-1/12"></div>
                        <div
                          className={
                            (message["misinfo"]
                              ? "border-rose-500 border-2 "
                              : "border-black border-2 ") + "p-2 rounded-3xl"
                          }
                        >
                          {message["content"]}
                        </div>
                        <button
                          onClick={() => handleMisinfo(message)}
                          className=""
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            width="20px"
                            height="20px"
                            viewBox="0 0 512 512"
                            version="1.1"
                          >
                            <title>ai</title>
                            <g
                              id="Page-1"
                              stroke="none"
                              strokeWidth="1"
                              fill="none"
                              fillRule="evenodd"
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
                        className={`w-full basis-1/6 flex flex-row justify-end items-center ${isSelected ? "bg-green-400 bg-opacity-50" : ""}`}
                        ref={lastMessageRef}
                        onClick={()=>selectMessage(message)}
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
                        className={`w-full basis-1/6 flex flex-row justify-start items-center ${isSelected ? "bg-green-400 bg-opacity-50" : ""}`}
                        ref={lastMessageRef}
                        onClick={()=>selectMessage(message)}
                      >
                        <div
                          className={
                            (message["misinfo"]
                              ? "border-rose-500 border-2 "
                              : "border-black border-2 ") + "basis-4/6 h-full "
                          }
                        >
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
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                width="20px"
                                height="20px"
                                viewBox="0 0 512 512"
                                version="1.1"
                              >
                                <title>ai</title>
                                <g
                                  id="Page-1"
                                  stroke="none"
                                  strokeWidth="1"
                                  fill="none"
                                  fillRule="evenodd"
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
    );
  };

  export default ChatMessagesDisplay;