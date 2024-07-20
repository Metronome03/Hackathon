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
  
    return (
      <div
              id="chat-messages"
              className="w-full h-full overflow-y-auto max-h-full flex flex-col justify-start items-center"
            >
              {chatMessages[currentChat.email].map((message) => {
                console.log(message["misinfo"])
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
                              ? "border-rose-500 border-6 "
                              : "border-black border-2 ") + "p-2 rounded-3xl"
                          }
                        >
                          {message["content"]}
                        </div>
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
                        <div className={`basis-4/6 h-full`}>
                          <div className="p-2 ">
                            <img
                              className={`w-full h-fit ${message["content"]["watermark"]?"border-green-600":"border-rose-500"} border-8`}
                              src={`data:${message["content"]["type"]};base64,${message["content"]["data"]}`}
                            ></img>
                          </div>
                          {message["content"]["watermark"]?(
                            <div className="flex flex-row justify-end items-center">
                                Watermark embedded✅
                            </div>
                          ):null}
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
                        "basis-4/6 h-full "
                          }
                        >
                          <div className="p-2 ">
                            <img
                              className={`w-full h-fit ${message["misinfo"]||!message["content"]["watermark"]?"border-rose-500 border-8":"border-green-600 border-8"}`}
                              src={`data:${message["content"]["type"]};base64,${message["content"]["data"]}`}
                            ></img>
                          </div>
                          {
                          message["content"]["watermark"]?(
                            <div className="flex flex-row justify-start items-center">
                                Image verified✅
                            </div>
                          ):
                          <div className="flex flex-row justify-start items-center">
                            Verification failed❗
                          </div>
                        }
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