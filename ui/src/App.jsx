import { useContext, useEffect, useState } from 'react'
import './App.css'
import { UserContext } from './UserContext.jsx'
import AccountsDisplay from './AccountsDisplay.jsx'
import ChatDisplay from './ChatDisplay.jsx'
import { socket } from './SocketMethods.jsx'
import { messageListener } from './SocketMethods.jsx'
import { getFriendsList,handleDifferentChats } from './UserMethods.jsx'
import AddFriendScreen from "./AddFriendScreen.jsx";
import CheckFriendRequestScreen from "./CheckFriendRequestScreen.jsx";

function App()
{

  const {user}=useContext(UserContext);
  const [displayScreen,setDisplayScreen]=useState(0);
  const [friendsList,setFriendsList]=useState([]);
  const [currentChat,setCurrentChat]=useState({});
  const [chatMessages,setChatMessages]=useState({});

  useEffect(()=>{
    socket.on("message",(message)=>{
      if(Object.keys(user).length!=0)
      {
        messageListener(message,user,setChatMessages);
      }
  });

    return ()=>{
      socket.off("message",(message)=>{
        if(Object.keys(user).length!=0)
        {
          messageListener(message,user,setChatMessages); 
        }
    });
    }
  },[user]);
  
  useEffect(()=>{
    getFriendsList(setFriendsList);
  },[]);

  useEffect(()=>{
    handleDifferentChats(currentChat,chatMessages,setChatMessages);
  },[currentChat]);
  
  if(Object.keys(user).length!=0)
  {
    switch(displayScreen)
    {
      case 1:
        return (
          <CheckFriendRequestScreen friendsList={friendsList} setFriendsList={setFriendsList} setDisplayScreen={setDisplayScreen} />
        );
        break;
      case 2:
        return (
          <AddFriendScreen setDisplayScreen={setDisplayScreen} setFriendsList={setFriendsList}/>
        );
        break;
      default:
        return (<div id="top-level-div" className="w-full h-full flex flex-col sm:flex-row justify-center items-center">
          <AccountsDisplay setDisplayScreen={setDisplayScreen} friendsList={friendsList} setCurrentChat={setCurrentChat}/>
          <ChatDisplay setChatMessages={setChatMessages} chatMessages={chatMessages} currentChat={currentChat} friendsList={friendsList} setFriendsList={setFriendsList}/>
          </div>
          );
    }
  }
  else
  {
    return (
      <div id="top-level-div" className="w-full h-full flex justify-center items-center">
        Loading user information...
      </div>
    );
  }
}
export default App
