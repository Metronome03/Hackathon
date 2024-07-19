import config from './main'

export const getFriendsList=async (setFriendsList)=>{
    try
    {
      const response=await fetch(config.server+"/get-friends",{
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

  export const handleDifferentChats=async (currentChat,chatMessages,setChatMessages)=>{
    try
    {
      if(Object.keys(currentChat).length!=0&&!chatMessages[currentChat.email])
      {
        const response=await fetch(config.server+"/get-chat",{
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