import { useContext, useEffect, useState } from 'react'
import './App.css'
import { UserContext } from './UserContext.jsx'
import AccountsDisplay from './AccountsDisplay.jsx'
import ChatDisplay from './ChatDisplay.jsx'
import { socket,socketListenMessages } from './SocketMethods.jsx'
import { getFriendsList,handleDifferentChats } from './AppMethods.jsx'

function App()
{

  const {user}=useContext(UserContext);
  const [addFriendDisplay,setAddFriendDisplay]=useState(false);
  const [friendsList,setFriendsList]=useState([]);
  const [currentChat,setCurrentChat]=useState({});
  const [chatMessages,setChatMessages]=useState({});

  socket.on("message",(message)=>{
    socketListenMessages(message);
  });

  socket.off("message",(message)=>{
    socketListenMessages(message);
  });

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
      <ChatDisplay setChatMessages={setChatMessages} chatMessages={chatMessages} currentChat={currentChat} addFriendDisplay={addFriendDisplay} setAddFriendDisplay={setAddFriendDisplay} setFriendsList={setFriendsList} friendsList={friendsList}/>
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
