import { useContext, useEffect, useState } from 'react'
import './App.css'
import { UserContext } from './UserContext.jsx'
import AccountsDisplay from './AccountsDisplay.jsx'
import ChatDisplay from './ChatDisplay.jsx'
import { socket } from './SocketMethods.jsx'

function App()
{

  const {user}=useContext(UserContext);
  const [addFriendDisplay,setAddFriendDisplay]=useState(false);
  const [friendsList,setFriendsList]=useState([]);
  const [pendingFriendsList,setPendingFriendsList]=useState([]);
  const [currentChat,setCurrentChat]=useState({});
  const [chatMessages,setChatMessages]=useState({});

  socket.on("message",(message)=>{
        setChatMessages(prevObject=>{
          const newObject=JSON.parse(JSON.stringify(prevObject));
          let toAdd="";
          if(user["email"]==message["sender"])
          toAdd=message["receiver"];
          else
          toAdd=message["sender"];
          if(newObject[toAdd])
          {
            const messageExists=newObject[toAdd].some(existingMessage=>
              existingMessage["timestamp"]==message["timestamp"]&&
              existingMessage["sender"]==message["sender"]
            );
            if(!messageExists)
            {
              newObject[toAdd].push(message);
              newObject[toAdd].sort((a,b)=>{
                let dateA=new Date(a["timestamp"]);
                let dateB=new Date(b["timestamp"]);
                return dateA-dateB;
              })
            }
          }
          return newObject;
        });
});

  const getFriendsList=async ()=>{
    try
    {
      const response=await fetch("/get-friends",{
        method:"GET",
        credentials:"include",
      });
      if(response.ok)
      {
        const result=await response.json();
        const friends=result["friends"];
        friends.forEach(friend => {
          if(friend["pending"]==true)
          {
            setPendingFriendsList(prevList=>{
              const elementPresent=prevList.find(element=>element["email"]==friend["email"]);
              if(elementPresent)
              {
                return prevList;
              }
              else
              {
                return [...prevList,friend];
              }
            });
          }
          else
          {
            setFriendsList(prevList=>{
              const elementPresent=prevList.find(element=>element["email"]==friend["email"]);
              if(elementPresent)
              {
                return prevList;
              }
              else
              {
                return [...prevList,friend];
              }
            });
          }
        });
      }
      else
      {
        console.log("Couldn't get friends of the user")
      }
    }
    catch(e)
    {
      console.log(e);
    }
  };
  useEffect(()=>{
    getFriendsList();
  },[]);

  const handleDifferentChats=async ()=>{
    try
    {
      if(Object.keys(currentChat).length!=0&&!chatMessages[currentChat.email])
      {
        const response=await fetch("/get-chat",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify({email:currentChat.email,type:"personal"}),
          credentials:"include",
        });
        if(response.ok)
        {
          const result=await response.json();
          const messages=result["messages"];
          setChatMessages(prevObject=>{
            let newObject=JSON.parse(JSON.stringify(prevObject));
            newObject[currentChat.email]=messages;
            newObject[currentChat.email].sort((a,b)=>{
              let dateA=new Date(a["timestamp"]);
              let dateB=new Date(b["timestamp"]);
              return dateA-dateB;
            });
            
            return newObject;
          });
        }
        else
        {
          console.log("Couldn't get the previous messages from th server");
        }
      }
    }
    catch(e)
    {
      console.log(e);
    }
  };
  useEffect(()=>{
    handleDifferentChats();
  },[currentChat]);
  
  if(Object.keys(user).length!=0)
  {
    return (<div id="top-level-div" className="w-full h-full flex flex-col sm:flex-row justify-center items-center">
      <AccountsDisplay addFriendDisplay={addFriendDisplay} setAddFriendDisplay={setAddFriendDisplay} friendsList={friendsList} setCurrentChat={setCurrentChat}/>
      <ChatDisplay setChatMessages={setChatMessages} chatMessages={chatMessages} currentChat={currentChat} addFriendDisplay={addFriendDisplay} setAddFriendDisplay={setAddFriendDisplay} setFriendsList={setFriendsList} pendingFriendsList={pendingFriendsList} setPendingFriendsList={setPendingFriendsList}/>
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
