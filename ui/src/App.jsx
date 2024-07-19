import { useContext, useEffect, useState } from 'react'
import './App.css'
import { UserContext } from './UserContext.jsx'
import AccountsDisplay from './AccountsDisplay.jsx'
import ChatDisplay from './ChatDisplay.jsx'
import { socket } from './SocketMethods.jsx'
import config from './main.jsx'
import { messageListener } from './SocketMethods.jsx'
import { getFriendsList,handleDifferentChats } from './UserMethods.jsx'

function App()
{

  const {user}=useContext(UserContext);
  const [addFriendDisplay,setAddFriendDisplay]=useState(false);
  const [friendsList,setFriendsList]=useState([]);
  const [currentChat,setCurrentChat]=useState({});
  const [chatMessages,setChatMessages]=useState({});

  useEffect(()=>{
    socket.on("message",(message)=>messageListener(message,user,setChatMessages));;

    return ()=>{
      socket.off("message",(message)=>messageListener(message,user,setChatMessages));;
    }
  },[]);
  
  useEffect(()=>{
    getFriendsList(setFriendsList);
  },[]);

  useEffect(()=>{
    handleDifferentChats(currentChat,chatMessages,setChatMessages);
  },[currentChat]);
  
  if(Object.keys(user).length!=0)
  {
    return (<div id="top-level-div" className="w-full h-full flex flex-col sm:flex-row justify-center items-center">
      <AccountsDisplay addFriendDisplay={addFriendDisplay} setAddFriendDisplay={setAddFriendDisplay} friendsList={friendsList} setCurrentChat={setCurrentChat}/>
      <ChatDisplay setChatMessages={setChatMessages} chatMessages={chatMessages} currentChat={currentChat} addFriendDisplay={addFriendDisplay} setAddFriendDisplay={setAddFriendDisplay} friendsList={friendsList} setFriendsList={setFriendsList}/>
      </div>
      );
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
